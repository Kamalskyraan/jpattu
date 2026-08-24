import express from "express";
import {
  getFSLevels,
  getLevels,
  getNPLevels,
  getRTLevels,
  getTTLevels,
} from "../controllers/levels.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getLevels);
router.get("/tt", verifyUser, getTTLevels);
router.get("/rt", verifyUser, getRTLevels);
router.get("/np", verifyUser, getNPLevels);
router.get("/fs", verifyUser, getFSLevels);

export default router;
