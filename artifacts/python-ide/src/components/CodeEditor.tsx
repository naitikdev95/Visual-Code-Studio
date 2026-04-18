import { useRef } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { EditorView } from "@codemirror/view";

const PYTHON_COMPLETIONS = [
  "False", "None", "True", "and", "as", "assert", "async", "await",
  "break", "class", "continue", "def", "del", "elif", "else", "except",
  "finally", "for", "from", "global", "if", "import", "in", "is",
  "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try",
  "while", "with", "yield",
  "abs", "all", "any", "bin", "bool", "bytes", "callable", "chr",
  "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate",
  "eval", "exec", "filter", "float", "format", "frozenset", "getattr",
  "globals", "hasattr", "hash", "help", "hex", "id", "input", "int",
  "isinstance", "issubclass", "iter", "len", "list", "locals", "map",
  "max", "memoryview", "min", "next", "object", "oct", "open", "ord",
  "pow", "print", "property", "range", "repr", "reversed", "round",
  "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum",
  "super", "tuple", "type", "vars", "zip",
  "self", "__init__", "__str__", "__repr__", "__len__", "__iter__",
  "append", "extend", "insert", "remove", "pop", "sort", "reverse",
  "keys", "values", "items", "get", "update", "split", "join", "strip",
  "lower", "upper", "replace", "find", "count", "startswith", "endswith",
];

const KEYWORDS = new Set([
  "False","None","True","and","as","assert","async","await","break","class",
  "continue","def","del","elif","else","except","finally","for","from",
  "global","if","import","in","is","lambda","nonlocal","not","or","pass",
  "raise","return","try","while","with","yield",
]);

function pythonCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const options = PYTHON_COMPLETIONS
    .filter((kw) => kw.startsWith(word.text))
    .map((kw) => ({
      label: kw,
      type: KEYWORDS.has(kw) ? "keyword" : kw.startsWith("__") ? "method" : "function",
    }));

  return { from: word.from, options };
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  theme: string;
  editorViewRef: React.MutableRefObject<EditorView | null>;
}

export function CodeEditor({ value, onChange, onRun, theme, editorViewRef }: CodeEditorProps) {
  const extensions = [
    python(),
    autocompletion({ override: [pythonCompletions] }),
    keymap.of([
      ...defaultKeymap,
      indentWithTab,
      {
        key: "Mod-Enter",
        run: () => {
          onRun?.();
          return true;
        },
      },
    ]),
    EditorView.lineWrapping,
  ];

  const editorTheme = theme === "light" ? [] : [oneDark];

  return (
    <div className="h-full w-full overflow-hidden">
      <ReactCodeMirror
        value={value}
        height="100%"
        extensions={[...extensions, ...editorTheme]}
        onChange={onChange}
        theme={theme === "light" ? "light" : "dark"}
        style={{ height: "100%", fontSize: "13px" }}
        onCreateEditor={(view) => {
          editorViewRef.current = view;
        }}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    </div>
  );
}
