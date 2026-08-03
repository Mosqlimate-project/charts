# Mosqlimate Charts SDK Roadmap

## Vision

Create a framework-agnostic charting SDK that allows anyone to embed Alertadengue/Mosqlimate visualizations into any website with a single script or npm package.

---

# Phase 1 — Core SDK (MVP)

**Goal:** Render a chart in a plain HTML page.

### Implemented

- **`@mosqlimate/charts` package** — ESM + CJS dual builds with TypeScript types
- **`Mosqlimate.render({ target, chart, params, theme, language, width, height })`** — renders any chart into a DOM element or CSS selector
- **`Mosqlimate.configure({ theme, language, maps_base, sdk_key, api_key })`** — global defaults
- **`Mosqlimate.setSdkKey()` / `setApiKey()` / `setLanguage()`** — runtime configuration
- **`Mosqlimate.update(id, data)` / `resize(id, width, height)` / `destroy(id)` / `destroyAll()`** — instance lifecycle
- **`Mosqlimate.onStatusChange()`** — subscribe to per-instance `loading` / `ready` / `error` status events
- **`ChartManager`** — instance registry, renderer lifecycle, and error rendering
- **`ApiClient`** — fetches `https://api.mosqlimate.org/api/vis/charts/<chart>/` with `X-SDK-Key` / `X-UID-Key` headers, CORS-aware error messages, and configurable base URL via `MOSQLIMATE_API_BASE`
- **Loading & error states** — failures render a localized `role="alert"` banner into the container
- **Responsive resizing** — charts auto-resize with the container
- **Bundled maps** — `@mosqlimate/charts` ships per-UF municipality GeoJSON (`dist/maps/<uf>.json`, e.g. `sp.json`, properties `geocode` + `name`); `EpiscannerChart` auto-fetches and registers the right map at render time from `maps_base` (defaults to the package's own unpkg URL, overridable via `configure`)

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
            ├── contaovos/
            │   ├── EggsDensityChart
            │   ├── PositivityChart
            │   ├── MapChart
            │   └── ScatterChart
            └── episcanner/
                └── EpiscannerChart
```

### Implemented

- **`ChartRenderer` interface** — every chart implements `render`, `update`, `resize`, and `destroy`
- **`EChartsRenderer` base class** — backed by Apache ECharts 6 (canvas renderer), debounced auto-resize on window resize
- **Light/dark theming** — shared axis, tooltip, and title colors via `axisColors()`
- **Localized labels** — en/pt translations via i18n `t()` keys
- **Concrete chart renderers**:
  - `RtChart` — Rt line with smooth curve, dashed threshold at Rt = 1, green/red value coloring
  - `TemperatureChart` — max / avg / min temperature lines with inside + slider `dataZoom`
  - `AccumulatedWaterfallChart` — stacked total/avg precipitation bars with `dataZoom`
  - `AirChart` — humidity (line) + pressure (bar) on dual axes with `dataZoom`
  - `EggsDensityChart` — egg count over epiweeks line chart
  - `PositivityChart` — positivity % bar chart by location
  - `MapChart` — Brazil choropleth map (GeoJSON registered via `registerMap()`)
  - `ScatterChart` — trap latitude/longitude scatter plot
  - `EpiscannerChart` — per-UF choropleth map of episcanner estimates (peak week, R0, total cases, etc.)
- **`PlaceholderRenderer`** — fallback for unregistered charts
- **Watermark** — Mosqlimate watermark overlay applied to every rendered chart

---

# Phase 3 — Backend Chart API

Instead of exposing raw prediction endpoints, expose visualization endpoints.

Example:

```
GET /api/vis/charts/infodengue/rt/
GET /api/vis/charts/climate/temperature/
GET /api/vis/charts/contaovos/eggs_density/
GET /api/vis/charts/episcanner/?disease=dengue&uf=CE&year=2024
```

### Implemented

- **Visualization endpoints** — `GET /api/vis/charts/<category>/<chart>/`
- **Stable response format** — every response is wrapped as `{ chart, category, data }`
- **Typed row shapes per chart** — `ChartDataMap` covers Rt, temperature, precipitation, humidity/pressure, egg density, positivity, map state, scatter, and episcanner rows
- **Query params** — `disease`, `geocode`, `uf`, `start`, `end`, `year`, and `metric`
- **Configurable base URL** — via `MOSQLIMATE_API_BASE` or the `ApiClient` constructor

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

### Implemented

- **Name → renderer registry** — `ChartManager` resolves every `ChartName` to its renderer class at render time
- **Typed chart names** — `ChartName` union of 9 charts across `infodengue` / `climate` / `contaovos` / `episcanner`
- **Typed metadata** — per-chart params and data row types exported from the package
- **Fallback** — unknown chart names render a `PlaceholderRenderer` instead of failing

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

### Implemented

- **`Mosqlimate.render()`** — JavaScript API
- **`Mosqlimate.autoInit({ root, sdk_key, api_key, language })`** — declarative `data-chart` auto-discovery that validates chart names/themes, applies `data-background` / `data-border` / `data-padding` container styles, and returns `{ rendered, errors }`
- **`<mosqlimate-chart>`** — custom element with Shadow DOM observing `chart`, `disease`, `geocode`, `start`, `end`, `uf`, `theme`, `width`, `height`, and `language` attributes (re-renders on change)
- **Automatic initialization** — charts render on element connect and clean up on disconnect

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

### Implemented

- **`@mosqlimate/react`** — React wrappers
- **`@mosqlimate/vue`** — Vue 3 wrappers
- **`@mosqlimate/angular`** — Angular standalone wrappers (`provideMosqlimate` providers + service)
- **`@mosqlimate/svelte`** — Svelte 5 wrappers

Every wrapper exposes the same feature set on top of `@mosqlimate/charts`:

- **Generic `<MosqlimateChart>`** — renders any chart by name via `chart`, `params`, `theme`, `language`, `width`, and `height` props
- **Typed chart components** — `RtChart`, `TemperatureChart`, `AccumulatedWaterfallChart`, `AirChart`, `EggsDensityChart`, `PositivityChart`, `MapChart`, `ScatterChart`, and `EpiscannerChart` with chart-specific props (`disease`, `geocode`, `uf`, `year`, `metric`, `start`, `end`)
- **Global configuration provider** — `MosqlimateProvider` (React/Vue/Svelte) or `provideMosqlimate` (Angular) to set `api_key`, `sdk_key`, `theme`, and `language` once at the app level
- **Reactive updates** — charts re-render automatically when props change and are destroyed on unmount
- **Responsive sizing** — `width`/`height` props with a default of 100% × 350px
- **Error handling** — render failures are surfaced as an inline `role="alert"` banner

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
│   ├── react/          ← Implemented (React wrappers)
│   ├── vue/            ← Implemented (Vue wrappers)
│   ├── angular/        ← Implemented (Angular wrappers)
│   ├── svelte/         ← Implemented (Svelte wrappers)
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

| Milestone | Goal                                                                             | Status                                                       |
| --------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **M1**    | Render a chart in plain HTML via CDN using `Mosqlimate.render()`.                | ✅ Done                                                      |
| **M2**    | Add multiple chart types with a renderer registry.                               | ✅ Done                                                      |
| **M3**    | Support `<mosqlimate-chart>` custom elements and declarative `data-*` auto-init. | ✅ Done                                                      |
| **M4**    | Publish to npm and a versioned CDN.                                              | 🟡 Partially (npm package exists, CDN pending)               |
| **M5**    | Release React, Vue, Angular, and Svelte wrappers.                                | 🟡 Partially (all wrappers implemented; npm release pending) |
| **M6**    | Add themes, exports, and accessibility.                                          | 🟡 Partially (light/dark done)                               |
| **M7**    | Support dashboards, linked interactions, and live updates.                       | ❌ Not started                                               |
| **M8**    | Reach a stable 1.0 release with complete documentation and examples.             | ❌ Not started                                               |

# Available Charts

| Category   | Chart Name                      | Renderer                    | Description                                                              |
| ---------- | ------------------------------- | --------------------------- | ------------------------------------------------------------------------ |
| infodengue | `infodengue/rt`                 | `RtChart`                   | Rt reproduction rate line chart                                          |
| climate    | `climate/temperature`           | `TemperatureChart`          | Max / avg / min temperature line chart                                   |
| climate    | `climate/accumulated-waterfall` | `AccumulatedWaterfallChart` | Precipitation stacked bar chart                                          |
| climate    | `climate/umid-pressao-med`      | `AirChart`                  | Humidity (line) + pressure (bar) dual-axis                               |
| contaovos  | `contaovos/eggs_density`        | `EggsDensityChart`          | Egg count over epiweeks line chart                                       |
| contaovos  | `contaovos/positivity`          | `PositivityChart`           | Positivity % by location bar chart                                       |
| contaovos  | `contaovos/map`                 | `MapChart`                  | Brazil choropleth map of total eggs                                      |
| contaovos  | `contaovos/map/scatter`         | `ScatterChart`              | Trap location scatter plot (lat/lng)                                     |
| episcanner | `episcanner`                    | `EpiscannerChart`           | Per-UF choropleth map of episcanner metrics (peak week, R0, total cases) |
