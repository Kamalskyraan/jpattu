import express from "express";
import {
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


router.get("/member-count", verifyUser, getMRMembersCount);

router.get("/:level", verifyUser, getMRMemberOnLevel);
export default router;
