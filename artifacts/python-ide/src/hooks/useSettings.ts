import { useState, useCallback } from "react";

export interface Settings {
  typingSound: boolean;
  typingSoundVolume: number;
  fontSize: number;
  wordWrap: boolean;
  theme: "dark" | "light" | "solarized" | "monokai";
  minimap: boolean;
}

const SETTINGS_KEY = "python-ide-settings-v1";

const DEFAULT_SETTINGS: Settings = {
  typingSound: false,
  typingSoundVolume: 0.5,
  fontSize: 13,
  wordWrap: true,
  theme: "dark",
  minimap: false,
};

function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { settings, updateSetting };
}
