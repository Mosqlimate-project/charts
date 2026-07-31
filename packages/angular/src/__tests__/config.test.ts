import { afterEach, describe, expect, it, vi } from "vitest";
import { applyMosqlimateConfig } from "../config";

const mocks = vi.hoisted(() => ({
  setSdkKey: vi.fn(),
  setApiKey: vi.fn(),
  configure: vi.fn(),
}));

vi.mock("@mosqlimate/charts", () => ({
  Mosqlimate: {
    setSdkKey: mocks.setSdkKey,
    setApiKey: mocks.setApiKey,
    configure: mocks.configure,
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("applyMosqlimateConfig", () => {
  it("applies sdk and api keys", async () => {
    await applyMosqlimateConfig({ sdk_key: "sdk-key", api_key: "api-key" });
    expect(mocks.setSdkKey).toHaveBeenCalledWith("sdk-key");
    expect(mocks.setApiKey).toHaveBeenCalledWith("api-key");
    expect(mocks.configure).not.toHaveBeenCalled();
  });

  it("applies theme and language", async () => {
    await applyMosqlimateConfig({ theme: "dark", language: "pt" });
    expect(mocks.configure).toHaveBeenCalledWith({
      theme: "dark",
      language: "pt",
    });
  });

  it("does nothing for an empty config", async () => {
    await applyMosqlimateConfig({});
    expect(mocks.setSdkKey).not.toHaveBeenCalled();
    expect(mocks.setApiKey).not.toHaveBeenCalled();
    expect(mocks.configure).not.toHaveBeenCalled();
  });
});
