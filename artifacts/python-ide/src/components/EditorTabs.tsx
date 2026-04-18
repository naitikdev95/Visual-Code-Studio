import { useRef } from "react";
import { FileItem } from "../hooks/useFileSystem";
import { FileCode, X, Upload, Download } from "lucide-react";

interface EditorTabsProps {
  files: FileItem[];
  activeFileId: string;
  onSelect: (id: string) => void;
  onClose?: (id: string) => void;
  onImport: () => void;
  onExport: () => void;
}

export function EditorTabs({
  files,
  activeFileId,
  onSelect,
  onImport,
  onExport,
}: EditorTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-stretch h-9 border-b border-border bg-sidebar shrink-0 min-w-0">
      {/* Tabs scroll area */}
      <div
        ref={scrollRef}
        className="flex items-stretch flex-1 overflow-x-auto min-w-0"
        style={{ scrollbarWidth: "none" }}
      >
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <button
              key={file.id}
              onClick={() => onSelect(file.id)}
              title={file.name}
              className={`group relative flex items-center gap-1.5 px-3 h-full text-xs border-r border-border shrink-0 max-w-[160px] transition-colors ${
                isActive
                  ? "bg-background text-foreground border-b-2 border-b-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <FileCode className="w-3 h-3 shrink-0 opacity-60" />
              <span className="truncate">{file.name}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 opacity-70" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 px-1.5 border-l border-border shrink-0">
        <button
          onClick={onImport}
          title="Import .py file"
          className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Import</span>
        </button>
        <button
          onClick={onExport}
          title="Export current file"
          className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Export</span>
        </button>
      </div>
    </div>
  );
}
