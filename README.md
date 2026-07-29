# Mosqlimate Charts SDK Roadmap

## Vision

Create a framework-agnostic charting SDK that allows anyone to embed Alertadengue/Mosqlimate visualizations into any website with a single script or npm package.

---

# Phase 1 — Core SDK (MVP)

**Goal:** Render a chart in a plain HTML page.

### Deliverables

- [x] Create `@mosqlimate/charts`
- [x] API client
- [x] Chart manager
- [x] Renderer lifecycle
- [x] Loading & error states
- [x] Responsive resizing
- [x] Public JavaScript API

Example:

```javascript
Mosqlimate.render({
  target: "#chart",
  chart: "infodengue/rt",
  params: {
    disease: "dengue",
    geocode: 2300507,
  },
});
```

---

# Phase 2 — Rendering Engine

Create a common interface for every chart, backed by Apache ECharts.

```text
ChartRenderer
    └── EChartsRenderer
            ├── infodengue/
            │   └── RtChart
            ├── climate/
            │   ├── TemperatureChart
            │   ├── AccumulatedWaterfallChart
            │   └── AirChart
            └── contaovos/
                ├── EggsDensityChart
                ├── PositivityChart
                ├── MapChart
                └── ScatterChart
```

### Deliverables

- [x] Renderer interface
- [x] Render
- [x] Update
- [x] Resize
- [x] Destroy

---

# Phase 3 — Backend Chart API

Instead of exposing raw prediction endpoints, expose visualization endpoints.

Example:

```
GET /api/vis/charts/infodengue/rt/
GET /api/vis/charts/climate/temperature/
GET /api/vis/charts/contaovos/eggs_density/
```

### Deliverables

- [x] Stable response format
- [x] Versioned API
- [x] Backend serializers optimized for charts

---

# Phase 4 — Chart Registry

Register every chart by name.

```text
infodengue/rt
    ↓
RtChart
    ↓
GET /api/vis/charts/infodengue/rt/
```

Example:

```javascript
Mosqlimate.render({
  chart: "infodengue/rt",
});
```

### Deliverables

- [x] Registry
- [x] Dynamic loading
- [x] Chart metadata

---

# Phase 5 — HTML Embedding

Support multiple embedding styles.

## JavaScript

```html
<div id="chart"></div>

<script>
  Mosqlimate.render({
    target: "#chart",
    chart: "infodengue/rt",
    params: { disease: "dengue", geocode: 2300507 },
  });
</script>
```

## Declarative (data-* attributes)

```html
<div
  data-chart="infodengue/rt"
  data-disease="dengue"
  data-geocode="2300507"
  data-start="2025-01-01"
  data-end="2025-12-31"
></div>
```

## Web Components

```html
<mosqlimate-chart
  chart="infodengue/rt"
  disease="dengue"
  geocode="2300507"
  start="2025-01-01"
  end="2025-12-31"
>
</mosqlimate-chart>
```

### Deliverables

- [x] `Mosqlimate.render()` — JavaScript API
- [x] `Mosqlimate.autoInit()` — Declarative auto-discovery via `data-chart`
- [x] `<mosqlimate-chart>` — Custom element with Shadow DOM
- [x] Automatic initialization on page load

---

# Phase 6 — Framework Wrappers

Thin wrappers around the core SDK.

Packages:

```
@mosqlimate/react
@mosqlimate/vue
@mosqlimate/angular
@mosqlimate/svelte
```

Example:

```tsx
<RtChart disease="dengue" geocode={2300507} />
```

### Deliverables

- [x] React package
- [ ] Vue package
- [ ] Angular package
- [ ] Svelte package

---

# Phase 7 — Themes

Built-in themes (light and dark already supported in core).

```
light

dark

minimal

publication

dashboard
```

Example:

```javascript
Mosqlimate.render({
  theme: "dark",
});
```

Custom theme:

```javascript
Mosqlimate.theme({
  primary: "#0099ff",
  font: "Inter",
});
```

### Deliverables

- [x] Light / dark mode (in ECharts renderer)
- [ ] Theme engine
- [ ] CSS variables
- [ ] Custom themes

---

# Phase 8 — Distribution

## CDN

```
cdn.mosqlimate.org

/sdk.js
/sdk.min.js
/v1/sdk.js
/v2/sdk.js
```

## npm

```
@mosqlimate/charts
```

### Deliverables

- [x] npm package (`@mosqlimate/charts`)
- [x] ESM + CJS dual builds
- [ ] CDN builds
- [ ] Semantic versioning pipeline

---

# Phase 9 — Dashboard Support

Render multiple coordinated charts.

Example:

```javascript
Mosqlimate.dashboard({
    target: "#dashboard",
    charts: [
        { chart: "infodengue/rt", params: { ... } },
        { chart: "climate/temperature", params: { ... } },
        { chart: "contaovos/eggs_density", params: { ... } }
    ]
});
```

### Deliverables

- [ ] Dashboard layout
- [ ] Shared state
- [ ] Responsive grid

---

# Phase 10 — Exporting

Supported formats:

- PNG
- SVG
- PDF
- CSV

Example:

```javascript
chart.export("png");
```

### Deliverables

- [ ] Image export
- [ ] Vector export
- [ ] CSV export
- [ ] Print support

---

# Phase 11 — Advanced Features

## Interaction

- [ ] Linked charts
- [ ] Shared tooltips
- [ ] Zoom synchronization
- [ ] Brush selection

## Live Data

- [ ] WebSockets
- [ ] Server-Sent Events
- [ ] Auto refresh

## Accessibility

- [ ] Keyboard navigation
- [ ] ARIA support
- [ ] High contrast mode

## Internationalization

- [ ] Locale support
- [ ] Number formatting
- [ ] Date formatting

---

# Repository Structure

```text
@mosqlimate/charts/
│
├── packages/
│   ├── core/           ← Implemented (API client, renderers, web component, auto-init)
│   ├── charts/         ← stub
│   ├── web-components/ ← stub
│   ├── react/          ← stub
│   ├── vue/            ← stub
│   ├── angular/        ← stub
│   ├── svelte/         ← stub
│   ├── themes/         ← stub
│   └── docs/           ← stub
│
├── examples/
│   ├── html/           ← stub
│   ├── react/          ← stub
│   ├── vue/            ← stub
│   ├── nextjs/         ← stub
│   └── django/         ← stub
│
├── website/            ← stub
│
└── playground/         ← Live demo with all chart types
```

---

# Milestones

| Milestone | Goal                                                                             | Status                                         |
| --------- | -------------------------------------------------------------------------------- | ---------------------------------------------- |
| **M1**    | Render a chart in plain HTML via CDN using `Mosqlimate.render()`.                | ✅ Done                                        |
| **M2**    | Add multiple chart types with a renderer registry.                               | ✅ Done                                        |
| **M3**    | Support `<mosqlimate-chart>` custom elements and declarative `data-*` auto-init. | ✅ Done                                        |
| **M4**    | Publish to npm and a versioned CDN.                                              | 🟡 Partially (npm package exists, CDN pending) |
| **M5**    | Release React, Vue, Angular, and Svelte wrappers.                                | ❌ Not started                                 |
| **M6**    | Add themes, exports, and accessibility.                                          | 🟡 Partially (light/dark done)                 |
| **M7**    | Support dashboards, linked interactions, and live updates.                       | ❌ Not started                                 |
| **M8**    | Reach a stable 1.0 release with complete documentation and examples.             | ❌ Not started                                 |

# Available Charts

| Category   | Chart Name      | Renderer  | Description                     |
| ---------- | --------------- | --------- | ------------------------------- |
| infodengue | `infodengue/rt` | `RtChart` | Rt reproduction rate line chart |

| climate | `climate/temperature` | `TemperatureChart` | Max / avg / min temperature line chart |
| climate | `climate/accumulated-waterfall` | `AccumulatedWaterfallChart` | Precipitation stacked bar chart |
| climate | `climate/umid-pressao-med` | `AirChart` | Humidity (line) + pressure (bar) dual-axis |
| contaovos | `contaovos/eggs_density` | `EggsDensityChart` | Egg count over epiweeks line chart |
| contaovos | `contaovos/positivity` | `PositivityChart` | Positivity % by location bar chart |
| contaovos | `contaovos/map` | `MapChart` | Brazil choropleth map of total eggs |
| contaovos | `contaovos/map/scatter` | `ScatterChart` | Trap location scatter plot (lat/lng) |
