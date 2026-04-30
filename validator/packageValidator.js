import { body } from "express-validator";

export const addPackageToUser = [
  body("level").isNumeric().withMessage("level is required"),
  body("user_data").notEmpty().withMessage("user_data is required"),
  body("user_data.user_id").notEmpty().withMessage("user_id is required"),
  body("user_data.name").notEmpty().withMessage("name is required"),
  body("user_data.mobile").isLength({ min: 10, max: 10 }).withMessage("Mobile number is invalid"),
  body("user_data.password").isLength({ min: 5 }).withMessage("Password must be atleast 5 letters"),
];
