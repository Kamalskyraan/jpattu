import { validationResult } from "express-validator";
import LinksModel from "../models/links.model.js";

export const getLink = async (req, res) => {
  try {
    const data = await LinksModel.getLinks();
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addLink = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.map((err) => err.msg),
      });
    }

    await LinksModel.addLink(data);
    res.status(201).json({ message: "Link added Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editLink = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.map((err) => err.msg),
      });
    }

    await LinksModel.editLink(data);
    res.status(200).json({ message: "Link updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params || false;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    await LinksModel.deleteLink(id);
    res.status(200).json({ message: "Link deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
