import express from "express";
import {
  getFSMembersCount,
  getMembersCount,
  getMRMemberOnLevel,
  getMRMembersCount,
  getTree,
  getTreeForFS,
  getTreeForNP,
  getTreeForRT,
  getTreeForTT,
  getTTMemberOnLevel,
  getTTMembersCount,
} from "../controllers/tree.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTreeForFS);
router.get("/member-count", verifyUser, getFSMembersCount);

router.get("/:level", verifyUser, getMRMemberOnLevel);
export default router;
