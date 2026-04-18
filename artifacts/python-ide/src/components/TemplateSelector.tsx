import { STARTER_TEMPLATES } from "../lib/libraries";
import { FileCode, ChevronDown } from "lucide-react";
import { useState } from "react";

interface TemplateSelectorProps {
  onSelect: (code: string) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
      >
        <FileCode className="w-3.5 h-3.5" />
        <span>Templates</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 z-20 bg-popover border border-popover-border rounded-lg shadow-xl p-1 min-w-[200px]">
            {STARTER_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelect(template.code);
                  setOpen(false);
                }}
                className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
              >
                <span className="text-base">{template.icon}</span>
                <div>
                  <p className="text-xs font-medium text-foreground">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
