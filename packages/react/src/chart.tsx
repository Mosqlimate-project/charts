import { useRef, useEffect, useState } from "react";
import type {
  ChartName,
  ChartParams,
  ChartInstance,
  Theme,
  Language,
} from "@mosqlimate/charts";
import { Mosqlimate } from "@mosqlimate/charts";

export interface MosqlimateChartProps {
  chart: ChartName;
  params: ChartParams;
  theme?: Theme;
  language?: Language;
  width?: number;
  height?: number;
}

export function MosqlimateChart({
  chart,
  params,
  theme,
  language,
  width,
  height,
}: MosqlimateChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ChartInstance | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    Mosqlimate.render({
      target: el,
      chart,
      params,
      ...(theme ? { theme } : {}),
      ...(language ? { language } : {}),
      ...(width !== undefined ? { width } : {}),
      ...(height !== undefined ? { height } : {}),
    })
      .then((instance) => {
        if (cancelled) {
          Mosqlimate.destroy(instance.id);
          return;
        }
        instanceRef.current = instance;
        setError(null);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error(String(err)));
      });

    return () => {
      cancelled = true;
      if (instanceRef.current) {
        Mosqlimate.destroy(instanceRef.current.id);
        instanceRef.current = null;
      }
    };
  }, [chart, JSON.stringify(params), theme, language, width, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "350px",
      }}
    >
      {error && (
        <div
          role="alert"
          style={{
            padding: 16,
            color: "#dc3545",
            background: "#f8d7da",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {error.message}
        </div>
      )}
    </div>
  );
}
