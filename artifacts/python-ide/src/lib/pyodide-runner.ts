export interface PyodideOutput {
  type: "stdout" | "stderr" | "result" | "error" | "info";
  text: string;
}

export interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (packages: string | string[]) => Promise<void>;
  globals: { get: (key: string) => unknown; set: (key: string, value: unknown) => void };
}

let pyodideInstance: PyodideInstance | null = null;
let loadingPromise: Promise<PyodideInstance> | null = null;

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInstance>;
  }
}

export async function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("pyodide-script")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "pyodide-script";
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function getPyodide(onOutput?: (msg: PyodideOutput) => void): Promise<PyodideInstance> {
  if (pyodideInstance) return pyodideInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    await loadPyodideScript();
    onOutput?.({ type: "info", text: "Loading Python runtime..." });
    const pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
    });

    pyodide.globals.set("__output_lines__", []);

    await pyodide.runPythonAsync(`
import sys
import io
import js

class _OutputCapture(io.StringIO):
    def __init__(self, stream_type):
        super().__init__()
        self._stream_type = stream_type

    def write(self, text):
        if text:
            js.window._pyStdout(self._stream_type, text)
        return len(text)

    def flush(self):
        pass

sys.stdout = _OutputCapture('stdout')
sys.stderr = _OutputCapture('stderr')
`);

    pyodideInstance = pyodide;
    onOutput?.({ type: "info", text: "Python 3.11 runtime ready." });
    return pyodide;
  })();

  return loadingPromise;
}

export async function runPythonCode(
  code: string,
  onOutput: (msg: PyodideOutput) => void,
  installedPackages: Set<string>
): Promise<void> {
  const pyodide = await getPyodide(onOutput);

  (window as Window & typeof globalThis)._pyStdout = (type: string, text: string) => {
    if (text.trim() || text.includes("\n")) {
      onOutput({ type: type as "stdout" | "stderr", text: text.replace(/\n$/, "") });
    }
  };

  try {
    const importLines = Array.from(installedPackages)
      .map((pkg) => `import micropip; await micropip.install('${pkg}')`)
      .join("\n");

    const fullCode = importLines ? `import micropip\nawait micropip.install([${Array.from(installedPackages).map(p => `'${p}'`).join(",")}])\n${code}` : code;

    const result = await pyodide.runPythonAsync(code);
    if (result !== undefined && result !== null) {
      onOutput({ type: "result", text: String(result) });
    }
  } catch (err: unknown) {
    const error = err as Error;
    onOutput({ type: "error", text: error.message || String(err) });
  }
}

export async function installPackage(
  packageName: string,
  onOutput: (msg: PyodideOutput) => void
): Promise<boolean> {
  try {
    const pyodide = await getPyodide(onOutput);
    onOutput({ type: "info", text: `Installing ${packageName}...` });
    await pyodide.loadPackage("micropip");
    await pyodide.runPythonAsync(`
import micropip
await micropip.install('${packageName}')
    `);
    onOutput({ type: "info", text: `Successfully installed ${packageName}` });
    return true;
  } catch (err: unknown) {
    const error = err as Error;
    onOutput({ type: "error", text: `Failed to install ${packageName}: ${error.message}` });
    return false;
  }
}
