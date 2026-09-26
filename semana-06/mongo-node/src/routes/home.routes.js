import express from "express";
import postService from "../services/postService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [posts, authors] = await Promise.all([postService.getPosts(), postService.getAuthors()]);
    res.render("home", {
      stats: { posts: posts.length, authors: authors.length },
      latest: posts.slice(-3).reverse()
    });
  } catch (error) {
    res.render("home", { stats: { posts: 0, authors: 0 }, latest: [] });
  }
});

export default router;
