
const { runJavaCode } = require("../services/javaCompilerService");

const compileJavaCode = async (req, res) => {
  try {
    const { sourceCode, stdin = "" } = req.body;

    if (typeof sourceCode !== "string" || !sourceCode.trim()) {
      return res.status(400).json({
        success: false,
        message: "Java source code is required.",
      });
    }

    const result = await runJavaCode(sourceCode, stdin);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Java compiler error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Java compiler is temporarily unavailable.",
    });
  }
};

module.exports = { compileJavaCode };
