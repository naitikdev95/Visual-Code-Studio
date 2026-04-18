import { useState, useRef } from "react";
import { FileItem } from "../hooks/useFileSystem";
import {
  FilePlus,
  Upload,
  Download,
  Trash2,
  Copy,
  Pencil,
  Check,
  X,
  FileCode,
  ChevronDown,
} from "lucide-react";

interface FileExplorerProps {
  files: FileItem[];
  activeFileId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDuplicate: (id: string) => void;
  onImport: (file: File) => void;
  onExport: (id: string) => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function FileExplorer({
  files,
  activeFileId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onDuplicate,
  onImport,
  onExport,
}: FileExplorerProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const startRename = (file: FileItem) => {
    setRenamingId(file.id);
    setRenameValue(file.name.replace(/\.py$/, ""));
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      onRename(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  };

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  return (
    <div className="h-full flex flex-col select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5">
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Explorer
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={onNew}
            title="New File"
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => importRef.current?.click()}
            title="Import .py file"
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".py,.txt"
            className="hidden"
            onChange={handleImportChange}
          />
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-auto py-1">
        {files.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-xs">
            No files yet
          </div>
        ) : (
          files.map((file) => {
            const isActive = file.id === activeFileId;
            const isRenaming = renamingId === file.id;
            const isHovered = hoveredId === file.id;

            return (
              <div
                key={file.id}
                onMouseEnter={() => setHoveredId(file.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => !isRenaming && onSelect(file.id)}
                className={`group flex items-center gap-1.5 px-2 py-1 cursor-pointer transition-colors ${
                  isActive
                    ? "bg-primary/15 text-foreground"
                    : "hover:bg-accent/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Active indicator */}
                <div
                  className={`w-0.5 h-4 rounded-full shrink-0 transition-colors ${
                    isActive ? "bg-primary" : "bg-transparent"
                  }`}
                />

                <FileCode
                  className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />

                {isRenaming ? (
                  <div className="flex-1 flex items-center gap-1 min-w-0">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") setRenamingId(null);
                        e.stopPropagation();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 min-w-0 text-xs bg-input border border-ring rounded px-1 py-0.5 text-foreground outline-none"
                    />
                    <span className="text-xs text-muted-foreground">.py</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); commitRename(); }}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setRenamingId(null); }}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate font-medium">{file.name}</p>
                      {isActive && (
                        <p className="text-xs text-muted-foreground/60 truncate">
                          {timeAgo(file.updatedAt)}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div
                      className={`flex items-center gap-0.5 transition-opacity ${
                        isHovered || isActive ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); startRename(file); }}
                        title="Rename"
                        className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDuplicate(file.id); }}
                        title="Duplicate"
                        className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onExport(file.id); }}
                        title="Download .py"
                        className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Download className="w-2.5 h-2.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${file.name}"?`)) onDelete(file.id);
                        }}
                        title="Delete"
                        className="p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer summary */}
      <div className="px-3 py-1.5 border-t border-border shrink-0 text-xs text-muted-foreground flex items-center justify-between">
        <span>{files.length} file{files.length !== 1 ? "s" : ""}</span>
        <button
          onClick={() => importRef.current?.click()}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Upload className="w-3 h-3" />
          Import
        </button>
      </div>
    </div>
  );
}
