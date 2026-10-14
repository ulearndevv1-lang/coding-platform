
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import "./App.css";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Find two numbers in a list whose sum equals the target. Print their indices.",
    starterCode: "# Read the numbers and target\n# Write your solution here",
    exampleInput: "2 7 11 15\n9",
    exampleOutput: "0 1",
    testCases: [
      { input: "2 7 11 15\n9", output: "0 1" },
      { input: "3 2 4\n6", output: "1 2" },
    ],
  },
  {
    id: 2,
    title: "Reverse a String",
    difficulty: "Easy",
    topic: "Strings",
    description: "Read a string and print it in reverse order.",
    starterCode: "s = input()\n# Write your solution here",
    exampleInput: "hello",
    exampleOutput: "olleh",
    testCases: [{ input: "hello", output: "olleh" }],
  },
  {
    id: 3,
    title: "Check Prime",
    difficulty: "Easy",
    topic: "Math",
    description: "Print True if the given number is prime; otherwise print False.",
    starterCode: "n = int(input())\n# Write your solution here",
    exampleInput: "7",
    exampleOutput: "True",
    testCases: [{ input: "7", output: "True" }],
  },
  {
    id: 4,
    title: "Find Maximum",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Find the largest number in a list without using max().",
    starterCode: "nums = list(map(int, input().split()))\n# Write your solution here",
    exampleInput: "4 8 2 10 5",
    exampleOutput: "10",
    testCases: [{ input: "4 8 2 10 5", output: "10" }],
  },
  {
    id: 5,
    title: "Fibonacci Sequence",
    difficulty: "Easy",
    topic: "Math",
    description: "Print the first n Fibonacci numbers separated by spaces.",
    starterCode: "n = int(input())\n# Write your solution here",
    exampleInput: "6",
    exampleOutput: "0 1 1 2 3 5",
    testCases: [{ input: "6", output: "0 1 1 2 3 5" }],
  },
  {
    id: 6,
    title: "Palindrome",
    difficulty: "Easy",
    topic: "Strings",
    description: "Print True if the input string is a palindrome; otherwise False.",
    starterCode: "s = input()\n# Write your solution here",
    exampleInput: "madam",
    exampleOutput: "True",
    testCases: [{ input: "madam", output: "True" }],
  },
  {
    id: 7,
    title: "Count Vowels",
    difficulty: "Easy",
    topic: "Strings",
    description: "Count the vowels in the given string.",
    starterCode: "s = input()\n# Write your solution here",
    exampleInput: "education",
    exampleOutput: "5",
    testCases: [{ input: "education", output: "5" }],
  },
  {
    id: 8,
    title: "Factorial",
    difficulty: "Easy",
    topic: "Math",
    description: "Calculate the factorial of a non-negative integer.",
    starterCode: "n = int(input())\n# Write your solution here",
    exampleInput: "5",
    exampleOutput: "120",
    testCases: [{ input: "5", output: "120" }],
  },
  {
    id: 9,
    title: "Sum of Digits",
    difficulty: "Easy",
    topic: "Math",
    description: "Find the sum of all digits in a positive integer.",
    starterCode: "n = input()\n# Write your solution here",
    exampleInput: "1234",
    exampleOutput: "10",
    testCases: [{ input: "1234", output: "10" }],
  },
  {
    id: 10,
    title: "Count Even Numbers",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Count how many numbers in the list are even.",
    starterCode: "nums = list(map(int, input().split()))\n# Write your solution here",
    exampleInput: "1 2 3 4 6",
    exampleOutput: "3",
    testCases: [{ input: "1 2 3 4 6", output: "3" }],
  },
  {
    id: 11,
    title: "Second Largest",
    difficulty: "Medium",
    topic: "Arrays",
    description: "Print the second-largest distinct number in a list.",
    starterCode: "nums = list(map(int, input().split()))\n# Write your solution here",
    exampleInput: "4 1 7 7 3",
    exampleOutput: "4",
    testCases: [{ input: "4 1 7 7 3", output: "4" }],
  },
  {
    id: 12,
    title: "Remove Duplicates",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Remove duplicates while preserving the original order.",
    starterCode: "nums = list(map(int, input().split()))\n# Write your solution here",
    exampleInput: "1 2 2 3 1",
    exampleOutput: "1 2 3",
    testCases: [{ input: "1 2 2 3 1", output: "1 2 3" }],
  },
  {
    id: 13,
    title: "Anagram Check",
    difficulty: "Easy",
    topic: "Strings",
    description: "Print True if two strings contain the same letters with the same frequencies.",
    starterCode: "a = input()\nb = input()\n# Write your solution here",
    exampleInput: "listen\nsilent",
    exampleOutput: "True",
    testCases: [{ input: "listen\nsilent", output: "True" }],
  },
  {
    id: 14,
    title: "Binary Search",
    difficulty: "Medium",
    topic: "Searching",
    description: "Find the index of a target in a sorted list. Print -1 if it is absent.",
    starterCode: "nums = list(map(int, input().split()))\ntarget = int(input())\n# Write your solution here",
    exampleInput: "1 3 5 7 9\n7",
    exampleOutput: "3",
    testCases: [{ input: "1 3 5 7 9\n7", output: "3" }],
  },
  {
    id: 15,
    title: "Missing Number",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Numbers from 0 to n contain one missing value. Find it.",
    starterCode: "nums = list(map(int, input().split()))\n# Write your solution here",
    exampleInput: "3 0 1",
    exampleOutput: "2",
    testCases: [{ input: "3 0 1", output: "2" }],
  },
  {
    id: 16,
    title: "Valid Parentheses",
    difficulty: "Medium",
    topic: "Stacks",
    description: "Check whether every opening bracket has a matching closing bracket in the correct order.",
    starterCode: "s = input()\n# Write your solution here",
    exampleInput: "()[]{}",
    exampleOutput: "True",
    testCases: [{ input: "()[]{}", output: "True" }],
  },
  {
    id: 17,
    title: "Merge Sorted Lists",
    difficulty: "Easy",
    topic: "Arrays",
    description: "Merge two sorted lists into one sorted list.",
    starterCode: "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\n# Write your solution here",
    exampleInput: "1 3 5\n2 4 6",
    exampleOutput: "1 2 3 4 5 6",
    testCases: [{ input: "1 3 5\n2 4 6", output: "1 2 3 4 5 6" }],
  },
  {
    id: 18,
    title: "Longest Word",
    difficulty: "Easy",
    topic: "Strings",
    description: "Print the longest word in a sentence. If tied, print the first one.",
    starterCode: "s = input()\n# Write your solution here",
    exampleInput: "Python is very useful",
    exampleOutput: "useful",
    testCases: [{ input: "Python is very useful", output: "useful" }],
  },
  {
    id: 19,
    title: "Greatest Common Divisor",
    difficulty: "Easy",
    topic: "Math",
    description: "Find the greatest common divisor (GCD) of two integers.",
    starterCode: "a, b = map(int, input().split())\n# Write your solution here",
    exampleInput: "12 18",
    exampleOutput: "6",
    testCases: [{ input: "12 18", output: "6" }],
  },
  {
    id: 20,
    title: "Power of Two",
    difficulty: "Easy",
    topic: "Math",
    description: "Print True if the positive integer is a power of two; otherwise False.",
    starterCode: "n = int(input())\n# Write your solution here",
    exampleInput: "16",
    exampleOutput: "True",
    testCases: [{ input: "16", output: "True" }],
  },
];

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("codespace-dark-mode") === "true"
  );
  const [selectedId, setSelectedId] = useState(1);
  const [language, setLanguage] = useState("python");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");
  const [bookmarks, setBookmarks] = useState(
    () => JSON.parse(localStorage.getItem("codespace-bookmarks") || "[]")
  );
  const [solved, setSolved] = useState(
    () => JSON.parse(localStorage.getItem("codespace-solved") || "[]")
  );
  const [drafts, setDrafts] = useState(
    () => JSON.parse(localStorage.getItem("codespace-code-drafts") || "{}")
  );
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [running, setRunning] = useState(false);

  const problem = problems.find((p) => p.id === selectedId) || problems[0];
  const draftKey = `${selectedId}-${language}`;
  const [code, setCode] = useState(
    () => drafts["1-python"] || problems[0].starterCode
  );

  useEffect(() => {
    localStorage.setItem("codespace-dark-mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("codespace-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("codespace-solved", JSON.stringify(solved));
  }, [solved]);

  useEffect(() => {
    localStorage.setItem("codespace-code-drafts", JSON.stringify(drafts));
  }, [drafts]);

  function selectProblem(p) {
    setSelectedId(p.id);
    const key = `${p.id}-${language}`;
    setCode(drafts[key] || p.starterCode);
    setOutput("");
    setTestResults([]);
  }

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    const key = `${selectedId}-${nextLanguage}`;
    setCode(drafts[key] || (nextLanguage === "python" ? problem.starterCode : ""));
    setOutput("");
    setTestResults([]);
  }

  function updateCode(value) {
    const nextCode = value ?? "";
    setCode(nextCode);
    setDrafts((old) => ({ ...old, [draftKey]: nextCode }));
  }

  function toggleBookmark(id) {
    setBookmarks((old) =>
      old.includes(id) ? old.filter((item) => item !== id) : [...old, id]
    );
  }

  function loadPyodideScript() {
    return new Promise((resolve, reject) => {
      if (window.loadPyodide) {
        resolve();
        return;
      }

      const existing = document.querySelector(
        'script[data-pyodide="true"]'
      );

      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js";
      script.dataset.pyodide = "true";
      script.onload = resolve;
      script.onerror = () => reject(new Error("Could not load Python runtime."));
      document.body.appendChild(script);
    });
  }

  async function executePython(source, inputText) {
    await loadPyodideScript();

    if (!window.codespacePyodide) {
      window.codespacePyodide = await window.loadPyodide();
    }

    const runtime = window.codespacePyodide;
    const wrapper = `
import sys, io, traceback
_input_text = ${JSON.stringify(inputText)}
_old_stdin, _old_stdout, _old_stderr = sys.stdin, sys.stdout, sys.stderr
sys.stdin = io.StringIO(_input_text)
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
_error = None
try:
    exec(compile(${JSON.stringify(source)}, "<codespace>", "exec"), {"__name__": "__main__"})
except Exception:
    _error = traceback.format_exc()
_result = sys.stdout.getvalue()
_err_result = sys.stderr.getvalue()
sys.stdin, sys.stdout, sys.stderr = _old_stdin, _old_stdout, _old_stderr
(_result, _err_result, _error)
`;
    const result = await runtime.runPythonAsync(wrapper);
    const stdout = result.get(0);
    const stderr = result.get(1);
    const error = result.get(2);
    result.destroy();

    if (error) throw new Error(error);
    if (stderr) throw new Error(stderr);
    return stdout;
  }

  async function runCode() {
    if (language !== "python") {
      setOutput(`Execution for ${language} is not enabled yet. Python execution is available in your browser.`);
      return;
    }

    setRunning(true);
    setOutput("Running your code...");
    setTestResults([]);

    try {
      const result = await executePython(code, customInput);
      setOutput(result || "(No output)");
    } catch (error) {
      setOutput(`Error:\n${error.message}`);
    } finally {
      setRunning(false);
    }
  }

  async function submitCode() {
    if (language !== "python") {
      setOutput(`Submission for ${language} is not enabled yet. Please select Python.`);
      return;
    }

    setRunning(true);
    setOutput("Running test cases...");
    setTestResults([]);

    try {
      const results = [];

      for (const test of problem.testCases) {
        try {
          const result = await executePython(code, test.input);
          const passed = result.trim() === test.output.trim();
          results.push({
            input: test.input,
            expected: test.output,
            actual: result.trim(),
            passed,
          });
        } catch (error) {
          results.push({
            input: test.input,
            expected: test.output,
            actual: error.message,
            passed: false,
          });
        }
      }

      setTestResults(results);
      const passedCount = results.filter((item) => item.passed).length;
      setOutput(
        `${passedCount} of ${results.length} test cases passed.`
      );

      if (passedCount === results.length) {
        setSolved((old) =>
          old.includes(selectedId) ? old : [...old, selectedId]
        );
      }
    } finally {
      setRunning(false);
    }
  }

  const topics = ["All", ...new Set(problems.map((p) => p.topic))];

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = topic === "All" || p.topic === topic;
    const matchesDifficulty =
      difficulty === "All" || p.difficulty === difficulty;
    const matchesStatus =
      status === "All" ||
      (status === "Solved" && solved.includes(p.id)) ||
      (status === "Unsolved" && !solved.includes(p.id)) ||
      (status === "Bookmarked" && bookmarks.includes(p.id));

    return (
      matchesSearch &&
      matchesTopic &&
      matchesDifficulty &&
      matchesStatus
    );
  });

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">{"</>"}</div>
          <h1 className="app-title">CodeSpace</h1>
          <span className="brand-tagline">Practice. Code. Grow.</span>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode((value) => !value)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <main className="main-content">
        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Problems</span>
            <strong>{problems.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Solved</span>
            <strong>{solved.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Bookmarked</span>
            <strong>{bookmarks.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Progress</span>
            <strong>
              {Math.round((solved.length / problems.length) * 100)}%
            </strong>
          </div>
        </section>

        <section className="workspace">
          <aside className="problem-sidebar">
            <h2>Problems</h2>

            <input
              className="search-input"
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="filter-controls">
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                {topics.map((item) => (
                  <option key={item} value={item}>{item === "All" ? "All Topics" : item}</option>
                ))}
              </select>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Solved">Solved</option>
                <option value="Unsolved">Unsolved</option>
                <option value="Bookmarked">Bookmarked</option>
              </select>
            </div>

            <div className="problem-list">
              {filteredProblems.map((p) => (
                <button
                  key={p.id}
                  className={`problem-item ${selectedId === p.id ? "active" : ""}`}
                  onClick={() => selectProblem(p)}
                >
                  <div className="problem-item-top">
                    <span className="problem-number">{p.id}.</span>
                    <span className="problem-name">{p.title}</span>
                    {solved.includes(p.id) && <span title="Solved">✓</span>}
                  </div>
                  <div className="problem-item-bottom">
                    <span className={`difficulty ${p.difficulty.toLowerCase()}`}>
                      {p.difficulty}
                    </span>
                    <span>{p.topic}</span>
                    {bookmarks.includes(p.id) && <span>★</span>}
                  </div>
                </button>
              ))}
              {filteredProblems.length === 0 && (
                <p className="empty-state">No problems found.</p>
              )}
            </div>
          </aside>

          <section className="coding-area">
            <div className="problem-description">
              <div className="problem-heading">
                <div>
                  <h2>{problem.id}. {problem.title}</h2>
                  <span className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                  <span className="topic-tag">{problem.topic}</span>
                </div>

                <button
                  className="bookmark-button"
                  onClick={() => toggleBookmark(problem.id)}
                >
                  {bookmarks.includes(problem.id) ? "★ Bookmarked" : "☆ Bookmark"}
                </button>
              </div>

              <p>{problem.description}</p>

              <h3>Example Input</h3>
              <pre>{problem.exampleInput}</pre>

              <h3>Example Output</h3>
              <pre>{problem.exampleOutput}</pre>
            </div>

            <div className="editor-panel">
              <div className="editor-toolbar">
                <label htmlFor="language-select">Language</label>
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript (editor only)</option>
                  <option value="java">Java (editor only)</option>
                  <option value="cpp">C++ (editor only)</option>
                  <option value="c">C (editor only)</option>
                </select>

                <div className="editor-actions">
                  <button
                    className="run-button"
                    onClick={runCode}
                    disabled={running}
                  >
                    {running ? "Running..." : "▶ Run"}
                  </button>
                  <button
                    className="submit-button"
                    onClick={submitCode}
                    disabled={running}
                  >
                    {running ? "Checking..." : "✓ Submit"}
                  </button>
                </div>
              </div>

              <Editor
                height="380px"
                language={language === "cpp" ? "cpp" : language}
                theme={darkMode ? "vs-dark" : "light"}
                value={code}
                onChange={updateCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  padding: { top: 16 },
                }}
              />
            </div>

            <section className="input-panel">
              <h3>Custom Input</h3>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter input for your program..."
                rows={3}
              />
            </section>

            <section className="output-panel">
              <h3>Output</h3>
              <pre className="output-content">{output || "Your output will appear here."}</pre>

              {testResults.length > 0 && (
                <div className="test-results">
                  <h3>Test Results</h3>
                  {testResults.map((result, index) => (
                    <div
                      className={`test-result ${result.passed ? "passed" : "failed"}`}
                      key={`${selectedId}-${index}`}
                    >
                      <strong>
                        {result.passed ? "✓ Passed" : "✗ Failed"} — Test {index + 1}
                      </strong>
                      <p>Input: {result.input}</p>
                      <p>Expected: {result.expected}</p>
                      <p>Actual: {result.actual || "(No output)"}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>
        </section>

        <footer className="app-footer">
          <p>CodeSpace — Keep learning, keep coding.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
