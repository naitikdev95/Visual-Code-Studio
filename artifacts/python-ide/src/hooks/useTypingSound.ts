import { useRef, useCallback } from "react";

function noiseClick(ctx: AudioContext, durationSec: number, volume: number, decay: number) {
  const size = Math.floor(ctx.sampleRate * durationSec);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (size * decay));
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

function toneClick(ctx: AudioContext, freq: number, durationSec: number, volume: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + durationSec);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + durationSec);
}

export function useTypingSound(enabled: boolean, volume: number) {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastKeyRef = useRef<number>(0);
  const enabledRef = useRef(enabled);
  const volumeRef = useRef(volume);

  enabledRef.current = enabled;
  volumeRef.current = volume;

  const play = useCallback((key: string) => {
    if (!enabledRef.current) return;

    const now = Date.now();
    if (now - lastKeyRef.current < 25) return;
    lastKeyRef.current = now;

    try {
      // Create AudioContext lazily inside user gesture (keydown = user gesture)
      if (!ctxRef.current || ctxRef.current.state === "closed") {
        ctxRef.current = new AudioContext();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
        return; // Skip this keystroke — next one will work after resume
      }

      const v = Math.max(0, Math.min(1, volumeRef.current));

      if (key === "Enter") {
        toneClick(ctx, 380, 0.07, v * 0.18);
        noiseClick(ctx, 0.03, v * 0.25, 0.1);
      } else if (key === " ") {
        noiseClick(ctx, 0.05, v * 0.4, 0.2);
      } else if (key === "Backspace" || key === "Delete") {
        noiseClick(ctx, 0.02, v * 0.22, 0.06);
      } else if (key === "Tab") {
        toneClick(ctx, 500, 0.04, v * 0.1);
      } else if (key.length === 1) {
        noiseClick(ctx, 0.022, v * 0.32, 0.08);
      }
    } catch {
      // AudioContext not available in this browser
    }
  }, []); // stable — reads from refs

  return play;
}
