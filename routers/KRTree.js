import express from "express";
import {
  getKRMemberOnLevel,
  getKRMembersCount,
  getMembersCount,
  getMRMemberOnLevel,
  getMRMembersCount,
  getTree,
  getTreeForFS,
  getTreeForKR,
  getTreeForNP,
  getTreeForRT,
  getTreeForTT,
  getTTMemberOnLevel,
  getTTMembersCount,
} from "../controllers/tree.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTreeForKR);

router.get("/member-count", verifyUser, getKRMembersCount);

router.get("/:level", verifyUser, getKRMemberOnLevel);
export default router;
