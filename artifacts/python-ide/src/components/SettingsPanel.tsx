import { Settings } from "../hooks/useSettings";
import {
  Volume2,
  VolumeX,
  Type,
  WrapText,
  Palette,
  Settings2,
} from "lucide-react";

interface SettingsPanelProps {
  settings: Settings;
  onUpdate: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 px-3 py-1.5 mb-1">
        <Icon className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="px-3 space-y-3">{children}</div>
    </div>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
  const THEMES = [
    { id: "dark", label: "Dark", icon: "🌙" },
    { id: "light", label: "Light", icon: "☀️" },
    { id: "solarized", label: "Solarized", icon: "🌅" },
    { id: "monokai", label: "Monokai", icon: "🎨" },
  ] as const;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border shrink-0">
        <Settings2 className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Settings
        </span>
      </div>

      <div className="flex-1 overflow-auto py-3">
        {/* Typing Sound */}
        <Section title="Sounds" icon={Volume2}>
          <Row
            label="Typing Sound"
            description="Mechanical keyboard sounds while coding"
          >
            <Toggle
              checked={settings.typingSound}
              onChange={(v) => onUpdate("typingSound", v)}
            />
          </Row>
          {settings.typingSound && (
            <Row label="Volume">
              <div className="flex items-center gap-2">
                <VolumeX className="w-3 h-3 text-muted-foreground" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.typingSoundVolume}
                  onChange={(e) =>
                    onUpdate("typingSoundVolume", parseFloat(e.target.value))
                  }
                  className="w-24 accent-primary"
                />
                <Volume2 className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground w-7 text-right">
                  {Math.round(settings.typingSoundVolume * 100)}%
                </span>
              </div>
            </Row>
          )}
        </Section>

        {/* Editor */}
        <Section title="Editor" icon={Type}>
          <Row label="Font Size" description="Editor font size in pixels">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onUpdate("fontSize", Math.max(10, settings.fontSize - 1))
                }
                className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-accent text-foreground text-sm"
              >
                −
              </button>
              <span className="text-xs w-6 text-center font-mono">
                {settings.fontSize}
              </span>
              <button
                onClick={() =>
                  onUpdate("fontSize", Math.min(24, settings.fontSize + 1))
                }
                className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-accent text-foreground text-sm"
              >
                +
              </button>
            </div>
          </Row>
          <Row label="Word Wrap" description="Wrap long lines in the editor">
            <Toggle
              checked={settings.wordWrap}
              onChange={(v) => onUpdate("wordWrap", v)}
            />
          </Row>
        </Section>

        {/* Theme */}
        <Section title="Theme" icon={Palette}>
          <div className="grid grid-cols-2 gap-1.5">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdate("theme", t.id)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-md border text-xs transition-colors ${
                  settings.theme === t.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Keyboard shortcuts */}
        <Section title="Shortcuts" icon={Settings2}>
          <div className="space-y-1.5 text-xs">
            {[
              ["Run code", "Ctrl + Enter"],
              ["Autocomplete", "Ctrl + Space"],
              ["Comment line", "Ctrl + /"],
              ["Indent", "Tab"],
              ["Search", "Ctrl + F"],
              ["Undo", "Ctrl + Z"],
              ["Redo", "Ctrl + Shift + Z"],
            ].map(([action, shortcut]) => (
              <div key={action} className="flex items-center justify-between">
                <span className="text-muted-foreground">{action}</span>
                <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-xs font-mono text-foreground">
                  {shortcut}
                </kbd>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
