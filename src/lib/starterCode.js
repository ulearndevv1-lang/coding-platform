function commentBlock(problem, prefix) {
  const lines = [
    `${problem.title}`,
    problem.description,
  ];
  return lines.map((line) => `${prefix} ${line}`).join("\n");
}

const builders = {
  python: (problem) => problem.starterCode,

  javascript: (problem) =>
    `${commentBlock(problem, "//")}\nconst fs = require("fs");\nconst input = fs.readFileSync(0, "utf8");\n// Write your solution below\n`,

  java: (problem) =>
    `${commentBlock(problem, "//")}\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n`,

  c: (problem) =>
    `${commentBlock(problem, "//")}\n#include <stdio.h>\n\nint main(void) {\n    // Write your solution here\n    return 0;\n}\n`,

  cpp: (problem) =>
    `${commentBlock(problem, "//")}\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n`,
};

export function getStarterCode(problem, languageId) {
  const build = builders[languageId] || builders.python;
  return build(problem);
}
