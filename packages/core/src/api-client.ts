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
  private api_key: string | null;

  constructor(api_base?: string, sdk_key?: string, api_key?: string) {
    this.base_url = api_base ?? DEFAULT_API_BASE;
    this.sdk_key = sdk_key ?? null;
    this.api_key = api_key ?? null;
  }

  setSdkKey(key: string): void {
    this.sdk_key = key;
  }

  setApiKey(key: string): void {
    this.api_key = key;
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
    if (this.api_key) {
      headers["X-UID-Key"] = this.api_key;
    }

    let response: Response;

    try {
      response = await fetch(url, {
        headers,
        mode: "cors",
        credentials: "omit",
      });
    } catch (err) {
      const message =
        err instanceof TypeError && err.message === "Failed to fetch"
          ? `CORS error: the API server at ${this.base_url} does not allow cross-origin requests. ` +
            "Use a proxy server (e.g. `npm run playground`) or configure the API to return CORS headers."
          : String(err);
      throw new Error(message);
    }

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
