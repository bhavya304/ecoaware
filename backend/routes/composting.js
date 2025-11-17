const express = require("express");
const router = express.Router();

// Compostable items list
const compostableList = [
  "vegetable peels",
  "fruit scraps",
  "tea leaves",
  "coffee grounds",
  "eggshells",
  "paper",
  "garden waste",
  "leaves"
];

// Videos mapped to languages
const compostVideos = {
  en: "https://www.youtube.com/embed/dRXNo7Ieky8", // English tutorial
  hi: "https://www.youtube.com/embed/Gc2EnSdlQ30", // Hindi
  te: "https://www.youtube.com/embed/X9gws9E9rWc"  // Telugu
};

// 1️⃣ Classify items, auto-generate steps & video
router.post("/classify", (req, res) => {
  const { items, language } = req.body;
  const lang = language || "en";

  if (!items || !items.trim()) {
    return res.status(400).json({ error: "No items provided" });
  }

  const itemArr = items.split(",").map((i) => i.trim().toLowerCase());

  const compostable = [];
  const nonCompostable = [];

  itemArr.forEach((item) => {
    if (compostableList.includes(item)) {
      compostable.push(item);
    } else {
      nonCompostable.push(item);
    }
  });

  // Generate default steps
  const steps = compostable.length
    ? [
        "Collect compostable items in a separate bin.",
        "Mix dry waste (paper, leaves) with wet waste (vegetable peels, fruit scraps).",
        "Maintain proper moisture (damp, not soggy).",
        "Turn the pile every few days for aeration.",
        "After 4-6 weeks, you’ll get rich compost for plants."
      ]
    : ["No compostable items found. Try again with organic waste."];

  const videoUrl = compostVideos[lang] || compostVideos.en;

  res.json({
    compostable,
    nonCompostable,
    steps,
    videoUrl
  });
});

// 2️⃣ Endpoint to change video language independently
router.post("/video", (req, res) => {
  const { language } = req.body;
  const videoUrl = compostVideos[language] || compostVideos.en;
  res.json({ videoUrl });
});

module.exports = router;
