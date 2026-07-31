import {
  Component,
  Input,
  ViewChild,
  signal,
  type ElementRef,
  type OnChanges,
  type OnDestroy,
  type OnInit,
} from "@angular/core";
import { inject } from "@angular/core";
import type {
  ChartInstance,
  ChartName,
  ChartParams,
  Language,
  Theme,
} from "@mosqlimate/charts";
import { MosqlimateService } from "./service";

@Component({
  selector: "ngx-mosqlimate-chart",
  standalone: true,
  template: `
    <div
      class="mosqlimate-chart"
      [style.width.px]="width ?? undefined"
      [style.height.px]="height ?? undefined"
    >
      <div #container class="mosqlimate-chart__container"></div>
      @if (error()) {
        <div role="alert" class="mosqlimate-chart__error">
          {{ error()?.message }}
        </div>
      }
    </div>
  `,
  styles: [
    `
      .mosqlimate-chart {
        width: 100%;
        height: 350px;
      }
      .mosqlimate-chart__container {
        width: 100%;
        height: 100%;
      }
      .mosqlimate-chart__error {
        padding: 16px;
        color: #dc3545;
        background: #f8d7da;
        border: 1px solid #f5c2c7;
        border-radius: 8px;
        font-size: 14px;
      }
    `,
  ],
})
export class MosqlimateChartComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild("container", { static: true })
  private containerRef!: ElementRef<HTMLDivElement>;

  @Input() chart!: ChartName;
  @Input() params!: ChartParams;
  @Input() theme?: Theme;
  @Input() language?: Language;
  @Input() width?: number;
  @Input() height?: number;

  readonly error = signal<Error | null>(null);

  private readonly service = inject(MosqlimateService);
  private instance: ChartInstance | null = null;
  private initialized = false;
  private lastKey = "";

  ngOnInit(): void {
    this.initialized = true;
    this.lastKey = "";
    void this.renderIfChanged();
  }

  ngOnChanges(): void {
    if (this.initialized) {
      void this.renderIfChanged();
    }
  }

  ngOnDestroy(): void {
    this.destroyInstance();
  }

  private renderIfChanged(): void {
    const key = JSON.stringify([
      this.chart,
      this.params,
      this.theme,
      this.language,
      this.width,
      this.height,
    ]);
    if (key === this.lastKey) return;
    this.lastKey = key;
    void this.renderChart();
  }

  private async renderChart(): Promise<void> {
    const el = this.containerRef?.nativeElement;
    if (!el) return;

    this.destroyInstance();
    this.error.set(null);

    try {
      this.instance = await this.service.render({
        target: el,
        chart: this.chart,
        params: this.params,
        ...(this.theme ? { theme: this.theme } : {}),
        ...(this.language ? { language: this.language } : {}),
        ...(this.width !== undefined ? { width: this.width } : {}),
        ...(this.height !== undefined ? { height: this.height } : {}),
      });
    } catch (err) {
      this.error.set(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private destroyInstance(): void {
    if (this.instance) {
      this.service.destroy(this.instance.id);
      this.instance = null;
    }
  }
}
