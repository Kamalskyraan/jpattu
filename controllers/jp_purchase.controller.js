import { validationResult } from "express-validator";
import { JpPurchaseModel, PurchaseModel } from "../models/purchase.model.js";

export const getPurchaseReports = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }
    const data = await JpPurchaseModel.getPurchaseData({ start, end });
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

// tt

export const getPurchaseTTReports = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }
    const data = await JpPurchaseModel.getPurchaseTTData({ start, end });
    const total_quantity = await JpPurchaseModel.getPurchaseTTDataForTotal({
      start,
      end,
    });
    const quantity = await JpPurchaseModel.getTTStockQuantity();
    const shadow_quantity = await PurchaseModel.getTTStockQuantity();
    const available_quantity =
      quantity - shadow_quantity < 0 ? 0 : quantity - shadow_quantity;
    res.status(200).json({
      data: data,
      available_quantity: available_quantity,
      total_quantity,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addPurchaseTTData = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.map((err) => err.msg) });
    }

    const added = await JpPurchaseModel.addPurchaseTTData(data);
    if (added) res.status(200).json({ message: "Record added successfully" });
    else res.status(400).json({ message: "Unable to add data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editTTPurchaseData = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.id) {
      return res.status(400).json({ message: "id is required" });
    }
    const updated = await JpPurchaseModel.editTTPurchaseData(data);
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

export const deleteTTPurchaseData = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const deleted = await JpPurchaseModel.deleteTTPurchaseData(id);
    if (deleted) res.status(200).json({ message: "Data deleted successfully" });
    else res.status(400).json({ message: "Unable to delete data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSingleTTPurchaseReports = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const data = await JpPurchaseModel.getSingleTTPurchaseData(id);
    res.status(200).json({ data: data, message: "Data fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// RT

export const editRTPurchaseData = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.id) {
      return res.status(400).json({ message: "id is required" });
    }
    const updated = await JpPurchaseModel.editRTPurchaseData(data);
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

export const getPurchaseRTReports = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }
    const data = await JpPurchaseModel.getPurchaseRTData({ start, end });
    const total_quantity = await JpPurchaseModel.getPurchaseRTDataForTotal({
      start,
      end,
    });
    const quantity = await JpPurchaseModel.getRTStockQuantity();
    const shadow_quantity = await PurchaseModel.getRTStockQuantity();
    const available_quantity =
      quantity - shadow_quantity < 0 ? 0 : quantity - shadow_quantity;
    res.status(200).json({
      data: data,
      available_quantity: available_quantity,
      total_quantity,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRTPurchaseData = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const deleted = await JpPurchaseModel.deleteRTPurchaseData(id);
    if (deleted) res.status(200).json({ message: "Data deleted successfully" });
    else res.status(400).json({ message: "Unable to delete data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addPurchaseRTData = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.map((err) => err.msg) });
    }

    const added = await JpPurchaseModel.addPurchaseRTData(data);
    if (added) res.status(200).json({ message: "Record added successfully" });
    else res.status(400).json({ message: "Unable to add data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSingleRTPurchaseReports = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const data = await JpPurchaseModel.getSingleRTPurchaseData(id);
    res.status(200).json({ data: data, message: "Data fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// NP

export const addPurchaseNPData = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.map((err) => err.msg) });
    }

    const added = await JpPurchaseModel.addPurchaseNPData(data);
    if (added) res.status(200).json({ message: "Record added successfully" });
    else res.status(400).json({ message: "Unable to add data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPurchaseNPReports = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }
    const data = await JpPurchaseModel.getPurchaseNPData({ start, end });
    const total_quantity = await JpPurchaseModel.getPurchaseNPDataForTotal({
      start,
      end,
    });
    const quantity = await JpPurchaseModel.getNPStockQuantity();
    const shadow_quantity = await PurchaseModel.getNPStockQuantity();
    const available_quantity =
      quantity - shadow_quantity < 0 ? 0 : quantity - shadow_quantity;
    res.status(200).json({
      data: data,
      available_quantity: available_quantity,
      total_quantity,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNPPurchaseData = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const deleted = await JpPurchaseModel.deleteNPPurchaseData(id);
    if (deleted) res.status(200).json({ message: "Data deleted successfully" });
    else res.status(400).json({ message: "Unable to delete data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSingleNPPurchaseReports = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const data = await JpPurchaseModel.getSingleNPPurchaseData(id);
    res.status(200).json({ data: data, message: "Data fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editNPPurchaseData = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.id) {
      return res.status(400).json({ message: "id is required" });
    }
    const updated = await JpPurchaseModel.editNPPurchaseData(data);
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

// FS

export const getPurchaseFSReports = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }
    const data = await JpPurchaseModel.getPurchaseFSData({ start, end });
    const total_quantity = await JpPurchaseModel.getPurchaseFSDataForTotal({
      start,
      end,
    });
    const quantity = await JpPurchaseModel.getFSStockQuantity();

    const shadow_quantity = await PurchaseModel.getFSStockQuantity();

    const available_quantity =
      quantity - shadow_quantity < 0 ? 0 : quantity - shadow_quantity;
    res.status(200).json({
      data: data,
      available_quantity: available_quantity,
      total_quantity,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addPurchaseFSData = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.map((err) => err.msg) });
    }

    const added = await JpPurchaseModel.addPurchaseFSData(data);
    if (added) res.status(200).json({ message: "Record added successfully" });
    else res.status(400).json({ message: "Unable to add data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editFSPurchaseData = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.id) {
      return res.status(400).json({ message: "id is required" });
    }
    const updated = await JpPurchaseModel.editFSPurchaseData(data);

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

export const deleteFSPurchaseData = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const deleted = await JpPurchaseModel.deleteFSPurchaseData(id);
    if (deleted) res.status(200).json({ message: "Data deleted successfully" });
    else res.status(400).json({ message: "Unable to delete data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSingleFSPurchaseReports = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const data = await JpPurchaseModel.getSingleFSPurchaseData(id);
    res.status(200).json({ data: data, message: "Data fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// KR

export const addPurchaseKRData = async (req, res) => {
  try {
    const data = req.body;
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({ message: errors.map((err) => err.msg) });
    }

    const added = await JpPurchaseModel.addPurchaseKRData(data);
    if (added) res.status(200).json({ message: "Record added successfully" });
    else res.status(400).json({ message: "Unable to add data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getPurchaseKRReports = async (req, res) => {
  try {
    const { start, end } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }
    const data = await JpPurchaseModel.getPurchaseKRData({ start, end });


    const total_quantity = await JpPurchaseModel.getPurchaseKRDataForTotal({
      start,
      end,
    });

  

    const quantity = await JpPurchaseModel.getKRStockQuantity();

    const shadow_quantity = await PurchaseModel.getKRStockQuantity();

    const available_quantity =
      quantity - shadow_quantity < 0 ? 0 : quantity - shadow_quantity;
    res.status(200).json({
      data: data,
      available_quantity: available_quantity,
      total_quantity,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const deleteKRPurchaseData = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const deleted = await JpPurchaseModel.deleteKRPurchaseData(id);
    if (deleted) res.status(200).json({ message: "Data deleted successfully" });
    else res.status(400).json({ message: "Unable to delete data" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const getSingleKRPurchaseReports = async (req, res) => {
  try {
    const { id } = req.params || false;

    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const data = await JpPurchaseModel.getSingleKRPurchaseData(id);
    res.status(200).json({ data: data, message: "Data fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const editKRPurchaseData = async (req, res) => {
  try {
    const data = req.body;
    if (!data?.id) {
      return res.status(400).json({ message: "id is required" });
    }
    const updated = await JpPurchaseModel.editKRPurchaseData(data);

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