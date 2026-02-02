import express from "express";
import { fetchSerpResults, generateAiContent } from "../services/ai.js";

const router = express.Router();

router.post("/serp", async (req, res, next) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: "Keyword is required" });
    }
    const serp = await fetchSerpResults(keyword);
    res.json(serp);
  } catch (error) {
    next(error);
  }
});

router.post("/generate", async (req, res, next) => {
  try {
    const payload = await generateAiContent(req.body);
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

export default router;
