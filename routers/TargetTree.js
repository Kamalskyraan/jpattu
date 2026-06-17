import express from "express";

import { getMembersCount, getTree, getTreeForTT, getTTMembersCount } from "../controllers/tree.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTreeForTT);
router.get("/member-count", verifyUser, getTTMembersCount);
export default router;
