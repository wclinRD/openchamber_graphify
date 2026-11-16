// panel/main.ts
import { connectHost } from '@openchamber/sdk';
import type { HostReadyContext } from '@openchamber/sdk';
import { applyHostReady } from '@openchamber/sdk/ui';

declare var vis: any;
type GraphData = { nodes: Record<string, any>[]; edges: Record<string, any>[]; visNetworkLibCode?: string };

const host = connectHost();
let root: HTMLElement | null;
let directory: string | null = null;

const CSS = `
  html, body { margin: 0; padding: 0; height: 100%; }
  #root { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
  .tabs { display: flex; background: var(--oc-bg); border-bottom: 1px solid var(--oc-border); }
  .tab {
    flex: 0 1 auto; padding: 8px 14px; font-size: 13px; color: var(--oc-muted-foreground);
    cursor: pointer; user-select: none; border-bottom: 2px solid transparent; margin-right: -1px;
    background: color-mix(in srgb, var(--oc-fg) 4%, transparent);
  }
  .tab:hover { color: var(--oc-fg); background-image: linear-gradient(var(--oc-hover), var(--oc-hover)); }
  .tab.active { color: var(--primary); border-color: var(--primary); font-weight: 600; background-image: linear-gradient(var(--oc-primary), var(--oc-primary)); color: #fff !important; }
  .content { flex: 1; display: none; overflow: hidden; height: 0; }
  .content.active { display: flex; flex-direction: column; height: auto; overflow: hidden; }
  .section-head { display: flex; align-items: center; gap: 8px; padding: 8px 12px; font-size: 13px; color: var(--oc-muted); border-bottom: 1px solid var(--oc-border); }
  .section-body { padding: 0; overflow-y: auto; flex: 1; }
  .graph-controls { display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: color-mix(in srgb, var(--oc-fg) 3%, transparent); border-bottom: 1px solid var(--oc-border); flex-shrink:0; }
  .graph-controls button { padding: 4px 8px; font-size: 12px; border-radius: 4px; background: color-mix(in srgb, var(--oc-fg) 8%, transparent); border: none; color: var(--oc-muted); cursor: pointer; }
  .graph-controls button:hover { color: var(--oc-fg); background: color-mix(in srgb, var(--primary) 15%, transparent); }
  .graph-controls input { width: 64px; padding: 3px 4px; font-family: var(--oc-mono); font-size: 12px; border-radius: 4px; background: color-mix(in srgb, var(--oc-fg) 4%, transparent); border: none; color: var(--oc-fg); }
  .section-body.graph-container { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; }
  #graph-canvas { width: 100%; height: auto; flex: 1; min-height: 0; }
  .report-pre { border: none; box-sizing: border-box; font-size: 12px; line-height: 1.55; color: var(--oc-fg); white-space: pre-wrap; overflow-y: auto; }
  .analysis-grid { display: grid; gap: 12px; padding: 12px; }
  .analysis-card { background: color-mix(in srgb, var(--oc-fg) 4%, transparent); border-radius: 8px; padding: 12px; }
  .analysis-card h4 { margin: 0 0 8px; font-size: 13px; font-weight: 600; color: var(--primary); }
  .gods-list, .questions-list { list-style-type: disc; margin: 0 0 8px 16px; font-family: var(--oc-mono); }
  .questions-list { list-style-type: none; margin-left: 0; padding-left: 4px; }
  .questions-list > li { margin-bottom: 10px; border-left: 2px solid var(--oc-border); padding-left: 8px; }
  .questions-list strong { color: var(--oc-fg); font: inherit; display: block; }
  .questions-list p { margin: 4px 0 0; color: var(--oc-muted); font-size: 12px; }
  .communities-table { width: 100%; border-collapse: collapse; font-size: 12px; color: var(--oc-fg); }
  .communities-table th { text-align: left; color: var(--oc-muted); padding: 6px 8px; border-bottom: 1px solid var(--oc-border); }
  .communities-table td { padding: 6px 8px; border-bottom: 1px solid var(--oc-border); }
  .badge-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px; }
`;

let activeTab = 'graph';

const tabsData = [
  { id: 'graph', label: 'Graph' },
  { id: 'report', label: 'Report' },
  { id: 'analysis', label: 'Analysis' },
];

function renderTabs(): void {
  if (!root) return;
  root.replaceChildren();

  const tabsEl = document.createElement('div');
  tabsEl.classList.add('tabs');
  for (const tab of tabsData) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('tab');
    if (tab.id === activeTab) btn.classList.add('active');
    btn.textContent = tab.label;
    btn.addEventListener('click', () => { activeTab = tab.id; renderTabs(); });
    tabsEl.appendChild(btn);
  }

  const contentGraph = createSection('graph', 'Interactive Graph');
  const contentReport = createSection('report', 'GRAPH REPORT');
  const contentAnalysis = createSection('analysis', 'Graph Analysis');

  root.appendChild(tabsEl);
  root.append(contentGraph, contentReport, contentAnalysis);

  void loadData();
}

function createSection(id: string, title: string): HTMLElement {
  const el = document.createElement('div');
  el.id = id;
  el.classList.add('content');
  if (id === activeTab) el.classList.add('active');

  const head = document.createElement('div');
  head.classList.add('section-head', id + '-head');
  head.textContent = title;
  el.appendChild(head);

  const body = document.createElement('div');
  body.classList.add('section-body', id + '-body');
  if (id === 'graph') body.classList.add('graph-container');
  el.appendChild(body);

  return el;
}

const networkMap = new Map<string, any>();

let graphScale = 1;
const ZOOM_IN_FACTOR = 1.25;
const ZOOM_OUT_FACTOR = 0.8;

async function fetchGraphData(): Promise<GraphData> {
  const r = await host.serviceRequest!({ method: 'GET', path: '/graph/data', query: { directory } });
  return JSON.parse(r.body) as GraphData;
}

function ensureVisNetwork(code?: string): Promise<void> {
  if (typeof vis !== 'undefined') return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    if (code && code.length > 0) {
      script.textContent = code;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('vis-network inline injection failed.'));
    } else {
      script.src = 'https://unpkg.com/vis-network@9.1.6/standalone/umd/vis-network.min.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('vis-network failed to load from CDN.'));
    }
    document.head.appendChild(script);
  });
}

async function drawGraph(data: GraphData): Promise<void> {
  const body = root?.querySelector<HTMLElement>(`.section-body.graph-container`);
  if (!body) return;

  body.replaceChildren();

  const controls = document.createElement('div');
  controls.classList.add('graph-controls');

  function makeButton(text: string, action: string) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.dataset.action = action;
    controls.appendChild(btn);
  }

  makeButton('Default', 'reset');
  makeButton('Zoom In', 'in');
  makeButton('Zoom Out', 'out');

  const labelSpan = document.createElement('span');
  labelSpan.style.cssText = 'font-size:12px; color:var(--oc-muted); margin-left:6px';
  labelSpan.textContent = 'Zoom %:';
  controls.appendChild(labelSpan);

  const inputZoom = document.createElement('input');
  inputZoom.type = 'number';
  inputZoom.classList.add('graph-zoom-input');
  inputZoom.step = '10';
  inputZoom.min = '25';
  inputZoom.max = '400';
  inputZoom.placeholder = '100%';
  controls.appendChild(inputZoom);

  body.appendChild(controls);

  const graphDiv = document.createElement('div');
  const id = 'graph-canvas';
  graphDiv.id = id;
  body.appendChild(graphDiv);

  requestAnimationFrame(async () => {
    const el = document.getElementById(id) as HTMLElement | null;
    if (!el) return;

    try {
      await ensureVisNetwork(data.visNetworkLibCode);
      networkMap.delete('graph');

      // Build dataset preserving community color but using vis-network options.
      const netNodes = data.nodes.map((node, i) => ({
        ...node,
        x: 30 * Math.sqrt(i) * Math.cos((i + 1) * 2.4),
        y: 30 * Math.sqrt(i + 1) * Math.sin((i + 1) * 2.4),
      }));

      const netEdges = data.edges.map((edge, i) => ({
        id: String(i), from: edge.from, to: edge.to, color: edge.color ?? { opacity: 0.7 }, width: edge.width ?? 2, dashed: edge.dashes ?? false,
        arrows: { to: { enabled: true, scaleFactor: 0.5 } }, title: edge.title ?? '',
      }));

      const network = new vis.Network(el, { nodes: netNodes, edges: netEdges }, {
        physics: { enabled: true, solver: 'forceAtlas2Based', forceAtlas2Based: { gravitationalConstant: -60, centralGravity: 0.005, springLength: 120, springConstant: 0.08, damping: 0.4, avoidOverlap: 0.8 }, stabilization: { iterations: 200, fit: true } },
        interaction: { hover: true, tooltipDelay: 100, hideEdgesOnDrag: true, navigationButtons: false, keyboard: false },
        nodes: { shape: 'dot', borderWidth: 1.5, size: 10 },
        edges: { smooth: { type: 'continuous', roundness: 0.2 }, selectionWidth: 3 },
      });

      networkMap.set('graph', network);

      const applyFit = (scale?: number) => {
        if (!network) return;
        network.fit(scale !== undefined ? { scale } : {});
        const s = network.getScale();
        graphScale = Number.isFinite(s) ? s : (scale ?? graphScale);
      };

      const runSetPct = () => {
        const value = Number(inputZoom.value);
        if (!Number.isNaN(value) && value >= 25 && value <= 400) {
          applyFit(value / 100);
        }
      };

      let graphScaleLocal: number | null = graphScale;

      // Fit to viewport after stabilization completes.
      (network as any).once?.('stabilizationIterationsDone', () => { applyFit(); network.setOptions({ physics: { enabled: false } }); graphScaleLocal = graphScale; });

      const handleZoomControls = (action: string) => {
        if (!network || !el) return;
        switch (action) {
          case 'reset': applyFit(); break;
          case 'in': applyFit(graphScaleLocal ?? graphScale * ZOOM_IN_FACTOR); break;
          case 'out': applyFit(graphScaleLocal ?? graphScale * ZOOM_OUT_FACTOR); break;
          case 'setpct': runSetPct(); break;
        }
      };

      controls.querySelectorAll('button[data-action]').forEach((button) => {
        const act = button.dataset.action as string;
        if (act && network) {
          button.addEventListener('click', () => handleZoomControls(act));
        }
      });

      inputZoom.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.keyCode === 13) runSetPct();
      });

      // Make canvas responsive to container size.
      new ResizeObserver(() => network?.resize?.()).observe(el);

    } catch (err: any) {
      networkMap.delete('graph');
      body.replaceChildren();
      const note = document.createElement('div');
      note.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--oc-muted);font-size:12px;padding:20px';
      note.textContent = err?.message ?? 'Failed to draw the graph.';
      body.appendChild(note);
    }
  });
}

async function fetchReport(): Promise<string> {
  const r = await host.serviceRequest!({ method: 'GET', path: '/api/report', query: { directory } });
  const obj = JSON.parse(r.body);
  return obj.report ?? '';
}

async function fetchAnalysis(): Promise<unknown> {
  const r = await host.serviceRequest!({ method: 'GET', path: '/api/analysis', query: { directory } });
  const obj = JSON.parse(r.body);
  return obj.analysis ?? {};
}

async function fetchManifest(): Promise<unknown> { } // Not used yet.

async function renderReport(report: string): Promise<void> {
  const body = root?.querySelector<HTMLElement>(`.section-body.report-body`);
  if (!body) return;

  body.replaceChildren();

  // Simple markdown-like formatting: headings and list items.
  const preEl = document.createElement('pre');
  preEl.classList.add('report-pre');

  const lines = report.split(/\r?\n/);
  for (const line of lines) {
    if (/^# /.test(line)) {
      const h2 = document.createElement('h3');
      h2.style.cssText = 'margin:8px 0 4px;font-size:14px;color:var(--oc-fg);';
      h2.textContent = line.replace(/^# /, '');
      body.appendChild(h2);
    } else if (/^## /.test(line)) {
      const h3 = document.createElement('h4');
      h3.style.cssText = 'margin:10px 0 4px;font-size:13px;color:var(--oc-muted);';
      h3.textContent = line.replace(/^## /, '');
      body.appendChild(h3);
    } else if (/^### /.test(line)) {
      const h4 = document.createElement('h5');
      h4.style.cssText = 'margin:8px 0 3px;font-size:12px;color:var(--oc-muted);';
      h4.textContent = line.replace(/^### /, '');
      body.appendChild(h4);
    } else if (/^- /.test(line)) {
      const li = document.createElement('li');
      li.style.cssText = 'margin:4px 0;font-family:var(--oc-mono)';
      li.textContent = line.replace(/^- /, '');
      preEl.appendChild(li);
    } else if (line === '') {
      continue; // skip empty lines in pre block for layout.
    } else {
      const p = document.createElement('p');
      p.style.cssText = 'margin:0 0 6px;white-space:pre-wrap';
      p.textContent = line;
      preEl.appendChild(p);
    }
  }

  // Wrap the rendered elements in a scrollable container.
  const scroller = document.createElement('div');
  scroller.style.cssText = 'overflow-y:auto;max-height:calc(100% - 2px)';
  scroller.appendChild(preEl);

  // If report-pre already has children, use them.
  if (preEl.children.length === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'padding:16px;color:var(--oc-muted);font-size:12px';
    empty.textContent = report || 'No graph report found.';
    scroller.appendChild(empty);
  }

  body.appendChild(scroller);
}

function renderAnalysis(analysis: any): void {
  const body = root?.querySelector<HTMLElement>(`.section-body.analysis-body`);
  if (!body) return;

  body.replaceChildren();

  const grid = document.createElement('div');
  grid.classList.add('analysis-grid');

  // Communities table
  const cardCommunities = document.createElement('div');
  cardCommunities.classList.add('analysis-card');
  const h3 = document.createElement('h4');
  h3.textContent = 'Communities';
  const table = document.createElement('table');
  table.classList.add('communities-table');

  // Header row
  const headerRow = document.createElement('tr');
  ['Community', 'Cohesion'].forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  const comms = (analysis as any).communities ?? {};
  const cohesion = (analysis as any).cohesion ?? {};

  for (const cid of Object.keys(comms).sort((a, b) => Number(a) - Number(b))) {
    const row = document.createElement('tr');
    const td1 = document.createElement('td');

    // Color from graphify-out legend mapping
    const hueMap: Record<string, string> = {'0':'4E79A7','1':'F28E2B','2':'E15759','3':'76B7B2','4':'59A14F','5':'EDC948','6':'B07AA1'};
    const color = hueMap[cid] || '888';

    td1.innerHTML = `<span class="badge-dot" style="background:#${color}"></span>C${cid}`;
    const td2 = document.createElement('td');
    const coh = cohesion[cid];
    td2.textContent = coh !== undefined ? coh.toFixed(2) : '-';

    row.appendChild(td1);
    row.appendChild(td2);
    table.appendChild(row);
  }

  cardCommunities.appendChild(h3);
  cardCommunities.appendChild(table);
  grid.appendChild(cardCommunities);

  // God nodes list
  const godsList = ((analysis as any).gods ?? []) as Array<{label: string; degree: number}>;
  if (godsList.length > 0) {
    const cardGods = document.createElement('div');
    cardGods.classList.add('analysis-card');
    const h4 = document.createElement('h4');
    h4.textContent = 'God Nodes';
    const ul = document.createElement('ol');
    ul.classList.add('gods-list');

    godsList.forEach((god, i) => {
      const li = document.createElement('li');
      li.textContent = `"${god.label}" — ${god.degree} edges`;
      ul.appendChild(li);
    });
    cardGods.appendChild(h4);
    cardGods.appendChild(ul);
    grid.appendChild(cardGods);
  }

  // Suggested questions & surprising connections
  const questions = ((analysis as any).questions ?? []) as Array<{question?: string; why?: string}> | Array<string>;
  const surprises = ((analysis as any).surprises ?? []) as Array<string>;

  if (questions.length > 0 || surprises.length > 0) {
    const cardQ = document.createElement('div');
    cardQ.classList.add('analysis-card');

    let headCount = 0;
    if (surprises.length > 0) {
      const h5 = document.createElement('h4');
      h5.textContent = 'Surprising Connections';
      cardQ.appendChild(h5); headCount++;

      const ulS = document.createElement('ul');
      ulS.classList.add('questions-list');
      surprises.forEach((s: string) => { const li = document.createElement('li'); li.textContent = s; ulS.appendChild(li); });
      cardQ.appendChild(ulS); headCount++;
    }

    if (questions.length > 0) {
      const h5q = document.createElement('h4');
      h5q.textContent = 'Suggested Questions';
      cardQ.appendChild(h5q); headCount++;

      const ulQ = document.createElement('ul');
      ulQ.classList.add('questions-list');

      questions.forEach((q: any) => {
        const li = document.createElement('li');
        let qStr: string;
        if (typeof q === 'string') {
          qStr = q;
        } else if (q?.question) {
          qStr = `Why does \`${esc(q.question)}\``;
        } else {
          qStr = 'Unknown question';
        }
        li.innerHTML = `<strong>${qStr}</strong>`;

        if (typeof q === 'object' && q.why) {
          const p = document.createElement('p');
          p.textContent = String(q.why);
          li.appendChild(p);
        }
        ulQ.appendChild(li);
      });

      if (headCount === 1 && cardQ.firstElementChild?.tagName.toLowerCase() !== 'h4' ) {
        // We already appended h5q
      } else if (surprises.length > 0) {
        // insert suggested questions after surprising connections head/ul if needed (already appended h5q)
      } else {
        // cardQ starts already with h4 and ul from surprises? No.
      }
      cardQ.appendChild(ulQ);
    }

    grid.appendChild(cardQ);
  }

  body.appendChild(grid);
}

function esc(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function loadData(): Promise<void> {
  if (!root || !directory) return;

  const sectionGraph = root.querySelector('.section-body.graph-container');
  if (sectionGraph) {
    const note = document.createElement('div');
    note.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--oc-muted);font-size:12px';
    note.textContent = 'Loading graph data…';
    sectionGraph.replaceChildren(note);
  }

  try {
    const dataRaw = await fetchGraphData();
    if (!dataRaw || !Array.isArray(dataRaw.nodes) || !Array.isArray(dataRaw.edges)) {
      const errNote = document.createElement('div');
      errNote.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--oc-error);font-size:12px';
      errNote.textContent = 'Graph data is empty or malformed.';
      sectionGraph?.replaceChildren(errNote);
      return;
    }

    if (activeTab === 'graph') await drawGraph(dataRaw);
  } catch (err: any) {
    const sectionGraph = root.querySelector('.section-body.graph-container');
    if (sectionGraph) {
      const errNote = document.createElement('div');
      errNote.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--oc-error);font-size:12px';
      let msg = err instanceof Error ? err.message : 'Failed to load graph data.';
      if (msg.includes('graph-not-found') || /not found/i.test(msg)) msg = 'No graphify-out/graph.html found. Run `graphify .` first.';
      errNote.textContent = msg;
      sectionGraph.replaceChildren(errNote);
    }
  }

  // Load report & analysis whenever they are visible.
  if (activeTab === 'report' || activeTab === 'analysis') {
    try {
      const report = await fetchReport();
      if (activeTab === 'report') await renderReport(report);
    } catch { /* report not found, handled by tab content */ }

    try {
      const analysis = await fetchAnalysis();
      if (activeTab === 'analysis') renderAnalysis(analysis as any);
    } catch { /* analysis not found; we can leave empty */ }
  } else if (activeTab !== 'graph') {
    const body = root?.querySelector<HTMLElement>(`.section-body.${activeTab}-body`);
    if (body) { body.replaceChildren(); const note = document.createElement('div'); note.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:var(--oc-muted);font-size:12px'; note.textContent='Empty.'; body.appendChild(note); }
  } else {
    // report/analysis already loaded if we want to cache; currently no caching needed.
  }

  updateTabHeight();
}

let resizeTimer: ReturnType<typeof setTimeout> | null = null;
function updateTabHeight(): void {
  if (!root) return;
  const height = Math.ceil(root?.getBoundingClientRect().height || 0);
  if (height > 0) {
    host.setHeight(height).catch(() => {});
  }
}

function setupResize(): void {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;

  new ResizeObserver(() => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => updateTabHeight(), 0);
  }).observe(rootEl);
}

let started = false;
host.onReady((ctx: HostReadyContext) => {
  if (started) return;
  started = true;

  applyHostReady(ctx, document.documentElement);
  root = document.getElementById('root') || null;

  if (root) {
    const styleEl = document.createElement('style');
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    // Render once ready and directory set.
    setupResize();
    renderTabs();
  }

  host.onDirectory((dir) => { directory = dir; if (root && started) renderTabs(); });
});
