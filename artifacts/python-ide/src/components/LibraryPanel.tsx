import { useState } from "react";
import { LIBRARIES, LIBRARY_CATEGORIES, Library } from "../lib/libraries";
import { Package, Download, CheckCircle, ExternalLink, Search, X } from "lucide-react";

interface LibraryPanelProps {
  installedPackages: Set<string>;
  onInstall: (pkg: Library) => void;
  onInsertExample: (code: string) => void;
  isInstalling: string | null;
}

export function LibraryPanel({ installedPackages, onInstall, onInsertExample, isInstalling }: LibraryPanelProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = LIBRARIES.filter((lib) => {
    const matchesSearch =
      lib.name.toLowerCase().includes(search.toLowerCase()) ||
      lib.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "all" || lib.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Libraries</span>
          <span className="text-xs text-muted-foreground ml-auto">{installedPackages.size} installed</span>
        </div>
        <div className="relative mb-2">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search libraries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-7 py-1.5 text-xs bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          {LIBRARY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                category === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-xs">
            <Package className="w-6 h-6 mx-auto mb-2 opacity-30" />
            <p>No libraries found</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filtered.map((lib) => {
              const installed = installedPackages.has(lib.pyodideName);
              const installing = isInstalling === lib.id;
              const isOpen = expanded === lib.id;

              return (
                <div
                  key={lib.id}
                  className="border border-border rounded-md overflow-hidden bg-card"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : lib.id)}
                    className="w-full text-left p-2 hover:bg-accent/50 transition-colors flex items-start gap-2"
                  >
                    <span className="text-base shrink-0 leading-none mt-0.5">{lib.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{lib.name}</span>
                        {installed && (
                          <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{lib.description}</p>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-border p-2 bg-muted/30 space-y-2">
                      <div className="text-xs font-mono bg-background/50 rounded p-2 overflow-auto max-h-32 text-foreground/80 leading-relaxed">
                        {lib.example.split("\n").slice(0, 8).join("\n")}
                        {lib.example.split("\n").length > 8 && "\n..."}
                      </div>
                      <div className="flex gap-1.5">
                        {!installed ? (
                          <button
                            onClick={() => onInstall(lib)}
                            disabled={installing}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-60 transition-opacity"
                          >
                            {installing ? (
                              <div className="w-3 h-3 border border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                              <Download className="w-3 h-3" />
                            )}
                            {installing ? "Installing..." : "Install"}
                          </button>
                        ) : (
                          <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs text-green-400 border border-green-400/30 rounded-md">
                            <CheckCircle className="w-3 h-3" />
                            Installed
                          </div>
                        )}
                        <button
                          onClick={() => onInsertExample(lib.example)}
                          className="flex items-center gap-1 py-1.5 px-2 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                        >
                          Insert Example
                        </button>
                        <a
                          href={lib.docs}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
