import express from "express";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=20&lang=en`,
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Photon search error:", error);
    res.status(500).json({ message: "Search failed" });
  }
});

router.get("/reverse", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    const response = await fetch(
      `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}&lang=en`,
    );

    if (!response.ok) {
      console.error("Photon failed:", response.status);
      return res.json({ features: [] }); 
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Photon reverse error:", error);
    res.json({ features: [] }); 
  }
});

export default router;
