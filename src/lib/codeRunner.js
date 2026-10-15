import { usesRemoteExecution } from "../data/languages";
import { executePython } from "./pythonRunner";
import { executeRemote } from "./remoteRunner";

export async function executeCode(language, code, stdin = "") {
  if (!usesRemoteExecution(language)) {
    try {
      const stdout = await executePython(code, stdin);
      return {
        configured: true,
        notConfigured: false,
        ok: true,
        status: "Success",
        stdout,
        stderr: "",
        compileOutput: "",
      };
    } catch (error) {
      return {
        configured: true,
        notConfigured: false,
        ok: false,
        status: "Runtime Error",
        stdout: "",
        stderr: error.message,
        compileOutput: "",
      };
    }
  }

  return executeRemote(language, code, stdin);
}
