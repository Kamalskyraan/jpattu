import UserBalanceModel from "../models/userbalance.model.js";

export const getBalanceLogs = async (req, res) => {
  try {
    const { start, end, status } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserBalanceModel.getLogs({ start, end, status });

    const sortedData = data.sort((a, b) =>
      a.user_id.localeCompare(b.user_id, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

    res.status(200).json({ data: sortedData, message: "user logs fetched" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserBalanceLog = async (req, res) => {
  try {
    const { user_id } = req.params || false;
    const { start, end } = req.query || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    } else if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserBalanceModel.getUserLog({ user_id, start, end });
    console.log(data);
    return res
      .status(200)
      .json({ data: data, message: "Data fetched successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ data: data, message: "Internal Server Error" });
  }
};

export const updateBalanceStatus = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "ids is required and must be an array" });
    }

    await UserBalanceModel.updateBalance(ids);
    return res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const { user_id } = req.params || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    } else if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }

    const data = await UserBalanceModel.paymentHistory(user_id);
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLevelIncome = async (req, res) => {
  try {
    const { user_id } = req.params || false;
    const { start, end } = req.query || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserBalanceModel.getLevelIncome({ user_id, start, end });
    data.sort((a, b) => a.level - b.level);

    const maxLevel = 9;
    const base = 2;
    let sub_total = 0;
    const result = Array.from({ length: maxLevel }, (_, i) => {
      const level = i + 1;
      const members = base ** level;
      const record = data.find((item) => item.level === level);
      const entry = record ? record.count : 0;
      const income = level === 1 ? 100 : level == 9 ? 185 : 10;
      const total_income = income * entry;
      sub_total += total_income;

      return {
        level,
        members,
        entry,
        income,
        total_income,
      };
    });

    res.status(200).json({ data: result, sub_total: sub_total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const receivedAmount = async (req, res) => {
  try {
    const { user_id } = req.params || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    } else if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }
    const data = await UserBalanceModel.getReceivedAmount(user_id);
    res.status(200).json({ data: data, message: "user logs fetched" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// tt

export const getTTLevelIncome = async (req, res) => {
  try {
    const { user_id } = req.params || false;
    const { start, end } = req.query || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserBalanceModel.getTTLevelIncome({
      user_id,
      start,
      end,
    });
    data.sort((a, b) => a.level - b.level);

    const maxLevel = 3;
    const base = 2;
    let sub_total = 0;
    const result = Array.from({ length: maxLevel }, (_, i) => {
      const level = i + 1;
      const members = base ** level;
      const record = data.find((item) => item.level === level);
      const entry = record ? record.count : 0;
      const income = level === 1 ? 2000 : level == 3 ? 11500 : 1000;
      const total_income = income * entry;
      sub_total += total_income;

      return {
        level,
        members,
        entry,
        income,
        total_income,
      };
    });

    res.status(200).json({ data: result, sub_total: sub_total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTTBalanceLogs = async (req, res) => {
  try {
    const { start, end, status } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserBalanceModel.getTTLogs({ start, end, status });

    const sortedData = data.sort((a, b) =>
      a.user_id.localeCompare(b.user_id, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

    res.status(200).json({ data: sortedData, message: "user logs fetched" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTTBalanceStatus = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "ids is required and must be an array" });
    }

    await UserBalanceModel.updateTTBalance(ids);
    return res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const receivedTTAmount = async (req, res) => {
  try {
    const { user_id } = req.params || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    } else if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }
    const data = await UserBalanceModel.getReceivedTTAmount(user_id);
    res.status(200).json({ data: data, message: "user logs fetched" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// RT

export const getRTBalanceLogs = async (req, res) => {
  try {
    const { start, end, status } = req.query || false;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserBalanceModel.getRTLogs({ start, end, status });

    const sortedData = data.sort((a, b) =>
      a.user_id.localeCompare(b.user_id, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

    res.status(200).json({ data: sortedData, message: "user logs fetched" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateRTBalanceStatus = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "ids is required and must be an array" });
    }

    await UserBalanceModel.updateRTBalance(ids);
    return res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRTLevelIncome = async (req, res) => {
  try {
    const { user_id } = req.params || false;
    const { start, end } = req.query || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "start date and end date is required" });
    }

    const data = await UserBalanceModel.getRTLevelIncome({
      user_id,
      start,
      end,
    });
    data.sort((a, b) => a.level - b.level);

    const maxLevel = 9;
    const base = 2;
    let sub_total = 0;
    const result = Array.from({ length: maxLevel }, (_, i) => {
      const level = i + 1;
      const members = base ** level;
      const record = data.find((item) => item.level === level);
      const entry = record ? record.count : 0;
      const income =
        level == 1 ? 800 : level == 2 ? 100 : level == 9 ? 1900 : 50;
      const total_income = income * entry;
      sub_total += total_income;

      return {
        level,
        members,
        entry,
        income,
        total_income,
      };
    });

    res.status(200).json({ data: result, sub_total: sub_total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
