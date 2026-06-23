import express from "express";
import { TTRegisterUser } from "../controllers/users.controller.js";
import { validateRegister } from "../validator/authValidator.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req, res) => {
    const status = res.statusCode;
    return status < 400;
  },

  message: "Too many failed attempts. Please try again later.",
});

const router = express.Router();

router.post("/tt-register", validateRegister, TTRegisterUser);

export default router;
