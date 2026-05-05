# Delhi–Dehradun Expressway Intelligence & Algorithm Visualization Platform

An interactive, production-grade platform that visualizes 6 core DSA algorithms applied to real-world expressway routing on the Delhi–Dehradun NH-58 corridor.

## Features

### Interactive Graph Engine (D3.js)
- 5 city nodes: Delhi → Meerut → Muzaffarnagar → Roorkee → Dehradun
- 7 weighted edges (distance km, toll ₹, fuel ₹)
- Zoom, pan, and drag nodes freely
- Hover tooltips with city population and road stats
- Smooth animated transitions for each algorithm step

### Algorithm Visualizations (6 total)

| Algorithm | Category | Complexity | Purpose |
|---|---|---|---|
| Dijkstra's | Graph | O((V+E)logV) | Shortest expressway path |
| Kruskal's | Graph | O(E log E) | Minimum spanning tree |
| Bellman-Ford | Graph | O(V×E) | Negative cycle detection |
| Fenwick Tree | Data Structure | O(log N) | Prefix-sum toll queries |
| Bloom Filter | Data Structure | O(k) | Road membership lookup |
| Top-K Heap | Algorithm | O(N log K) | Highest-traffic segments |

### Animation Controls
- Play / Pause / Step Forward / Step Backward
- Timeline scrubber (jump to any step)
- Speed: 0.25× / 0.5× / 1× / 2×
- Restart

### Analytics Dashboard
- Live traffic simulation (3-second updates)
- Bar charts: toll vs fuel cost per segment
- Line chart: historical traffic trends
- Doughnut: distance distribution
- Algorithm complexity reference table

### UI/UX
- Premium dark theme (deep navy + neon blue/purple)
- Glassmorphism cards with backdrop blur
- Framer Motion page transitions and micro-interactions
- Responsive across all screen sizes (mobile, tablet, desktop)
- Collapsible sidebar navigation
- Pseudo-code panel with live line highlighting
- Step explanation panel with data tags

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 18** + **TypeScript** — Component-driven architecture
- **Vite** — Fast build tool with code splitting
- **Tailwind CSS** — Utility-first dark theme styling
- **Framer Motion** — Page transitions, card animations, micro-interactions
- **D3.js v7** — Interactive SVG graph (zoom, pan, drag, transitions)
- **Chart.js + react-chartjs-2** — Analytics charts (Bar, Line, Doughnut)
- **Lucide React** — Icon library
- **React Router v6** — Client-side routing

## Project Structure

```
src/
├── types/          # TypeScript interfaces
├── utils/          # Graph data, color constants
├── hooks/          # useAlgorithm, useAnimation
├── components/
│   ├── graph/      # D3.js GraphCanvas
│   ├── algorithm/  # ControlPanel, PseudoCode, Explanation, Legend
│   ├── analytics/  # StatsCard
│   └── ui/         # Navbar, Sidebar
├── features/
│   ├── dijkstra/   # Algorithm + step generator + visualizer
│   ├── kruskal/
│   ├── bellmanford/
│   ├── fenwick/
│   ├── bloomfilter/
│   └── topk/
└── pages/          # Dashboard, AlgorithmsPage, AnalyticsPage
```

## Deployment (Netlify)

The `netlify.toml` is pre-configured:
```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Push to GitHub and connect to Netlify — zero configuration required.

## Graph Data

The expressway network is modeled as an undirected weighted graph:

| Edge | Distance | Toll | Fuel |
|---|---|---|---|
| Delhi ↔ Meerut | 70 km | ₹85 | ₹105 |
| Meerut ↔ Muzaffarnagar | 60 km | ₹75 | ₹90 |
| Muzaffarnagar ↔ Roorkee | 65 km | ₹80 | ₹98 |
| Roorkee ↔ Dehradun | 55 km | ₹70 | ₹83 |
| Delhi ↔ Muzaffarnagar | 140 km | ₹150 | ₹210 |
| Meerut ↔ Roorkee | 120 km | ₹130 | ₹180 |
| Muzaffarnagar ↔ Dehradun | 185 km | ₹200 | ₹278 |
