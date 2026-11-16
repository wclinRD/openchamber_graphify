import { connectHost } from '@openchamber/sdk';
import { applyHostReady } from '@openchamber/sdk/ui';

// dynamic vis-network runtime available in window/globalThis after script injection
declare var vis: any;

const VIS_NETWORK_URL = 'https://unpkg.com/vis-network@9.1.6/standalone/umd/vis-network.min.js';

const host = connectHost();
let root: HTMLElement | null;
let directory: string | null = null;

const setupResize = (element: HTMLElement): void => {
  let reportedHeight = -1;
  new ResizeObserver(() => {
    const height = Math.ceil(element.getBoundingClientRect().height);
    if (height !== reportedHeight) {
      reportedHeight = height;
      void host.setHeight(height).catch(() => {});
    }
  }).observe(element);
};

host.onReady((context) => {
  applyHostReady(context, document.documentElement);
  root = document.getElementById('root') || null;
  if (root) {
    setupResize(root);
    tryLoad();
  }
});

host.onDirectory((nextDir: string | null) => {
  directory = nextDir;
  if (root) {
    tryLoad();
  }
});

function renderNote(message: string): void {
  if (!root) return;
  root.replaceChildren();
  const note = document.createElement('div');
  note.classList.add('note');
  note.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--oc-muted);font-size:12px;padding:20px;box-sizing:border-box';
  note.textContent = message;
  root.appendChild(note);
}

interface GraphResult { nodes: any[]; edges: any[]; visNetworkLibCode?: string }

function drawGraph(nodes: any[], edges: any[]): void {
  if (!root) return;

  try {
    root.replaceChildren();
    const container = document.createElement('div');
    container.style.cssText = 'width:100%;height:100%;overflow:hidden;';
    container.innerHTML = '<div id="graph" style="width:100%;height:100%"></div>';
    root.appendChild(container);

    requestAnimationFrame(() => {
      const netEl = container.querySelector<HTMLElement>('#graph');
      if (!netEl) throw new Error('Graph container element not found.');
      if (typeof vis === 'undefined') throw new Error('vis-network library failed to load.');

      const networkOptions: Record<string, any> = {
        physics: {
          enabled: true,
          solver: 'forceAtlas2Based',
          forceAtlas2Based: { gravitationalConstant: -60, centralGravity: 0.005, springLength: 120, springConstant: 0.08, damping: 0.4, avoidOverlap: 0.8 },
          stabilization: { iterations: 200, fit: true }
        },
        interaction: { hover: true, tooltipDelay: 100, hideEdgesOnDrag: true },
        nodes: { shape: 'dot', borderWidth: 1.5 },
        edges: { smooth: { type: 'continuous', roundness: 0.2 }, selectionWidth: 3 }
      };

      const networkData = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
      const network = new vis.Network(netEl, networkData, networkOptions);

      network.once('stabilizationIterationsDone', () => {
        network.setOptions({ physics: { enabled: false } });
      });

      if (root) setupResize(root);
    });
  } catch (err: any) {
    renderNote(err?.message || 'Failed to draw the graph.');
  }
}

async function fetchGraphData(directory: string): Promise<unknown> {
  const result = await host.serviceRequest({ method: 'GET', path: '/graph/data', query: { directory } });
  // Host service returns JSON text; parse it, but defer structural checks to caller.
  return JSON.parse(result.body);
}

async function ensureVisNetwork(code?: string): Promise<void> {
  if (typeof vis !== 'undefined') return; // Already loaded globally.

  if (code && code.length > 0) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.textContent = code;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('vis-network inline injection failed.'));
      document.head.appendChild(script);
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = VIS_NETWORK_URL;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`vis-network failed to load from ${VIS_NETWORK_URL}`));
    document.head.appendChild(script);
  });
}

async function tryLoad(): Promise<void> {
  if (!root) return;

  if (!directory) {
    renderNote('Open a project to see its graphify graph.');
    return;
  }

  renderNote('Loading the graph...');

  try {
    const raw = await fetchGraphData(directory) as any;

    // If the service returned an error key, surface its message immediately.
    if (raw && typeof raw === 'object' && 'error' in raw) {
      throw new Error(String(raw.error));
    }

    const data = raw as GraphResult;
    if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      throw new Error('Graphify data is empty or malformed.');
    }

    await ensureVisNetwork(data.visNetworkLibCode);

    drawGraph(data.nodes, data.edges);
  } catch (err: any) {
    const error = err instanceof Error ? err.message : String(err);
    let message: string;

    if (!directory || error.includes('graph-not-found') || (typeof error === 'string' && /not-found/i.test(error))) {
      message = 'Graphify graph not found in this project. Run `graphify .` first.';
    } else if (error === 'parse-error' || error.includes('Graphify data is empty or malformed')) {
      message = 'graphify data is empty or malformed. Open a project that has run graphify.';
    } else if (error.includes('vis-network failed') || error === 'inline injection failed' || error.toLowerCase().includes('network')) {
      message = 'Failed to load vis-network. Check network access or make sure graphify-out/graph.html was generated.';
    } else if (error.includes('Access denied') || error === 'bad-request' || /403/i.test(error)) {
      message = 'Access denied to graphify-out/graph.html.';
    } else if (error === 'graph container element not found' || error === 'vis-network library failed to load.') {
      message = `Graph rendering issue: ${error}`;
    } else {
      // Service host errors, JSON parse from bad result body, or other unexpected error.
      message = err instanceof Error ? `Failed to load the graphify graph: ${err.message}` : 'Failed to load the graphify graph.';
    }

    renderNote(message);
  }
}

tryLoad();
