export interface PyodideOutput {
  type: "stdout" | "stderr" | "result" | "error" | "info";
  text: string;
}

export interface TurtleCommand {
  type: "line" | "dot" | "text" | "bgcolor" | "clear";
  x1?: number; y1?: number; x2?: number; y2?: number;
  x?: number; y?: number;
  color?: string;
  width?: number;
  size?: number;
  text?: string;
  font_size?: number;
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
    _pyStdout: (type: string, text: string) => void;
    _pyPlotImage: (dataUrl: string) => void;
  }
}

// The mock turtle module source code — careful: no ${} inside the Python string below
const TURTLE_SETUP = `
import sys, math, types, json as _json

class _MockTurtle:
    def __init__(self):
        self.x = 0.0
        self.y = 0.0
        self.angle = 90.0
        self.pendown_state = True
        self.pencolor_val = 'white'
        self.pensize_val = 1
        self.fillcolor_val = 'white'
        self.bgcolor_val = 'black'
        self.commands = []
        self.speed_val = 0
        self.visible = True

    def _draw_to(self, nx, ny):
        if self.pendown_state:
            self.commands.append({'type': 'line', 'x1': self.x, 'y1': -self.y, 'x2': nx, 'y2': -ny, 'color': self.pencolor_val, 'width': self.pensize_val})
        self.x = nx
        self.y = ny

    def forward(self, distance):
        rad = math.radians(self.angle)
        self._draw_to(self.x + distance * math.cos(rad), self.y + distance * math.sin(rad))
    def fd(self, d): self.forward(d)
    def backward(self, distance): self.forward(-distance)
    def back(self, d): self.backward(d)
    def bk(self, d): self.backward(d)
    def right(self, angle): self.angle -= angle
    def rt(self, a): self.right(a)
    def left(self, angle): self.angle += angle
    def lt(self, a): self.left(a)

    def goto(self, x, y=None):
        if hasattr(x, '__iter__') and y is None:
            x, y = x
        self._draw_to(float(x), float(y))
    def setpos(self, x, y=None): self.goto(x, y)
    def setposition(self, x, y=None): self.goto(x, y)
    def setx(self, x): self.goto(x, self.y)
    def sety(self, y): self.goto(self.x, y)

    def penup(self): self.pendown_state = False
    def pu(self): self.penup()
    def up(self): self.penup()
    def pendown(self): self.pendown_state = True
    def pd(self): self.pendown()
    def down(self): self.pendown()

    def pencolor(self, *args):
        if len(args) == 1:
            self.pencolor_val = args[0]
        elif len(args) == 3:
            r, g, b = [int(v * 255) if isinstance(v, float) and v <= 1.0 else int(v) for v in args]
            self.pencolor_val = 'rgb(' + str(r) + ',' + str(g) + ',' + str(b) + ')'
    def fillcolor(self, *args):
        if len(args) == 1:
            self.fillcolor_val = args[0]
    def color(self, *args):
        if len(args) == 1:
            self.pencolor(*args); self.fillcolor(*args)
        elif len(args) == 2:
            self.pencolor(args[0]); self.fillcolor(args[1])
        else:
            self.pencolor(*args)

    def bgcolor(self, color):
        self.bgcolor_val = color
        self.commands = [c for c in self.commands if c.get('type') != 'bgcolor']
        self.commands.insert(0, {'type': 'bgcolor', 'color': color})

    def speed(self, s): self.speed_val = s
    def pensize(self, w): self.pensize_val = w
    def width(self, w): self.pensize(w)
    def setheading(self, angle): self.angle = angle
    def seth(self, a): self.setheading(a)

    def home(self):
        self._draw_to(0.0, 0.0)
        self.angle = 90.0

    def circle(self, radius, extent=360, steps=None):
        if steps is None:
            steps = max(int(abs(radius) * abs(extent) / 360.0 * 8), 8)
        if steps == 0: return
        step_angle = extent / steps
        step_len = 2 * math.pi * abs(radius) * abs(extent) / 360.0 / steps
        sign = 1 if radius >= 0 else -1
        self.left(sign * 90)
        for _ in range(steps):
            self.forward(step_len)
            if radius >= 0:
                self.right(step_angle)
            else:
                self.left(step_angle)
        self.left(sign * 90)

    def dot(self, size=None, *color):
        s = size if size else max(self.pensize_val + 4, 5)
        c = color[0] if color else self.pencolor_val
        self.commands.append({'type': 'dot', 'x': self.x, 'y': -self.y, 'size': s, 'color': c})

    def stamp(self):
        self.commands.append({'type': 'dot', 'x': self.x, 'y': -self.y, 'size': self.pensize_val + 4, 'color': self.pencolor_val})

    def write(self, text, move=False, align='left', font=('Arial', 8, 'normal')):
        fs = font[1] if isinstance(font, (list, tuple)) and len(font) > 1 else 8
        self.commands.append({'type': 'text', 'x': self.x, 'y': -self.y, 'text': str(text), 'color': self.pencolor_val, 'font_size': fs})

    def clear(self):
        self.commands.append({'type': 'clear'})

    def reset(self):
        self.x = 0.0; self.y = 0.0; self.angle = 90.0; self.pendown_state = True
        self.commands.append({'type': 'clear'})

    def xcor(self): return self.x
    def ycor(self): return self.y
    def pos(self): return (self.x, self.y)
    def position(self): return self.pos()
    def heading(self): return self.angle
    def isdown(self): return self.pendown_state
    def isvisible(self): return self.visible
    def hideturtle(self): self.visible = False
    def ht(self): self.hideturtle()
    def showturtle(self): self.visible = True
    def st(self): self.showturtle()
    def tracer(self, *a): pass
    def update(self): pass
    def done(self): pass
    def exitonclick(self): pass
    def mainloop(self): pass
    def bye(self): pass
    def title(self, t): pass
    def setup(self, *a, **kw): pass
    def screensize(self, *a, **kw): pass
    def mode(self, m=None): return 'standard'
    def begin_fill(self): pass
    def end_fill(self): pass
    def numinput(self, title, prompt, default=None, minval=None, maxval=None): return default
    def textinput(self, title, prompt): return ''

    def getcommands(self):
        return _json.dumps(self.commands)

_turtle_inst = _MockTurtle()
_turtle_mod = types.ModuleType('turtle')

for _nm in [n for n in dir(_MockTurtle) if not n.startswith('_')]:
    setattr(_turtle_mod, _nm, getattr(_turtle_inst, _nm))

_turtle_mod.Turtle = lambda: _turtle_inst
_turtle_mod.Screen = lambda: _turtle_inst
_turtle_mod._instance = _turtle_inst
sys.modules['turtle'] = _turtle_mod
`;

// Reset turtle state before each run
const TURTLE_RESET = `
import sys
_tm = sys.modules.get('turtle')
if _tm and hasattr(_tm, '_instance'):
    inst = _tm._instance
    inst.x = 0.0
    inst.y = 0.0
    inst.angle = 90.0
    inst.pendown_state = True
    inst.pencolor_val = 'black'
    inst.pensize_val = 1
    inst.fillcolor_val = 'black'
    inst.bgcolor_val = 'white'
    inst.commands = []
    inst.speed_val = 0
    inst.visible = True
`;

// Get turtle commands JSON after run
const TURTLE_GET_COMMANDS = `
import sys
_tm = sys.modules.get('turtle')
_turtle_cmds_json = ''
if _tm and hasattr(_tm, '_instance'):
    _turtle_cmds_json = _tm._instance.getcommands()
_turtle_cmds_json
`;

// Matplotlib setup — intercept plt.show() to capture image as base64 and send to JS
const MATPLOTLIB_SETUP = `
import sys
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as _plt_orig
    import io as _io_plt
    import base64 as _b64_plt
    import js as _js_plt

    _orig_show = _plt_orig.show

    def _intercept_show(*args, **kwargs):
        figs = [_plt_orig.figure(i) for i in _plt_orig.get_fignums()]
        for fig in figs:
            buf = _io_plt.BytesIO()
            fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
            buf.seek(0)
            b64 = _b64_plt.b64encode(buf.read()).decode()
            _js_plt.window._pyPlotImage('data:image/png;base64,' + b64)
            buf.close()
        _plt_orig.close('all')

    _plt_orig.show = _intercept_show
except Exception:
    pass
`;

export async function loadPyodideScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("pyodide-script")) { resolve(); return; }
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

    // Set up stdout/stderr capture
    await pyodide.runPythonAsync(`
import sys, io, js

class _OutputCapture(io.StringIO):
    def __init__(self, stream_type):
        super().__init__()
        self._stream_type = stream_type
    def write(self, text):
        if text:
            js.window._pyStdout(self._stream_type, text)
        return len(text)
    def flush(self): pass

sys.stdout = _OutputCapture('stdout')
sys.stderr = _OutputCapture('stderr')
`);

    // Install turtle mock
    await pyodide.runPythonAsync(TURTLE_SETUP);

    // Set up matplotlib capture
    try {
      await pyodide.runPythonAsync(MATPLOTLIB_SETUP);
    } catch { /* matplotlib not available yet */ }

    pyodideInstance = pyodide;
    onOutput?.({ type: "info", text: "Python 3.11 runtime ready." });
    return pyodide;
  })();

  return loadingPromise;
}

export async function runCodeAndGetTurtle(
  pyodide: PyodideInstance,
  code: string
): Promise<{ turtleCommands: TurtleCommand[] | null; hasTurtle: boolean }> {
  // Check if code uses turtle
  const hasTurtle = /\bimport\s+turtle\b|from\s+turtle\b/.test(code);

  if (hasTurtle) {
    // Reset turtle state before run
    await pyodide.runPythonAsync(TURTLE_RESET);
  }

  await pyodide.runPythonAsync(code);

  if (hasTurtle) {
    const json = await pyodide.runPythonAsync(TURTLE_GET_COMMANDS) as string;
    try {
      return { turtleCommands: JSON.parse(json), hasTurtle: true };
    } catch {
      return { turtleCommands: [], hasTurtle: true };
    }
  }
  return { turtleCommands: null, hasTurtle: false };
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
    // Re-apply matplotlib setup in case it was just installed
    if (packageName === "matplotlib") {
      try { await pyodide.runPythonAsync(MATPLOTLIB_SETUP); } catch { /* ignore */ }
    }
    onOutput({ type: "info", text: `Successfully installed ${packageName}` });
    return true;
  } catch (err: unknown) {
    onOutput({ type: "error", text: `Failed to install ${packageName}: ${(err as Error).message}` });
    return false;
  }
}
