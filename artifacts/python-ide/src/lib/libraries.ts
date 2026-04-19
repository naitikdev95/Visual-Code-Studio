export interface Library {
  id: string;
  name: string;
  pyodideName: string;
  description: string;
  category: "data" | "visualization" | "ml" | "games" | "math" | "web" | "utils" | "scraping" | "nlp";
  icon: string;
  docs: string;
  example: string;
  browserUnsupported?: boolean;
}

export const LIBRARY_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "data", label: "Data" },
  { id: "visualization", label: "Visualization" },
  { id: "ml", label: "ML / AI" },
  { id: "math", label: "Math" },
  { id: "nlp", label: "NLP" },
  { id: "scraping", label: "Scraping" },
  { id: "games", label: "Games" },
  { id: "web", label: "Web" },
  { id: "utils", label: "Utilities" },
] as const;

export const LIBRARIES: Library[] = [
  // ── Data ──────────────────────────────────────────────────────────────────
  {
    id: "numpy",
    name: "NumPy",
    pyodideName: "numpy",
    description: "Fundamental package for scientific computing. Arrays, linear algebra, Fourier transforms.",
    category: "math",
    icon: "🔢",
    docs: "https://numpy.org/doc/",
    example: `import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print("Array:", arr)
print("Mean:", np.mean(arr))
print("Sum:", np.sum(arr))
A = np.array([[1,2],[3,4]])
B = np.array([[5,6],[7,8]])
print("Matrix multiply:")
print(A @ B)`,
  },
  {
    id: "pandas",
    name: "Pandas",
    pyodideName: "pandas",
    description: "Data analysis and manipulation library. DataFrames, Series, CSV/JSON reading, data cleaning.",
    category: "data",
    icon: "🐼",
    docs: "https://pandas.pydata.org/docs/",
    example: `import pandas as pd

data = {
    'Name': ['Alice', 'Bob', 'Carol', 'Dave'],
    'Score': [95, 87, 92, 78],
    'Grade': ['A', 'B', 'A', 'C']
}
df = pd.DataFrame(data)
print(df)
print("\\nAverage score:", df['Score'].mean())
print("\\nBy grade:")
print(df.groupby('Grade')['Score'].mean())`,
  },

  // ── Visualization ─────────────────────────────────────────────────────────
  {
    id: "matplotlib",
    name: "Matplotlib",
    pyodideName: "matplotlib",
    description: "2D plotting library. Line charts, bar charts, histograms, scatter plots — rendered in Preview.",
    category: "visualization",
    icon: "📊",
    docs: "https://matplotlib.org/stable/",
    example: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y1, label='sin(x)', color='royalblue')
plt.plot(x, y2, label='cos(x)', color='tomato')
plt.title('Sine and Cosine')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()`,
  },
  {
    id: "seaborn",
    name: "Seaborn",
    pyodideName: "seaborn",
    description: "Statistical data visualization built on Matplotlib. Beautiful charts with minimal code.",
    category: "visualization",
    icon: "🎨",
    docs: "https://seaborn.pydata.org/",
    example: `import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

np.random.seed(42)
data = np.random.multivariate_normal([0, 0], [[1, .5],[.5, 1]], 200)
x, y = data[:, 0], data[:, 1]

plt.figure(figsize=(6, 5))
sns.scatterplot(x=x, y=y, alpha=0.6)
sns.kdeplot(x=x, y=y, levels=5, color='red', linewidths=0.8)
plt.title('Seaborn — Scatter + KDE')
plt.tight_layout()
plt.show()`,
  },
  {
    id: "plotly",
    name: "Plotly",
    pyodideName: "plotly",
    description: "Interactive web-based graphs and dashboards. 3D charts, animations, and more.",
    category: "visualization",
    icon: "📈",
    docs: "https://plotly.com/python/",
    example: `import plotly.graph_objects as go
import json

fig = go.Figure(data=[
    go.Bar(name='Q1', x=['Jan', 'Feb', 'Mar'], y=[20, 14, 23]),
    go.Bar(name='Q2', x=['Jan', 'Feb', 'Mar'], y=[15, 21, 19]),
])
fig.update_layout(title='Quarterly Sales', barmode='group')

# Save to HTML (plotly in browser)
html = fig.to_html(full_html=False, include_plotlyjs='cdn')
print(html[:300] + "...")
print("\\nPlotly chart created! (HTML output)")`,
  },
  {
    id: "pillow",
    name: "Pillow (PIL)",
    pyodideName: "Pillow",
    description: "Python Imaging Library. Open, manipulate, and save image files. Create graphics programmatically.",
    category: "visualization",
    icon: "🖼️",
    docs: "https://pillow.readthedocs.io/",
    example: `from PIL import Image, ImageDraw
import io, base64

img = Image.new('RGB', (400, 250), color=(30, 30, 46))
draw = ImageDraw.Draw(img)

# Draw shapes
draw.rectangle([20, 20, 380, 230], fill=(49, 50, 68), outline=(137, 180, 250), width=2)
for i, (color, name) in enumerate([
    ((243, 139, 168), 'Red'), ((166, 227, 161), 'Green'),
    ((137, 180, 250), 'Blue'), ((250, 179, 135), 'Orange')
]):
    draw.ellipse([40 + i*80, 60, 100 + i*80, 120], fill=color)
    draw.text((55 + i*80, 130), name, fill=color)

draw.text((160, 180), 'Hello Pillow!', fill=(205, 214, 244))

buf = io.BytesIO()
img.save(buf, format='PNG')
b64 = base64.b64encode(buf.getvalue()).decode()
import js
js.window._pyPlotImage('data:image/png;base64,' + b64)
print("Image drawn and shown in Preview!")`,
  },

  // ── ML / AI ───────────────────────────────────────────────────────────────
  {
    id: "sklearn",
    name: "Scikit-learn",
    pyodideName: "scikit-learn",
    description: "Standard ML library. Classification, regression, clustering, preprocessing.",
    category: "ml",
    icon: "🤖",
    docs: "https://scikit-learn.org/stable/",
    example: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

X, y = make_classification(n_samples=300, n_features=6, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = RandomForestClassifier(n_estimators=50, random_state=42)
clf.fit(X_train, y_train)
preds = clf.predict(X_test)

print(f"Accuracy: {accuracy_score(y_test, preds):.2%}")
print(f"\\nTop 3 feature importances:")
for i, imp in sorted(enumerate(clf.feature_importances_), key=lambda x: -x[1])[:3]:
    print(f"  Feature {i}: {imp:.3f}")`,
  },
  {
    id: "pytorch",
    name: "PyTorch",
    pyodideName: "torch",
    description: "Deep learning framework by Meta. NOT available in browser — requires a native Python environment.",
    category: "ml",
    icon: "🔥",
    docs: "https://pytorch.org/docs/",
    browserUnsupported: true,
    example: `# PyTorch is not available in browser-based Python.
# Install it locally:
#   pip install torch
#
# Then run:
import torch
x = torch.tensor([1.0, 2.0, 3.0])
print(x * 2)`,
  },
  {
    id: "tensorflow",
    name: "TensorFlow",
    pyodideName: "tensorflow",
    description: "Google's ML framework. NOT available in browser — requires a native Python environment.",
    category: "ml",
    icon: "🧠",
    docs: "https://www.tensorflow.org/",
    browserUnsupported: true,
    example: `# TensorFlow is not available in browser-based Python.
# Install it locally:
#   pip install tensorflow
#
# Then run:
import tensorflow as tf
x = tf.constant([1, 2, 3])
print(x)`,
  },

  // ── NLP ───────────────────────────────────────────────────────────────────
  {
    id: "nltk",
    name: "NLTK",
    pyodideName: "nltk",
    description: "Natural Language Toolkit. Tokenization, stemming, POS tagging, stop words.",
    category: "nlp",
    icon: "📝",
    docs: "https://www.nltk.org/",
    example: `import nltk
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('averaged_perceptron_tagger_eng', quiet=True)

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

text = "Python is a great programming language for data science and machine learning."
tokens = word_tokenize(text)
print("Tokens:", tokens[:8], "...")

stops = set(stopwords.words('english'))
filtered = [t for t in tokens if t.lower() not in stops and t.isalpha()]
print("Filtered:", filtered)

stemmer = PorterStemmer()
stems = [stemmer.stem(w) for w in filtered]
print("Stems:", stems)`,
  },

  // ── Scraping & Web ────────────────────────────────────────────────────────
  {
    id: "requests",
    name: "Requests",
    pyodideName: "requests",
    description: "HTTP library for fetching web data. GET, POST, JSON APIs.",
    category: "web",
    icon: "🌐",
    docs: "https://requests.readthedocs.io/",
    example: `import requests

res = requests.get('https://jsonplaceholder.typicode.com/posts/1')
data = res.json()
print("Status:", res.status_code)
print("Title:", data['title'])
print("Body:", data['body'][:100])

# GET list
posts = requests.get('https://jsonplaceholder.typicode.com/posts?_limit=3').json()
for p in posts:
    print(f"\\nPost {p['id']}: {p['title'][:40]}")`,
  },
  {
    id: "beautifulsoup",
    name: "BeautifulSoup",
    pyodideName: "beautifulsoup4",
    description: "HTML/XML parser for web scraping. Extract data from web pages.",
    category: "scraping",
    icon: "🍲",
    docs: "https://www.crummy.com/software/BeautifulSoup/",
    example: `from bs4 import BeautifulSoup

html = """
<html><body>
  <h1>Python Packages</h1>
  <ul id="packages">
    <li class="pkg" data-stars="100k">NumPy — numerical computing</li>
    <li class="pkg" data-stars="40k">Pandas — data analysis</li>
    <li class="pkg" data-stars="35k">Matplotlib — data visualization</li>
  </ul>
  <p>Total: <strong>3 packages</strong></p>
</body></html>
"""

soup = BeautifulSoup(html, 'html.parser')
print("Title:", soup.h1.text)
print("\\nPackages:")
for li in soup.select('li.pkg'):
    print(f"  ★ {li['data-stars']}  {li.text}")
print("\\nSummary:", soup.find('strong').text)`,
  },

  // ── Math / Science ────────────────────────────────────────────────────────
  {
    id: "scipy",
    name: "SciPy",
    pyodideName: "scipy",
    description: "Scientific computing: optimization, signal processing, statistics, linear algebra.",
    category: "math",
    icon: "🔬",
    docs: "https://docs.scipy.org/",
    example: `from scipy import stats, optimize
import numpy as np

# Statistics
data = np.random.normal(5, 2, 500)
mean, std = np.mean(data), np.std(data)
t_stat, p = stats.ttest_1samp(data, 5)
print(f"Mean: {mean:.3f}, Std: {std:.3f}")
print(f"t={t_stat:.3f}, p={p:.4f}")
print("Significant?", p < 0.05)

# Optimization
def f(x): return (x - 3)**2 + 2
result = optimize.minimize_scalar(f)
print(f"\\nMinimum of f(x): x={result.x:.4f}, f(x)={result.fun:.4f}")`,
  },
  {
    id: "sympy",
    name: "SymPy",
    pyodideName: "sympy",
    description: "Symbolic mathematics: algebra, calculus, equation solving, simplification.",
    category: "math",
    icon: "∑",
    docs: "https://docs.sympy.org/",
    example: `from sympy import symbols, diff, integrate, expand, factor, solve, sqrt, pi

x, y = symbols('x y')

expr = (x + 1)**3
print("Expand:", expand(expr))
print("Factor:", factor(x**2 - 1))
print("Derivative:", diff(x**3 + 2*x, x))
print("Integral:", integrate(x**2, x))
print("Solve x^2=4:", solve(x**2 - 4, x))`,
  },
  {
    id: "sqlalchemy",
    name: "SQLAlchemy",
    pyodideName: "sqlalchemy",
    description: "SQL toolkit and ORM for database management.",
    category: "data",
    icon: "🗄️",
    docs: "https://docs.sqlalchemy.org/",
    example: `from sqlalchemy import create_engine, Column, Integer, String, Float, text
from sqlalchemy.orm import DeclarativeBase, Session

engine = create_engine('sqlite:///:memory:')

class Base(DeclarativeBase): pass

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Float)
    stock = Column(Integer)

Base.metadata.create_all(engine)

with Session(engine) as session:
    session.add_all([
        Product(name='Apple', price=0.50, stock=100),
        Product(name='Banana', price=0.25, stock=150),
        Product(name='Cherry', price=2.00, stock=50),
    ])
    session.commit()
    products = session.query(Product).filter(Product.price < 1.0).all()
    print("Products under $1:")
    for p in products:
        price_str = f"{p.price:.2f}"
        print(f"  {p.name}: $" + price_str + f" ({p.stock} in stock)")`,
  },

  // ── Games ─────────────────────────────────────────────────────────────────
  {
    id: "turtle",
    name: "Turtle 🐢",
    pyodideName: "turtle",
    description: "Draw shapes and patterns with turtle graphics — rendered live in the Preview panel!",
    category: "games",
    icon: "🐢",
    docs: "https://docs.python.org/3/library/turtle.html",
    example: `import turtle

turtle.bgcolor("black")
turtle.speed(0)

colors = ["red", "yellow", "green", "cyan", "blue", "magenta"]
turtle.penup()
turtle.goto(0, 0)
turtle.pendown()

for i in range(180):
    turtle.pencolor(colors[i % len(colors)])
    turtle.pensize(i / 80 + 0.5)
    turtle.forward(i * 1.2)
    turtle.left(59)

turtle.exitonclick()`,
  },

  // ── Built-ins ─────────────────────────────────────────────────────────────
  {
    id: "math",
    name: "Math",
    pyodideName: "math",
    description: "Built-in mathematical functions: trigonometry, logarithms, constants.",
    category: "math",
    icon: "π",
    docs: "https://docs.python.org/3/library/math.html",
    example: `import math

print(f"Pi = {math.pi:.6f}")
print(f"e  = {math.e:.6f}")
print(f"sin(pi/2) = {math.sin(math.pi/2)}")
print(f"sqrt(2) = {math.sqrt(2):.6f}")
print(f"log2(1024) = {math.log2(1024)}")
print(f"factorial(10) = {math.factorial(10)}")`,
  },
  {
    id: "random",
    name: "Random",
    pyodideName: "random",
    description: "Pseudo-random number generation, shuffling, and sampling.",
    category: "utils",
    icon: "🎲",
    docs: "https://docs.python.org/3/library/random.html",
    example: `import random

random.seed(42)
print("Random float:", random.random())
print("Random int (1-100):", random.randint(1, 100))

items = ['apple', 'banana', 'cherry', 'date', 'elderberry']
random.shuffle(items)
print("Shuffled:", items)
print("Sample 3:", random.sample(items, 3))
print("Choice:", random.choice(items))`,
  },
  {
    id: "datetime",
    name: "DateTime",
    pyodideName: "datetime",
    description: "Working with dates and times: date, time, datetime, timedelta.",
    category: "utils",
    icon: "📅",
    docs: "https://docs.python.org/3/library/datetime.html",
    example: `from datetime import datetime, timedelta, date

now = datetime.now()
print("Now:", now.strftime("%Y-%m-%d %H:%M:%S"))
future = now + timedelta(days=30)
print("In 30 days:", future.strftime("%B %d, %Y"))
bday = date(1990, 6, 15)
age_days = (date.today() - bday).days
print(f"Days since June 15, 1990: {age_days:,}")
print(f"That's about {age_days // 365} years")`,
  },
  {
    id: "regex",
    name: "Regex (re)",
    pyodideName: "re",
    description: "Regular expression operations. Pattern matching and text processing.",
    category: "utils",
    icon: "🔍",
    docs: "https://docs.python.org/3/library/re.html",
    example: `import re

text = "Contact us at support@example.com or info@company.org"
emails = re.findall(r'[\\w.-]+@[\\w.-]+\\.\\w+', text)
print("Emails found:", emails)

phone_text = "Call 555-1234 or (800) 555-9876"
phones = re.findall(r'[\\(]?\\d{3}[\\)-\\s]?\\d{3}[-\\s]?\\d{4}', phone_text)
print("Phones found:", phones)`,
  },
  {
    id: "json",
    name: "JSON",
    pyodideName: "json",
    description: "Built-in JSON encoder/decoder.",
    category: "utils",
    icon: "{}",
    docs: "https://docs.python.org/3/library/json.html",
    example: `import json

data = {
    "name": "Python IDE",
    "features": ["editor", "preview", "packages"],
    "config": {"theme": "dark", "fontSize": 13}
}

s = json.dumps(data, indent=2)
print(s)

parsed = json.loads(s)
print("\\nName:", parsed['name'])`,
  },
  {
    id: "itertools",
    name: "Itertools",
    pyodideName: "itertools",
    description: "Iterator building blocks: combinations, permutations, chains, cycles.",
    category: "utils",
    icon: "🔄",
    docs: "https://docs.python.org/3/library/itertools.html",
    example: `import itertools

letters = ['A', 'B', 'C']
print("Permutations:")
for p in itertools.permutations(letters, 2):
    print(" ", p)
print("\\nCombinations:")
for c in itertools.combinations(letters, 2):
    print(" ", c)`,
  },
  {
    id: "collections",
    name: "Collections",
    pyodideName: "collections",
    description: "High-performance containers: Counter, defaultdict, OrderedDict, deque.",
    category: "utils",
    icon: "📦",
    docs: "https://docs.python.org/3/library/collections.html",
    example: `from collections import Counter, defaultdict, deque

words = "the quick brown fox jumps over the lazy dog".split()
counter = Counter(words)
print("Top words:", counter.most_common(3))

groups = defaultdict(list)
for w in words:
    groups[len(w)].append(w)
print("\\nBy length:")
for n, ws in sorted(groups.items()):
    print(f"  {n}: {ws}")`,
  },
];

export const STARTER_TEMPLATES = [
  {
    id: "hello",
    name: "Hello World",
    icon: "👋",
    description: "Basic Python output",
    code: `# Welcome to Python IDE!
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
`,
  },
  {
    id: "fibonacci",
    name: "Fibonacci",
    icon: "🌀",
    description: "Fibonacci sequence generator",
    code: `def fibonacci(n):
    a, b = 0, 1
    sequence = []
    for _ in range(n):
        sequence.append(a)
        a, b = b, a + b
    return sequence

n = 15
fib = fibonacci(n)
print(f"First {n} Fibonacci numbers:")
print(fib)
print(f"\\nSum: {sum(fib)}")
ratio = fib[-1] / fib[-2]
print(f"Golden ratio ≈ {ratio:.6f}")
`,
  },
  {
    id: "turtle_spiral",
    name: "Turtle Spiral",
    icon: "🐢",
    description: "Colorful spiral in Preview",
    code: `import turtle

turtle.bgcolor("black")
turtle.speed(0)
colors = ["red", "yellow", "green", "cyan", "blue", "magenta"]

for i in range(180):
    turtle.pencolor(colors[i % len(colors)])
    turtle.pensize(i / 80 + 0.5)
    turtle.forward(i * 1.2)
    turtle.left(59)

turtle.exitonclick()
`,
  },
  {
    id: "matplotlib_chart",
    name: "Matplotlib Plot",
    icon: "📊",
    description: "Sine wave chart in Preview",
    code: `import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 4 * np.pi, 200)
fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].plot(x, np.sin(x), color='royalblue', label='sin(x)')
axes[0].plot(x, np.cos(x), color='tomato', label='cos(x)')
axes[0].set_title('Sine & Cosine')
axes[0].legend()
axes[0].grid(alpha=0.3)

axes[1].bar(['A', 'B', 'C', 'D'], [23, 45, 12, 38], color=['#89b4fa','#a6e3a1','#fab387','#f38ba8'])
axes[1].set_title('Bar Chart')
axes[1].grid(axis='y', alpha=0.3)

plt.tight_layout()
plt.show()
`,
  },
  {
    id: "data_analysis",
    name: "Data Analysis",
    icon: "📈",
    description: "Pandas + NumPy analysis",
    code: `import numpy as np
import pandas as pd

np.random.seed(42)
months = ['Jan','Feb','Mar','Apr','May','Jun']
data = {
    'Month': months,
    'Sales': np.random.randint(10000, 50000, 6),
    'Expenses': np.random.randint(5000, 25000, 6),
    'Units': np.random.randint(100, 500, 6),
}
df = pd.DataFrame(data)
df['Profit'] = df['Sales'] - df['Expenses']
df['Margin'] = (df['Profit'] / df['Sales'] * 100).round(1)

print("Sales Report:")
print(df.to_string(index=False))
print(f"\\nTotal Revenue: {df['Sales'].sum():,}")
print(f"Total Profit: {df['Profit'].sum():,}")
print(f"Best Month: {df.loc[df['Profit'].idxmax(), 'Month']}")
print(f"Avg Margin: {df['Margin'].mean():.1f}%")
`,
  },
  {
    id: "game_life",
    name: "Game of Life",
    icon: "🦠",
    description: "Conway's Game of Life",
    code: `import random

def create_grid(rows, cols, density=0.3):
    return [[1 if random.random() < density else 0
             for _ in range(cols)] for _ in range(rows)]

def count_neighbors(grid, r, c, rows, cols):
    count = 0
    for dr in [-1, 0, 1]:
        for dc in [-1, 0, 1]:
            if dr == 0 and dc == 0: continue
            nr, nc = (r + dr) % rows, (c + dc) % cols
            count += grid[nr][nc]
    return count

def next_generation(grid, rows, cols):
    new = [[0]*cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            n = count_neighbors(grid, r, c, rows, cols)
            if grid[r][c]: new[r][c] = 1 if n in [2, 3] else 0
            else: new[r][c] = 1 if n == 3 else 0
    return new

def render(grid):
    return '\\n'.join(''.join('█' if c else '·' for c in row) for row in grid)

random.seed(42)
ROWS, COLS = 12, 25
grid = create_grid(ROWS, COLS)
print("Generation 0:")
print(render(grid))
for gen in range(1, 4):
    grid = next_generation(grid, ROWS, COLS)
    alive = sum(sum(r) for r in grid)
    print(f"\\nGeneration {gen} (alive: {alive}):")
    print(render(grid))
`,
  },
];
