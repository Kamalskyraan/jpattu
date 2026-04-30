import express from "express";
import {
  approveUser,
  getHomeDetails,
  getAllUsers,
  UpdateAdmin,
  AddQueuedUser,
  getQueuedUsers,
  searchUser,
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/auth.js";
import { getAllPayouts } from "../controllers/users.controller.js";

const router = express.Router();

router.put("/", verifyAdmin, UpdateAdmin);
router.post("/approve", verifyAdmin, approveUser);
router.post("/add-user", verifyAdmin, AddQueuedUser);
router.get("/users", verifyAdmin, getAllUsers);
router.get("/payouts", verifyAdmin, getAllPayouts);
router.get("/queued-users", verifyAdmin, getQueuedUsers);
router.get("/data/:user_id", verifyAdmin, getHomeDetails);
router.get("/search-user/:user_id", verifyAdmin, searchUser);

export default router;
