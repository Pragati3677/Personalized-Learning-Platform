
const JUDGE0_URL = process.env.JUDGE0_API_URL;
const JAVA_LANGUAGE_ID = Number(process.env.JUDGE0_LANGUAGE_ID);

async function runJavaCode(sourceCode, stdin = "") {
  if (!JUDGE0_URL) {
    throw new Error("JUDGE0_API_URL is missing in .env");
  }

  if (
    typeof sourceCode !== "string" ||
    !sourceCode.trim() ||
    sourceCode.length > 20000
  ) {
    throw new Error(
      "Java source code is required (maximum 20,000 characters)."
    );
  }

  const response = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: JAVA_LANGUAGE_ID,
        stdin: String(stdin).slice(0, 5000),
        cpu_time_limit: 2,
        wall_time_limit: 5,
        memory_limit: 128000,
      }),
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!response.ok) {
    throw new Error(`Judge0 returned HTTP ${response.status}`);
  }

  const result = await response.json();

  return {
    status: result.status?.description || "Unknown",
    output: result.stdout || "",
    compileOutput: result.compile_output || "",
    error: result.stderr || result.message || "",
    time: result.time || null,
  };
}

module.exports = { runJavaCode };
