import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TestBed } from "@angular/core/testing";
import type { ChartInstance } from "@mosqlimate/charts";
import { MosqlimateChartComponent } from "../chart.component";
import { MosqlimateService } from "../service";

vi.mock("@mosqlimate/charts", () => ({
  Mosqlimate: {
    render: vi.fn(),
    destroy: vi.fn(),
    update: vi.fn(),
    resize: vi.fn(),
    configure: vi.fn(),
    setSdkKey: vi.fn(),
    setApiKey: vi.fn(),
  },
}));

function mockInstance(id: string): ChartInstance {
  return {
    id,
    container: document.createElement("div"),
    renderer: {
      render: () => {},
      update: () => {},
      resize: () => {},
      destroy: () => {},
    },
    options: {
      target: document.createElement("div"),
      chart: "infodengue/rt",
      params: {
        disease: "dengue",
        geocode: 2300507,
        start: "2025-01-01",
        end: "2025-12-31",
      },
    },
    data: null,
    status: "ready",
    error: null,
  };
}

describe("MosqlimateChartComponent", () => {
  const service = {
    render: vi.fn(),
    destroy: vi.fn(),
    update: vi.fn(),
    resize: vi.fn(),
  };

  beforeEach(() => {
    service.render.mockReset();
    service.destroy.mockReset();
    TestBed.configureTestingModule({
      imports: [MosqlimateChartComponent],
      providers: [{ provide: MosqlimateService, useValue: service }],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("renders a container and calls render on init", async () => {
    service.render.mockResolvedValue(mockInstance("chart-1"));
    const fixture = TestBed.createComponent(MosqlimateChartComponent);
    fixture.componentRef.setInput("chart", "infodengue/rt");
    fixture.componentRef.setInput("params", {
      disease: "dengue",
      geocode: 2300507,
      start: "2025-01-01",
      end: "2025-12-31",
    });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(service.render).toHaveBeenCalledWith(
      expect.objectContaining({
        chart: "infodengue/rt",
        params: expect.objectContaining({ disease: "dengue" }),
      }),
    );
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector(".mosqlimate-chart__container")).toBeTruthy();
  });

  it("destroys the instance on destroy", async () => {
    service.render.mockResolvedValue(mockInstance("chart-2"));
    const fixture = TestBed.createComponent(MosqlimateChartComponent);
    fixture.componentRef.setInput("chart", "infodengue/rt");
    fixture.componentRef.setInput("params", {
      disease: "dengue",
      geocode: 2300507,
      start: "2025-01-01",
      end: "2025-12-31",
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.destroy();

    expect(service.destroy).toHaveBeenCalledWith("chart-2");
  });

  it("shows an error alert when render fails", async () => {
    service.render.mockRejectedValue(new Error("boom"));
    const fixture = TestBed.createComponent(MosqlimateChartComponent);
    fixture.componentRef.setInput("chart", "infodengue/rt");
    fixture.componentRef.setInput("params", {
      disease: "dengue",
      geocode: 2300507,
      start: "2025-01-01",
      end: "2025-12-31",
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const alert = (fixture.nativeElement as HTMLElement).querySelector(
      '[role="alert"]',
    );
    expect(alert?.textContent).toContain("boom");
  });
});
