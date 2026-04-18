import { useEffect, useRef, useState } from "react";
import { Monitor, RefreshCw, Image } from "lucide-react";

interface PreviewPanelProps {
  previewContent: string;
  isRunning: boolean;
}

export function PreviewPanel({ previewContent, isRunning }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"canvas" | "image">("image");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!previewContent) return;

    if (previewContent.startsWith("data:image") || previewContent.startsWith("blob:") || previewContent.startsWith("http")) {
      setImageUrl(previewContent);
      setMode("image");
    }
  }, [previewContent]);

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Visual Preview</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setMode("canvas")}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              mode === "canvas"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Canvas
          </button>
          <button
            onClick={() => setMode("image")}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              mode === "image"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Image
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-4 relative">
        {isRunning && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running...</span>
            </div>
          </div>
        )}

        {mode === "canvas" && (
          <div className="w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              id="pyodide-canvas"
              width={400}
              height={300}
              className="border border-border rounded-md bg-white shadow-sm"
            />
          </div>
        )}

        {mode === "image" && (
          <div className="w-full h-full flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Python output"
                className="max-w-full max-h-full object-contain rounded-md shadow-md border border-border"
              />
            ) : (
              <div className="text-center text-muted-foreground select-none">
                <Image className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No visual output yet</p>
                <p className="text-xs mt-1 opacity-60">
                  Use matplotlib or PIL to generate images
                </p>
                <div className="mt-4 text-xs text-left bg-muted/50 rounded-md p-3 max-w-xs mx-auto font-mono">
                  <p className="text-muted-foreground mb-1">Example:</p>
                  <p className="text-foreground/80">import matplotlib.pyplot as plt</p>
                  <p className="text-foreground/80">import numpy as np</p>
                  <p className="text-foreground/80">x = np.linspace(0, 6, 100)</p>
                  <p className="text-foreground/80">plt.plot(x, np.sin(x))</p>
                  <p className="text-foreground/80">plt.show()</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
