import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockRender, mockSetSdkKey, mockSetApiKey, mockSetLanguage } =
  vi.hoisted(() => ({
    mockRender: vi.fn(),
    mockSetSdkKey: vi.fn(),
    mockSetApiKey: vi.fn(),
    mockSetLanguage: vi.fn(),
  }));

vi.stubGlobal("VERSION", "0.0.0-test");

vi.mock("../mosqlimate", () => {
  return {
    Mosqlimate: {
      render: mockRender,
      setSdkKey: mockSetSdkKey,
      setApiKey: mockSetApiKey,
      setLanguage: mockSetLanguage,
    },
  };
});

import { autoInit } from "../declarative";

function makeElement(attrs: Record<string, string>): HTMLElement {
  const el = document.createElement("div");
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  return el;
}

describe("autoInit", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mockRender.mockReset();
    mockSetSdkKey.mockReset();
    mockRender.mockResolvedValue({ id: "mc-test", status: "ready" });
  });

  it("returns 0 rendered when no elements exist", async () => {
    const result = await autoInit();
    expect(result.rendered).toBe(0);
    expect(result.errors).toHaveLength(0);
    expect(mockRender).not.toHaveBeenCalled();
  });

  it("renders a single rt chart from data-* attrs", async () => {
    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    document.body.appendChild(el);

    const result = await autoInit();

    expect(result.rendered).toBe(1);
    expect(result.errors).toHaveLength(0);
    expect(mockRender).toHaveBeenCalledOnce();
    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        target: el,
        chart: "infodengue/rt",
        params: {
          disease: "dengue",
          geocode: 3550308,
          start: "2024-01-01",
          end: "2024-01-31",
        },
      }),
    );
  });

  it("renders multiple charts", async () => {
    const el1 = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    const el2 = makeElement({
      "data-chart": "climate/temperature",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    document.body.appendChild(el1);
    document.body.appendChild(el2);

    const result = await autoInit();

    expect(result.rendered).toBe(2);
    expect(result.errors).toHaveLength(0);
    expect(mockRender).toHaveBeenCalledTimes(2);
  });

  it("passes theme from data-theme attr", async () => {
    const el = makeElement({
      "data-chart": "contaovos/eggs_density",
      "data-start": "2024-01-01",
      "data-end": "2024-06-30",
      "data-theme": "dark",
    });
    document.body.appendChild(el);

    await autoInit();

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({ theme: "dark" }),
    );
  });

  it("passes width and height as numbers", async () => {
    const el = makeElement({
      "data-chart": "contaovos/positivity",
      "data-start": "2024-01-01",
      "data-end": "2024-06-30",
      "data-width": "800",
      "data-height": "400",
    });
    document.body.appendChild(el);

    await autoInit();

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({ width: 800, height: 400 }),
    );
  });

  it("passes uf from data-uf attr", async () => {
    const el = makeElement({
      "data-chart": "contaovos/positivity",
      "data-start": "2024-01-01",
      "data-end": "2024-06-30",
      "data-uf": "SP",
    });
    document.body.appendChild(el);

    await autoInit();

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({ uf: "SP" }),
      }),
    );
  });

  it("renders episcanner from data-* attrs", async () => {
    const el = makeElement({
      "data-chart": "episcanner",
      "data-disease": "dengue",
      "data-uf": "CE",
      "data-year": "2024",
      "data-metric": "R0",
    });
    document.body.appendChild(el);

    const result = await autoInit();

    expect(result.rendered).toBe(1);
    expect(result.errors).toHaveLength(0);
    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        target: el,
        chart: "episcanner",
        params: { disease: "dengue", uf: "CE", year: 2024, metric: "R0" },
      }),
    );
  });

  it("applies container styles from data-* attrs", async () => {
    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
      "data-background": "#1a1a1a",
      "data-border": "1px solid #333",
      "data-border-radius": "12px",
      "data-padding": "16px",
      "data-font-family": "monospace",
    });
    document.body.appendChild(el);

    await autoInit();

    expect(el.style.backgroundColor).toBe("rgb(26, 26, 26)");
    expect(el.style.border).toBe("1px solid rgb(51, 51, 51)");
    expect(el.style.borderRadius).toBe("12px");
    expect(el.style.padding).toBe("16px");
    expect(el.style.fontFamily).toBe("monospace");
  });

  it("calls setSdkKey when sdk_key option is passed", async () => {
    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    document.body.appendChild(el);

    const result = await autoInit({ sdk_key: "test-key-123" });

    expect(mockSetSdkKey).toHaveBeenCalledWith("test-key-123");
    expect(result.rendered).toBe(1);
  });

  it("passes language from data-language attr", async () => {
    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
      "data-language": "pt",
    });
    document.body.appendChild(el);

    await autoInit();

    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({ language: "pt" }),
    );
  });

  it("calls setLanguage when language option is passed", async () => {
    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    document.body.appendChild(el);

    const result = await autoInit({ language: "pt" });

    expect(mockSetLanguage).toHaveBeenCalledWith("pt");
    expect(result.rendered).toBe(1);
  });

  it("calls setApiKey when api_key option is passed", async () => {
    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    document.body.appendChild(el);

    const result = await autoInit({ api_key: "test-api-key-456" });

    expect(mockSetApiKey).toHaveBeenCalledWith("test-api-key-456");
    expect(result.rendered).toBe(1);
  });

  it("reports error for invalid data-theme value", async () => {
    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
      "data-theme": "neon",
    });
    document.body.appendChild(el);

    const result = await autoInit();

    expect(result.rendered).toBe(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error.message).toContain("neon");
    expect(mockRender).not.toHaveBeenCalled();
  });

  it("reports error for invalid data-chart value", async () => {
    const el = makeElement({
      "data-chart": "invalid-chart",
      "data-start": "2024-01-01",
      "data-end": "2024-06-30",
    });
    document.body.appendChild(el);

    const result = await autoInit();

    expect(result.rendered).toBe(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].element).toBe(el);
    expect(result.errors[0].error.message).toContain("invalid");
    expect(mockRender).not.toHaveBeenCalled();
  });

  it("reports error for missing data-chart", async () => {
    const el = document.createElement("div");
    document.body.appendChild(el);

    const result = await autoInit();

    expect(result.rendered).toBe(0);
    expect(result.errors).toHaveLength(0);
    expect(mockRender).not.toHaveBeenCalled();
  });

  it("reports render error without crashing other charts", async () => {
    mockRender
      .mockRejectedValueOnce(new Error("Network fail"))
      .mockResolvedValueOnce({ id: "mc-ok", status: "ready" });

    const el1 = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    const el2 = makeElement({
      "data-chart": "climate/temperature",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    document.body.appendChild(el1);
    document.body.appendChild(el2);

    const result = await autoInit();

    expect(result.rendered).toBe(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error.message).toBe("Network fail");
  });

  it("wraps non-Error render rejection in Error object", async () => {
    mockRender.mockRejectedValue("string rejection");

    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    document.body.appendChild(el);

    const result = await autoInit();

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].error.message).toBe("string rejection");
  });

  it("handles invalid number in geocode gracefully", async () => {
    mockRender.mockResolvedValue({ id: "mc-test", status: "ready" });

    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "not-a-number",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    document.body.appendChild(el);

    const result = await autoInit();

    expect(result.rendered).toBe(1);
    expect(result.errors).toHaveLength(0);
  });

  it("renders chart without data-start and data-end attrs", async () => {
    mockRender.mockResolvedValue({ id: "mc-test", status: "ready" });

    const el = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
    });
    document.body.appendChild(el);

    const result = await autoInit();

    expect(result.rendered).toBe(1);
    expect(mockRender).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { disease: "dengue", geocode: 3550308 },
      }),
    );
  });

  it("ignores empty optional data-* attrs", async () => {
    const el = makeElement({
      "data-chart": "contaovos/eggs_density",
      "data-start": "2024-01-01",
      "data-end": "2024-06-30",
    });
    document.body.appendChild(el);

    await autoInit();

    const opts = mockRender.mock.calls[0][0];
    expect(opts.params).toEqual({
      start: "2024-01-01",
      end: "2024-06-30",
    });
    expect(opts.theme).toBeUndefined();
    expect(opts.width).toBeUndefined();
    expect(opts.height).toBeUndefined();
  });

  it("scoped root only renders elements within that root", async () => {
    const scope = document.createElement("section");
    const el1 = makeElement({
      "data-chart": "infodengue/rt",
      "data-disease": "dengue",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    const el2 = makeElement({
      "data-chart": "climate/temperature",
      "data-geocode": "3550308",
      "data-start": "2024-01-01",
      "data-end": "2024-01-31",
    });
    scope.appendChild(el1);
    document.body.appendChild(scope);
    document.body.appendChild(el2);

    const result = await autoInit({ root: scope });

    expect(result.rendered).toBe(1);
    expect(mockRender).toHaveBeenCalledOnce();
  });
});
