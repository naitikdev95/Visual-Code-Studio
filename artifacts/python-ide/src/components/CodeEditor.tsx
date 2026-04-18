import ReactCodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { keymap, EditorView } from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";

const PYTHON_COMPLETIONS = [
  "False","None","True","and","as","assert","async","await","break","class",
  "continue","def","del","elif","else","except","finally","for","from",
  "global","if","import","in","is","lambda","nonlocal","not","or","pass",
  "raise","return","try","while","with","yield",
  "abs","all","any","bin","bool","bytes","callable","chr","compile","complex",
  "delattr","dict","dir","divmod","enumerate","eval","exec","filter","float",
  "format","frozenset","getattr","globals","hasattr","hash","help","hex","id",
  "input","int","isinstance","issubclass","iter","len","list","locals","map",
  "max","memoryview","min","next","object","oct","open","ord","pow","print",
  "property","range","repr","reversed","round","set","setattr","slice",
  "sorted","staticmethod","str","sum","super","tuple","type","vars","zip",
  "self","__init__","__str__","__repr__","__len__","__iter__","__next__",
  "__enter__","__exit__","__name__","__main__",
  "append","extend","insert","remove","pop","sort","reverse","clear","copy",
  "keys","values","items","get","update","setdefault","split","join","strip",
  "lstrip","rstrip","lower","upper","title","replace","find","count",
  "startswith","endswith","format","encode","decode","read","write","close",
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
  const options = PYTHON_COMPLETIONS.filter((kw) => kw.startsWith(word.text)).map((kw) => ({
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
  fontSize: number;
  wordWrap: boolean;
  editorViewRef: React.MutableRefObject<EditorView | null>;
  onKeyDown?: (key: string) => void;
}

export function CodeEditor({
  value,
  onChange,
  onRun,
  theme,
  fontSize,
  wordWrap,
  editorViewRef,
  onKeyDown,
}: CodeEditorProps) {
  const extensions = [
    python(),
    autocompletion({ override: [pythonCompletions] }),
    keymap.of([
      ...defaultKeymap,
      indentWithTab,
      { key: "Mod-Enter", run: () => { onRun?.(); return true; } },
    ]),
    ...(wordWrap ? [EditorView.lineWrapping] : []),
    EditorView.domEventHandlers({
      keydown(e) {
        onKeyDown?.(e.key);
        return false;
      },
    }),
  ];

  return (
    <div className="h-full w-full overflow-hidden">
      <ReactCodeMirror
        value={value}
        height="100%"
        extensions={[...extensions, ...(theme !== "light" ? [oneDark] : [])]}
        onChange={onChange}
        theme={theme === "light" ? "light" : "dark"}
        style={{ height: "100%", fontSize: `${fontSize}px` }}
        onCreateEditor={(view) => { editorViewRef.current = view; }}
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
