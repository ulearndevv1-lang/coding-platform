import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useTheme } from "../hooks/useTheme";
import { LANGUAGES, getLanguage, usesRemoteExecution } from "../data/languages";
import { problems } from "../data/problems";
import { executeCode } from "../lib/codeRunner";
import {
  formatExecutionMessage,
  stdoutForComparison,
} from "../lib/formatExecution";
import { fetchExecutionConfig } from "../lib/remoteRunner";
import { preloadPythonRuntime } from "../lib/pythonRunner";
import { getStarterCode } from "../lib/starterCode";
import "../App.css";

export default function PracticePage() {
  const { darkMode } = useTheme();
  const [, setSearchParams] = useSearchParams();

  function resolveProblemId(params) {
    const param = Number(params.get("problem"));
    return param && problems.some((p) => p.id === param) ? param : 1;
  }

  const [selectedId, setSelectedId] = useState(() =>
    resolveProblemId(new URLSearchParams(window.location.search))
  );
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
  const [executionStatus, setExecutionStatus] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [pythonReady, setPythonReady] = useState(false);
  const [pythonError, setPythonError] = useState("");
  const [apiAvailable, setApiAvailable] = useState(null);
  const [remoteConfigured, setRemoteConfigured] = useState(null);

  const problem = problems.find((p) => p.id === selectedId) || problems[0];
  const draftKey = `${selectedId}-${language}`;
  const langMeta = getLanguage(language);
  const [code, setCode] = useState(() => {
    const storedDrafts = JSON.parse(
      localStorage.getItem("codespace-code-drafts") || "{}"
    );
    const id = resolveProblemId(new URLSearchParams(window.location.search));
    const key = `${id}-python`;
    const initialProblem = problems.find((p) => p.id === id) || problems[0];
    return storedDrafts[key] || getStarterCode(initialProblem, "python");
  });

  useEffect(() => {
    localStorage.setItem("codespace-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("codespace-solved", JSON.stringify(solved));
  }, [solved]);

  useEffect(() => {
    localStorage.setItem("codespace-code-drafts", JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    let cancelled = false;
    preloadPythonRuntime()
      .then(() => {
        if (!cancelled) {
          setPythonReady(true);
          setPythonError("");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPythonError(
            "Could not load the Python runtime. Check your network connection and refresh."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    fetchExecutionConfig().then((config) => {
      setApiAvailable(config.apiAvailable);
      setRemoteConfigured(config.remoteConfigured);
    });
  }, []);

  function selectProblem(p) {
    setSelectedId(p.id);
    const key = `${p.id}-${language}`;
    setCode(drafts[key] || getStarterCode(p, language));
    setOutput("");
    setExecutionStatus("");
    setTestResults([]);
    setSearchParams({ problem: String(p.id) }, { replace: true });
  }

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    const key = `${selectedId}-${nextLanguage}`;
    setCode(drafts[key] || getStarterCode(problem, nextLanguage));
    setOutput("");
    setExecutionStatus("");
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

  function resetToStarter() {
    updateCode(getStarterCode(problem, language));
    setOutput("");
    setExecutionStatus("");
    setTestResults([]);
  }

  function useExampleInput() {
    setCustomInput(problem.exampleInput);
  }

  const canRun = usesRemoteExecution(language)
    ? apiAvailable === true && remoteConfigured === true
    : pythonReady;

  const runBlockReason = useMemo(() => {
    if (usesRemoteExecution(language)) {
      if (apiAvailable === null || remoteConfigured === null) {
        return "Checking remote execution availability…";
      }
      if (apiAvailable === false) {
        return "Remote API is not available here. Run `npx vercel dev` for local Java/C/C++/JS, or use Python in-browser.";
      }
      if (remoteConfigured === false) {
        return "Judge0 is not configured on the server (JUDGE0_API_KEY / JUDGE0_API_URL).";
      }
    }
    if (language === "python" && !pythonReady) {
      return "Loading Python runtime…";
    }
    return null;
  }, [apiAvailable, language, pythonReady, remoteConfigured]);

  const runCode = useCallback(async () => {
    if (!canRun) {
      setOutput(runBlockReason || "Cannot run code yet.");
      return;
    }

    setRunning(true);
    setOutput("Running your code...");
    setExecutionStatus("");
    setTestResults([]);

    try {
      const result = await executeCode(language, code, customInput);
      setExecutionStatus(result.status || "");
      setOutput(formatExecutionMessage(result));
    } finally {
      setRunning(false);
    }
  }, [canRun, code, customInput, language, runBlockReason]);

  async function submitCode() {
    if (!canRun) {
      setOutput(runBlockReason || "Cannot submit yet.");
      return;
    }

    setRunning(true);
    setOutput("Running test cases...");
    setExecutionStatus("");
    setTestResults([]);

    try {
      const results = [];

      for (const test of problem.testCases) {
        const result = await executeCode(language, code, test.input);
        const actual = stdoutForComparison(result);
        const passed =
          !result.notConfigured &&
          !result.compileOutput &&
          actual.trim() === test.output.trim();

        results.push({
          input: test.input,
          expected: test.output,
          actual: actual || result.message || "(No output)",
          passed,
          status: result.status,
        });
      }

      setTestResults(results);
      const passedCount = results.filter((item) => item.passed).length;
      setExecutionStatus(
        passedCount === results.length ? "All tests passed" : "Some tests failed"
      );
      setOutput(`${passedCount} of ${results.length} test cases passed.`);

      if (passedCount === results.length) {
        setSolved((old) =>
          old.includes(selectedId) ? old : [...old, selectedId]
        );
      }
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        if (!running && canRun) {
          runCode();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canRun, runCode, running]);

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
      <div className="app-container">
        <SiteHeader variant="practice" />

        {pythonError && language === "python" && (
          <div className="banner banner-error" role="alert">
            {pythonError}
          </div>
        )}
        {language === "python" && !pythonReady && !pythonError && (
          <div className="banner banner-info" role="status">
            Loading Python runtime for in-browser execution…
          </div>
        )}
        {usesRemoteExecution(language) && apiAvailable === false && (
          <div className="banner banner-info" role="status">
            {langMeta.label} runs on the server API, which is not available in
            plain <code>npm run dev</code>. Use <code>npx vercel dev</code> or
            deploy to Vercel. Python still runs in your browser.
          </div>
        )}
        {usesRemoteExecution(language) &&
          apiAvailable === true &&
          remoteConfigured === false && (
            <div className="banner banner-error" role="alert">
              Server-side execution for {langMeta.label} is not configured. Add
              JUDGE0_API_KEY and JUDGE0_API_URL on the host (see .env.example).
              Python still runs in your browser.
            </div>
          )}

        <main className="main-content">
          <section className="stats-grid stats-grid-compact" aria-label="Your progress">
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
                type="search"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search problems"
              />

              <div className="filter-controls">
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  aria-label="Filter by topic"
                >
                  {topics.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All Topics" : item}
                    </option>
                  ))}
                </select>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  aria-label="Filter by difficulty"
                >
                  <option value="All">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="All">All Status</option>
                  <option value="Solved">Solved</option>
                  <option value="Unsolved">Unsolved</option>
                  <option value="Bookmarked">Bookmarked</option>
                </select>
              </div>

              <div className="problem-list">
                {filteredProblems.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    className={`problem-item ${selectedId === p.id ? "active" : ""}`}
                    onClick={() => selectProblem(p)}
                  >
                    <div className="problem-item-top">
                      <span className="problem-number">{p.id}.</span>
                      <span className="problem-name">{p.title}</span>
                      {solved.includes(p.id) && (
                        <span title="Solved" aria-label="Solved">✓</span>
                      )}
                    </div>
                    <div className="problem-item-bottom">
                      <span className={`difficulty ${p.difficulty.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                      <span>{p.topic}</span>
                      {bookmarks.includes(p.id) && <span aria-hidden>★</span>}
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
                    <h2>
                      {problem.id}. {problem.title}
                    </h2>
                    <span
                      className={`difficulty ${problem.difficulty.toLowerCase()}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="topic-tag">{problem.topic}</span>
                  </div>

                  <button
                    type="button"
                    className="bookmark-button"
                    onClick={() => toggleBookmark(problem.id)}
                  >
                    {bookmarks.includes(problem.id)
                      ? "★ Bookmarked"
                      : "☆ Bookmark"}
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
                    {LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.label}
                        {lang.runtime === "browser" ? " (in-browser)" : ""}
                      </option>
                    ))}
                  </select>
                  <span className="runtime-badge">
                    {langMeta.runtime === "browser"
                      ? "Runs locally in browser"
                      : apiAvailable === false
                        ? "Server API not available in this dev mode"
                        : remoteConfigured
                          ? "Runs on server (Judge0)"
                          : "Judge0 not configured on server"}
                  </span>

                  <div className="editor-actions">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={resetToStarter}
                      disabled={running}
                    >
                      Reset code
                    </button>
                    <button
                      type="button"
                      className="run-button"
                      onClick={runCode}
                      disabled={running || !canRun}
                      title="Run (Ctrl+Enter)"
                    >
                      {running ? "Running..." : "▶ Run"}
                    </button>
                    <button
                      type="button"
                      className="submit-button"
                      onClick={submitCode}
                      disabled={running || !canRun}
                    >
                      {running ? "Checking..." : "✓ Submit"}
                    </button>
                  </div>
                </div>

                <Editor
                  height="400px"
                  language={langMeta.monaco}
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
                <div className="panel-heading-row">
                  <h3>Custom Input</h3>
                  <button
                    type="button"
                    className="text-button"
                    onClick={useExampleInput}
                  >
                    Use example input
                  </button>
                </div>
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter input for your program..."
                  rows={3}
                  aria-label="Custom program input"
                />
              </section>

              <section className="output-panel">
                <div className="panel-heading-row">
                  <h3>Output</h3>
                  {executionStatus && (
                    <span
                      className={`status-pill ${
                        executionStatus.includes("passed") ||
                        executionStatus === "Success" ||
                        executionStatus === "Accepted"
                          ? "success"
                          : executionStatus === "Not Configured"
                            ? "muted"
                            : "neutral"
                      }`}
                    >
                      {executionStatus}
                    </span>
                  )}
                </div>
                <pre className="output-content">
                  {output || "Your output will appear here."}
                </pre>
                {runBlockReason && !running && (
                  <p className="run-hint warn">{runBlockReason}</p>
                )}
                <p className="keyboard-hint">
                  Tip: Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> (or{" "}
                  <kbd>⌘</kbd>+<kbd>Enter</kbd>) to run.
                </p>

                {testResults.length > 0 && (
                  <div className="test-results">
                    <h3>Test Results</h3>
                    {testResults.map((result, index) => (
                      <div
                        className={`test-result ${result.passed ? "passed" : "failed"}`}
                        key={`${selectedId}-${index}`}
                      >
                        <strong>
                          {result.passed ? "✓ Passed" : "✗ Failed"} — Test{" "}
                          {index + 1}
                          {result.status ? ` (${result.status})` : ""}
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

          <SiteFooter />
        </main>
      </div>
    </div>
  );
}
