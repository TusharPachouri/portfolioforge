"use client";

import { useEffect, useState, useCallback } from "react";
import { BuilderState, PortfolioData, RawUserDetails } from "@/types/portfolio";

const KEY = "pf_builder";
const MAX_FREE_GENERATIONS = 3;

const DEFAULT_STATE: BuilderState = {
  selectedComponentIds: [],
  portfolioData: null,
  rawFormData: null,
  lastUpdated: Date.now(),
  generationCount: 0,
  lastGeneratedAt: null,
};

function read(): BuilderState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_STATE, ...(JSON.parse(raw) as BuilderState) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function write(state: BuilderState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function useBuilderState() {
  const [state, setState] = useState<BuilderState>(DEFAULT_STATE);

  useEffect(() => {
    setState(read());
  }, []);

  const update = useCallback((updater: (prev: BuilderState) => BuilderState) => {
    setState((prev) => {
      const next = updater(prev);
      write(next);
      return next;
    });
  }, []);

  const addComponent = useCallback(
    (id: string) =>
      update((prev) =>
        prev.selectedComponentIds.includes(id)
          ? prev
          : { ...prev, selectedComponentIds: [...prev.selectedComponentIds, id], lastUpdated: Date.now() }
      ),
    [update]
  );

  const removeComponent = useCallback(
    (id: string) =>
      update((prev) => ({
        ...prev,
        selectedComponentIds: prev.selectedComponentIds.filter((c) => c !== id),
        lastUpdated: Date.now(),
      })),
    [update]
  );

  const reorderComponents = useCallback(
    (ids: string[]) =>
      update((prev) => ({ ...prev, selectedComponentIds: ids, lastUpdated: Date.now() })),
    [update]
  );

  const setPortfolioData = useCallback(
    (data: PortfolioData, raw: RawUserDetails) =>
      update((prev) => ({
        ...prev,
        portfolioData: data,
        rawFormData: raw,
        generationCount: prev.generationCount + 1,
        lastGeneratedAt: Date.now(),
        lastUpdated: Date.now(),
      })),
    [update]
  );

  const saveRawForm = useCallback(
    (raw: RawUserDetails) =>
      update((prev) => ({ ...prev, rawFormData: raw, lastUpdated: Date.now() })),
    [update]
  );

  const clearBuilder = useCallback(
    () => update(() => ({ ...DEFAULT_STATE, lastUpdated: Date.now() })),
    [update]
  );

  const canGenerate = state.generationCount < MAX_FREE_GENERATIONS;

  return {
    state,
    addComponent,
    removeComponent,
    reorderComponents,
    setPortfolioData,
    saveRawForm,
    clearBuilder,
    canGenerate,
    MAX_FREE_GENERATIONS,
  };
}
