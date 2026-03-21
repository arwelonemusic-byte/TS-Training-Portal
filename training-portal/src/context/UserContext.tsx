"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { mockPresets, type MockPreset } from "@/data/mock-presets";

interface UserInfo {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
}

interface UserState {
  user: UserInfo | null;
  roles: string[];
  testResults: Record<string, { passed: boolean; score?: number; total?: number }>;
  isLoading: boolean;
  isMockMode: boolean;
  refreshTestResults: () => Promise<void>;
  // Mock mode only
  mockPresetIndex?: number;
  setMockPreset?: (index: number) => void;
}

const UserContext = createContext<UserState | null>(null);

const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

function MockUserProvider({ children }: { children: ReactNode }) {
  const [presetIndex, setPresetIndex] = useState(0);
  const preset: MockPreset = mockPresets[presetIndex];

  const value: UserState = {
    user: { id: "mock", username: "Боец_Призрак", displayName: "Боец_Призрак", avatar: null },
    roles: preset.roles,
    testResults: preset.testResults,
    isLoading: false,
    isMockMode: true,
    refreshTestResults: async () => {},
    mockPresetIndex: presetIndex,
    setMockPreset: setPresetIndex,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function RealUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<
    Record<string, { passed: boolean; score?: number; total?: number }>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.user) {
        setUser({ id: data.user.id, username: data.user.username, displayName: data.user.displayName ?? data.user.username, avatar: data.user.avatar });
        setRoles(data.user.roles ?? []);
      } else {
        setUser(null);
        setRoles([]);
      }
    } catch {
      setUser(null);
      setRoles([]);
    }
  }, []);

  const refreshTestResults = useCallback(async () => {
    try {
      const res = await fetch("/api/test-results");
      if (res.ok) {
        const data = await res.json();
        setTestResults(data.results ?? {});
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      await fetchSession();
      await refreshTestResults();
      setIsLoading(false);
    }
    init();
  }, [fetchSession, refreshTestResults]);

  const value: UserState = {
    user,
    roles,
    testResults,
    isLoading,
    isMockMode: false,
    refreshTestResults,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function UserProvider({ children }: { children: ReactNode }) {
  if (IS_MOCK) {
    return <MockUserProvider>{children}</MockUserProvider>;
  }
  return <RealUserProvider>{children}</RealUserProvider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
