import CashbackModel from "../models/cashback.model.js";

export const getCashbackReport = async (req, res) => {
  try {
    const { status, start, end } = req.query || false;

    if (!start || !end) {
      return res.status(400).json({ message: "start date and end date is required" });
    }

    const data = await CashbackModel.getCashBackReport({ start, end, status });
    
    const sortedData = data.sort((a, b) =>
      a.user_id.localeCompare(b.user_id, undefined, { numeric: true, sensitivity: "base" })
    );

    res.status(200).json({ data: sortedData, message: "user cashbacks fetched" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserCashbackReport = async (req, res) => {
  try {
    const { user_id } = req.params || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const data = await CashbackModel.getUserCashBackReport(user_id);
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addCashback = async (req, res) => {
  try {
    const { user_id } = req.body || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const added = await CashbackModel.addCashBack(user_id);

    if (added) {
      res.status(200).json({ message: "cashback added successfully" });
    } else {
      res.status(500).json({ message: "Unable to add cashback" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCashback = async (req, res) => {
  try {
    const { ids } = req.body || false;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "ids is required and must be an array" });
    }

    const added = await CashbackModel.updateCashBack(ids);

    if (added) {
      res.status(200).json({ message: "cashback updated successfully" });
    } else {
      res.status(500).json({ message: "Unable to update cashback" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
