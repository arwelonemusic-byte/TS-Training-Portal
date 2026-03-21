"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { mockPresets, type MockPreset } from "@/data/mock-presets";

interface MockState {
  preset: MockPreset;
  presetIndex: number;
  setPresetIndex: (index: number) => void;
}

const MockStateContext = createContext<MockState | null>(null);

export function MockStateProvider({ children }: { children: ReactNode }) {
  const [presetIndex, setPresetIndex] = useState(0);
  const preset = mockPresets[presetIndex];

  return (
    <MockStateContext.Provider value={{ preset, presetIndex, setPresetIndex }}>
      {children}
    </MockStateContext.Provider>
  );
}

export function useMockState() {
  const ctx = useContext(MockStateContext);
  if (!ctx) throw new Error("useMockState must be used within MockStateProvider");
  return ctx;
}
