import express from "express";


import { getTree } from "../controllers/tree.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTree);

export default router;
