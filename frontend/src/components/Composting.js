import React, { useState } from "react";
import axios from "axios";

function Composting({ user }) {
  const [items, setItems] = useState("");
  const [compostable, setCompostable] = useState([]);
  const [nonCompostable, setNonCompostable] = useState([]);
  const [steps, setSteps] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const handleClassify = async () => {
    if (!items.trim()) {
      alert("Please enter some items to classify!");
      return;
    }

    setLoading(true);
    try {
      // Send items and language to backend
      const res = await axios.post(
        "http://localhost:5001/ai/composting/classify",
        { items, language },
        { headers: { "Content-Type": "application/json" } }
      );

      const compost = res.data.compostable || [];
      const nonCompost = res.data.nonCompostable || [];
      const generatedSteps = res.data.steps || [];
      const video = res.data.videoUrl || "";

      setCompostable(compost);
      setNonCompostable(nonCompost);
      setSteps(generatedSteps);
      setVideoUrl(video);
    } catch (err) {
      console.error("Error in composting workflow:", err);
      alert("Something went wrong. Please check your backend.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Composting Guide</h1>

      {/* Info Section */}
      <div className="mb-6 bg-green-100 p-5 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">What is Composting?</h2>
        <p>
          Composting is the natural process of recycling organic matter such as
          vegetable scraps, leaves, and fruit peels into nutrient-rich soil.
        </p>
        <ul className="list-disc ml-6 mt-2">
          <li>Mix wet waste with dry waste (paper, leaves).</li>
          <li>Maintain proper moisture.</li>
          <li>Turn the pile every few days.</li>
          <li>After 4-6 weeks, you get rich compost.</li>
        </ul>
      </div>

      {/* Input Form */}
      <div className="mb-6 bg-black-100 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Enter Materials at Home</h2>
        <textarea
          className="w-full border rounded-lg p-4 text-lg"
          style={{ minHeight: "150px" }}
          placeholder="e.g., Banana peels, Onion skins, Tea leaves, Eggshells"
          value={items}
          onChange={(e) => setItems(e.target.value)}
        /><br/>
        <button
          onClick={handleClassify}
          disabled={loading}
          className="mt-3 px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-600 font-semibold transition duration-200"
        >
          {loading ? "Classifying..." : "Classify Items"}
        </button>
      </div>

      {/* Classification Results */}
      {(compostable.length > 0 || nonCompostable.length > 0) && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">✅ Compostable</h3>
            <ul className="list-disc ml-6 mt-2">
              {compostable.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">❌ Non-Compostable</h3>
            <ul className="list-disc ml-6 mt-2">
              {nonCompostable.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <div className="mb-6 bg-yellow-50 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">🪱 Composting Steps</h3>
          <ol className="list-decimal ml-6 mt-2">
            {steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Video */}
      {videoUrl && (
        <div className="mb-6">
          <label className="mr-2 font-semibold">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded mb-2"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
          </select>
          <iframe
            width="100%"
            height="400"
            src={videoUrl}
            title="Composting Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow"
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default Composting;
