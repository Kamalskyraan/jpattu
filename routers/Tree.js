import express from "express";
import {
  getMemberOnLevel,
  getMembersCount,
  getTree,
  getTreeChart,
} from "../controllers/tree.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTree);
router.get("/member-count", verifyUser, getMembersCount);

router.get("/:level", verifyUser, getMemberOnLevel);

router.get("/tree/:id", verifyUser, getTreeChart);

export default router;
