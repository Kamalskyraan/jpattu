import express from "express";
import {
  getMembersCount,
  getTree,
  getTreeForRT,
  getTreeForTT,
  getTTMemberOnLevel,
  getTTMembersCount,
} from "../controllers/tree.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTreeForRT);
router.get("/member-count", verifyUser, getTTMembersCount);

router.get("/:level", verifyUser, getTTMemberOnLevel);
export default router;
