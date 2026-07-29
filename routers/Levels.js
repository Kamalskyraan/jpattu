import express from "express";
import {
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

export default router;
