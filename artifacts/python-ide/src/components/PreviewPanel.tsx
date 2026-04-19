import { useEffect, useRef, useState } from "react";
import { Monitor, RefreshCw, Image as ImageIcon, Download } from "lucide-react";
import { TurtleCommand } from "../lib/pyodide-runner";

interface PreviewPanelProps {
  previewContent: string;      // base64 data URL for matplotlib
  turtleCommands: TurtleCommand[] | null;
  isRunning: boolean;
}

function renderTurtleOnCanvas(
  canvas: HTMLCanvasElement,
  commands: TurtleCommand[]
) {
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#1e1e2e";
  ctx.fillRect(0, 0, W, H);

  for (const cmd of commands) {
    if (cmd.type === "bgcolor") {
      ctx.fillStyle = cmd.color ?? "#000";
      ctx.fillRect(0, 0, W, H);
    } else if (cmd.type === "clear") {
      ctx.fillStyle = "#1e1e2e";
      ctx.fillRect(0, 0, W, H);
    } else if (cmd.type === "line") {
      ctx.beginPath();
      ctx.strokeStyle = cmd.color ?? "#fff";
      ctx.lineWidth = cmd.width ?? 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(cx + (cmd.x1 ?? 0), cy + (cmd.y1 ?? 0));
      ctx.lineTo(cx + (cmd.x2 ?? 0), cy + (cmd.y2 ?? 0));
      ctx.stroke();
    } else if (cmd.type === "dot") {
      ctx.beginPath();
      ctx.fillStyle = cmd.color ?? "#fff";
      ctx.arc(cx + (cmd.x ?? 0), cy + (cmd.y ?? 0), (cmd.size ?? 5) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (cmd.type === "text") {
      ctx.fillStyle = cmd.color ?? "#fff";
      ctx.font = `${cmd.font_size ?? 12}px sans-serif`;
      ctx.fillText(cmd.text ?? "", cx + (cmd.x ?? 0), cy + (cmd.y ?? 0));
    }
  }
}

export function PreviewPanel({ previewContent, turtleCommands, isRunning }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"auto" | "image" | "turtle">("auto");
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  // Detect what to show automatically
  useEffect(() => {
    if (turtleCommands && turtleCommands.length > 0) {
      setMode("turtle");
    } else if (previewContent) {
      setMode("image");
      setImgSrc(previewContent);
    }
  }, [turtleCommands, previewContent]);

  // Render turtle whenever commands change
  useEffect(() => {
    if (turtleCommands && turtleCommands.length > 0 && canvasRef.current) {
      renderTurtleOnCanvas(canvasRef.current, turtleCommands);
    }
  }, [turtleCommands]);

  const activeMode = mode === "auto"
    ? (turtleCommands && turtleCommands.length > 0 ? "turtle" : "image")
    : mode;

  const downloadCanvas = () => {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "turtle-drawing.png";
    a.click();
  };

  const downloadImage = () => {
    if (!imgSrc) return;
    const a = document.createElement("a");
    a.href = imgSrc;
    a.download = "plot.png";
    a.click();
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preview</span>
        </div>
        <div className="flex items-center gap-1.5">
          {activeMode === "turtle" && turtleCommands && (
            <button
              onClick={downloadCanvas}
              title="Download PNG"
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="w-3 h-3" />
            </button>
          )}
          {activeMode === "image" && imgSrc && (
            <button
              onClick={downloadImage}
              title="Download PNG"
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => setMode("turtle")}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              activeMode === "turtle"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            🐢 Turtle
          </button>
          <button
            onClick={() => setMode("image")}
            className={`px-2 py-0.5 text-xs rounded border transition-colors ${
              activeMode === "image"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            📊 Plot
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-3 relative bg-[#1e1e2e]">
        {isRunning && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Running...</span>
            </div>
          </div>
        )}

        {/* Turtle canvas — always mounted so it persists */}
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className={`rounded shadow-lg border border-border/30 ${activeMode === "turtle" ? "block" : "hidden"}`}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />

        {activeMode === "image" && (
          <div className="w-full h-full flex items-center justify-center">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt="Python plot output"
                className="max-w-full max-h-full object-contain rounded shadow-md border border-border"
              />
            ) : (
              <div className="text-center text-muted-foreground select-none">
                <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No visual output yet</p>
                <p className="text-xs mt-1 opacity-60 mb-4">Use matplotlib, PIL, or turtle to generate visuals</p>
                <div className="text-xs text-left bg-muted/30 rounded-md p-3 max-w-xs mx-auto font-mono border border-border/30">
                  <p className="text-muted-foreground mb-1 font-sans">Matplotlib example:</p>
                  <p className="text-foreground/70">import matplotlib.pyplot as plt</p>
                  <p className="text-foreground/70">import numpy as np</p>
                  <p className="text-foreground/70">x = np.linspace(0, 6, 100)</p>
                  <p className="text-foreground/70">plt.plot(x, np.sin(x))</p>
                  <p className="text-foreground/70">plt.show()</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
