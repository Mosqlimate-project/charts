import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MosqlimateProvider, useMosqlimate } from "../context";

afterEach(cleanup);

function TestConsumer() {
  const ctx = useMosqlimate();
  return <div data-testid="ctx">{JSON.stringify(ctx)}</div>;
}

describe("MosqlimateProvider", () => {
  it("renders children", () => {
    render(
      <MosqlimateProvider api_key="test-key">
        <TestConsumer />
      </MosqlimateProvider>,
    );
    expect(screen.getByTestId("ctx")).toBeTruthy();
  });

  it("passes context to children", () => {
    render(
      <MosqlimateProvider api_key="my-key" sdk_key="sdk-key" language="pt">
        <TestConsumer />
      </MosqlimateProvider>,
    );
    const el = screen.getByTestId("ctx");
    const ctx = JSON.parse(el.textContent || "{}");
    expect(ctx.api_key).toBe("my-key");
    expect(ctx.sdk_key).toBe("sdk-key");
    expect(ctx.language).toBe("pt");
  });

  it("returns empty object outside provider", () => {
    render(<TestConsumer />);
    const el = screen.getByTestId("ctx");
    expect(JSON.parse(el.textContent || "{}")).toEqual({});
  });
});
