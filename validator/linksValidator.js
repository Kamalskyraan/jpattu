import { body } from "express-validator";

export const addLinkValidator = [
  body("type").notEmpty().withMessage("Type is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("link").notEmpty().withMessage("Link is required"),
];
export const editLinkValidator = [
  body("id").notEmpty().withMessage("Id is required"),
  body("type").notEmpty().withMessage("Type is required"),
  body("name").notEmpty().withMessage("Name is required"),
  body("link").notEmpty().withMessage("Link is required"),
];
