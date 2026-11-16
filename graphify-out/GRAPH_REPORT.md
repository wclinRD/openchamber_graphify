# Graph Report - openchamber_graphify  (2026-11-16)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 72 nodes · 78 edges · 7 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 12,048 input · 765 output

## Community Hubs (Navigation)
- TypeScript Configuration
- Package Dependencies
- Server Build Setup
- Extension Manifest
- Bundled Build Output
- UI Component Configuration
- Graph Rendering Logic

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `openchamber` - 6 edges
3. `statusSection` - 6 edges
4. `Fo()` - 3 edges
5. `tryLoad()` - 3 edges
6. `scripts` - 3 edges
7. `@openchamber/sdk` - 3 edges
8. `service` - 3 edges
9. `contributes` - 3 edges
10. `c` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (7 total, 0 thin omitted)

### Community 0 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module (+9 more)

### Community 1 - "Package Dependencies"
Cohesion: 0.16
Nodes (13): description, devDependencies, @openchamber/sdk@^2.3.3, @types/node@^20, name, private, scripts, build (+5 more)

### Community 2 - "Server Build Setup"
Cohesion: 0.23
Nodes (5): pkgRoot, targets, port, server, sendJson()

### Community 3 - "Extension Manifest"
Cohesion: 0.22
Nodes (9): service, openchamber, apiVersion, contributes, icon, id, name, entry (+1 more)

### Community 4 - "Bundled Build Output"
Cohesion: 0.32
Nodes (4): c, Fo(), Ht(), pr()

### Community 5 - "UI Component Configuration"
Cohesion: 0.33
Nodes (6): statusSection, defaultExpanded, entry, height, requiresProject, title

### Community 6 - "Graph Rendering Logic"
Cohesion: 0.60
Nodes (4): host, renderGraph(), renderNote(), tryLoad()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `openchamber` connect `Extension Manifest` to `Package Dependencies`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `contributes` connect `Extension Manifest` to `UI Component Configuration`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `@openchamber/sdk` connect `Package Dependencies` to `Graph Rendering Logic`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._