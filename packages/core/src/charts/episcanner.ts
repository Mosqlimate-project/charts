import type { EChartsOption } from "echarts";
import type {
  ChartData,
  EpiscannerMetric,
  EpiscannerParams,
  EpiscannerRow,
  Language,
  RenderOptions,
  Theme,
} from "../types";
import { EChartsRenderer } from "./base";
import { t } from "../i18n";
import { DEFAULT_MAPS_BASE } from "../maps";

export class EpiscannerChart extends EChartsRenderer {
  private uf = "";
  private metric: EpiscannerMetric = "R0";

  override async render(
    container: HTMLElement,
    data: ChartData,
    options: RenderOptions,
  ): Promise<void> {
    const params = options.params as EpiscannerParams;
    this.uf = params.uf ?? "";
    this.metric = params.metric ?? "R0";
    await this.ensureMap(options.maps_base);
    await super.render(container, data, options);
  }

  private mapName(): string {
    return `episcanner-${this.uf.toLowerCase()}`;
  }

  private async ensureMap(mapsBase?: string): Promise<void> {
    const name = this.mapName();
    const echarts = await this.loadECharts();
    if (echarts.getMap(name)) return;
    const base = (mapsBase || DEFAULT_MAPS_BASE).replace(/\/+$/, "");
    const url = `${base}/${this.uf.toLowerCase()}.json`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to load map "${this.uf}" from ${url} (${res.status})`,
      );
    }
    const geoJson = (await res.json()) as Parameters<
      typeof echarts.registerMap
    >[1];
    echarts.registerMap(name, geoJson);
  }

  buildOption(data: ChartData, theme: Theme, lang?: Language): EChartsOption {
    const rows = data.data as EpiscannerRow[];
    const c = this.axisColors(theme);
    const mapName = this.mapName();
    const values = rows
      .map((r) => Number(r[this.metric]))
      .filter((v) => Number.isFinite(v));
    const min = values.length > 0 ? Math.min(...values) : 0;
    const max = values.length > 0 ? Math.max(...values, 1) : 1;
    const metricLabel = t(`episcanner.metric.${this.metric}`, lang);

    return {
      tooltip: {
        trigger: "item",
        backgroundColor: c.tooltipBg,
        borderColor: c.tooltipBorder,
        textStyle: { color: c.tooltipText },
        formatter: (params: unknown) => {
          const p = params as { name?: string; value?: number | number[] };
          const row = rows.find((r) => String(r.geocode) === String(p.name));
          if (row) {
            return `<b>${row.muni_name}</b><br/>${metricLabel}: ${String(
              p.value,
            )}`;
          }
          return String(p.name ?? "");
        },
      },
      visualMap: {
        min,
        max,
        left: 20,
        bottom: 20,
        calculable: true,
        inRange: { color: ["#CEF8FE", "#0F646B"] },
        textStyle: { color: c.text },
      },
      series: [
        {
          type: "map",
          map: mapName,
          nameProperty: "geocode",
          roam: true,
          itemStyle: {
            areaColor: this.isDark(theme) ? "#1f2937" : "#e0e0e0",
            borderColor: this.isDark(theme) ? "#4b5563" : "#333",
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              areaColor: this.isDark(theme) ? "#374151" : "#d1d5db",
            },
          },
          data: rows.map((r) => ({
            name: String(r.geocode),
            value: Number(r[this.metric]),
            muni_name: r.muni_name,
          })),
        },
      ],
    };
  }
}
