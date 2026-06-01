import express from "express";


import { getTree, getTreeForTT } from "../controllers/tree.controller.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyUser, getTreeForTT);

export default router;
