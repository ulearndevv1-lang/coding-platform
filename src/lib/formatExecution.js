export function formatExecutionMessage(result) {
  if (result.notConfigured) {
    return result.message || "Remote execution is not configured.";
  }

  if (result.message && !result.stdout && !result.compileOutput && !result.stderr) {
    return result.message;
  }

  const lines = [];

  if (result.status) {
    lines.push(`Status: ${result.status}`);
  }

  if (result.compileOutput) {
    lines.push("", "Compilation output:", result.compileOutput);
  }

  if (result.stderr) {
    lines.push("", "Runtime / stderr:", result.stderr);
  }

  if (result.stdout !== undefined && result.stdout !== "") {
    lines.push("", "Program output:", result.stdout);
  } else if (!result.compileOutput && !result.stderr && result.ok) {
    lines.push("", "(No output)");
  }

  if (result.time != null) {
    lines.push("", `Time: ${result.time}s`);
  }

  if (lines.length === 0) {
    return result.message || "No execution result.";
  }

  return lines.join("\n");
}

export function stdoutForComparison(result) {
  if (result.notConfigured) {
    return "";
  }
  if (result.compileOutput) {
    return `[Compilation Error]\n${result.compileOutput}`;
  }
  if (result.stderr && !result.stdout) {
    return result.stderr;
  }
  return (result.stdout || "").trim();
}
