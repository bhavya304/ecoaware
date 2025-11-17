const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const response = await axios.post("http://localhost:5001/analyze-image", {
      imageUrl
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

module.exports = router;
