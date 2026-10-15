import { loadPyodide, version as pyodideVersion } from "pyodide";

let pyodidePromise = null;

export function preloadPythonRuntime() {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide({
      indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
    });
  }
  return pyodidePromise;
}

export async function executePython(source, inputText) {
  const runtime = await preloadPythonRuntime();

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

  if (error) {
    throw new Error(error);
  }
  if (stderr) {
    throw new Error(stderr);
  }
  return stdout;
}
