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
    java: 62,
    c: 50,
    cpp: 54
  };

  const languageId = languageIds[String(language).toLowerCase()];

  if (!code || !languageId) {
    return res.status(400).json({
      error: "Provide code and a supported language: Python, Java, C, or C++."
    });
  }

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/submissions?base64_encoded=false&wait=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        },
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

    return res.status(200).json({
      status: result.status?.description || "Unknown",
      output: result.stdout || "",
      error: result.stderr || result.compile_output || result.message || "",
      time: result.time || null,
      memory: result.memory || null
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to reach Judge0. Check the API URL and connection."
    });
  }
}