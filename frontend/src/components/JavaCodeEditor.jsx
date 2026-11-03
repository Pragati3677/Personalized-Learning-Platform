
import { useState } from "react";

const starterCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`;

export default function JavaCodeEditor() {
  const [sourceCode, setSourceCode] = useState(starterCode);
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runCode = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in before running Java code.");
      }

      const response = await fetch(
        "http://localhost:5000/api/java-compiler/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sourceCode, stdin }),
          signal: AbortSignal.timeout(65000),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to execute Java code."
        );
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err.name === "TimeoutError" || err.name === "AbortError"
          ? "The request timed out. Please try again."
          : err.message || "Unable to connect to the compiler."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-indigo-950">
          Java Code Editor
        </h3>
        <p className="text-sm text-slate-500">
          Write Java code, provide input, and run it.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Source Code
        </label>
        <textarea
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          spellCheck={false}
          className="w-full min-h-80 rounded-lg border border-slate-300
            bg-slate-950 p-4 font-mono text-sm text-green-300
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Custom Input (stdin)
        </label>
        <textarea
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="Enter input for your program, if required..."
          rows={3}
          className="w-full rounded-lg border border-slate-300 p-3
            font-mono text-sm focus:outline-none focus:ring-2
            focus:ring-indigo-500"
        />
      </div>

      <button
        type="button"
        onClick={runCode}
        disabled={loading || !sourceCode.trim()}
        className="btn-primary justify-center disabled:opacity-50"
      >
        {loading ? "Compiling..." : "▶ Run Code"}
      </button>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3
          text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="flex justify-between gap-3">
            <strong>Execution Result</strong>
            <span
              className={
                result.status === "Accepted"
                  ? "text-emerald-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {result.status}
            </span>
          </div>

          {result.output && (
            <div>
              <div className="text-sm font-semibold mb-1">Output</div>
              <pre className="whitespace-pre-wrap break-words rounded
                bg-slate-950 p-3 text-sm text-green-300">
                {result.output}
              </pre>
            </div>
          )}

          {result.compileOutput && (
            <div>
              <div className="text-sm font-semibold mb-1">
                Compilation Messages
              </div>
              <pre className="whitespace-pre-wrap break-words rounded
                bg-slate-100 p-3 text-sm text-red-700">
                {result.compileOutput}
              </pre>
            </div>
          )}

          {result.error && (
            <div>
              <div className="text-sm font-semibold mb-1">
                Error or Runtime Message
              </div>
              <pre className="whitespace-pre-wrap break-words rounded
                bg-slate-100 p-3 text-sm text-red-700">
                {result.error}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
