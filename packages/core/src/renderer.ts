import type { ChartData, ChartRenderer, RenderOptions } from "./types";

export class PlaceholderRenderer implements ChartRenderer {
  private container: HTMLElement | null = null;

  async render(
    container: HTMLElement,
    data: ChartData,
    _options: RenderOptions,
  ): Promise<void> {
    this.container = container;

    const canvas = document.createElement("canvas");
    canvas.width = container.clientWidth || 600;
    canvas.height = container.clientHeight || 400;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    this.drawPlaceholder(ctx, canvas.width, canvas.height, data);
  }

  update(data: ChartData): void {
    if (!this.container) return;
    const canvas = this.container.querySelector("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawPlaceholder(ctx, canvas.width, canvas.height, data);
  }

  resize(width: number, height: number): void {
    if (!this.container) return;
    const canvas = this.container.querySelector("canvas");
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  destroy(): void {
    if (!this.container) return;
    const canvas = this.container.querySelector("canvas");
    canvas?.remove();
    this.container = null;
  }

  private drawPlaceholder(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: ChartData,
  ): void {
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#dee2e6";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    ctx.fillStyle = "#6c757d";
    ctx.font = "16px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`Chart: ${data.chart}`, width / 2, height / 2 - 12);

    ctx.font = "12px system-ui, sans-serif";
    ctx.fillStyle = "#adb5bd";
    ctx.fillText("Renderer not yet implemented", width / 2, height / 2 + 12);
  }
}
