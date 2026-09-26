import express from "express";
import authorController from "../controllers/authorController.js";

const router = express.Router();

router.get("/", authorController.list);
router.get("/:id", authorController.profile);

export default router;
