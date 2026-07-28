import type { ChartName, Language, Theme } from "./types";
import { Mosqlimate } from "./mosqlimate";

const ATTR_LIST = [
  "chart",
  "disease",
  "geocode",
  "start",
  "end",
  "uf",
  "theme",
  "width",
  "height",
  "language",
] as const;

function parseNumber(value: string | null): number | undefined {
  if (value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export class MosqlimateChart extends HTMLElement {
  private _chartId: string | null = null;
  private _container: HTMLDivElement;
  private _renderQueued = false;

  static get observedAttributes(): string[] {
    return [...ATTR_LIST];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    this._container = document.createElement("div");
    this._container.style.width = "100%";
    this._container.style.height = "100%";
    shadow.appendChild(this._container);
  }

  connectedCallback(): void {
    Promise.resolve().then(() => {
      if (this.isConnected) this._render();
    });
  }

  disconnectedCallback(): void {
    this._cleanup();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ): void {
    if (oldValue === newValue) return;
    if (!this.isConnected) return;

    if (name === "chart" && !newValue) {
      this._cleanup();
      return;
    }

    this._rerender();
  }

  private _cleanup(): void {
    if (this._chartId) {
      Mosqlimate.destroy(this._chartId);
      this._chartId = null;
    }
  }

  private _rerender(): void {
    this._cleanup();
    this._render();
  }

  private _render(): void {
    const chart = this.getAttribute("chart") as ChartName | null;
    if (!chart) return;

    const disease = this.getAttribute("disease");
    const geocode = parseNumber(this.getAttribute("geocode"));
    const start = this.getAttribute("start");
    const end = this.getAttribute("end");
    const uf = this.getAttribute("uf");
    const theme = this.getAttribute("theme") as Theme | null;
    const language = this.getAttribute("language") as Language | null;
    const width = parseNumber(this.getAttribute("width"));
    const height = parseNumber(this.getAttribute("height"));

    const params: Record<string, string | number> = {};
    if (disease) params.disease = disease;
    if (geocode !== undefined) params.geocode = geocode;
    if (start) params.start = start;
    if (end) params.end = end;
    if (uf) params.uf = uf;

    Mosqlimate.render({
      target: this._container,
      chart,
      params: params as never,
      ...(theme ? { theme } : {}),
      ...(language ? { language } : {}),
      ...(width !== undefined ? { width } : {}),
      ...(height !== undefined ? { height } : {}),
    }).then((instance) => {
      this._chartId = instance.id;
    });
  }
}

const TAG_NAME = "mosqlimate-chart";

export function registerChartElement(): void {
  if (!customElements.get(TAG_NAME)) {
    customElements.define(TAG_NAME, MosqlimateChart);
  }
}

export function isChartElementRegistered(): boolean {
  return !!customElements.get(TAG_NAME);
}
