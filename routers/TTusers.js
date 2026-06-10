import express from "express";
import { getTTUser, getTTUserName } from "../controllers/users.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getTTUserName);
router.get("/:user_id", verifyUser, getTTUser);
export default router;
