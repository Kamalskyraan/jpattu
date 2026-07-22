import express from "express";
import {
  approveUser,
  getHomeDetails,
  getAllUsers,
  UpdateAdmin,
  AddQueuedUser,
  getQueuedUsers,
  searchUser,
  getAllTTUsers,
  approveTTUser,
  searchTTUser,
  getTTQueuedUsers,
  AddQueuedTTUser,
  showAddMember,
  getAllRTUsers,
  approveRTUser,
  searchRTUser,
  getRTQueuedUsers,
  AddQueuedRTUser,
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
// TT
router.get("/tt-users", verifyAdmin, getAllTTUsers);
router.post("/approve-tt", verifyAdmin, approveTTUser);
router.get("/search-tt-user/:user_id", verifyAdmin, searchTTUser);

router.get("/queued-users/tt", verifyAdmin, getTTQueuedUsers);
router.post("/add-user/tt", verifyAdmin, AddQueuedTTUser);
router.post("/show-add-member", verifyAdmin, showAddMember);

//RT
router.get("/rt-users", verifyAdmin, getAllRTUsers);
router.post("/approve-rt", verifyAdmin, approveRTUser);
router.get("/search-rt-user/:user_id", verifyAdmin, searchRTUser);
router.get("/queued-users/rt", verifyAdmin, getRTQueuedUsers);
router.post("/add-user/rt", verifyAdmin, AddQueuedRTUser);

export default router;
