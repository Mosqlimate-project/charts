import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ApiClient } from "../api-client";
import type { UF } from "../types";

describe("ApiClient", () => {
  let fakeFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fakeFetch = vi.fn();
    vi.stubGlobal("fetch", fakeFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function okResponse(data: unknown) {
    return {
      ok: true,
      status: 200,
      json: () => Promise.resolve(data),
    } as Response;
  }

  function errorResponse(status: number, body = "Not Found") {
    return {
      ok: false,
      status,
      text: () => Promise.resolve(body),
    } as Response;
  }

  describe("constructor", () => {
    it("uses default api base", () => {
      const client = new ApiClient();
      expect(client).toBeDefined();
    });

    it("accepts custom api base", () => {
      const client = new ApiClient("https://custom.api.org");
      expect(client).toBeDefined();
    });
  });

  describe("fetchChart", () => {
    it("fetches infodengue rt with correct endpoint and params", async () => {
      const rtData = [
        { data_iniSE: "2024-01-07", Rt: 1.2 },
        { data_iniSE: "2024-01-14", Rt: 0.9 },
      ];
      fakeFetch.mockResolvedValue(okResponse(rtData));

      const client = new ApiClient("https://test.api");
      const result = await client.fetchChart({
        target: document.createElement("div"),
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      expect(fakeFetch).toHaveBeenCalledOnce();
      const [url, opts] = fakeFetch.mock.calls[0];
      expect(url).toBe(
        "https://test.api/api/vis/charts/infodengue/rt/" +
          "?disease=dengue&geocode=3550308&start=2024-01-01&end=2024-01-31",
      );
      expect(opts.headers).toEqual({});
      expect(result).toEqual({
        chart: "infodengue/rt",
        category: "infodengue",
        data: rtData,
      });
    });

    it("fetches climate temperature with correct endpoint", async () => {
      const tempData = [
        {
          date: "2024-01-01",
          epiweek: 1,
          temp_min: 18.5,
          temp_med: 24.2,
          temp_max: 30.1,
        },
      ];
      fakeFetch.mockResolvedValue(okResponse(tempData));

      const client = new ApiClient("https://test.api");
      const result = await client.fetchChart({
        target: document.createElement("div"),
        chart: "climate/temperature",
        params: { geocode: 3550308, start: "2024-01-01", end: "2024-01-31" },
      });

      const [url] = fakeFetch.mock.calls[0];
      expect(url).toContain("/api/vis/charts/climate/temperature/");
      expect(result.chart).toBe("climate/temperature");
      expect(result.category).toBe("climate");
      expect(result.data).toEqual(tempData);
    });

    it("fetches contaovos map-scatter with correct endpoint", async () => {
      const scatterData = [
        {
          name: "SP",
          latitude: -23.5,
          longitude: -46.6,
          trap_id: 123,
          municipality: "São Paulo",
        },
      ];
      fakeFetch.mockResolvedValue(okResponse(scatterData));

      const client = new ApiClient("https://test.api");
      const result = await client.fetchChart({
        target: document.createElement("div"),
        chart: "contaovos/map/scatter",
        params: { start: "2024-01-01", end: "2024-06-30" },
      });

      const [url] = fakeFetch.mock.calls[0];
      expect(url).toContain("/api/vis/charts/contaovos/map/scatter/");
      expect(result.chart).toBe("contaovos/map/scatter");
      expect(result.category).toBe("contaovos");
    });

    it("fetches episcanner with correct endpoint and params", async () => {
      const episcannerData = [
        {
          disease: "dengue",
          CID10: "A90",
          year: 2024,
          geocode: 2304400,
          muni_name: "Fortaleza",
          peak_week: 12,
          beta: 0.25,
          gamma: 0.2,
          R0: 1.5,
          total_cases: 1200,
          alpha: 0.01,
          sum_res: 0.02,
          ep_ini: "2024-01-01",
          ep_end: "2024-06-30",
          ep_dur: 26,
        },
      ];
      fakeFetch.mockResolvedValue(okResponse(episcannerData));

      const client = new ApiClient("https://test.api");
      const result = await client.fetchChart({
        target: document.createElement("div"),
        chart: "episcanner",
        params: { disease: "dengue", uf: "CE", year: 2024 },
      });

      const [url] = fakeFetch.mock.calls[0];
      expect(url).toBe(
        "https://test.api/api/vis/charts/episcanner/" +
          "?disease=dengue&uf=CE&year=2024",
      );
      expect(result.chart).toBe("episcanner");
      expect(result.category).toBe("episcanner");
      expect(result.data).toEqual(episcannerData);
    });

    it("sends X-SDK-Key header when sdk_key is set", async () => {
      fakeFetch.mockResolvedValue(
        okResponse([{ data_iniSE: "2024-01-07", Rt: 1.2 }]),
      );

      const client = new ApiClient("https://test.api", "test-sdk-key-123");
      await client.fetchChart({
        target: document.createElement("div"),
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });

      const [, opts] = fakeFetch.mock.calls[0];
      expect(opts.headers).toEqual({ "X-SDK-Key": "test-sdk-key-123" });
    });

    it("sends X-UID-Key header when api_key is set in constructor", async () => {
      fakeFetch.mockResolvedValue(okResponse([]));
      const client = new ApiClient(
        "https://test.api",
        undefined,
        "test-api-key",
      );
      await client.fetchChart({
        target: document.createElement("div"),
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });
      const [, opts] = fakeFetch.mock.calls[0];
      expect(opts.headers).toEqual({ "X-UID-Key": "test-api-key" });
    });

    it("setApiKey updates X-UID-Key for subsequent requests", async () => {
      fakeFetch.mockResolvedValue(okResponse([]));
      const client = new ApiClient("https://test.api");
      client.setApiKey("new-api-key");
      await client.fetchChart({
        target: document.createElement("div"),
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      });
      const [, opts] = fakeFetch.mock.calls[0];
      expect(opts.headers).toEqual({ "X-UID-Key": "new-api-key" });
    });

    it("setSdkKey updates header for subsequent requests", async () => {
      fakeFetch.mockResolvedValue(okResponse([]));

      const client = new ApiClient("https://test.api");
      await client.fetchChart({
        target: document.createElement("div"),
        chart: "contaovos/eggs_density",
        params: { start: "2024-01-01", end: "2024-06-30" },
      });
      expect(fakeFetch.mock.calls[0][1].headers).toEqual({});

      client.setSdkKey("new-key");
      await client.fetchChart({
        target: document.createElement("div"),
        chart: "contaovos/eggs_density",
        params: { start: "2024-01-01", end: "2024-06-30" },
      });
      expect(fakeFetch.mock.calls[1][1].headers).toEqual({
        "X-SDK-Key": "new-key",
      });
    });

    it("throws on non-ok response", async () => {
      fakeFetch.mockResolvedValue(errorResponse(401, "Unauthorized"));

      const client = new ApiClient("https://test.api");
      await expect(
        client.fetchChart({
          target: document.createElement("div"),
          chart: "infodengue/rt",
          params: {
            disease: "dengue",
            geocode: 3550308,
            start: "2024-01-01",
            end: "2024-01-31",
          },
        }),
      ).rejects.toThrow("API error 401: Unauthorized");
    });

    it("falls back to Unknown error when response text() fails", async () => {
      fakeFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.reject(new Error("stream error")),
      } as Response);

      const client = new ApiClient("https://test.api");
      await expect(
        client.fetchChart({
          target: document.createElement("div"),
          chart: "infodengue/rt",
          params: {
            disease: "dengue",
            geocode: 3550308,
            start: "2024-01-01",
            end: "2024-01-31",
          },
        }),
      ).rejects.toThrow("API error 500: Unknown error");
    });

    it("throws on network failure", async () => {
      fakeFetch.mockRejectedValue(new Error("Network error"));

      const client = new ApiClient("https://test.api");
      await expect(
        client.fetchChart({
          target: document.createElement("div"),
          chart: "climate/temperature",
          params: { geocode: 3550308, start: "2024-01-01", end: "2024-01-31" },
        }),
      ).rejects.toThrow("Network error");
    });

    it("throws descriptive CORS error on TypeError with Failed to fetch", async () => {
      fakeFetch.mockRejectedValue(new TypeError("Failed to fetch"));

      const client = new ApiClient("https://test.api");
      await expect(
        client.fetchChart({
          target: document.createElement("div"),
          chart: "infodengue/rt",
          params: {
            disease: "dengue",
            geocode: 3550308,
            start: "2024-01-01",
            end: "2024-01-31",
          },
        }),
      ).rejects.toThrow("CORS error");
    });

    it("throws generic message on TypeError with non-Failed-to-fetch message", async () => {
      fakeFetch.mockRejectedValue(new TypeError("Some other type error"));

      const client = new ApiClient("https://test.api");
      await expect(
        client.fetchChart({
          target: document.createElement("div"),
          chart: "infodengue/rt",
          params: {
            disease: "dengue",
            geocode: 3550308,
            start: "2024-01-01",
            end: "2024-01-31",
          },
        }),
      ).rejects.toThrow("Some other type error");
    });

    it("excludes undefined/null params from query string", async () => {
      fakeFetch.mockResolvedValue(okResponse([]));

      const client = new ApiClient("https://test.api");
      await client.fetchChart({
        target: document.createElement("div"),
        chart: "contaovos/eggs_density",
        params: { start: "2024-01-01", end: "2024-06-30" },
      });

      const [url] = fakeFetch.mock.calls[0];
      expect(url).not.toContain("uf=");
      expect(url).not.toContain("geocode=");
    });

    it("includes optional uf param when provided", async () => {
      fakeFetch.mockResolvedValue(okResponse([]));

      const client = new ApiClient("https://test.api");
      await client.fetchChart({
        target: document.createElement("div"),
        chart: "contaovos/positivity",
        params: { start: "2024-01-01", end: "2024-06-30", uf: "SP" },
      });

      const [url] = fakeFetch.mock.calls[0];
      expect(url).toContain("uf=SP");
    });

    it("excludes explicit null params from query string", async () => {
      fakeFetch.mockResolvedValue(okResponse([]));

      const client = new ApiClient("https://test.api");
      await client.fetchChart({
        target: document.createElement("div"),
        chart: "contaovos/eggs_density",
        params: {
          start: "2024-01-01",
          end: "2024-06-30",
          uf: null as unknown as UF,
        },
      });

      const [url] = fakeFetch.mock.calls[0];
      expect(url).not.toContain("uf=");
    });
  });
});
