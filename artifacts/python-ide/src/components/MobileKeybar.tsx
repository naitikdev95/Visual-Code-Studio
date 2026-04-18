import { useEffect, useState, useRef } from "react";
import { EditorView } from "@codemirror/view";

const PYTHON_KEYS = [
  { label: "⇥", value: "    " },
  { label: ":", value: ":" },
  { label: "=", value: "=" },
  { label: "==", value: "==" },
  { label: "!=", value: "!=" },
  { label: "(", value: "(" },
  { label: ")", value: ")" },
  { label: "[", value: "[" },
  { label: "]", value: "]" },
  { label: "{", value: "{" },
  { label: "}", value: "}" },
  { label: "'", value: "'" },
  { label: '"', value: '"' },
  { label: "#", value: "# " },
  { label: ",", value: ", " },
  { label: ".", value: "." },
  { label: "+", value: "+" },
  { label: "-", value: "-" },
  { label: "*", value: "*" },
  { label: "**", value: "**" },
  { label: "/", value: "/" },
  { label: "//", value: "//" },
  { label: "%", value: "%" },
  { label: "<", value: "<" },
  { label: ">", value: ">" },
  { label: "<=", value: "<=" },
  { label: ">=", value: ">=" },
  { label: "not", value: "not " },
  { label: "and", value: " and " },
  { label: "or", value: " or " },
  { label: "in", value: " in " },
  { label: "is", value: " is " },
  { label: "->", value: "->" },
  { label: "_", value: "_" },
  { label: "\\n", value: "\\n" },
  { label: "f''", value: "f''" },
];

const isTouchDevice =
  typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

interface MobileKeybarProps {
  editorViewRef: React.MutableRefObject<EditorView | null>;
}

export function MobileKeybar({ editorViewRef }: MobileKeybarProps) {
  const [bottomOffset, setBottomOffset] = useState(0);
  const initialHeightRef = useRef<number>(
    typeof window !== "undefined" ? window.innerHeight : 0
  );

  useEffect(() => {
    if (!isTouchDevice) return;

    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // Distance from the bottom of visual viewport to bottom of layout viewport
      const offsetTop = vv.offsetTop ?? 0;
      const keyboardHeight = Math.max(
        0,
        initialHeightRef.current - (vv.height + offsetTop)
      );
      setBottomOffset(keyboardHeight);
    };

    // Capture the initial full height once (before any keyboard)
    const handleFirstFocus = () => {
      initialHeightRef.current = window.innerHeight;
    };

    window.addEventListener("focusin", handleFirstFocus, { once: true });
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    update();

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  if (!isTouchDevice) return null;

  const insertText = (text: string) => {
    const view = editorViewRef.current;
    if (!view) return;

    const { state } = view;
    const changes = state.selection.ranges.map((range) => ({
      from: range.from,
      to: range.to,
      insert: text,
    }));

    view.dispatch(
      state.update({
        changes,
        selection: {
          anchor: state.selection.main.from + text.length,
        },
      })
    );
    view.focus();
  };

  return (
    <div
      className="fixed left-0 right-0 z-[9999]"
      style={{ bottom: bottomOffset }}
    >
      <div className="flex items-center bg-sidebar border-t-2 border-primary/40 shadow-2xl">
        {/* Drag indicator */}
        <div className="shrink-0 w-0.5 self-stretch bg-primary/20 mx-1" />
        <div
          className="flex items-center gap-1 px-2 py-2 overflow-x-auto flex-1"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {PYTHON_KEYS.map((key) => (
            <button
              key={key.label}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                insertText(key.value);
              }}
              className="shrink-0 h-9 min-w-[38px] px-2.5 text-sm font-mono rounded-md border border-border bg-card text-foreground active:bg-primary active:text-primary-foreground active:scale-95 transition-all select-none"
              style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
