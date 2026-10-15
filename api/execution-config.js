const REMOTE_LANGUAGES = ["javascript", "java", "c", "cpp", "python"];

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET requests are allowed." });
  }

  const configured = Boolean(
    process.env.JUDGE0_API_KEY && process.env.JUDGE0_API_URL
  );

  return res.status(200).json({
    configured,
    languages: configured ? REMOTE_LANGUAGES : [],
  });
}
