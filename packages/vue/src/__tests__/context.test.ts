import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { MosqlimateProvider, useMosqlimate } from "../context";

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

const TestConsumer = defineComponent({
  setup() {
    const ctx = useMosqlimate();
    return () => h("div", { "data-testid": "ctx" }, JSON.stringify(ctx));
  },
});

describe("MosqlimateProvider", () => {
  it("renders default slot content", () => {
    const wrapper = mount(MosqlimateProvider, {
      props: { api_key: "test-key" },
      slots: { default: () => h(TestConsumer) },
    });
    expect(wrapper.find('[data-testid="ctx"]').exists()).toBe(true);
  });

  it("passes context to children", () => {
    const wrapper = mount(MosqlimateProvider, {
      props: { api_key: "my-key", sdk_key: "sdk-key", language: "pt" },
      slots: { default: () => h(TestConsumer) },
    });
    const ctx = JSON.parse(wrapper.find('[data-testid="ctx"]').text());
    expect(ctx.api_key).toBe("my-key");
    expect(ctx.sdk_key).toBe("sdk-key");
    expect(ctx.language).toBe("pt");
  });

  it("applies config on mount", async () => {
    mount(MosqlimateProvider, {
      props: { api_key: "my-key", sdk_key: "sdk-key", theme: "dark" },
    });
    await flushPromises();
    expect(mocks.setSdkKey).toHaveBeenCalledWith("sdk-key");
    expect(mocks.setApiKey).toHaveBeenCalledWith("my-key");
    expect(mocks.configure).toHaveBeenCalledWith({ theme: "dark" });
  });

  it("returns empty object outside provider", () => {
    const wrapper = mount(TestConsumer);
    expect(JSON.parse(wrapper.find('[data-testid="ctx"]').text())).toEqual({});
  });
});
