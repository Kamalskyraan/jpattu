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

    const data = await UserModel.getTTSales({ start, end });
    const quantity = await PurchaseModel.getTTStockQuantity();
    const user_count = await UserModel.getTTUsersCount();
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

// tt

export const getJPSalesTTReport = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await JpPurchaseModel.getTTSales({ start, end });
    const quantity = await JpPurchaseModel.getTTStockQuantity();
    const shadow_quantity = await PurchaseModel.getTTStockQuantity();
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

export const getTTShadowReport = async (req, res) => {
  try {
    const data = await PurchaseModel.getShadowTTQuantity();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};

export const getOuterTTSorceReport = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallTTShadowQty();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};

export const getTTJarikaiOverall = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallTTQuantity();

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

// RT

export const getRTSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserModel.getRTSales({ start, end });
    const quantity = await PurchaseModel.getRTStockQuantity();
    const user_count = await UserModel.getRTUsersCount();
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

export const getRTJarikaiOverall = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallRTQuantity();

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

export const getShadowReportRT = async (req, res) => {
  try {
    const data = await PurchaseModel.getShadowQuantityRT();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};

export const getOuterRTSorceReport = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallRTShadowQty();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};

// NP

export const getNPSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserModel.getNPSales({ start, end });
    const quantity = await PurchaseModel.getNPStockQuantity();
    const user_count = await UserModel.getNPUsersCount();
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

export const getNPJarikaiOverall = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallNPQuantity();

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

export const getShadowReportNP = async (req, res) => {
  try {
    const data = await PurchaseModel.getShadowQuantityNP();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};

export const getOuterNPSorceReport = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallNPShadowQty();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};

// fs

export const getFSSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserModel.getFSSales({ start, end });

    const quantity = await PurchaseModel.getFSStockQuantity();

    const user_count = await UserModel.getFSUsersCount();
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

export const getFSJarikaiOverall = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallFSQuantity();

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

export const getShadowReportFS = async (req, res) => {
  try {
    const data = await PurchaseModel.getShadowQuantityFS();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};

export const getOuterFSSorceReport = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallFSShadowQty();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};

// kr

export const getKRSalesReport = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserModel.getKRSales({ start, end });

    const quantity = await PurchaseModel.getKRStockQuantity();

    const user_count = await UserModel.getKRUsersCount();
    
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


export const getShadowReportKR = async (req, res) => {
  try {
    const data = await PurchaseModel.getShadowQuantityKR();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};



export const getOuterKRSorceReport = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallKRShadowQty();
    return res.status(200).json({
      data,
      message: "Shadow Stocks Fetched Successfully",
    });
  } catch (err) {
    res.status(500).josn({ message: "Internal Server Error" });
  }
};



export const getKRJarikaiOverall = async (req, res) => {
  try {
    const data = await PurchaseModel.getOverallKRQuantity();

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