import express from "express";

import {
  getMembersCount,
  getTree,
  getTreeForTT,
  getTTMemberOnLevel,
  getTTMembersCount,
} from "../controllers/tree.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTreeForTT);
router.get("/member-count", verifyUser, getTTMembersCount);

router.get("/:level", verifyUser, getTTMemberOnLevel);
export default router;
