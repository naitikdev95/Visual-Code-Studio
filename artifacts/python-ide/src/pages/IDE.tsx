import { useState, useCallback, useEffect, useRef } from "react";
import { CodeEditor } from "../components/CodeEditor";
import { OutputPanel } from "../components/OutputPanel";
import { PreviewPanel } from "../components/PreviewPanel";
import { LibraryPanel } from "../components/LibraryPanel";
import { ThemeSelector, Theme } from "../components/ThemeSelector";
import { TemplateSelector } from "../components/TemplateSelector";
import { PyodideOutput, getPyodide, installPackage } from "../lib/pyodide-runner";
import { Library } from "../lib/libraries";
import {
  Play,
  Square,
  Code2,
  Package,
  Monitor,
  Terminal,
  Loader2,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

const DEFAULT_CODE = `# Welcome to Python IDE!
# Press Ctrl+Enter or click Run to execute your code.

print("Hello, Python IDE!")

# Try some calculations
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
total = sum(numbers)
average = total / len(numbers)

print(f"\\nNumbers: {numbers}")
print(f"Sum: {total}")
print(f"Average: {average}")

# String operations
message = "Python is amazing!"
print(f"\\n{message}")
print(f"Uppercase: {message.upper()}")
print(f"Words: {len(message.split())}")

# List comprehension
squares = [x**2 for x in range(1, 6)]
print(f"\\nSquares: {squares}")
`;

type Tab = "output" | "preview";
type SidebarTab = "libraries";

export default function IDE() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<PyodideOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [activeTab, setActiveTab] = useState<Tab>("output");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [installedPackages, setInstalledPackages] = useState<Set<string>>(new Set());
  const [isInstalling, setIsInstalling] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const runControllerRef = useRef<AbortController | null>(null);

  const addOutput = useCallback((msg: PyodideOutput) => {
    setOutput((prev) => [...prev, msg]);
  }, []);

  useEffect(() => {
    setIsPyodideLoading(true);
    getPyodide(addOutput).then(() => {
      setIsPyodideReady(true);
      setIsPyodideLoading(false);
    });
  }, [addOutput]);

  const handleRun = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutput([]);
    setPreviewContent("");

    try {
      const pyodide = await getPyodide(addOutput);

      (window as Window & typeof globalThis)._pyStdout = (type: string, text: string) => {
        const trimmed = text.replace(/\n$/, "");
        if (trimmed) {
          addOutput({ type: type as PyodideOutput["type"], text: trimmed });
        }
      };

      const result = await pyodide.runPythonAsync(code);
      if (result !== undefined && result !== null) {
        addOutput({ type: "result", text: String(result) });
      }

      const fs = (pyodide as unknown as { FS?: { readFile?: (path: string) => Uint8Array } }).FS;
      if (fs && fs.readFile) {
        try {
          const pngData = fs.readFile("/tmp/plot.png");
          const blob = new Blob([pngData], { type: "image/png" });
          const url = URL.createObjectURL(blob);
          setPreviewContent(url);
          setActiveTab("preview");
          addOutput({ type: "info", text: "Plot rendered in Preview tab." });
        } catch {
          // No plot file — that's fine
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      addOutput({ type: "error", text: error.message || String(err) });
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning, addOutput]);

  const handleInstall = useCallback(
    async (lib: Library) => {
      setIsInstalling(lib.id);
      const success = await installPackage(lib.pyodideName, addOutput);
      if (success) {
        setInstalledPackages((prev) => new Set([...prev, lib.pyodideName]));
      }
      setIsInstalling(null);
    },
    [addOutput]
  );

  const handleInsertExample = useCallback((exampleCode: string) => {
    setCode(exampleCode);
    addOutput({ type: "info", text: "Example code loaded. Click Run to execute." });
  }, [addOutput]);

  const themeClass =
    theme === "light"
      ? "theme-light"
      : theme === "solarized"
      ? "theme-solarized"
      : theme === "monokai"
      ? "theme-monokai"
      : "";

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${themeClass} bg-background text-foreground`}>
      {/* Top Bar */}
      <header className="flex items-center gap-2 px-3 py-2 border-b border-border bg-sidebar shrink-0">
        <div className="flex items-center gap-2 mr-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Code2 className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground hidden sm:block">Python IDE</span>
          {isPyodideLoading && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="hidden sm:block">Loading runtime...</span>
            </div>
          )}
          {isPyodideReady && !isPyodideLoading && (
            <span className="text-xs text-green-400 hidden sm:flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              Python 3.11
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-1">
          <button
            onClick={handleRun}
            disabled={isRunning || isPyodideLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Running</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run</span>
              </>
            )}
          </button>

          <TemplateSelector onSelect={(c) => { setCode(c); setOutput([]); }} />

          <div className="ml-auto flex items-center gap-1.5">
            <ThemeSelector theme={theme} onChange={setTheme} />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-3.5 h-3.5" />
              ) : (
                <PanelLeft className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar - Libraries */}
        {sidebarOpen && (
          <div className="w-64 shrink-0 border-r border-border bg-sidebar flex flex-col overflow-hidden">
            <LibraryPanel
              installedPackages={installedPackages}
              onInstall={handleInstall}
              onInsertExample={handleInsertExample}
              isInstalling={isInstalling}
            />
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-card/50 shrink-0">
            <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">main.py</span>
            <span className="ml-auto text-xs text-muted-foreground hidden sm:block">
              Ctrl+Enter to run · Tab for indent · Ctrl+Space for completions
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <CodeEditor
              value={code}
              onChange={setCode}
              onRun={handleRun}
              theme={theme}
            />
          </div>
        </div>

        {/* Right Panel - Output + Preview */}
        <div className="w-80 shrink-0 border-l border-border flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center border-b border-border shrink-0 bg-card/50">
            <button
              onClick={() => setActiveTab("output")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs border-r border-border transition-colors ${
                activeTab === "output"
                  ? "text-foreground bg-background border-b-2 border-b-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Output
              {output.some((o) => o.type === "error") && (
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-colors ${
                activeTab === "preview"
                  ? "text-foreground bg-background border-b-2 border-b-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Preview
              {previewContent && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              )}
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === "output" ? (
              <OutputPanel
                output={output}
                onClear={() => setOutput([])}
              />
            ) : (
              <PreviewPanel
                previewContent={previewContent}
                isRunning={isRunning}
              />
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-border bg-sidebar shrink-0 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>
            {code.split("\n").length} lines · {code.length} chars
          </span>
          <span>Python 3.11</span>
          {installedPackages.size > 0 && (
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {installedPackages.size} package{installedPackages.size !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="flex items-center gap-1 text-primary">
              <Loader2 className="w-3 h-3 animate-spin" />
              Executing...
            </span>
          )}
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
