export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  const apiKey = process.env.JUDGE0_API_KEY;
  const apiUrl = process.env.JUDGE0_API_URL;

  if (!apiKey || !apiUrl) {
    return res.status(500).json({
      error: "Judge0 API configuration is missing."
    });
  }

  const { code, language, stdin = "" } = req.body || {};

  const languageIds = {
    python: 71,
    javascript: 63,
    java: 62,
    c: 50,
    cpp: 54,
  };

  const languageId = languageIds[String(language).toLowerCase()];

  if (!code || !languageId) {
    return res.status(400).json({
      error:
        "Provide code and a supported language: Python, JavaScript, Java, C, or C++.",
    });
  }

  const rapidApiHost =
    process.env.JUDGE0_RAPIDAPI_HOST || "judge0-ce.p.rapidapi.com";
  const submissionUrl = `${apiUrl.replace(/\/$/, "")}/submissions?base64_encoded=false&wait=true`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (apiUrl.includes("rapidapi.com") || process.env.JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = apiKey;
    headers["X-RapidAPI-Host"] = rapidApiHost;
  }

  try {
    const response = await fetch(submissionUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: result.message || result.error || "Judge0 request failed."
      });
    }

    const compileOutput = result.compile_output || "";
    const stderr = result.stderr || "";

    return res.status(200).json({
      status: result.status?.description || "Unknown",
      output: result.stdout || "",
      stderr,
      compileOutput,
      error: compileOutput || stderr || result.message || "",
      time: result.time || null,
      memory: result.memory || null,
    });
  } catch {
    return res.status(500).json({
      error: "Unable to reach Judge0. Check the API URL and connection."
    });
  }
}