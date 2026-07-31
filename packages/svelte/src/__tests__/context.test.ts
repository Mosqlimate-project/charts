import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/svelte";
import Consumer from "./Consumer.svelte";
import ProviderHarness from "./ProviderHarness.svelte";
import MosqlimateProvider from "../lib/context.svelte";

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
  cleanup();
  vi.clearAllMocks();
});

async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("MosqlimateProvider", () => {
  it("renders default slot content", () => {
    const { getByTestId } = render(ProviderHarness, {
      props: { api_key: "test-key" },
    });
    expect(getByTestId("ctx").textContent).not.toBeNull();
  });

  it("passes context to children", async () => {
    const { getByTestId } = render(ProviderHarness, {
      props: { api_key: "my-key", sdk_key: "sdk-key", language: "pt" },
    });
    await flush();
    const ctx = JSON.parse(getByTestId("ctx").textContent ?? "{}");
    expect(ctx.api_key).toBe("my-key");
    expect(ctx.sdk_key).toBe("sdk-key");
    expect(ctx.language).toBe("pt");
  });

  it("applies config on mount", async () => {
    render(ProviderHarness, {
      props: { api_key: "my-key", sdk_key: "sdk-key", theme: "dark" },
    });
    await flush();
    expect(mocks.setSdkKey).toHaveBeenCalledWith("sdk-key");
    expect(mocks.setApiKey).toHaveBeenCalledWith("my-key");
    expect(mocks.configure).toHaveBeenCalledWith({ theme: "dark" });
  });

  it("applies config with language only", async () => {
    render(ProviderHarness, {
      props: { language: "pt", sdk_key: "sdk-key" },
    });
    await flush();
    expect(mocks.setSdkKey).toHaveBeenCalledWith("sdk-key");
    expect(mocks.setApiKey).not.toHaveBeenCalled();
    expect(mocks.configure).toHaveBeenCalledWith({ language: "pt" });
  });

  it("renders nothing without children", () => {
    const { container } = render(MosqlimateProvider);
    expect(container.querySelector("*")).toBeNull();
  });

  it("returns empty object outside provider", () => {
    const { getByTestId } = render(Consumer);
    expect(JSON.parse(getByTestId("ctx").textContent ?? "{}")).toEqual({});
  });
});
