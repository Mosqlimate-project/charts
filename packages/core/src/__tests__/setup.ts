import { vi } from "vitest";

const mockECharts = {
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  })),
  registerMap: vi.fn(),
  getMap: vi.fn(() => undefined),
};

vi.stubGlobal("echarts", mockECharts);
