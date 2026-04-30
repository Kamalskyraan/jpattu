import express from "express";
import { getLevels } from "../controllers/levels.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getLevels);

export default router;
