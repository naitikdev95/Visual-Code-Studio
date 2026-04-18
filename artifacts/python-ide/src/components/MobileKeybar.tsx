import { useEffect, useState, useRef } from "react";
import { EditorView } from "@codemirror/view";

const PYTHON_KEYS = [
  { label: "Tab", value: "    ", display: "⇥" },
  { label: ":", value: ":", display: ":" },
  { label: "=", value: "=", display: "=" },
  { label: "==", value: "==", display: "==" },
  { label: "!=", value: "!=", display: "!=" },
  { label: "(", value: "(", display: "(" },
  { label: ")", value: ")", display: ")" },
  { label: "[", value: "[", display: "[" },
  { label: "]", value: "]", display: "]" },
  { label: "{", value: "{", display: "{" },
  { label: "}", value: "}", display: "}" },
  { label: "'", value: "'", display: "'" },
  { label: '"', value: '"', display: '"' },
  { label: "#", value: "# ", display: "#" },
  { label: ",", value: ", ", display: "," },
  { label: ".", value: ".", display: "." },
  { label: "+", value: "+", display: "+" },
  { label: "-", value: "-", display: "-" },
  { label: "*", value: "*", display: "*" },
  { label: "**", value: "**", display: "**" },
  { label: "/", value: "/", display: "/" },
  { label: "//", value: "//", display: "//" },
  { label: "%", value: "%", display: "%" },
  { label: "<", value: "<", display: "<" },
  { label: ">", value: ">", display: ">" },
  { label: "<=", value: "<=", display: "<=" },
  { label: ">=", value: ">=", display: ">=" },
  { label: "not", value: "not ", display: "not" },
  { label: "and", value: " and ", display: "and" },
  { label: "or", value: " or ", display: "or" },
  { label: "in", value: " in ", display: "in" },
  { label: "is", value: " is ", display: "is" },
  { label: "→", value: "->", display: "->" },
  { label: "_", value: "_", display: "_" },
  { label: "\\n", value: "\\n", display: "\\n" },
  { label: "f''", value: "f''", display: "f''" },
  { label: "f\"\"", value: 'f""', display: 'f""' },
];

interface MobileKeybarProps {
  editorViewRef: React.MutableRefObject<EditorView | null>;
}

export function MobileKeybar({ editorViewRef }: MobileKeybarProps) {
  const [visible, setVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleViewportChange = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;

      const windowHeight = window.screen.height;
      const viewportHeight = viewport.height;
      const heightDiff = windowHeight - viewportHeight;

      if (heightDiff > 150) {
        setVisible(true);
        setKeyboardHeight(heightDiff);
      } else {
        setVisible(false);
        setKeyboardHeight(0);
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".cm-editor")) {
        if (window.visualViewport) {
          window.visualViewport.addEventListener("resize", handleViewportChange);
          window.visualViewport.addEventListener("scroll", handleViewportChange);
          handleViewportChange();
        }
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.relatedTarget as HTMLElement | null;
      if (!target || !target.closest(".cm-editor")) {
        setVisible(false);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener("resize", handleViewportChange);
          window.visualViewport.removeEventListener("scroll", handleViewportChange);
        }
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportChange);
        window.visualViewport.removeEventListener("scroll", handleViewportChange);
      }
    };
  }, []);

  const insertText = (text: string) => {
    const view = editorViewRef.current;
    if (!view) return;

    view.dispatch(
      view.state.update({
        changes: view.state.selection.ranges.map((range) => ({
          from: range.from,
          to: range.to,
          insert: text,
        })),
        selection: {
          anchor: view.state.selection.main.from + text.length,
        },
      })
    );
    view.focus();
  };

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      className="fixed left-0 right-0 z-50 bg-sidebar border-t border-border shadow-lg"
      style={{
        bottom: keyboardHeight > 0 ? keyboardHeight : 0,
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onTouchStart={(e) => e.stopPropagation()}
      >
        {PYTHON_KEYS.map((key) => (
          <button
            key={key.label}
            onPointerDown={(e) => {
              e.preventDefault();
              insertText(key.value);
            }}
            className="shrink-0 min-w-[36px] h-8 px-2 text-xs font-mono rounded border border-border bg-card text-foreground hover:bg-accent active:scale-95 transition-transform select-none touch-manipulation"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {key.display}
          </button>
        ))}
      </div>
    </div>
  );
}
