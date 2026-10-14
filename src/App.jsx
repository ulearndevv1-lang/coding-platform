
import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { loadPyodide, version as pyodideVersion } from "pyodide";
import "./App.css";

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Arrays", description: "Find two numbers in a list whose sum equals the target. Print their indices.", starterCode: "nums = list(map(int, input().split()))\ntarget = int(input())\n# Write your code here", exampleInput: "2 7 11 15\n9", exampleOutput: "0 1", constraints: "At least two numbers are provided. Exactly one valid answer exists.", hint: "Use a dictionary to remember numbers you have already seen.", explanation: "For each number, check whether target minus that number has appeared before.", testCases: [{ input: "2 7 11 15\n9", output: "0 1" }, { input: "3 2 4\n6", output: "1 2" }] },
  { id: 2, title: "Reverse a String", difficulty: "Easy", topic: "Strings", description: "Read a string and print it in reverse order.", starterCode: "s = input()\n# Write your code here", exampleInput: "hello", exampleOutput: "olleh", constraints: "The input is a single line of text.", hint: "Python slicing can reverse a string.", explanation: "The slice s[::-1] traverses the string from end to beginning.", testCases: [{ input: "hello", output: "olleh" }, { input: "python", output: "nohtyp" }] },
  { id: 3, title: "Check Prime Number", difficulty: "Easy", topic: "Math", description: "Print True if the given integer is prime; otherwise print False.", starterCode: "n = int(input())\n# Write your code here", exampleInput: "7", exampleOutput: "True", constraints: "The input is an integer.", hint: "Check divisors only up to the square root of n.", explanation: "A prime number is greater than 1 and has no positive divisors other than 1 and itself.", testCases: [{ input: "7", output: "True" }, { input: "9", output: "False" }, { input: "1", output: "False" }] },
  { id: 4, title: "Find Maximum", difficulty: "Easy", topic: "Arrays", description: "Read space-separated integers and print the largest value.", starterCode: "nums = list(map(int, input().split()))\n# Write your code here", exampleInput: "4 9 2 7", exampleOutput: "9", constraints: "The list contains at least one integer.", hint: "Keep track of the largest value seen so far.", explanation: "Compare each value against the current maximum.", testCases: [{ input: "4 9 2 7", output: "9" }, { input: "-5 -2 -9", output: "-2" }] },
  { id: 5, title: "Fibonacci Sequence", difficulty: "Easy", topic: "Loops", description: "Print the first n Fibonacci numbers, starting with 0 and 1.", starterCode: "n = int(input())\n# Write your code here", exampleInput: "6", exampleOutput: "0 1 1 2 3 5", constraints: "n is a non-negative integer.", hint: "Each number is the sum of the two previous numbers.", explanation: "Start with 0 and 1, then repeatedly update the pair.", testCases: [{ input: "6", output: "0 1 1 2 3 5" }, { input: "1", output: "0" }] },
  { id: 6, title: "Palindrome Number", difficulty: "Easy", topic: "Strings", description: "Print True if the input number reads the same forward and backward.", starterCode: "n = input()\n# Write your code here", exampleInput: "121", exampleOutput: "True", constraints: "The input is a whole number represented as text.", hint: "Compare the text with its reverse.", explanation: "A palindrome remains unchanged when its digits are reversed.", testCases: [{ input: "121", output: "True" }, { input: "123", output: "False" }] },
  { id: 7, title: "Count Vowels", difficulty: "Easy", topic: "Strings", description: "Count the vowels a, e, i, o, and u in the input, ignoring case.", starterCode: "s = input()\n# Write your code here", exampleInput: "Hello World", exampleOutput: "3", constraints: "The input may contain uppercase and lowercase letters.", hint: "Convert the string to lowercase and check each character.", explanation: "Count characters that belong to the set of five vowels.", testCases: [{ input: "Hello World", output: "3" }, { input: "sky", output: "0" }] },
  { id: 8, title: "Factorial", difficulty: "Easy", topic: "Math", description: "Calculate n factorial. By definition, 0 factorial is 1.", starterCode: "n = int(input())\n# Write your code here", exampleInput: "5", exampleOutput: "120", constraints: "n is a non-negative integer.", hint: "Multiply all integers from 1 through n.", explanation: "Factorial is the product of every positive integer up to n.", testCases: [{ input: "5", output: "120" }, { input: "0", output: "1" }] },
  { id: 9, title: "Sum of Digits", difficulty: "Easy", topic: "Math", description: "Print the sum of all digits in the given non-negative integer.", starterCode: "n = input()\n# Write your code here", exampleInput: "1234", exampleOutput: "10", constraints: "The input is a non-negative integer.", hint: "Convert the number to text and add its digits.", explanation: "Extract each digit and accumulate its numeric value.", testCases: [{ input: "1234", output: "10" }, { input: "900", output: "9" }] },
  { id: 10, title: "Count Even Numbers", difficulty: "Easy", topic: "Arrays", description: "Count the even numbers in a space-separated list.", starterCode: "nums = list(map(int, input().split()))\n# Write your code here", exampleInput: "1 2 3 4 6", exampleOutput: "3", constraints: "The list contains integers.", hint: "A number is even if number modulo 2 equals zero.", explanation: "Count each value divisible by two without a remainder.", testCases: [{ input: "1 2 3 4 6", output: "3" }, { input: "1 3 5", output: "0" }] },
  { id: 11, title: "Second Largest Number", difficulty: "Medium", topic: "Arrays", description: "Print the second-largest distinct value in the list.", starterCode: "nums = list(map(int, input().split()))\n# Write your code here", exampleInput: "10 5 8 10 3", exampleOutput: "8", constraints: "At least two distinct values exist.", hint: "Remove duplicates, sort, and select the second-largest value.", explanation: "Distinct values prevent the largest number from being counted twice.", testCases: [{ input: "10 5 8 10 3", output: "8" }, { input: "1 4 2", output: "2" }] },
  { id: 12, title: "Remove Duplicates", difficulty: "Medium", topic: "Arrays", description: "Print the list without duplicate values, preserving their first occurrence order.", starterCode: "nums = list(map(int, input().split()))\n# Write your code here", exampleInput: "1 2 2 3 1", exampleOutput: "1 2 3", constraints: "The input contains integers.", hint: "Maintain a set of seen values and a result list.", explanation: "Add a value to the result only the first time it appears.", testCases: [{ input: "1 2 2 3 1", output: "1 2 3" }, { input: "4 4 4", output: "4" }] },
  { id: 13, title: "Anagram Check", difficulty: "Medium", topic: "Strings", description: "Print True if two input strings contain the same characters with the same frequencies, ignoring case.", starterCode: "a = input().lower()\nb = input().lower()\n# Write your code here", exampleInput: "listen\nsilent", exampleOutput: "True", constraints: "Each string is provided on a separate line.", hint: "Compare the sorted characters of both strings.", explanation: "Anagrams have identical character frequencies.", testCases: [{ input: "listen\nsilent", output: "True" }, { input: "hello\nworld", output: "False" }] },
  { id: 14, title: "Binary Search", difficulty: "Medium", topic: "Searching", description: "Find the index of a target in a sorted list. Print -1 if absent.", starterCode: "nums = list(map(int, input().split()))\ntarget = int(input())\n# Write your code here", exampleInput: "1 3 5 7 9\n7", exampleOutput: "3", constraints: "The list is sorted in ascending order.", hint: "Use low, high, and middle pointers.", explanation: "Each comparison eliminates half of the remaining search range.", testCases: [{ input: "1 3 5 7 9\n7", output: "3" }, { input: "1 3 5 7 9\n4", output: "-1" }] },
  { id: 15, title: "Missing Number", difficulty: "Medium", topic: "Arrays", description: "The list contains distinct numbers from 0 through n with one missing. Print the missing number.", starterCode: "nums = list(map(int, input().split()))\n# Write your code here", exampleInput: "3 0 1", exampleOutput: "2", constraints: "The numbers are distinct and one value from the expected range is missing.", hint: "Compare the expected sum with the actual sum.", explanation: "The sum from 0 through n is n times (n + 1) divided by 2.", testCases: [{ input: "3 0 1", output: "2" }, { input: "0 1", output: "2" }] },
  { id: 16, title: "Valid Parentheses", difficulty: "Medium", topic: "Stacks", description: "Check whether (), [], and {} are correctly matched and nested. Print True or False.", starterCode: "s = input()\n# Write your code here", exampleInput: "{[()]}", exampleOutput: "True", constraints: "The input contains only parentheses and brackets.", hint: "Use a stack to track opening brackets.", explanation: "Every closing bracket must match the most recent unmatched opening bracket.", testCases: [{ input: "{[()]}", output: "True" }, { input: "([)]", output: "False" }] },
  { id: 17, title: "Merge Sorted Arrays", difficulty: "Medium", topic: "Arrays", description: "Read two sorted integer lists on separate lines and print their merged sorted list.", starterCode: "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\n# Write your code here", exampleInput: "1 3 5\n2 4 6", exampleOutput: "1 2 3 4 5 6", constraints: "Both input lists are sorted in ascending order.", hint: "Compare the first remaining element of each list.", explanation: "Repeatedly take the smaller available value from either list.", testCases: [{ input: "1 3 5\n2 4 6", output: "1 2 3 4 5 6" }, { input: "1 2\n3 4", output: "1 2 3 4" }] },
  { id: 18, title: "Longest Word", difficulty: "Easy", topic: "Strings", description: "Print the longest word in a line of text. If tied, print the first longest word.", starterCode: "s = input()\n# Write your code here", exampleInput: "Python is very useful", exampleOutput: "useful", constraints: "The input contains words separated by spaces.", hint: "Split the line into words and compare their lengths.", explanation: "Track the first word with the greatest length.", testCases: [{ input: "Python is very useful", output: "useful" }, { input: "cat dog", output: "cat" }] },
  { id: 19, title: "GCD of Two Numbers", difficulty: "Medium", topic: "Math", description: "Print the greatest common divisor of two non-negative integers.", starterCode: "a = int(input())\nb = int(input())\n# Write your code here", exampleInput: "12\n18", exampleOutput: "6", constraints: "At least one input number is positive.", hint: "Use the Euclidean algorithm.", explanation: "Repeatedly replace the pair with the second value and the remainder.", testCases: [{ input: "12\n18", output: "6" }, { input: "7\n3", output: "1" }] },
  { id: 20, title: "Power of Two", difficulty: "Easy", topic: "Math", description: "Print True if the given positive integer is a power of two; otherwise print False.", starterCode: "n = int(input())\n# Write your code here", exampleInput: "16", exampleOutput: "True", constraints: "The input is an integer.", hint: "A power of two has exactly one set bit in binary.", explanation: "Repeatedly divide by two while the number is even, or use a bitwise check.", testCases: [{ input: "16", output: "True" }, { input: "12", output: "False" }, { input: "1", output: "True" }] }
];

const languages = ["Python", "Java", "C", "C++"];

const starterCodes = {
  Python: "print('Hello, CodeSpace!')",
  Java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeSpace!");\n    }\n}',
  C: '#include <stdio.h>\n\nint main(void) {\n    printf("Hello, CodeSpace!\\n");\n    return 0;\n}',
  "C++": '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, CodeSpace!" << endl;\n    return 0;\n}'
};

const DRAFTS_KEY = "codespace-code-drafts";
const SOLVED_KEY = "codespace-solved";
const BOOKMARKS_KEY = "codespace-bookmarks";

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [selectedProblem, setSelectedProblem] = useState(problems[0]);
  const [language, setLanguage] = useState("Python");
  const [codeDrafts, setCodeDrafts] = useState(() => readStorage(DRAFTS_KEY, {}));
  const [solvedProblems, setSolvedProblems] = useState(() => readStorage(SOLVED_KEY, []));
  const [bookmarks, setBookmarks] = useState(() => readStorage(BOOKMARKS_KEY, []));
  const [code, setCode] = useState(problems[0].starterCode);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("Description");
  const [customInput, setCustomInput] = useState(problems[0].exampleInput);
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [executionTime, setExecutionTime] = useState(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideError, setPyodideError] = useState("");
  const pyodideRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(codeDrafts));
  }, [codeDrafts]);

  useEffect(() => {
    localStorage.setItem(SOLVED_KEY, JSON.stringify(solvedProblems));
  }, [solvedProblems]);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    let cancelled = false;

    async function initializePython() {
      try {
        const runtime = await loadPyodide({
          indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`
        });

        if (!cancelled) {
          pyodideRef.current = runtime;
          setPyodideReady(true);
        }
      } catch (error) {
        if (!cancelled) {
          setPyodideError(error.message || "Unable to load Python.");
        }
      }
    }

    initializePython();

    return () => {
      cancelled = true;
    };
  }, []);

  const topics = ["All", ...new Set(problems.map((p) => p.topic))];

  const filteredProblems = problems.filter((problem) => {
    const query = search.toLowerCase();
    const matchesSearch =
      problem.title.toLowerCase().includes(query) ||
      problem.description.toLowerCase().includes(query) ||
      problem.topic.toLowerCase().includes(query);

    const matchesStatus =
      filter === "All" ||
      (filter === "Solved" && solvedProblems.includes(problem.id)) ||
      (filter === "Unsolved" && !solvedProblems.includes(problem.id)) ||
      (filter === "Bookmarked" && bookmarks.includes(problem.id));

    return (
      matchesSearch &&
      matchesStatus &&
      (topicFilter === "All" || problem.topic === topicFilter) &&
      (difficultyFilter === "All" || problem.difficulty === difficultyFilter)
    );
  });

  const progress = Math.round((solvedProblems.length / problems.length) * 100);

  function changeProblem(problem) {
    setSelectedProblem(problem);
    setCode(codeDrafts[`${problem.id}-${language}`] ?? (
      language === "Python" ? problem.starterCode : starterCodes[language]
    ));
    setCustomInput(problem.exampleInput);
    setOutput("");
    setTestResults([]);
    setExecutionTime(null);
    setActiveTab("Description");
  }

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setCode(
      codeDrafts[`${selectedProblem.id}-${nextLanguage}`] ??
      (nextLanguage === "Python" ? selectedProblem.starterCode : starterCodes[nextLanguage])
    );
    setOutput("");
    setTestResults([]);
  }

  function updateCode(value = "") {
    setCode(value);
    setCodeDrafts((previous) => ({
      ...previous,
      [`${selectedProblem.id}-${language}`]: value
    }));
  }

  function resetCode() {
    updateCode(language === "Python" ? selectedProblem.starterCode : starterCodes[language]);
    setOutput("");
    setTestResults([]);
  }

  function toggleBookmark(id) {
    setBookmarks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  async function executePython(source, inputText) {
    const runtime = pyodideRef.current;

    if (!runtime) throw new Error("Python is still loading. Please try again.");

    runtime.globals.set("__source", source);
    runtime.globals.set("__input", inputText);

    try {
      return await runtime.runPythonAsync(`
import sys, io, traceback
__old_stdin = sys.stdin
__old_stdout = sys.stdout
__old_stderr = sys.stderr
__captured_out = io.StringIO()
__captured_err = io.StringIO()
sys.stdin = io.StringIO(__input)
sys.stdout = __captured_out
sys.stderr = __captured_err
try:
    exec(compile(__source, "<codespace>", "exec"), {"__name__": "__main__"})
except Exception:
    traceback.print_exc()
finally:
    sys.stdin = __old_stdin
    sys.stdout = __old_stdout
    sys.stderr = __old_stderr
(__captured_out.getvalue(), __captured_err.getvalue())
      `).then((result) => {
        try {
          return { stdout: result.get(0), stderr: result.get(1) };
        } finally {
          result.destroy();
        }
      });
    } finally {
      runtime.globals.delete("__source");
      runtime.globals.delete("__input");
    }
  }

  async function runCode() {
    if (language !== "Python") {
      setOutput(`${language} execution is not enabled yet. Python is currently supported.`);
      setActiveTab("Output");
      return;
    }

    if (!pyodideReady) {
      setOutput(pyodideError || "Python is loading. Please wait.");
      setActiveTab("Output");
      return;
    }

    setIsRunning(true);
    setActiveTab("Output");
    setTestResults([]);

    const start = performance.now();

    try {
      const result = await executePython(code, customInput);
      setExecutionTime(Math.round(performance.now() - start));
      setOutput(result.stderr ? `${result.stdout}${result.stderr}` : result.stdout || "(No output)");
    } catch (error) {
      setOutput(error.message || String(error));
      setExecutionTime(Math.round(performance.now() - start));
    } finally {
      setIsRunning(false);
    }
  }

  async function submitCode() {
    if (language !== "Python") {
      setOutput(`${language} execution is not enabled yet. Python is currently supported.`);
      setActiveTab("Output");
      return;
    }

    if (!pyodideReady) {
      setOutput(pyodideError || "Python is loading. Please wait.");
      setActiveTab("Output");
      return;
    }

    setIsRunning(true);
    setActiveTab("Output");
    setTestResults([]);

    const start = performance.now();

    try {
      const results = [];

      for (const test of selectedProblem.testCases) {
        try {
          const result = await executePython(code, test.input);
          const actual = result.stdout.trim();
          const expected = test.output.trim();
          const passed = !result.stderr && actual === expected;

          results.push({
            input: test.input,
            expected,
            actual: result.stderr ? result.stderr.trim() : actual,
            passed
          });
        } catch (error) {
          results.push({
            input: test.input,
            expected: test.output,
            actual: error.message,
            passed: false
          });
        }
      }

      setTestResults(results);
      setExecutionTime(Math.round(performance.now() - start));

      const passedAll = results.length > 0 && results.every((test) => test.passed);

      setOutput(
        passedAll
          ? "All visible test cases passed!"
          : `${results.filter((test) => test.passed).length} of ${results.length} test cases passed.`
      );

      if (passedAll) {
        setSolvedProblems((previous) =>
          previous.includes(selectedProblem.id)
            ? previous
            : [...previous, selectedProblem.id]
        );
      }
    } catch (error) {
      setOutput(error.message || String(error));
    } finally {
      setIsRunning(false);
    }
  }

  function clearFilters() {
    setSearch("");
    setFilter("All");
    setTopicFilter("All");
    setDifficultyFilter("All");
  }

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <div className="app-container">
        <header className="app-header">
          <div className="brand">
            <span className="brand-icon">{"</>"}</span>
            <div>
              <h1>CodeSpace</h1>
              <p>Your coding practice workspace</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="runtime-status">
              <span className={`status-dot ${pyodideError ? "error" : ""}`} />
              {pyodideError
                ? "Python unavailable"
                : pyodideReady
                  ? "Python ready"
                  : "Loading Python..."}
            </div>
            <button
              className="theme-toggle"
              onClick={() => setDarkMode((value) => !value)}
            >
              {darkMode ? "☀️ Light mode" : "🌙 Dark mode"}
            </button>
          </div>
        </header>

        <section className="dashboard-summary">
          <div className="summary-card">
            <h3>YOUR PROGRESS</h3>
            <div className="summary-value">{progress}%</div>
            <div className="summary-caption">
              {solvedProblems.length} of {problems.length} problems solved
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="summary-card">
            <h3>SOLVED PROBLEMS</h3>
            <div className="summary-value">{solvedProblems.length}</div>
            <div className="summary-caption">Keep practicing!</div>
          </div>

          <div className="summary-card">
            <h3>BOOKMARKS</h3>
            <div className="summary-value">{bookmarks.length}</div>
            <div className="summary-caption">Saved for later</div>
          </div>
        </section>

        <div className="workspace">
          <aside className="sidebar">
            <div className="sidebar-heading">
              <h2>Problems</h2>
              <span className="count-badge">{filteredProblems.length} shown</span>
            </div>

            <div className="filter-group">
              <label className="filter-label" htmlFor="problem-search">Search</label>
              <input
                id="problem-search"
                className="search-input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search problems..."
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <div className="filter-tabs">
                {["All", "Solved", "Unsolved", "Bookmarked"].map((item) => (
                  <button
                    key={item}
                    className={`filter-tab ${filter === item ? "active" : ""}`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label" htmlFor="topic-filter">Topic</label>
              <select
                id="topic-filter"
                className="filter-select"
                value={topicFilter}
                onChange={(event) => setTopicFilter(event.target.value)}
              >
                {topics.map((topic) => <option key={topic}>{topic}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label" htmlFor="difficulty-filter">Difficulty</label>
              <select
                id="difficulty-filter"
                className="filter-select"
                value={difficultyFilter}
                onChange={(event) => setDifficultyFilter(event.target.value)}
              >
                {["All", "Easy", "Medium", "Hard"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <button className="filter-clear" onClick={clearFilters}>
              Clear filters
            </button>

            <div className="problem-list">
              {filteredProblems.map((problem) => (
                <div
                  key={problem.id}
                  className={`problem-item ${selectedProblem.id === problem.id ? "active" : ""} ${solvedProblems.includes(problem.id) ? "solved" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => changeProblem(problem)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      changeProblem(problem);
                    }
                  }}
                >
                  <span className="problem-number">
                    {solvedProblems.includes(problem.id) ? "✓" : problem.id}
                  </span>
                  <div className="problem-item-content">
                    <div className="problem-title">{problem.title}</div>
                    <div className="problem-meta">
                      <span className={`difficulty difficulty-${problem.difficulty.toLowerCase()}`}>
                        {problem.difficulty}
                      </span>
                      <span className="topic-tag">{problem.topic}</span>
                    </div>
                  </div>
                  <button
                    className={`bookmark-button ${bookmarks.includes(problem.id) ? "bookmarked" : ""}`}
                    aria-label={bookmarks.includes(problem.id) ? "Remove bookmark" : "Bookmark problem"}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleBookmark(problem.id);
                    }}
                  >
                    {bookmarks.includes(problem.id) ? "★" : "☆"}
                  </button>
                </div>
              ))}

              {filteredProblems.length === 0 && (
                <div className="empty-state">No problems match these filters.</div>
              )}
            </div>
          </aside>

          <main className="main-content">
            <div className="workspace-panels">
              <section className="problem-panel">
                <div className="panel-heading">
                  <div>
                    <h2>{selectedProblem.id}. {selectedProblem.title}</h2>
                    <p>{selectedProblem.topic} · {selectedProblem.difficulty}</p>
                  </div>
                  {solvedProblems.includes(selectedProblem.id) && (
                    <span className="count-badge">✓ Solved</span>
                  )}
                </div>

                <div className="problem-tabs">
                  {["Description", "Examples", "Output"].map((tab) => (
                    <button
                      key={tab}
                      className={`problem-tab ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="problem-content">
                  {activeTab === "Description" && (
                    <>
                      <h3>Problem description</h3>
                      <p>{selectedProblem.description}</p>

                      <h3>Example</h3>
                      <div className="example-box">
                        <strong>Input</strong>{"\n"}
                        {selectedProblem.exampleInput}{"\n\n"}
                        <strong>Output</strong>{"\n"}
                        {selectedProblem.exampleOutput}
                      </div>

                      <div className="info-box">
                        <h4>Constraints</h4>
                        <p>{selectedProblem.constraints}</p>
                      </div>

                      <div className="info-box hint-box">
                        <h4>💡 Hint</h4>
                        <p>{selectedProblem.hint}</p>
                      </div>

                      <div className="info-box">
                        <h4>📘 Explanation</h4>
                        <p>{selectedProblem.explanation}</p>
                      </div>
                    </>
                  )}

                  {activeTab === "Examples" && (
                    <>
                      <h3>Sample test case</h3>
                      <p>Use this input to try the problem.</p>
                      <h4>Input</h4>
                      <pre>{selectedProblem.exampleInput}</pre>
                      <h4>Expected output</h4>
                      <pre>{selectedProblem.exampleOutput}</pre>
                      <h4>Constraints</h4>
                      <p>{selectedProblem.constraints}</p>
                    </>
                  )}

                  {activeTab === "Output" && (
                    <>
                      <h3>Execution output</h3>
                      <pre className="output-content">{output || "Run your code to see output here."}</pre>
                      {executionTime !== null && (
                        <p className="summary-caption">Execution time: {executionTime} ms</p>
                      )}
                    </>
                  )}
                </div>
              </section>

              <section className="editor-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Code editor</h2>
                    <p>Write, run, and test your solution</p>
                  </div>
                </div>

                <div className="editor-toolbar">
                  <div className="toolbar-group">
                    <select
                      aria-label="Programming language"
                      value={language}
                      onChange={(event) => changeLanguage(event.target.value)}
                    >
                      {languages.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>

                    <select
                      aria-label="Editor font size"
                      value={fontSize}
                      onChange={(event) => setFontSize(Number(event.target.value))}
                    >
                      {[12, 14, 16, 18, 20].map((size) => (
                        <option key={size} value={size}>{size}px</option>
                      ))}
                    </select>
                  </div>

                  <div className="toolbar-group">
                    <button onClick={resetCode}>Reset</button>
                    <button onClick={() => navigator.clipboard?.writeText(code)}>
                      Copy code
                    </button>
                  </div>
                </div>

                <div className="editor-container">
                  <Editor
                    height="390px"
                    language={
                      language === "C++" ? "cpp" :
                      language === "C" ? "c" :
                      language.toLowerCase()
                    }
                    theme={darkMode ? "vs-dark" : "light"}
                    value={code}
                    onChange={updateCode}
                    options={{
                      fontSize,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      padding: { top: 16 },
                      tabSize: 4
                    }}
                  />
                </div>

                <div className="custom-input-section">
                  <label htmlFor="custom-input">Custom input</label>
                  <textarea
                    id="custom-input"
                    className="custom-input"
                    value={customInput}
                    onChange={(event) => setCustomInput(event.target.value)}
                    placeholder="Enter input for your program..."
                  />
                </div>

                <div className="editor-actions">
                  <div className="execution-note">
                    {language === "Python"
                      ? pyodideReady
                        ? "Python runs in your browser."
                        : pyodideError || "Preparing the Python runtime..."
                      : `${language} execution is not enabled yet.`}
                  </div>

                  <div className="button-row">
                    <button
                      className="secondary-button"
                      onClick={runCode}
                      disabled={isRunning || (language === "Python" && !pyodideReady)}
                    >
                      {isRunning ? "Running..." : "▶ Run code"}
                    </button>
                    <button
                      className="primary-button"
                      onClick={submitCode}
                      disabled={isRunning || (language === "Python" && !pyodideReady)}
                    >
                      {isRunning ? "Testing..." : "✓ Submit"}
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <section className="output-panel">
              <div className="output-heading">
                <h3>Output</h3>
                {executionTime !== null && (
                  <span className="summary-caption">{executionTime} ms</span>
                )}
              </div>
              <pre className={`output-content ${output.includes("error") || output.includes("Error") ? "output-error" : ""}`}>
                {output || "Your program output will appear here."}
              </pre>
            </section>

            <section className="test-results">
              <h3>Test results ({testResults.filter((test) => test.passed).length}/{testResults.length} passed)</h3>

              {testResults.length === 0 ? (
                <div className="empty-state">
                  Submit your Python solution to check the visible test cases.
                </div>
              ) : (
                testResults.map((test, index) => (
                  <div className="test-result-item" key={`${selectedProblem.id}-${index}`}>
                    <span className={`test-result-icon ${test.passed ? "pass" : "fail"}`}>
                      {test.passed ? "✓" : "✕"}
                    </span>
                    <div>
                      <h4>Test case {index + 1}: {test.passed ? "Passed" : "Failed"}</h4>
                      <p>Input: {test.input}</p>
                      <p>Expected: {test.expected}</p>
                      <p>Actual: {test.actual || "(No output)"}</p>
                    </div>
                  </div>
                ))
              )}
            </section>
          </main>
        </div>

        <footer className="app-footer">
          <span>© {new Date().getFullYear()} CodeSpace</span>
          <span>Practice consistently. Learn something new every day.</span>
        </footer>
      </div>
    </div>
  );
}
