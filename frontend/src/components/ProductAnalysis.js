import React, { useState } from "react";
import axios from "axios";

const ProductAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("userId", "demo-user");

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("http://localhost:5001/ai/analyze-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err) {
      setError("⚠️ Failed to analyze image. Check backend logs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>♻️ Product Sustainability Analysis</h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {preview && (
        <div style={{ textAlign: "center", marginTop: "15px", marginBottom: "20px" }}>
          <img
            src={preview}
            alt="preview"
            width="250"
            style={{ borderRadius: "12px", boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}
          />
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <button
          onClick={handleUpload}
          style={{
            background: "#2e7d32",
            color: "white",
            padding: "12px 28px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
          disabled={loading}
        >
          {loading ? "🔄 Analyzing..." : "Analyze Image"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "30px",
            background: "#fdfdfd",
            borderRadius: "16px",
            padding: "25px",
            boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: "20px", textAlign: "center" }}>✅ Analysis Result</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
            <div style={{ background: "#e8f5e9", padding: "15px", borderRadius: "10px" }}>
              <strong>Score:</strong> {result.score}
            </div>
            <div style={{ background: "#fff3e0", padding: "15px", borderRadius: "10px" }}>
              <strong>Disposal:</strong> {result.disposal}
            </div>
            <div style={{ background: "#e3f2fd", padding: "15px", borderRadius: "10px" }}>
              <strong>Carbon:</strong> {result.carbon_kg} kg
            </div>
            <div style={{ background: "#fce4ec", padding: "15px", borderRadius: "10px" }}>
              <strong>Materials:</strong> {result.detected_materials?.join(", ") || "N/A"}
            </div>
            <div style={{ background: "#f1f8e9", padding: "15px", borderRadius: "10px" }}>
              <strong>Alternatives:</strong>
              {result.alt_products && result.alt_products.length > 0 ? (
                <ul style={{ margin: "5px 0 0 0", paddingLeft: "18px" }}>
                  {result.alt_products.map((item, idx) => (
                    <li key={idx}>{typeof item === "string" ? item : item.name || JSON.stringify(item)}</li>
                  ))}
                </ul>
              ) : (
                "None"
              )}
            </div>
            <div style={{ background: "#ede7f6", padding: "15px", borderRadius: "10px" }}>
              <strong>Confidence:</strong> {result.confidence}
            </div>
            <div style={{ background: result.alert ? "#ffebee" : "#e8f5e9", padding: "15px", borderRadius: "10px" }}>
              <strong>Alert:</strong> {result.alert ? "⚠️ Yes" : "✅ No"}
            </div>
            <div style={{ background: "#f0f4c3", padding: "15px", borderRadius: "10px" }}>
              <strong>Method:</strong> {result.analysis_method}
            </div>
          </div>

          <p style={{ marginTop: "20px", fontSize: "13px", color: "gray", textAlign: "center" }}>
            🕒 {result.timestamp}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductAnalysis;
