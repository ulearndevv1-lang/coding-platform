export const LANGUAGES = [
  {
    id: "python",
    label: "Python",
    monaco: "python",
    runtime: "browser",
  },
  {
    id: "javascript",
    label: "JavaScript",
    monaco: "javascript",
    runtime: "judge0",
  },
  {
    id: "java",
    label: "Java",
    monaco: "java",
    runtime: "judge0",
  },
  {
    id: "c",
    label: "C",
    monaco: "c",
    runtime: "judge0",
  },
  {
    id: "cpp",
    label: "C++",
    monaco: "cpp",
    runtime: "judge0",
  },
];

export function getLanguage(id) {
  return LANGUAGES.find((lang) => lang.id === id) || LANGUAGES[0];
}

export function usesRemoteExecution(languageId) {
  return getLanguage(languageId).runtime === "judge0";
}
