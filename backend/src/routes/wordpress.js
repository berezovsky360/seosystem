import express from "express";
import Site from "../models/Site.js";
import { decrypt } from "../utils/crypto.js";
import {
  createDraft,
  fetchPosts,
  publishPost,
  syncPost,
} from "../services/wordpress.js";

const router = express.Router();

router.get("/posts", async (req, res, next) => {
  try {
    const sites = await Site.find();
    const posts = await Promise.all(
      sites.map(async (site) => {
        const auth = {
          url: site.url,
          username: site.username,
          appPassword: decrypt(site.appPasswordEncrypted),
        };
        const items = await fetchPosts(auth);
        return { siteId: site._id, siteName: site.name, posts: items };
      })
    );

    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.post("/posts/:siteId/draft", async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.siteId);
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    const post = await createDraft(
      {
        url: site.url,
        username: site.username,
        appPassword: decrypt(site.appPasswordEncrypted),
      },
      req.body
    );

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.post("/posts/:siteId/:postId/publish", async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.siteId);
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    const post = await publishPost(
      {
        url: site.url,
        username: site.username,
        appPassword: decrypt(site.appPasswordEncrypted),
      },
      req.params.postId
    );

    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.post("/posts/:siteId/:postId/sync", async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.siteId);
    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    const post = await syncPost(
      {
        url: site.url,
        username: site.username,
        appPassword: decrypt(site.appPasswordEncrypted),
      },
      req.params.postId,
      req.body
    );

    res.json(post);
  } catch (error) {
    next(error);
  }
});

export default router;
