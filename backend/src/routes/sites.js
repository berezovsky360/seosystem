import express from "express";
import Site from "../models/Site.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import { checkSiteStatus } from "../services/wordpress.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const sites = await Site.find().sort({ createdAt: -1 });
    res.json(
      sites.map((site) => ({
        id: site._id,
        name: site.name,
        url: site.url,
        username: site.username,
        status: site.status,
        lastCheckedAt: site.lastCheckedAt,
      }))
    );
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, url, username, appPassword } = req.body;
    if (!name || !url || !username || !appPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const site = await Site.create({
      name,
      url,
      username,
      appPasswordEncrypted: encrypt(appPassword),
    });

    res.status(201).json({ id: site._id });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/status", async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    const status = await checkSiteStatus({
      url: site.url,
      username: site.username,
      appPassword: decrypt(site.appPasswordEncrypted),
    });

    site.status = status;
    site.lastCheckedAt = new Date();
    await site.save();

    res.json({ status });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Site.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
