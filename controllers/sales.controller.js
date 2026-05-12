import { JpPurchaseModel, PurchaseModel } from "../models/purchase.model.js";
import { UserModel } from "../models/users.model.js";

export const getSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserModel.getSales({ start, end });
    const quantity = await PurchaseModel.getStockQuantity();
    const user_count = await UserModel.getUsersCount();
    const available_quantity =
      quantity - user_count < 0 ? 0 : quantity - user_count;
    res
      .status(200)
      .json({ data: data, available_quantity: available_quantity });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getTTSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserModel.getSales({ start, end });
    const quantity = await PurchaseModel.getStockQuantity();
    const user_count = await UserModel.getUsersCount();
    const available_quantity =
      quantity - user_count < 0 ? 0 : quantity - user_count;
    res
      .status(200)
      .json({ data: data, available_quantity: available_quantity });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJPSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await JpPurchaseModel.getSales({ start, end });
    const quantity = await JpPurchaseModel.getStockQuantity();
    const shadow_quantity = await PurchaseModel.getStockQuantity();
    const available_quantity =
      quantity - shadow_quantity < 0 ? 0 : quantity - shadow_quantity;
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

export const getJarikaiOverall = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallQuantity();

    return res.status(200).json({
      data: {
        over_all_sales: data.sales_quantity,
        over_all_stock: data.stock_quantity,
        start: data.start,
        end: data.end,
      },
      message: "Jarikai Overall Stocks Fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getShadowReport = async (req, res) => {
  try {
    const data = await PurchaseModel.getShadowQuantity();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};

export const getOuterSorceReport = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallShadowQty();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};
