import { describe, expect, it, vi } from "vitest";

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

import {
  AccumulatedWaterfallChart,
  AirChart,
  EggsDensityChart,
  EpiscannerChart,
  MapChart,
  MosqlimateChart,
  MosqlimateProvider,
  PositivityChart,
  RtChart,
  ScatterChart,
  TemperatureChart,
  useMosqlimate,
} from "@mosqlimate/svelte";

describe("package public API", () => {
  it("resolves all exports", () => {
    expect(MosqlimateProvider).toBeDefined();
    expect(MosqlimateChart).toBeDefined();
    expect(RtChart).toBeDefined();
    expect(TemperatureChart).toBeDefined();
    expect(AccumulatedWaterfallChart).toBeDefined();
    expect(AirChart).toBeDefined();
    expect(EggsDensityChart).toBeDefined();
    expect(PositivityChart).toBeDefined();
    expect(MapChart).toBeDefined();
    expect(ScatterChart).toBeDefined();
    expect(EpiscannerChart).toBeDefined();
    expect(typeof useMosqlimate).toBe("function");
  });
});
