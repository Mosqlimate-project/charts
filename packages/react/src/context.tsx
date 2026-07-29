import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { Language, Theme } from "@mosqlimate/charts";

interface MosqlimateContextValue {
  api_key?: string;
  sdk_key?: string;
  theme?: Theme;
  language?: Language;
}

const MosqlimateContext = createContext<MosqlimateContextValue | null>(null);

export interface MosqlimateProviderProps {
  api_key?: string;
  sdk_key?: string;
  theme?: Theme;
  language?: Language;
  children: ReactNode;
}

export function MosqlimateProvider({
  api_key,
  sdk_key,
  theme,
  language,
  children,
}: MosqlimateProviderProps) {
  useEffect(() => {
    (async () => {
      const { Mosqlimate } = await import("@mosqlimate/charts");
      if (sdk_key) Mosqlimate.setSdkKey(sdk_key);
      if (api_key) Mosqlimate.setApiKey(api_key);
      if (theme || language)
        Mosqlimate.configure({
          ...(theme && { theme }),
          ...(language && { language }),
        });
    })();
  }, [api_key, sdk_key, theme, language]);

  return (
    <MosqlimateContext.Provider value={{ api_key, sdk_key, theme, language }}>
      {children}
    </MosqlimateContext.Provider>
  );
}

export function useMosqlimate(): MosqlimateContextValue {
  const ctx = useContext(MosqlimateContext);
  return ctx ?? {};
}
