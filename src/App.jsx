
import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { loadPyodide, version as pyodideVersion } from "pyodide";
import "./App.css";

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Given a list of integers and a target, find the indices of two numbers whose sum equals the target.",
    starterCode:
      "nums = list(map(int, input().split()))\ntarget = int(input())\n\nfor i in range(len(nums)):\n    for j in range(i + 1, len(nums)):\n        if nums[i] + nums[j] == target:\n            print(i, j)\n            break\n    else:\n        continue\n    break",
    exampleInput: "2 7 11 15\n9",
    exampleOutput: "0 1",
    testCases: [
      { input: "2 7 11 15\n9", expected: "0 1" },
      { input: "3 2 4\n6", expected: "1 2" },
      { input: "3 3\n6", expected: "0 1" },
    ],
  },
  {
    id: 2,
    title: "Reverse a String",
    difficulty: "Easy",
    topic: "Strings",
    description:
      "Read a string and print the characters in reverse order.",
    starterCode:
      'text = input()\nprint(text[::-1])',
    exampleInput: "hello",
    exampleOutput: "olleh",
    testCases: [
      { input: "hello", expected: "olleh" },
      { input: "Python", expected: "nohtyP" },
      { input: "12345", expected: "54321" },
    ],
  },
  {
    id: 3,
    title: "Check Prime Number",
    difficulty: "Easy",
    topic: "Math",
    description:
      "Read an integer and print True if it is prime, otherwise print False.",
    starterCode:
      "n = int(input())\n\nis_prime = n >= 2\nfor i in range(2, int(n ** 0.5) + 1):\n    if n % i == 0:\n        is_prime = False\n        break\n\nprint(is_prime)",
    exampleInput: "7",
    exampleOutput: "True",
    testCases: [
      { input: "7", expected: "True" },
      { input: "10", expected: "False" },
      { input: "1", expected: "False" },
      { input: "2", expected: "True" },
    ],
  },
  {
    id: 4,
    title: "Find Maximum",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Read a space-separated list of integers and print the largest number.",
    starterCode:
      "nums = list(map(int, input().split()))\nprint(max(nums))",
    exampleInput: "10 25 7 42 18",
    exampleOutput: "42",
    testCases: [
      { input: "10 25 7 42 18", expected: "42" },
      { input: "-5 -2 -10", expected: "-2" },
      { input: "8", expected: "8" },
    ],
  },
  {
    id: 5,
    title: "Fibonacci Sequence",
    difficulty: "Easy",
    topic: "Loops",
    description:
      "Read n and print the first n Fibonacci numbers, starting with 0 and 1, separated by spaces.",
    starterCode:
      "n = int(input())\na, b = 0, 1\nresult = []\n\nfor _ in range(n):\n    result.append(a)\n    a, b = b, a + b\n\nprint(*result)",
    exampleInput: "7",
    exampleOutput: "0 1 1 2 3 5 8",
    testCases: [
      { input: "7", expected: "0 1 1 2 3 5 8" },
      { input: "1", expected: "0" },
      { input: "5", expected: "0 1 1 2 3" },
    ],
  },
];

const languages = ["Python", "Java", "C", "C++"];

const starterCodes = {
  Python: problems[0].starterCode,
  Java: "// Java execution is not enabled yet.",
  C: "// C execution is not enabled yet.",
  "C++": "// C++ execution is not enabled yet.",
};

function readSaved(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [language, setLanguage] = useState("Python");

  const [codeDrafts, setCodeDrafts] = useState(() =>
    readSaved("codespace-code-drafts", {})
  );

  const [code, setCode] = useState(
    () =>
      readSaved("codespace-code-drafts", {})["1:Python"] ??
      problems[0].starterCode
  );

  const [solvedProblems, setSolvedProblems] = useState(() =>
    readSaved("codespace-solved", [])
  );

  const [bookmarks, setBookmarks] = useState(() =>
    readSaved("codespace-bookmarks", [])
  );

  const [customInput, setCustomInput] = useState(
    problems[0].exampleInput
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("Description");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [executionTime, setExecutionTime] = useState(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideError, setPyodideError] = useState("");

  const pyodideRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(
      "codespace-code-drafts",
      JSON.stringify(codeDrafts)
    );
  }, [codeDrafts]);

  useEffect(() => {
    localStorage.setItem(
      "codespace-solved",
      JSON.stringify(solvedProblems)
    );
  }, [solvedProblems]);

  useEffect(() => {
    localStorage.setItem(
      "codespace-bookmarks",
      JSON.stringify(bookmarks)
    );
  }, [bookmarks]);

  useEffect(() => {
    let cancelled = false;

    async function initializePython() {
      try {
        setIsLoading(true);

        const instance = await loadPyodide({
          indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
        });

        if (!cancelled) {
          pyodideRef.current = instance;
          setPyodideReady(true);
          setPyodideError("");
        }
      } catch (error) {
        if (!cancelled) {
          setPyodideError(
            error?.message || "Unable to load the Python runtime."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    initializePython();

    return () => {
      cancelled = true;
    };
  }, []);

  function changeProblem(problem) {
    setSelectedProblem(problem);

    const key = `${problem.id}:${language}`;
    const drafts = codeDrafts;

    setCode(
      drafts[key] ??
        (language === "Python"
          ? problem.starterCode
          : starterCodes[language])
    );

    setCustomInput(problem.exampleInput);
    setOutput("");
    setTestResults([]);
    setExecutionTime(null);
    setActiveTab("Description");
  }

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);

    const key = `${selectedProblem.id}:${nextLanguage}`;

    setCode(
      codeDrafts[key] ??
        (nextLanguage === "Python"
          ? selectedProblem.starterCode
          : starterCodes[nextLanguage])
    );

    setOutput("");
    setTestResults([]);
    setExecutionTime(null);
  }

  function updateCode(nextCode) {
    setCode(nextCode);

    setCodeDrafts((previous) => ({
      ...previous,
      [`${selectedProblem.id}:${language}`]: nextCode,
    }));
  }

  function resetCode() {
    const initialCode =
      language === "Python"
        ? selectedProblem.starterCode
        : starterCodes[language];

    updateCode(initialCode);
    setOutput("");
    setTestResults([]);
  }

  async function executePython(source, input) {
    const pyodide = pyodideRef.current;

    if (!pyodide) {
      throw new Error("Python is still loading. Please try again.");
    }

    pyodide.setStdout({ batched: () => {} });
    pyodide.setStderr({ batched: () => {} });

    pyodide.globals.set("__codespace_source", source);
    pyodide.globals.set("__codespace_input", input);

    const wrapper = `
import sys
import io
import traceback

_codespace_stdout = io.StringIO()
_codespace_stderr = io.StringIO()
_codespace_old_stdin = sys.stdin
_codespace_old_stdout = sys.stdout
_codespace_old_stderr = sys.stderr

try:
    sys.stdin = io.StringIO(__codespace_input)
    sys.stdout = _codespace_stdout
    sys.stderr = _codespace_stderr

    exec(
        compile(__codespace_source, "<CodeSpace>", "exec"),
        {"__name__": "__main__"}
    )

except SystemExit:
    pass
except Exception:
    traceback.print_exc(file=_codespace_stderr)
finally:
    sys.stdin = _codespace_old_stdin
    sys.stdout = _codespace_old_stdout
    sys.stderr = _codespace_old_stderr

_codespace_result = _codespace_stdout.getvalue()
_codespace_error = _codespace_stderr.getvalue()
(_codespace_result, _codespace_error)
`;

    try {
      const result = await pyodide.runPythonAsync(wrapper);
      return {
        stdout: result.get(0),
        stderr: result.get(1),
      };
    } finally {
      pyodide.globals.delete("__codespace_source");
      pyodide.globals.delete("__codespace_input");
    }
  }

  async function runCode() {
    if (language !== "Python") {
      setOutput(
        `${language} execution is not enabled yet. Please select Python.`
      );
      setActiveTab("Output");
      return;
    }

    if (!pyodideReady) {
      setOutput("Python is loading. Please wait and try again.");
      setActiveTab("Output");
      return;
    }

    setIsRunning(true);
    setOutput("Running your code...");
    setTestResults([]);
    setExecutionTime(null);
    setActiveTab("Output");

    const input =
      customInput.trim().length > 0
        ? customInput
        : selectedProblem.exampleInput;

    const started = performance.now();

    try {
      const result = await executePython(code, input);

      setExecutionTime(
        `${(performance.now() - started).toFixed(2)} ms`
      );

      if (result.stderr.trim()) {
        setOutput(result.stderr.trim());
      } else {
        setOutput(result.stdout || "(No output)");
      }
    } catch (error) {
      setOutput(error?.message || "An unexpected error occurred.");
    } finally {
      setIsRunning(false);
    }
  }

  async function submitCode() {
    if (language !== "Python") {
      setOutput(
        `${language} execution is not enabled yet. Please select Python.`
      );
      setActiveTab("Output");
      return;
    }

    if (!pyodideReady) {
      setOutput("Python is loading. Please wait and try again.");
      setActiveTab("Output");
      return;
    }

    setIsRunning(true);
    setOutput("");
    setTestResults([]);
    setExecutionTime(null);
    setActiveTab("Test Cases");

    const results = [];
    const started = performance.now();

    try {
      for (let index = 0; index < selectedProblem.testCases.length; index++) {
        const test = selectedProblem.testCases[index];

        try {
          const result = await executePython(code, test.input);
          const actual = result.stdout.trim();
          const expected = test.expected.trim();
          const passed = !result.stderr.trim() && actual === expected;

          results.push({
            number: index + 1,
            passed,
            expected,
            actual: result.stderr.trim()
              ? result.stderr.trim()
              : actual || "(No output)",
          });
        } catch (error) {
          results.push({
            number: index + 1,
            passed: false,
            expected: test.expected,
            actual: error?.message || "Runtime error",
          });
        }

        setTestResults([...results]);
      }

      const allPassed =
        results.length > 0 && results.every((result) => result.passed);

      setExecutionTime(
        `${(performance.now() - started).toFixed(2)} ms`
      );

      if (allPassed) {
        setSolvedProblems((previous) =>
          previous.includes(selectedProblem.id)
            ? previous
            : [...previous, selectedProblem.id]
        );
        setOutput("Accepted — all visible test cases passed!");
      } else {
        setOutput("Some test cases failed. Review the results and try again.");
      }
    } finally {
      setIsRunning(false);
    }
  }

  function toggleBookmark(problemId) {
    setBookmarks((previous) =>
      previous.includes(problemId)
        ? previous.filter((id) => id !== problemId)
        : [...previous, problemId]
    );
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Solved" && solvedProblems.includes(problem.id)) ||
      (filter === "Unsolved" && !solvedProblems.includes(problem.id)) ||
      (filter === "Bookmarked" && bookmarks.includes(problem.id));

    return matchesSearch && matchesFilter;
  });

  const progress = Math.round(
    (solvedProblems.length / problems.length) * 100
  );

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">{"</>"}</span>
          <span>CodeSpace</span>
        </div>

        <div className="header-actions">
          <span className="runtime-status">
            <span
              className={`status-dot ${pyodideReady ? "ready" : ""}`}
            />
            {pyodideReady
              ? "Python ready"
              : isLoading
                ? "Loading Python..."
                : "Python unavailable"}
          </span>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode((previous) => !previous)}
            title="Toggle theme"
          >
            {darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
          </button>
        </div>
      </header>

      {pyodideError && (
        <div className="runtime-error">
          Python failed to load: {pyodideError}
        </div>
      )}

      <div className="dashboard-summary">
        <div>
          <span className="summary-label">Problems solved</span>
          <strong>
            {solvedProblems.length} / {problems.length}
          </strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="progress-label">{progress}% complete</span>
      </div>

      <main className="app-layout">
        <aside className="problem-sidebar">
          <div className="sidebar-heading">
            <h2>Problems</h2>
            <span className="problem-count">{problems.length}</span>
          </div>

          <input
            className="problem-search"
            type="search"
            placeholder="Search problems..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="problem-filters">
            {["All", "Unsolved", "Solved", "Bookmarked"].map((item) => (
              <button
                key={item}
                className={filter === item ? "filter-active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="problem-list">
            {filteredProblems.map((problem) => (
              <button
                key={problem.id}
                className={`problem-item ${
                  selectedProblem.id === problem.id ? "selected" : ""
                }`}
                onClick={() => changeProblem(problem)}
              >
                <div className="problem-item-top">
                  <span className="problem-number">
                    {String(problem.id).padStart(2, "0")}
                  </span>
                  <span className="problem-title">{problem.title}</span>
                  {solvedProblems.includes(problem.id) && (
                    <span className="solved-mark">✓</span>
                  )}
                </div>

                <div className="problem-item-bottom">
                  <span className="difficulty">{problem.difficulty}</span>
                  <span className="problem-topic">{problem.topic}</span>
                  <span
                    className="bookmark-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleBookmark(problem.id);
                    }}
                    title="Bookmark problem"
                  >
                    {bookmarks.includes(problem.id) ? "★" : "☆"}
                  </span>
                </div>
              </button>
            ))}

            {filteredProblems.length === 0 && (
              <p className="empty-state">No problems found.</p>
            )}
          </div>
        </aside>

        <section className="workspace">
          <div className="problem-panel">
            <div className="problem-header">
              <div>
                <h1>
                  {String(selectedProblem.id).padStart(2, "0")}.{" "}
                  {selectedProblem.title}
                </h1>
                <span className="difficulty">
                  {selectedProblem.difficulty}
                </span>
              </div>

              <button
                className="bookmark-action"
                onClick={() => toggleBookmark(selectedProblem.id)}
              >
                {bookmarks.includes(selectedProblem.id)
                  ? "★ Bookmarked"
                  : "☆ Bookmark"}
              </button>
            </div>

            <div className="content-tabs">
              {["Description", "Examples", "Output"].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? "tab-active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="problem-content">
              {activeTab === "Description" && (
                <>
                  <p>{selectedProblem.description}</p>
                  <h3>Topic</h3>
                  <p>{selectedProblem.topic}</p>
                  <h3>Example</h3>
                  <pre>{selectedProblem.exampleInput}</pre>
                  <h3>Expected output</h3>
                  <pre>{selectedProblem.exampleOutput}</pre>
                </>
              )}

              {activeTab === "Examples" && (
                <>
                  <h3>Sample input</h3>
                  <pre>{selectedProblem.exampleInput}</pre>
                  <h3>Sample output</h3>
                  <pre>{selectedProblem.exampleOutput}</pre>
                </>
              )}

              {activeTab === "Output" && (
                <div className="execution-output">
                  <h3>Execution Output</h3>
                  <pre>{output || "Run your code to see the output."}</pre>
                  {executionTime && (
                    <p>Execution time: {executionTime}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="editor-panel">
            <div className="editor-toolbar">
              <div className="language-selector">
                {languages.map((item) => (
                  <button
                    key={item}
                    className={language === item ? "language-active" : ""}
                    onClick={() => changeLanguage(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="editor-actions">
                <button onClick={() => setFontSize((size) => Math.max(10, size - 1))}>
                  A−
                </button>
                <button onClick={() => setFontSize((size) => Math.min(24, size + 1))}>
                  A+
                </button>
                <button onClick={resetCode}>Reset Code</button>
                <button onClick={() => navigator.clipboard?.writeText(code)}>
                  Copy Code
                </button>
              </div>
            </div>

            <div className="code-editor">
              <Editor
                height="390px"
                language={
                  language === "C++"
                    ? "cpp"
                    : language.toLowerCase()
                }
                theme={darkMode ? "vs-dark" : "light"}
                value={code}
                onChange={(value) => updateCode(value ?? "")}
                options={{
                  fontSize,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  tabSize: 4,
                  padding: { top: 16 },
                }}
              />
            </div>

            <div className="input-panel">
              <label htmlFor="custom-input">Custom Input</label>
              <textarea
                id="custom-input"
                value={customInput}
                onChange={(event) => setCustomInput(event.target.value)}
                placeholder="Enter input for your program..."
                rows={3}
              />

              <div className="run-actions">
                <button
                  className="run-button"
                  onClick={runCode}
                  disabled={isRunning || !pyodideReady}
                >
                  {isRunning ? "Running..." : "▶ Run Code"}
                </button>

                <button
                  className="submit-button"
                  onClick={submitCode}
                  disabled={isRunning || !pyodideReady}
                >
                  {isRunning ? "Testing..." : "✓ Submit Code"}
                </button>
              </div>
            </div>

            <div className="test-results-panel">
              <div className="test-results-heading">
                <h3>Test Results</h3>
                {testResults.length > 0 && (
                  <span>
                    {testResults.filter((test) => test.passed).length} /{" "}
                    {testResults.length} passed
                  </span>
                )}
              </div>

              {testResults.length === 0 ? (
                <p className="empty-state">
                  Submit your solution to see test results.
                </p>
              ) : (
                testResults.map((test) => (
                  <div
                    key={test.number}
                    className={`test-result ${
                      test.passed ? "test-passed" : "test-failed"
                    }`}
                  >
                    <strong>
                      {test.passed ? "✓" : "✗"} Test Case {test.number}
                    </strong>

                    <div>
                      <span>Expected: </span>
                      <code>{test.expected}</code>
                    </div>

                    <div>
                      <span>Actual: </span>
                      <code>{test.actual}</code>
                    </div>
                  </div>
                ))
              )}

              {output && (
                <p className="submission-message">{output}</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        CodeSpace · Practice, learn, and improve every day.
        <span>
          {pyodideReady
            ? "Python execution enabled"
            : "Python runtime loading"}
        </span>
      </footer>
    </div>
  );
}

export default App;
