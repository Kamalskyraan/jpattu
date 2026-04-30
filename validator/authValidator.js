import { body } from "express-validator";

export const validateRegister = [
  body("referral_id").notEmpty().withMessage("referral_id is required"),
  body("sponsor_name").notEmpty().withMessage("sponsor_name is required"),
  body("mobile").isLength({ min: 10, max: 10 }).withMessage("Mobile number is invalid"),
  body("password").isLength({ min: 5 }).withMessage("Password must be atleast 5 letters"),
];

export const validateLogin = [
  body("user_id").notEmpty().withMessage("user_id is required"),
  body("password").notEmpty().withMessage("password is required"),
];

export const updateValidation = [
  body("email").optional().isEmail().withMessage("Email is invalid"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 letters"),
];
