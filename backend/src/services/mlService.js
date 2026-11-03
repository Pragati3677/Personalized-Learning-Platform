const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8001";

const predictLearningLevel = async (features) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/classify/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(features),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.detail
          ? JSON.stringify(data.detail)
          : `ML service returned status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error("ML Service Error:", error.message);
    throw error;
  }
};

module.exports = {
  predictLearningLevel,
};