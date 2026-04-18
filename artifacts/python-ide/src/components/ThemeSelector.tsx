import { useState } from "react";
import { Palette, ChevronDown, Check } from "lucide-react";

export type Theme = "dark" | "light" | "solarized" | "monokai";

const THEMES: { id: Theme; name: string; icon: string; preview: string }[] = [
  {
    id: "dark",
    name: "Dark",
    icon: "🌙",
    preview: "bg-[#1a1b26]",
  },
  {
    id: "light",
    name: "Light",
    icon: "☀️",
    preview: "bg-[#f9f9f9]",
  },
  {
    id: "solarized",
    name: "Solarized",
    icon: "🌅",
    preview: "bg-[#002b36]",
  },
  {
    id: "monokai",
    name: "Monokai",
    icon: "🎨",
    preview: "bg-[#272822]",
  },
];

interface ThemeSelectorProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeSelector({ theme, onChange }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  const current = THEMES.find((t) => t.id === theme)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
      >
        <Palette className="w-3.5 h-3.5" />
        <span>{current.icon} {current.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 z-20 bg-popover border border-popover-border rounded-lg shadow-xl p-1 min-w-[160px]">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onChange(t.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
              >
                <div className={`w-4 h-4 rounded-sm border border-border/50 ${t.preview} shrink-0`} />
                <span className="text-xs text-foreground">{t.icon} {t.name}</span>
                {theme === t.id && (
                  <Check className="w-3 h-3 ml-auto text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
