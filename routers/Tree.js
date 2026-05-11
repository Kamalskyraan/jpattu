import express from "express";
import {
  getMemberOnLevel,
  getMembersCount,
  getTree,
  getTreeChart,
  getTreeChartForTT,
  getTreeForTT,
} from "../controllers/tree.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTree);

router.get("/member-count", verifyUser, getMembersCount);

router.get("/:level", verifyUser, getMemberOnLevel);

router.get("/tree/:id", verifyUser, getTreeChart);

//TT
router.get("/tt", verifyUser, getTreeForTT);
router.get("/tree:id", verifyUser, getTreeChartForTT);
// router.get("/:level", verifyUser, getMemberOnLevel);
export default router;
