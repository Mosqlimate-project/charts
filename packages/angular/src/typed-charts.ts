import { Component, Directive, Input, type OnChanges } from "@angular/core";
import type {
  ChartParams,
  Disease,
  Language,
  Theme,
  UF,
} from "@mosqlimate/charts";
import { MosqlimateChartComponent } from "./chart.component";

@Directive()
export abstract class MosqlimateTypedChartComponent implements OnChanges {
  @Input() theme?: Theme;
  @Input() language?: Language;
  @Input() width?: number;
  @Input() height?: number;

  protected cachedParams?: ChartParams;

  ngOnChanges(): void {
    this.cachedParams = undefined;
  }

  protected get params(): ChartParams {
    if (!this.cachedParams) {
      this.cachedParams = this.buildParams();
    }
    return this.cachedParams;
  }

  protected abstract buildParams(): ChartParams;
}

@Component({
  selector: "ngx-mosqlimate-rt-chart",
  standalone: true,
  imports: [MosqlimateChartComponent],
  template: `
    <ngx-mosqlimate-chart
      [chart]="'infodengue/rt'"
      [params]="params"
      [theme]="theme"
      [language]="language"
      [width]="width"
      [height]="height"
    ></ngx-mosqlimate-chart>
  `,
})
export class RtChartComponent extends MosqlimateTypedChartComponent {
  @Input() disease!: Disease;
  @Input() geocode!: number;
  @Input() start?: string;
  @Input() end?: string;

  protected override buildParams(): ChartParams {
    return {
      disease: this.disease,
      geocode: this.geocode,
      start: this.start,
      end: this.end,
    } as ChartParams;
  }
}

@Component({
  selector: "ngx-mosqlimate-temperature-chart",
  standalone: true,
  imports: [MosqlimateChartComponent],
  template: `
    <ngx-mosqlimate-chart
      [chart]="'climate/temperature'"
      [params]="params"
      [theme]="theme"
      [language]="language"
      [width]="width"
      [height]="height"
    ></ngx-mosqlimate-chart>
  `,
})
export class TemperatureChartComponent extends MosqlimateTypedChartComponent {
  @Input() geocode!: number;
  @Input() start?: string;
  @Input() end?: string;

  protected override buildParams(): ChartParams {
    return {
      geocode: this.geocode,
      start: this.start,
      end: this.end,
    } as ChartParams;
  }
}

@Component({
  selector: "ngx-mosqlimate-accumulated-waterfall-chart",
  standalone: true,
  imports: [MosqlimateChartComponent],
  template: `
    <ngx-mosqlimate-chart
      [chart]="'climate/accumulated-waterfall'"
      [params]="params"
      [theme]="theme"
      [language]="language"
      [width]="width"
      [height]="height"
    ></ngx-mosqlimate-chart>
  `,
})
export class AccumulatedWaterfallChartComponent extends MosqlimateTypedChartComponent {
  @Input() geocode!: number;
  @Input() start?: string;
  @Input() end?: string;

  protected override buildParams(): ChartParams {
    return {
      geocode: this.geocode,
      start: this.start,
      end: this.end,
    } as ChartParams;
  }
}

@Component({
  selector: "ngx-mosqlimate-air-chart",
  standalone: true,
  imports: [MosqlimateChartComponent],
  template: `
    <ngx-mosqlimate-chart
      [chart]="'climate/umid-pressao-med'"
      [params]="params"
      [theme]="theme"
      [language]="language"
      [width]="width"
      [height]="height"
    ></ngx-mosqlimate-chart>
  `,
})
export class AirChartComponent extends MosqlimateTypedChartComponent {
  @Input() geocode!: number;
  @Input() start?: string;
  @Input() end?: string;

  protected override buildParams(): ChartParams {
    return {
      geocode: this.geocode,
      start: this.start,
      end: this.end,
    } as ChartParams;
  }
}

@Component({
  selector: "ngx-mosqlimate-eggs-density-chart",
  standalone: true,
  imports: [MosqlimateChartComponent],
  template: `
    <ngx-mosqlimate-chart
      [chart]="'contaovos/eggs_density'"
      [params]="params"
      [theme]="theme"
      [language]="language"
      [width]="width"
      [height]="height"
    ></ngx-mosqlimate-chart>
  `,
})
export class EggsDensityChartComponent extends MosqlimateTypedChartComponent {
  @Input() start?: string;
  @Input() end?: string;
  @Input() uf?: UF;
  @Input() geocode?: number;

  protected override buildParams(): ChartParams {
    return {
      start: this.start,
      end: this.end,
      uf: this.uf,
      geocode: this.geocode,
    } as ChartParams;
  }
}

@Component({
  selector: "ngx-mosqlimate-positivity-chart",
  standalone: true,
  imports: [MosqlimateChartComponent],
  template: `
    <ngx-mosqlimate-chart
      [chart]="'contaovos/positivity'"
      [params]="params"
      [theme]="theme"
      [language]="language"
      [width]="width"
      [height]="height"
    ></ngx-mosqlimate-chart>
  `,
})
export class PositivityChartComponent extends MosqlimateTypedChartComponent {
  @Input() start?: string;
  @Input() end?: string;
  @Input() uf?: UF;

  protected override buildParams(): ChartParams {
    return {
      start: this.start,
      end: this.end,
      uf: this.uf,
    } as ChartParams;
  }
}

@Component({
  selector: "ngx-mosqlimate-map-chart",
  standalone: true,
  imports: [MosqlimateChartComponent],
  template: `
    <ngx-mosqlimate-chart
      [chart]="'contaovos/map'"
      [params]="params"
      [theme]="theme"
      [language]="language"
      [width]="width"
      [height]="height"
    ></ngx-mosqlimate-chart>
  `,
})
export class MapChartComponent extends MosqlimateTypedChartComponent {
  @Input() start?: string;
  @Input() end?: string;

  protected override buildParams(): ChartParams {
    return {
      start: this.start,
      end: this.end,
    } as ChartParams;
  }
}

@Component({
  selector: "ngx-mosqlimate-scatter-chart",
  standalone: true,
  imports: [MosqlimateChartComponent],
  template: `
    <ngx-mosqlimate-chart
      [chart]="'contaovos/map/scatter'"
      [params]="params"
      [theme]="theme"
      [language]="language"
      [width]="width"
      [height]="height"
    ></ngx-mosqlimate-chart>
  `,
})
export class ScatterChartComponent extends MosqlimateTypedChartComponent {
  @Input() start?: string;
  @Input() end?: string;

  protected override buildParams(): ChartParams {
    return {
      start: this.start,
      end: this.end,
    } as ChartParams;
  }
}
