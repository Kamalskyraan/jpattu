import { validationResult } from "express-validator";
import { JpPurchaseModel, PurchaseModel } from "../models/purchase.model.js";

export const getPurchaseReports = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res.status(400).json({ message: "start date and end date is required" });
    }
    const data = await JpPurchaseModel.getPurchaseData({ start, end });
    const quantity = await JpPurchaseModel.getStockQuantity();
    const shadow_quantity = await PurchaseModel.getStockQuantity();
    const available_quantity = quantity - shadow_quantity < 0 ? 0 : quantity - shadow_quantity;
    res.status(200).json({
      data: data,
      available_quantity: available_quantity,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getSinglePurchaseReports = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const data = await JpPurchaseModel.getSinglePurchaseData(id);
    res.status(200).json({ data: data, message: "Data fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addPurchaseData = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.map((err) => err.msg) });
    }

    const added = await JpPurchaseModel.addPurchaseData(data);
    if (added) res.status(200).json({ message: "Record added successfully" });
    else res.status(400).json({ message: "Unable to add data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editPurchaseData = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.id) {
      return res.status(400).json({ message: "id is required" });
    }
    const updated = await JpPurchaseModel.editPurchaseData(data);
    if (updated) res.status(200).json({ message: "data updated successfully" });
    else res.status(400).json({ message: "Unable to update data" });
  } catch (err) {
    console.log(err);
    if (err.message === "no data") {
      res.status(500).json({ message: "Atleast 1 field is required" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const deletePurchaseData = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const deleted = await JpPurchaseModel.deletePurchaseData(id);
    if (deleted) res.status(200).json({ message: "Data deleted successfully" });
    else res.status(400).json({ message: "Unable to delete data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
