import type {
  ChartCategory,
  ChartData,
  ChartName,
  ChartParams,
  RenderOptions,
} from "./types";

const DEFAULT_API_BASE = "https://api.mosqlimate.org";

function chartEndpoint(name: ChartName): string {
  return `/api/vis/charts/${name}/`;
}

function chartCategory(name: ChartName): ChartCategory {
  return name.split("/")[0] as ChartCategory;
}

export class ApiClient {
  private base_url: string;
  private sdk_key: string | null;

  constructor(api_base?: string, sdk_key?: string) {
    this.base_url = api_base ?? DEFAULT_API_BASE;
    this.sdk_key = sdk_key ?? null;
  }

  setSdkKey(key: string): void {
    this.sdk_key = key;
  }

  async fetchChart<T extends ChartName>(
    options: RenderOptions<T>,
  ): Promise<ChartData<T>> {
    const endpoint = chartEndpoint(options.chart);
    const params = this.buildParams(options.params);
    const url = `${this.base_url}${endpoint}?${params.toString()}`;

    const headers: Record<string, string> = {};
    if (this.sdk_key) {
      headers["X-SDK-Key"] = this.sdk_key;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const text = await response.text().catch(() => "Unknown error");
      throw new Error(`API error ${response.status}: ${text}`);
    }

    const json = await response.json();

    return {
      chart: options.chart,
      category: chartCategory(options.chart),
      data: json,
    };
  }

  private buildParams(params: ChartParams): URLSearchParams {
    const qs = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        qs.set(key, String(value));
      }
    }

    return qs;
  }
}
