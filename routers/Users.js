import express from "express";
import {
  getHomeDetails,
  getPaymentDetails,
  getTempUser,
  getUser,
  getUserName,
  paidProof,
  updateUser,
  deleteTempUser,
  getUserDetails,
  getAdminData,
  TTPaidProof,
  getTTUserName,
  getTempTTUser,
  updateTTUser,
  getTTUser,
  deleteTempTTUser,
  RTPaidProof,
  deleteTempRTUser,
  getRTUserName,
  getRTUser,
  getTempRTUser,
  updateRTUser,
  NPPaidProof,
  getNPUserName,
  getNPUser,
  getTempNPUser,
  updateNPUser,
  FSPaidProof,
  deleteTempFSUser,
  getTempFSUser,
  getFSUserName,
  updateFSUser,
  getFSUser,
} from "../controllers/users.controller.js";
import multer from "multer";
import path from "path";
import { updateValidation } from "../validator/authValidator.js";
import { verifyUser } from "../middlewares/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "" +
        Math.floor(Math.random() * 99) +
        path.extname(file.originalname),
    );
  },
  destination: (req, file, cb) => {
    cb(null, "public/screenshots");
  },
});

const screenshots = multer({
  storage: storage,
  limits: 5 * 1024 * 1024,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router.delete("/delete-user/:id", deleteTempUser);

router.post("/paidProof", screenshots.single("image"), paidProof);
router.put("/", verifyUser, updateValidation, updateUser);
router.get("/", getUserName);
router.get("/payment-details", getPaymentDetails);
router.get("/data/:user_id", verifyUser, getHomeDetails);
router.get("/temp/:user_id", getTempUser);
router.get("/:user_id", verifyUser, getUser);
router.post("/user-id", getUserDetails);

// tt
router.post("/tt-paidproof", screenshots.single("image"), TTPaidProof);
router.get("/tt", getTTUserName);
router.get("/temp/tt/:user_id", getTempTTUser);
router.get("/tt/:user_id", verifyUser, getTTUser);
router.put("/tt", verifyUser, updateValidation, updateTTUser);
router.delete("/tt-delete-user/:id", deleteTempTTUser);

// rt
router.post("/rt-paidproof", screenshots.single("image"), RTPaidProof);
router.delete("/rt-delete-user/:id", deleteTempRTUser);
router.get("/rt", getRTUserName);
router.get("/rt/:user_id", verifyUser, getRTUser);
router.get("/temp/rt/:user_id", getTempRTUser);
router.put("/rt", verifyUser, updateValidation, updateRTUser);

// NP

router.post("/np-paidproof", screenshots.single("image"), NPPaidProof);
router.get("/np", getNPUserName);
router.get("/np/:user_id", verifyUser, getNPUser);
router.get("/temp/np/:user_id", getTempNPUser);
router.put("/np", verifyUser, updateValidation, updateNPUser);


// Focus

router.post("/fs-paidproof", screenshots.single("image"), FSPaidProof);
router.delete("/fs-delete-user/:id", deleteTempFSUser);
router.get("/temp/fs/:user_id", getTempFSUser);
router.get("/fs", getFSUserName);
router.put("/fs", verifyUser, updateValidation, updateFSUser);
router.get("/fs/:user_id", verifyUser, getFSUser);
export default router;
