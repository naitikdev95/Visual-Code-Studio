import { useState, useCallback, useEffect, useRef } from "react";
import { CodeEditor } from "../components/CodeEditor";
import { OutputPanel } from "../components/OutputPanel";
import { PreviewPanel } from "../components/PreviewPanel";
import { LibraryPanel } from "../components/LibraryPanel";
import { FileExplorer } from "../components/FileExplorer";
import { EditorTabs } from "../components/EditorTabs";
import { SettingsPanel } from "../components/SettingsPanel";
import { MobileKeybar } from "../components/MobileKeybar";
import { TemplateSelector } from "../components/TemplateSelector";
import {
  PyodideOutput,
  TurtleCommand,
  getPyodide,
  runCodeAndGetTurtle,
  installPackage,
  setOutputCallback,
} from "../lib/pyodide-runner";
import { Library } from "../lib/libraries";
import { useFileSystem } from "../hooks/useFileSystem";
import { useSettings } from "../hooks/useSettings";
import { useTypingSound } from "../hooks/useTypingSound";
import { EditorView } from "@codemirror/view";
import {
  Play,
  Code2,
  Package,
  Monitor,
  Terminal,
  Loader2,
  FolderOpen,
  Settings2,
  PanelRightClose,
  PanelRight,
  ChevronRight,
} from "lucide-react";

type SidePanel = "files" | "libraries" | "settings";
type RightTab = "output" | "preview";

export default function IDE() {
  const fs = useFileSystem();
  const { settings, updateSetting } = useSettings();
  const playTypingSound = useTypingSound(settings.typingSound, settings.typingSoundVolume);

  const [output, setOutput] = useState<PyodideOutput[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);

  const [sidePanel, setSidePanel] = useState<SidePanel>("files");
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [rightTab, setRightTab] = useState<RightTab>("output");

  const [installedPackages, setInstalledPackages] = useState<Set<string>>(new Set());
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  // Preview state
  const [plotImageUrl, setPlotImageUrl] = useState("");
  const [turtleCommands, setTurtleCommands] = useState<TurtleCommand[] | null>(null);

  const editorViewRef = useRef<EditorView | null>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const addOutput = useCallback((msg: PyodideOutput) => {
    setOutput((prev) => [...prev, msg]);
  }, []);

  // Keep the global output callback always pointing to addOutput
  useEffect(() => {
    setOutputCallback(addOutput);
  }, [addOutput]);

  // Register matplotlib image callback
  useEffect(() => {
    window._pyPlotImage = (dataUrl: string) => {
      setPlotImageUrl(dataUrl);
      setRightTab("preview");
    };
  }, []);

  useEffect(() => {
    setIsPyodideLoading(true);
    getPyodide(addOutput).then(() => {
      setIsPyodideReady(true);
      setIsPyodideLoading(false);
    });
  }, [addOutput]);

  const handleRun = useCallback(async () => {
    if (isRunning || !fs.activeFile) return;
    setIsRunning(true);
    setOutput([]);
    setPlotImageUrl("");
    setTurtleCommands(null);

    try {
      const pyodide = await getPyodide(addOutput);

      const { turtleCommands: cmds, hasTurtle } = await runCodeAndGetTurtle(
        pyodide,
        fs.activeFile.content
      );

      if (hasTurtle && cmds) {
        setTurtleCommands(cmds);
        setRightTab("preview");
        const lineCount = cmds.filter((c) => c.type === "line").length;
        addOutput({ type: "info", text: `Turtle drawing complete — ${lineCount} line${lineCount !== 1 ? "s" : ""} drawn.` });
      }
    } catch (err: unknown) {
      addOutput({ type: "error", text: (err as Error).message ?? String(err) });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, fs.activeFile, addOutput]);

  const handleInstall = useCallback(async (lib: Library) => {
    if (lib.browserUnsupported) {
      addOutput({ type: "error", text: `${lib.name} requires native C extensions and cannot run in the browser. Try numpy, pandas, matplotlib, seaborn, or scikit-learn instead.` });
      return;
    }
    setIsInstalling(lib.id);
    const ok = await installPackage(lib.pyodideName, addOutput);
    if (ok) setInstalledPackages((prev) => new Set([...prev, lib.pyodideName]));
    setIsInstalling(null);
  }, [addOutput]);

  const handleInsertExample = useCallback((code: string) => {
    if (fs.activeFile) {
      fs.updateFileContent(fs.activeFile.id, code);
      addOutput({ type: "info", text: "Example code loaded. Click Run to execute." });
    }
  }, [fs, addOutput]);

  const handleImportFile = useCallback((file: File) => {
    fs.importFile(file);
    addOutput({ type: "info", text: `Imported: ${file.name}` });
  }, [fs, addOutput]);

  const handleImportClick = () => importInputRef.current?.click();

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { handleImportFile(file); e.target.value = ""; }
  };

  const ACTIVITY_ITEMS: { id: SidePanel; Icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { id: "files", Icon: FolderOpen, label: "Explorer" },
    { id: "libraries", Icon: Package, label: "Libraries" },
    { id: "settings", Icon: Settings2, label: "Settings" },
  ];

  const themeClass =
    settings.theme === "light" ? "theme-light" :
    settings.theme === "solarized" ? "theme-solarized" :
    settings.theme === "monokai" ? "theme-monokai" : "";

  const hasError = output.some((o) => o.type === "error");
  const hasPreview = !!plotImageUrl || (turtleCommands && turtleCommands.length > 0);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${themeClass} bg-background text-foreground`}>

      {/* ── Top Menu Bar ── */}
      <header className="flex items-center gap-2 px-2 py-1.5 border-b border-border bg-sidebar shrink-0 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0 mr-1">
          <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
            <Code2 className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="text-xs font-bold text-foreground hidden sm:block tracking-tight">PyIDE</span>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning || isPyodideLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity shrink-0"
        >
          {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span className="hidden xs:block">{isRunning ? "Running" : "Run"}</span>
        </button>

        <div className="flex items-center gap-1 shrink-0">
          {isPyodideLoading ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="hidden sm:block">Loading...</span>
            </span>
          ) : isPyodideReady ? (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="hidden sm:block">Python 3.11</span>
            </span>
          ) : null}
        </div>

        <div className="hidden sm:block">
          <TemplateSelector onSelect={(c) => { if (fs.activeFile) fs.updateFileContent(fs.activeFile.id, c); setOutput([]); setPlotImageUrl(""); setTurtleCommands(null); }} />
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setRightPanelOpen((v) => !v)}
            title="Toggle output panel"
            className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            {rightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Activity Bar */}
        <div className="w-10 shrink-0 bg-sidebar border-r border-border flex flex-col items-center py-2 gap-1">
          {ACTIVITY_ITEMS.map(({ id, Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                if (sidePanel === id && sidePanelOpen) setSidePanelOpen(false);
                else { setSidePanel(id); setSidePanelOpen(true); }
              }}
              title={label}
              className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                sidePanel === id && sidePanelOpen
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Side Panel */}
        {sidePanelOpen && (
          <div className="w-56 shrink-0 border-r border-border bg-sidebar flex flex-col overflow-hidden">
            {sidePanel === "files" && (
              <FileExplorer
                files={fs.files}
                activeFileId={fs.activeFileId}
                onSelect={fs.setActiveFileId}
                onNew={fs.newFile}
                onDelete={fs.deleteFile}
                onRename={fs.renameFile}
                onDuplicate={fs.duplicateFile}
                onImport={handleImportFile}
                onExport={fs.exportFile}
              />
            )}
            {sidePanel === "libraries" && (
              <LibraryPanel
                installedPackages={installedPackages}
                onInstall={handleInstall}
                onInsertExample={handleInsertExample}
                isInstalling={isInstalling}
              />
            )}
            {sidePanel === "settings" && (
              <SettingsPanel settings={settings} onUpdate={updateSetting} />
            )}
          </div>
        )}

        {/* ── Editor Column ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          <EditorTabs
            files={fs.files}
            activeFileId={fs.activeFileId}
            onSelect={fs.setActiveFileId}
            onImport={handleImportClick}
            onExport={() => fs.exportFile(fs.activeFileId)}
          />
          <input
            ref={importInputRef}
            type="file"
            accept=".py,.txt"
            className="hidden"
            onChange={handleImportChange}
          />

          <div className="flex items-center gap-1 px-3 py-1 border-b border-border bg-card/30 shrink-0 text-xs text-muted-foreground">
            <Code2 className="w-3 h-3 opacity-60" />
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="font-medium text-foreground/80">{fs.activeFile?.name ?? "..."}</span>
            <span className="ml-auto hidden sm:block opacity-60">Ctrl+Enter to run · Ctrl+Space completions</span>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <CodeEditor
              value={fs.activeFile?.content ?? ""}
              onChange={(val) => fs.activeFile && fs.updateFileContent(fs.activeFile.id, val)}
              onRun={handleRun}
              theme={settings.theme}
              fontSize={settings.fontSize}
              wordWrap={settings.wordWrap}
              editorViewRef={editorViewRef}
              onKeyDown={playTypingSound}
            />
          </div>
        </div>

        {/* ── Right Panel ── */}
        {rightPanelOpen && (
          <div className="w-72 shrink-0 border-l border-border flex flex-col overflow-hidden">
            <div className="flex items-center border-b border-border shrink-0 bg-sidebar">
              <button
                onClick={() => setRightTab("output")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs border-r border-border transition-colors ${
                  rightTab === "output"
                    ? "text-foreground bg-background border-b-2 border-b-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Output
                {hasError && <span className="w-1.5 h-1.5 rounded-full bg-destructive" />}
              </button>
              <button
                onClick={() => setRightTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs transition-colors ${
                  rightTab === "preview"
                    ? "text-foreground bg-background border-b-2 border-b-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Preview
                {hasPreview && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden">
              {rightTab === "output" ? (
                <OutputPanel output={output} onClear={() => setOutput([])} />
              ) : (
                <PreviewPanel
                  previewContent={plotImageUrl}
                  turtleCommands={turtleCommands}
                  isRunning={isRunning}
                />
              )}
            </div>
          </div>
        )}
      </div>

      <MobileKeybar editorViewRef={editorViewRef} />

      {/* ── Status Bar ── */}
      <div className="flex items-center justify-between px-3 py-0.5 border-t border-border bg-primary text-primary-foreground shrink-0 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Code2 className="w-3 h-3 opacity-70" />
            Python 3.11
          </span>
          {fs.activeFile && (
            <span className="opacity-70">
              {fs.activeFile.content.split("\n").length} lines
            </span>
          )}
          {installedPackages.size > 0 && (
            <span className="flex items-center gap-1 opacity-70">
              <Package className="w-3 h-3" />
              {installedPackages.size} pkg{installedPackages.size !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isRunning && (
            <span className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Executing...
            </span>
          )}
          {settings.typingSound && <span className="opacity-70">🔊</span>}
          <span className="opacity-70">{fs.activeFile?.name}</span>
          <span className="opacity-70">UTF-8</span>
        </div>
      </div>
    </div>
  );
}
