import express from "express";
import { getTTUserName } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getTTUserName);

export default router;
