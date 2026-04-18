export interface Library {
  id: string;
  name: string;
  pyodideName: string;
  description: string;
  category: "data" | "visualization" | "ml" | "games" | "math" | "web" | "utils";
  icon: string;
  docs: string;
  example: string;
}

export const LIBRARY_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "data", label: "Data" },
  { id: "visualization", label: "Visualization" },
  { id: "ml", label: "ML / AI" },
  { id: "math", label: "Math" },
  { id: "games", label: "Games" },
  { id: "utils", label: "Utilities" },
] as const;

export const LIBRARIES: Library[] = [
  {
    id: "numpy",
    name: "NumPy",
    pyodideName: "numpy",
    description: "Fundamental package for scientific computing with Python. Arrays, linear algebra, Fourier transforms.",
    category: "math",
    icon: "🔢",
    docs: "https://numpy.org/doc/",
    example: `import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print("Array:", arr)
print("Mean:", np.mean(arr))
print("Sum:", np.sum(arr))
print("Matrix multiply:")
A = np.array([[1,2],[3,4]])
B = np.array([[5,6],[7,8]])
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
  {
    id: "matplotlib",
    name: "Matplotlib",
    pyodideName: "matplotlib",
    description: "2D plotting library for Python. Line charts, bar charts, histograms, scatter plots.",
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
plt.savefig('/tmp/plot.png')
plt.show()
print("Plot saved!")`,
  },
  {
    id: "scipy",
    name: "SciPy",
    pyodideName: "scipy",
    description: "Scientific computing: optimization, interpolation, signal processing, statistics.",
    category: "math",
    icon: "🔬",
    docs: "https://docs.scipy.org/",
    example: `from scipy import stats
import numpy as np

data = np.random.normal(loc=5, scale=2, size=1000)
mean, std = np.mean(data), np.std(data)
print(f"Mean: {mean:.3f}, Std: {std:.3f}")

t_stat, p_value = stats.ttest_1samp(data, 5)
print(f"t-statistic: {t_stat:.3f}")
print(f"p-value: {p_value:.4f}")
print("Significant?" , p_value < 0.05)`,
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
    id: "sklearn",
    name: "Scikit-learn",
    pyodideName: "scikit-learn",
    description: "Machine learning: classification, regression, clustering, preprocessing.",
    category: "ml",
    icon: "🤖",
    docs: "https://scikit-learn.org/stable/",
    example: `from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=200, n_features=4, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

clf = RandomForestClassifier(n_estimators=10, random_state=42)
clf.fit(X_train, y_train)
preds = clf.predict(X_test)

print(f"Accuracy: {accuracy_score(y_test, preds):.2%}")
print(f"Features: {clf.n_features_in_}")`,
  },
  {
    id: "pillow",
    name: "Pillow (PIL)",
    pyodideName: "Pillow",
    description: "Python Imaging Library. Open, manipulate, and save image files.",
    category: "visualization",
    icon: "🖼️",
    docs: "https://pillow.readthedocs.io/",
    example: `from PIL import Image, ImageDraw, ImageFont
import io

img = Image.new('RGB', (300, 150), color=(30, 30, 46))
draw = ImageDraw.Draw(img)

draw.rectangle([20, 20, 280, 130], fill=(69, 71, 90), outline=(137, 180, 250), width=2)
draw.ellipse([50, 40, 120, 110], fill=(243, 139, 168))
draw.text((150, 65), "Hello PIL!", fill=(205, 214, 244))

img.save('/tmp/output.png')
print("Image created:", img.size, img.mode)`,
  },
  {
    id: "requests",
    name: "Requests",
    pyodideName: "requests",
    description: "Elegant HTTP library for Python. GET, POST, sessions, authentication.",
    category: "web",
    icon: "🌐",
    docs: "https://requests.readthedocs.io/",
    example: `import requests

res = requests.get('https://jsonplaceholder.typicode.com/posts/1')
data = res.json()
print("Status:", res.status_code)
print("Title:", data['title'])
print("Body preview:", data['body'][:80])`,
  },
  {
    id: "regex",
    name: "Regex (re)",
    pyodideName: "re",
    description: "Regular expression operations built into Python. Pattern matching and text processing.",
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
    description: "Built-in JSON encoder/decoder for working with JSON data.",
    category: "utils",
    icon: "{}",
    docs: "https://docs.python.org/3/library/json.html",
    example: `import json

data = {
    "name": "Python IDE",
    "version": "1.0",
    "features": ["editor", "preview", "packages"],
    "config": {"theme": "dark", "fontSize": 13}
}

serialized = json.dumps(data, indent=2)
print("JSON output:")
print(serialized)

parsed = json.loads(serialized)
print("\\nName:", parsed['name'])
print("Features:", parsed['features'])`,
  },
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
print(f"sin(π/2) = {math.sin(math.pi/2)}")
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
print("\\nOriginal:", items)
random.shuffle(items)
print("Shuffled:", items)
print("Sample 3:", random.sample(items, 3))
print("Choice:", random.choice(items))`,
  },
  {
    id: "datetime",
    name: "DateTime",
    pyodideName: "datetime",
    description: "Classes for working with dates and times: date, time, datetime, timedelta.",
    category: "utils",
    icon: "📅",
    docs: "https://docs.python.org/3/library/datetime.html",
    example: `from datetime import datetime, timedelta, date

now = datetime.now()
print("Now:", now.strftime("%Y-%m-%d %H:%M:%S"))

future = now + timedelta(days=30)
print("In 30 days:", future.strftime("%B %d, %Y"))

bday = date(1990, 6, 15)
today = date.today()
age_days = (today - bday).days
print(f"Days since June 15, 1990: {age_days:,}")
print(f"That's about {age_days // 365} years")`,
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
    print(" ", c)

print("\\nProduct:")
for p in itertools.product([0,1], repeat=3):
    print(" ", p)`,
  },
  {
    id: "collections",
    name: "Collections",
    pyodideName: "collections",
    description: "High-performance container datatypes: Counter, defaultdict, OrderedDict, deque.",
    category: "utils",
    icon: "📦",
    docs: "https://docs.python.org/3/library/collections.html",
    example: `from collections import Counter, defaultdict, deque

words = "the quick brown fox jumps over the lazy dog the fox".split()
counter = Counter(words)
print("Word counts:", counter.most_common(5))

groups = defaultdict(list)
for word in words:
    groups[len(word)].append(word)
print("\\nBy length:")
for length, ws in sorted(groups.items()):
    print(f"  {length} letters: {ws}")

d = deque([1, 2, 3])
d.appendleft(0)
d.append(4)
print("\\nDeque:", list(d))`,
  },
];

export const STARTER_TEMPLATES = [
  {
    id: "hello",
    name: "Hello World",
    icon: "👋",
    description: "Basic Python output",
    code: `# Hello, World!
print("Hello, World!")
print("Welcome to Python IDE")

name = "Python"
version = 3.11
print(f"\\nRunning {name} {version}")

for i in range(5):
    print(f"Count: {i + 1}")
`,
  },
  {
    id: "fibonacci",
    name: "Fibonacci",
    icon: "🌀",
    description: "Fibonacci sequence generator",
    code: `# Fibonacci sequence
def fibonacci(n):
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
print(f"Last: {fib[-1]}")

# Golden ratio approximation
ratio = fib[-1] / fib[-2]
print(f"Golden ratio ≈ {ratio:.6f}")
`,
  },
  {
    id: "data_analysis",
    name: "Data Analysis",
    icon: "📊",
    description: "Pandas + NumPy data analysis",
    code: `import numpy as np
import pandas as pd

# Generate sample sales data
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
total_rev = df['Sales'].sum()
total_prof = df['Profit'].sum()
best_month = df.loc[df['Profit'].idxmax(), 'Month']
avg_margin = df['Margin'].mean()
print(f"\\nTotal Revenue: {total_rev:,}")
print(f"Total Profit: {total_prof:,}")
print(f"Best Month: {best_month}")
print(f"Avg Margin: {avg_margin:.1f}%")
`,
  },
  {
    id: "sorting",
    name: "Sorting Algorithms",
    icon: "🔀",
    description: "Bubble and merge sort comparison",
    code: `import random
import time

def bubble_sort(arr):
    n = len(arr)
    arr = arr.copy()
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

data = random.sample(range(1000), 20)
print("Original:", data[:10], "...")

t0 = time.time()
sorted_b = bubble_sort(data)
t1 = time.time()
sorted_m = merge_sort(data)
t2 = time.time()

print("Bubble:", sorted_b[:10], "...")
print("Merge: ", sorted_m[:10], "...")
print(f"\\nBubble sort: {(t1-t0)*1000:.2f}ms")
print(f"Merge sort:  {(t2-t1)*1000:.2f}ms")
print("Results match:", sorted_b == sorted_m)
`,
  },
  {
    id: "game_life",
    name: "Game of Life",
    icon: "🦠",
    description: "Conway's Game of Life simulation",
    code: `# Conway's Game of Life
import random

def create_grid(rows, cols, density=0.3):
    return [[1 if random.random() < density else 0
             for _ in range(cols)] for _ in range(rows)]

def count_neighbors(grid, r, c, rows, cols):
    count = 0
    for dr in [-1, 0, 1]:
        for dc in [-1, 0, 1]:
            if dr == 0 and dc == 0:
                continue
            nr, nc = (r + dr) % rows, (c + dc) % cols
            count += grid[nr][nc]
    return count

def next_generation(grid, rows, cols):
    new_grid = [[0]*cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            neighbors = count_neighbors(grid, r, c, rows, cols)
            if grid[r][c] == 1:
                new_grid[r][c] = 1 if neighbors in [2, 3] else 0
            else:
                new_grid[r][c] = 1 if neighbors == 3 else 0
    return new_grid

def render(grid):
    return '\\n'.join(''.join('█' if c else '·' for c in row) for row in grid)

random.seed(42)
ROWS, COLS = 15, 30
grid = create_grid(ROWS, COLS)

print("Generation 0:")
print(render(grid))

for gen in range(1, 4):
    grid = next_generation(grid, ROWS, COLS)
    alive = sum(sum(row) for row in grid)
    print(f"\\nGeneration {gen} (alive: {alive}):")
    print(render(grid))
`,
  },
  {
    id: "class_demo",
    name: "OOP Demo",
    icon: "🏗️",
    description: "Object-oriented programming example",
    code: `# Object-Oriented Programming Demo
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species
        self._energy = 100

    def eat(self, food):
        self._energy += 10
        print(f"{self.name} eats {food}. Energy: {self._energy}")

    def speak(self):
        raise NotImplementedError

    def __repr__(self):
        return f"{self.species}('{self.name}')"

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name, "Dog")
        self.breed = breed

    def speak(self):
        return f"{self.name} says: Woof! 🐕"

    def fetch(self):
        self._energy -= 15
        return f"{self.name} fetches the ball! Energy: {self._energy}"

class Cat(Animal):
    def __init__(self, name, indoor=True):
        super().__init__(name, "Cat")
        self.indoor = indoor

    def speak(self):
        return f"{self.name} says: Meow! 🐈"

# Create animals
rex = Dog("Rex", "German Shepherd")
whiskers = Cat("Whiskers")

print("=== Animal Shelter ===")
animals = [rex, whiskers]
for animal in animals:
    print(f"\\n{animal}")
    print(animal.speak())
    animal.eat("kibble")

print("\\n" + rex.fetch())
print(f"Indoor cat? {whiskers.indoor}")
`,
  },
];
