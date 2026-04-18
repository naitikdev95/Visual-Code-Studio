import { useState, useCallback } from "react";

export interface FileItem {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "python-ide-files-v2";

const DEFAULT_CONTENT = `# Welcome to Python IDE!
# Press Ctrl+Enter or click Run to execute.

print("Hello, Python IDE!")

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
total = sum(numbers)
average = total / len(numbers)

print(f"\\nNumbers: {numbers}")
print(f"Sum: {total}")
print(f"Average: {average}")

squares = [x**2 for x in range(1, 6)]
print(f"\\nSquares: {squares}")
`;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function loadFiles(): FileItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [
    {
      id: "main",
      name: "main.py",
      content: DEFAULT_CONTENT,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
}

function persist(files: FileItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch {}
}

export function useFileSystem() {
  const [files, setFiles] = useState<FileItem[]>(loadFiles);
  const [activeFileId, setActiveFileId] = useState<string>(() => {
    const loaded = loadFiles();
    return loaded[0]?.id ?? "main";
  });

  const commit = useCallback((next: FileItem[]) => {
    setFiles(next);
    persist(next);
  }, []);

  const newFile = useCallback(() => {
    const untitled = files.filter((f) => f.name.startsWith("untitled")).length;
    const name = untitled === 0 ? "untitled.py" : `untitled_${untitled + 1}.py`;
    const file: FileItem = {
      id: generateId(),
      name,
      content: "# New file\n",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    commit([...files, file]);
    setActiveFileId(file.id);
    return file;
  }, [files, commit]);

  const deleteFile = useCallback(
    (id: string) => {
      let next = files.filter((f) => f.id !== id);
      if (next.length === 0) {
        next = [
          {
            id: generateId(),
            name: "main.py",
            content: "# New file\n",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ];
      }
      commit(next);
      if (activeFileId === id) setActiveFileId(next[0].id);
    },
    [files, activeFileId, commit]
  );

  const renameFile = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const finalName = trimmed.endsWith(".py") ? trimmed : `${trimmed}.py`;
      commit(
        files.map((f) =>
          f.id === id ? { ...f, name: finalName, updatedAt: Date.now() } : f
        )
      );
    },
    [files, commit]
  );

  const duplicateFile = useCallback(
    (id: string) => {
      const file = files.find((f) => f.id === id);
      if (!file) return;
      const base = file.name.replace(/\.py$/, "");
      const dupe: FileItem = {
        id: generateId(),
        name: `${base}_copy.py`,
        content: file.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const idx = files.findIndex((f) => f.id === id);
      const next = [...files];
      next.splice(idx + 1, 0, dupe);
      commit(next);
      setActiveFileId(dupe.id);
    },
    [files, commit]
  );

  const updateFileContent = useCallback(
    (id: string, content: string) => {
      commit(
        files.map((f) =>
          f.id === id ? { ...f, content, updatedAt: Date.now() } : f
        )
      );
    },
    [files, commit]
  );

  const importFile = useCallback(
    (file: File): Promise<FileItem> =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = (e.target?.result as string) ?? "";
          const item: FileItem = {
            id: generateId(),
            name: file.name,
            content,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          commit([...files, item]);
          setActiveFileId(item.id);
          resolve(item);
        };
        reader.readAsText(file);
      }),
    [files, commit]
  );

  const exportFile = useCallback(
    (id: string) => {
      const file = files.find((f) => f.id === id);
      if (!file) return;
      const blob = new Blob([file.content], { type: "text/x-python" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [files]
  );

  const activeFile = files.find((f) => f.id === activeFileId) ?? files[0];

  return {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    newFile,
    deleteFile,
    renameFile,
    duplicateFile,
    updateFileContent,
    importFile,
    exportFile,
  };
}
