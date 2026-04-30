import { body } from "express-validator";

export const addPurchase = [
  body("gst_number").notEmpty().withMessage("gst_number is required"),
  body("hsn_code").notEmpty().withMessage("hsn_code is required"),
  body("purchase_id").notEmpty().withMessage("purchase_id is required"),
  body("purchase_date").notEmpty().withMessage("purchase_date is required"),
  body("supplier").notEmpty().withMessage("supplier is required"),
  body("quantity").notEmpty().withMessage("quantity is required"),
  body("amount").notEmpty().withMessage("amount is required"),
];
