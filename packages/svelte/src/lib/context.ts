import { getContext, setContext } from "svelte";
import type { MosqlimateContextValue } from "./types";

export const MOSQLIMATE_CONTEXT_KEY = Symbol("mosqlimate");

export function provideMosqlimate(value: MosqlimateContextValue): void {
  setContext(MOSQLIMATE_CONTEXT_KEY, value);
}

export function useMosqlimate(): MosqlimateContextValue {
  return getContext<MosqlimateContextValue>(MOSQLIMATE_CONTEXT_KEY) ?? {};
}
