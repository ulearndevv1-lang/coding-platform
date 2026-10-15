import { apiUrl } from "./apiBase";

let configCache = null;

const UNAVAILABLE_MESSAGE =
  "The code execution API is not available on this dev server. Python still runs in your browser. For Java, C, C++, and JavaScript locally, run `npx vercel dev` (recommended) or deploy to Vercel with Judge0 env vars. See README.md.";

export async function fetchExecutionConfig() {
  if (configCache) {
    return configCache;
  }

  try {
    const response = await fetch(apiUrl("/api/execution-config"));

    if (response.status === 404) {
      configCache = {
        remoteConfigured: false,
        apiAvailable: false,
        supportedLanguages: [],
      };
      return configCache;
    }

    if (!response.ok) {
      configCache = {
        remoteConfigured: false,
        apiAvailable: true,
        supportedLanguages: [],
      };
      return configCache;
    }

    const data = await response.json();
    configCache = {
      remoteConfigured: Boolean(data.configured),
      apiAvailable: true,
      supportedLanguages: data.languages || [],
    };
    return configCache;
  } catch {
    configCache = {
      remoteConfigured: false,
      apiAvailable: false,
      supportedLanguages: [],
    };
    return configCache;
  }
}

export function clearExecutionConfigCache() {
  configCache = null;
}

export async function executeRemote(language, code, stdin = "") {
  let response;

  try {
    response = await fetch(apiUrl("/api/execute"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, stdin }),
    });
  } catch {
    return {
      configured: false,
      notConfigured: true,
      apiUnavailable: true,
      ok: false,
      message: UNAVAILABLE_MESSAGE,
      status: "API Unavailable",
      stdout: "",
      stderr: "",
      compileOutput: "",
    };
  }

  const data = await response.json().catch(() => ({}));

  if (response.status === 404) {
    return {
      configured: false,
      notConfigured: true,
      apiUnavailable: true,
      ok: false,
      message: UNAVAILABLE_MESSAGE,
      status: "API Unavailable",
      stdout: "",
      stderr: "",
      compileOutput: "",
    };
  }

  if (response.status === 500 && data.error?.includes("configuration")) {
    clearExecutionConfigCache();
    return {
      configured: false,
      notConfigured: true,
      apiUnavailable: false,
      ok: false,
      message:
        "Remote code execution is not configured on the server. Set JUDGE0_API_KEY and JUDGE0_API_URL on the host (see .env.example). Python still runs in your browser.",
      status: "Not Configured",
      stdout: "",
      stderr: "",
      compileOutput: "",
    };
  }

  if (!response.ok) {
    return {
      configured: true,
      notConfigured: false,
      apiUnavailable: false,
      ok: false,
      status: "Error",
      message: data.error || "Execution request failed.",
      stdout: data.output || "",
      stderr: data.stderr || "",
      compileOutput: data.compileOutput || "",
    };
  }

  const status = data.status || "Unknown";
  const compileOutput = data.compileOutput || "";
  const stderr = data.stderr || "";
  const stdout = data.output || "";
  const accepted = status === "Accepted";

  return {
    configured: true,
    notConfigured: false,
    apiUnavailable: false,
    ok: accepted && !compileOutput,
    status,
    stdout,
    stderr,
    compileOutput,
    time: data.time,
    memory: data.memory,
  };
}
