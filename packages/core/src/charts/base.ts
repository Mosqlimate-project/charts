import type { EChartsOption, ECharts } from "echarts";
import type {
  ChartData,
  ChartRenderer,
  Language,
  RenderOptions,
  Theme,
} from "../types";

export type { EChartsOption };

const RESIZE_DEBOUNCE_MS = 100;

export abstract class EChartsRenderer implements ChartRenderer {
  protected chart: ECharts | null = null;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;
  private boundHandleResize: () => void;

  constructor() {
    this.boundHandleResize = () => this.handleResize();
  }

  private async loadECharts(): Promise<typeof import("echarts")> {
    const g = globalThis as Record<string, unknown>;
    if (typeof g.echarts === "object" && g.echarts !== null) {
      return g.echarts as typeof import("echarts");
    }
    return await import("echarts");
  }

  async render(
    container: HTMLElement,
    data: ChartData,
    options: RenderOptions,
  ): Promise<void> {
    const echarts = await this.loadECharts();

    if (this.chart) {
      this.chart.dispose();
    }

    this.chart = echarts.init(container, undefined, {
      renderer: "canvas",
    });

    window.addEventListener("resize", this.boundHandleResize);

    const option = this.buildOption(
      data,
      options.theme ?? "light",
      options.language,
    );
    (option as Record<string, unknown>).backgroundColor = "transparent";
    this.chart.setOption(option, { notMerge: true });
    this.chart.resize();
  }

  update(data: ChartData): void {
    if (!this.chart) return;
    const option = this.buildOption(data, "light", "en");
    this.chart.setOption(option, { notMerge: true });
  }

  resize(width: number, height: number): void {
    if (!this.chart) return;
    this.chart.resize({ width, height });
  }

  destroy(): void {
    window.removeEventListener("resize", this.boundHandleResize);
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.chart?.dispose();
    this.chart = null;
  }

  abstract buildOption(
    data: ChartData,
    theme: Theme,
    lang?: Language,
  ): EChartsOption;

  protected isDark(theme: Theme): boolean {
    return theme === "dark";
  }

  protected axisColors(theme: Theme) {
    const dark = this.isDark(theme);
    return {
      text: dark ? "#9ca3af" : "#6b7280",
      line: dark ? "#374151" : "#e5e7eb",
      tooltipBg: dark ? "#1f2937" : "#ffffff",
      tooltipBorder: dark ? "#374151" : "#e5e7eb",
      tooltipText: dark ? "#f3f4f6" : "#111827",
      titleText: dark ? "#ffffff" : "#000000",
    };
  }

  private handleResize(): void {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.chart?.resize();
    }, RESIZE_DEBOUNCE_MS);
  }
}
