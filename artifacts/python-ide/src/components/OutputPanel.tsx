import { useEffect, useRef } from "react";
import { PyodideOutput } from "../lib/pyodide-runner";
import { Terminal, Trash2 } from "lucide-react";

interface OutputPanelProps {
  output: PyodideOutput[];
  onClear: () => void;
}

function getLineClass(type: PyodideOutput["type"]): string {
  switch (type) {
    case "error": return "output-line-error";
    case "stderr": return "output-line-error";
    case "result": return "output-line-success";
    case "info": return "output-line-info";
    default: return "";
  }
}

function getLinePrefix(type: PyodideOutput["type"]): string {
  switch (type) {
    case "error": return "✗ ";
    case "stderr": return "⚠ ";
    case "result": return "→ ";
    case "info": return "ℹ ";
    default: return "";
  }
}

export function OutputPanel({ output, onClear }: OutputPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Output</span>
          {output.length > 0 && (
            <span className="text-xs text-muted-foreground">({output.length} lines)</span>
          )}
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          title="Clear output"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
        {output.length === 0 ? (
          <div className="text-muted-foreground text-center mt-8 select-none">
            <Terminal className="w-6 h-6 mx-auto mb-2 opacity-30" />
            <p>Run code to see output here</p>
            <p className="mt-1 text-xs opacity-60">Press Ctrl+Enter or click Run</p>
          </div>
        ) : (
          output.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-all ${getLineClass(line.type)}`}
            >
              <span className="opacity-50">{getLinePrefix(line.type)}</span>
              {line.text}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
