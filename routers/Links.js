import express from "express";
import { addLinkValidator, editLinkValidator } from "../validator/linksValidator.js";
import { addLink, deleteLink, editLink, getLink } from "../controllers/links.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyAdmin, getLink);
router.post("/", verifyAdmin, addLinkValidator, addLink);
router.put("/", verifyAdmin, editLinkValidator, editLink);
router.delete("/:id", verifyAdmin, deleteLink);

export default router;
