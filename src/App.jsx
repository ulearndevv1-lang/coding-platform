
import { useState } from "react";
import Editor from "@monaco-editor/react";
import "./App.css";

const starterCodes = {
  Python: `text = input()
print(text[::-1])`,
  Java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  C: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  "C++": `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
};

const editorLanguages = {
  Python: "python",
  Java: "java",
  C: "c",
  "C++": "cpp",
};

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given a list of integers and a target value, find the indices of two numbers whose sum equals the target. Print the two indices separated by a space.",
    exampleInput: "2 7 11 15\n9",
    exampleOutput: "0 1",
    starterCode: `nums = list(map(int, input().split()))
target = int(input())

for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            print(i, j)
            break
    else:
        continue
    break`,
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
    description:
      "Write a program that reads a string and prints the string in reverse order.",
    exampleInput: "hello",
    exampleOutput: "olleh",
    starterCode: `text = input()
print(text[::-1])`,
    testCases: [
      { input: "hello", expected: "olleh" },
      { input: "code", expected: "edoc" },
      { input: "Python", expected: "nohtyP" },
    ],
  },
  {
    id: 3,
    title: "Check Prime Number",
    difficulty: "Easy",
    description:
      "Read an integer and print Prime if it is a prime number. Otherwise, print Not Prime.",
    exampleInput: "7",
    exampleOutput: "Prime",
    starterCode: `n = int(input())

if n < 2:
    print("Not Prime")
else:
    is_prime = True
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            is_prime = False
            break

    print("Prime" if is_prime else "Not Prime")`,
    testCases: [
      { input: "7", expected: "Prime" },
      { input: "10", expected: "Not Prime" },
      { input: "2", expected: "Prime" },
      { input: "1", expected: "Not Prime" },
    ],
  },
  {
    id: 4,
    title: "Find Maximum",
    difficulty: "Easy",
    description:
      "Read a line of space-separated integers and print the largest number.",
    exampleInput: "4 9 2 15 6",
    exampleOutput: "15",
    starterCode: `nums = list(map(int, input().split()))
print(max(nums))`,
    testCases: [
      { input: "4 9 2 15 6", expected: "15" },
      { input: "-5 -2 -10", expected: "-2" },
      { input: "8", expected: "8" },
    ],
  },
  {
    id: 5,
    title: "Fibonacci Sequence",
    difficulty: "Easy",
    description:
      "Read a positive integer n and print the first n Fibonacci numbers separated by spaces. Start the sequence with 0 and 1.",
    exampleInput: "7",
    exampleOutput: "0 1 1 2 3 5 8",
    starterCode: `n = int(input())

a, b = 0, 1
result = []

for _ in range(n):
    result.append(str(a))
    a, b = b, a + b

print(" ".join(result))`,
    testCases: [
      { input: "7", expected: "0 1 1 2 3 5 8" },
      { input: "5", expected: "0 1 1 2 3" },
      { input: "1", expected: "0" },
    ],
  },
];

function App() {
  const [language, setLanguage] = useState("Python");
  const [selectedProblem, setSelectedProblem] = useState(problems[1]);
  const [code, setCode] = useState(problems[1].starterCode);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("Description");
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [testResults, setTestResults] = useState([]);

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const isSolved = solvedProblems.includes(problem.id);

    const matchesFilter =
      filter === "All" ||
      (filter === "Solved" && isSolved) ||
      (filter === "Unsolved" && !isSolved);

    return matchesSearch && matchesFilter;
  });

  function changeLanguage(newLanguage) {
    setLanguage(newLanguage);
    setCode(starterCodes[newLanguage]);
    setOutput("");
    setTestResults([]);
  }

  function selectProblem(problem) {
    setSelectedProblem(problem);
    setCode(
      language === "Python"
        ? problem.starterCode
        : starterCodes[language]
    );
    setCustomInput("");
    setOutput("");
    setTestResults([]);
    setActiveTab("Description");
  }

  async function executePython(inputText, expectedOutput) {
    const response = await fetch("http://127.0.0.1:8000/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        input: inputText,
        ...(expectedOutput !== undefined ? { expectedOutput } : {}),
      }),
    });

    const data = await response.json();

    if (!response.ok && !data.error) {
      throw new Error("The server could not run your code.");
    }

    return data;
  }

  async function runCode() {
    if (language !== "Python") {
      setOutput(
        `${language} execution is not configured yet. Please select Python to run code.`
      );
      return;
    }

    setRunning(true);
    setOutput("Running your code...");
    setTestResults([]);

    try {
      const result = await executePython(customInput);

      if (result.error) {
        setOutput(
          [result.output, result.error].filter(Boolean).join("\n")
        );
      } else {
        setOutput(result.output || "Program finished with no output.");
      }
    } catch (error) {
      setOutput(`Connection error: ${error.message}`);
    } finally {
      setRunning(false);
    }
  }

  async function submitCode() {
    if (language !== "Python") {
      setOutput(
        `${language} execution is not configured yet. Please select Python to submit this problem.`
      );
      return;
    }

    setRunning(true);
    setTestResults([]);
    setOutput("Running test cases...");

    const results = [];

    try {
      for (let i = 0; i < selectedProblem.testCases.length; i++) {
        const test = selectedProblem.testCases[i];

        const testResult = {
          number: i + 1,
          input: test.input,
          expected: test.expected,
          actual: "",
          error: "",
          status: "Running",
          passed: false,
        };

        try {
          const result = await executePython(
            test.input,
            test.expected
          );

          testResult.actual = result.output ?? "";
          testResult.error = result.error ?? "";

          if (result.status === "Time Limit Exceeded") {
            testResult.status = "Time Limit Exceeded";
          } else if (result.error || result.status === "Runtime Error") {
            testResult.status = "Runtime Error";
          } else {
            testResult.passed =
              result.passed === true ||
              (
                result.passed === undefined &&
                testResult.actual.trim() === test.expected.trim()
              );

            testResult.status = testResult.passed
              ? "Accepted"
              : "Wrong Answer";
          }
        } catch (error) {
          testResult.status = "Connection Error";
          testResult.error = error.message;
        }

        results.push(testResult);
        setTestResults([...results]);

        if (
          testResult.status === "Runtime Error" ||
          testResult.status === "Time Limit Exceeded" ||
          testResult.status === "Connection Error"
        ) {
          break;
        }
      }

      const passedCount = results.filter(
        (result) => result.passed
      ).length;

      const totalCount = selectedProblem.testCases.length;
      const allPassed =
        results.length === totalCount &&
        results.every((result) => result.passed);

      if (allPassed) {
        setSolvedProblems((previous) =>
          previous.includes(selectedProblem.id)
            ? previous
            : [...previous, selectedProblem.id]
        );
      }

      setOutput(
        allPassed
          ? `Accepted! All ${totalCount} test cases passed.`
          : `${passedCount} of ${totalCount} test cases passed.`
      );
    } finally {
      setRunning(false);
    }
  }

  function clearOutput() {
    setOutput("");
    setTestResults([]);
  }

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">{"</>"}</div>
          <div>
            <h1>CodeSpace</h1>
            <p>Practice. Code. Improve.</p>
          </div>
        </div>

        <div className="topbar-right">
          <div className="progress-info">
            <span>Progress</span>
            <strong>
              {solvedProblems.length}/{problems.length} solved
            </strong>
          </div>

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle theme"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <h2>Problems</h2>
            <span>{filteredProblems.length}</span>
          </div>

          <input
            className="search-input"
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="filter-buttons">
            {["All", "Unsolved", "Solved"].map((item) => (
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
            {filteredProblems.map((problem) => {
              const isSolved = solvedProblems.includes(problem.id);
              const isSelected =
                selectedProblem.id === problem.id;

              return (
                <button
                  key={problem.id}
                  className={`problem-item ${
                    isSelected ? "problem-selected" : ""
                  }`}
                  onClick={() => selectProblem(problem)}
                >
                  <div className="problem-item-top">
                    <span className="problem-number">
                      {String(problem.id).padStart(2, "0")}
                    </span>
                    <span className="problem-check">
                      {isSolved ? "✓" : ""}
                    </span>
                  </div>

                  <strong>{problem.title}</strong>
                  <span className="difficulty">
                    {problem.difficulty}
                  </span>
                </button>
              );
            })}

            {filteredProblems.length === 0 && (
              <p className="empty-message">No problems found.</p>
            )}
          </div>
        </aside>

        <section className="description-panel">
          <div className="panel-tabs">
            <button
              className={activeTab === "Description" ? "tab-active" : ""}
              onClick={() => setActiveTab("Description")}
            >
              Description
            </button>
            <button
              className={activeTab === "Examples" ? "tab-active" : ""}
              onClick={() => setActiveTab("Examples")}
            >
              Examples
            </button>
          </div>

          {activeTab === "Description" ? (
            <div className="problem-description">
              <div className="title-row">
                <h2>{selectedProblem.title}</h2>
                <span className="difficulty-badge">
                  {selectedProblem.difficulty}
                </span>
              </div>

              <p>{selectedProblem.description}</p>

              <div className="description-section">
                <h3>Instructions</h3>
                <p>
                  Write your solution in the editor. Read input from
                  standard input and print your answer to standard
                  output.
                </p>
              </div>

              <div className="description-section">
                <h3>Test Cases</h3>
                <p>
                  This problem has {selectedProblem.testCases.length}{" "}
                  test cases. Click <strong>Submit Code</strong> to
                  check your solution against all of them.
                </p>
              </div>

              <div className="hint-card">
                <span>💡</span>
                <p>
                  Test your solution with different inputs before
                  submitting it.
                </p>
              </div>
            </div>
          ) : (
            <div className="problem-description">
              <h3>Example Input</h3>
              <pre className="example-block">
                {selectedProblem.exampleInput}
              </pre>

              <h3>Expected Output</h3>
              <pre className="example-block">
                {selectedProblem.exampleOutput}
              </pre>

              <p>
                Make sure your output matches the expected output.
              </p>
            </div>
          )}
        </section>

        <section className="editor-panel">
          <div className="editor-toolbar">
            <div className="editor-title">
              <span className="editor-dot" />
              <strong>Code Editor</strong>
            </div>

            <select
              value={language}
              onChange={(event) =>
                changeLanguage(event.target.value)
              }
              aria-label="Programming language"
            >
              {Object.keys(starterCodes).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="monaco-wrapper">
            <Editor
              height="350px"
              language={editorLanguages[language]}
              theme={darkMode ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => setCode(value ?? "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 16 },
                tabSize: 4,
              }}
            />
          </div>

          <div className="input-section">
            <label htmlFor="custom-input">Custom Input</label>
            <textarea
              id="custom-input"
              className="custom-input"
              placeholder="Enter input for your program..."
              value={customInput}
              onChange={(event) =>
                setCustomInput(event.target.value)
              }
              rows={3}
            />
          </div>

          <div className="editor-actions">
            <button
              className="run-button"
              onClick={runCode}
              disabled={running}
            >
              {running ? "Running..." : "▶ Run Code"}
            </button>

            <button
              className="submit-button"
              onClick={submitCode}
              disabled={running}
            >
              {running ? "Checking..." : "✓ Submit Code"}
            </button>
          </div>

          <div className="console-panel">
            <div className="console-heading">
              <h3>Test Results &amp; Console</h3>
              <button onClick={clearOutput}>Clear</button>
            </div>

            {testResults.length > 0 && (
              <div className="test-results-list">
                {testResults.map((test) => (
                  <div
                    key={test.number}
                    className={`test-result ${
                      test.passed ? "test-passed" : "test-failed"
                    }`}
                  >
                    <div className="test-result-heading">
                      <strong>Test Case {test.number}</strong>
                      <span className="test-status">
                        {test.passed
                          ? "✓ Passed"
                          : `✕ ${test.status}`}
                      </span>
                    </div>

                    <div className="test-result-details">
                      <p>
                        <strong>Input:</strong>
                        <code>{test.input || "(empty)"}</code>
                      </p>

                      <p>
                        <strong>Expected:</strong>
                        <code>{test.expected || "(empty)"}</code>
                      </p>

                      <p>
                        <strong>Actual:</strong>
                        <code>
                          {test.actual.trim() || "(no output)"}
                        </code>
                      </p>
                    </div>

                    {test.error && (
                      <pre className="test-error">{test.error}</pre>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="console-subheading">
              <h4>Console Output</h4>
            </div>

            <pre className="console-output">
              {output || "Run your code to see output here."}
            </pre>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>CodeSpace</span>
        <span>Keep learning, keep coding ✨</span>
      </footer>
    </div>
  );
}

export default App;
