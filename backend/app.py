
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import tempfile
import os

app = Flask(__name__)

# Allow requests from your CodeSpace frontend
CORS(app, resources={
    r"/run": {"origins": ["http://localhost:5175"]}
})


@app.route("/run", methods=["POST"])
def run_code():
    data = request.get_json(silent=True) or {}

    code = data.get("code", "")
    user_input = data.get("input", "")
    expected_output = data.get("expectedOutput")

    if not isinstance(code, str) or not code.strip():
        return jsonify({
            "output": "",
            "error": "Please enter some Python code.",
            "passed": False
        }), 400

    if not isinstance(user_input, str):
        return jsonify({
            "output": "",
            "error": "Input must be text.",
            "passed": False
        }), 400

    result = {
        "output": "",
        "error": "",
        "passed": None
    }

    try:
        with tempfile.TemporaryDirectory() as folder:
            file_path = os.path.join(folder, "main.py")

            with open(file_path, "w", encoding="utf-8") as file:
                file.write(code)

            process = subprocess.run(
                ["python3", "-I", file_path],
                input=user_input,
                capture_output=True,
                text=True,
                timeout=5,
                cwd=folder
            )

            result["output"] = process.stdout
            result["error"] = process.stderr

            if expected_output is not None:
                result["expectedOutput"] = str(expected_output)

                result["passed"] = (
                    process.returncode == 0
                    and process.stdout.strip()
                    == str(expected_output).strip()
                )

                if process.returncode != 0:
                    result["status"] = "Runtime Error"
                elif result["passed"]:
                    result["status"] = "Accepted"
                else:
                    result["status"] = "Wrong Answer"

    except subprocess.TimeoutExpired:
        result["error"] = "Execution timed out (5-second limit)."
        result["passed"] = False
        result["status"] = "Time Limit Exceeded"

    except Exception as error:
        result["error"] = str(error)
        result["passed"] = False
        result["status"] = "Runtime Error"

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
