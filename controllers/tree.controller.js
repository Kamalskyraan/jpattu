import db from "../configs/db.js";
import TreeModel from "../models/tree.model.js";
import buildTree from "../utilities/BuildTree.js";

export const getTree = async (req, res) => {
  try {
    const { user_id } = req.query || false;
    if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const [data, id] = await TreeModel.getTree(user_id);

    if (!data) {
      res.status(400).json({ message: "User not found" });
    } else {
      const tree = buildTree(data, id);
      res.status(200).json({ data: tree });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMemberOnLevel = async (req, res) => {
  try {
    const { level } = req.params || false;
    const { user_id } = req.query || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    const data = await TreeModel.getMemberOnLevel({ user_id, level });

    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMembersCount = async (req, res) => {
  try {
    const { user_id } = req.query || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    const data = await TreeModel.getMembersCount(user_id);

    data.sort((a, b) => a.level - b.level);
    const maxLevel = 9;
    const base = 2;

    const result = Array.from({ length: maxLevel }, (_, i) => {
      const level = i + 1;
      const total = base ** level;
      const record = data.find((item) => item.level === level);
      const count = record ? record.count : 0;
      const balance = total - count;

      return {
        level,
        total,
        count,
        balance,
      };
    });

    res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// controller
export const getTreeChart = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(
      `
      SELECT 
        u.user_id,
        u.name,
        r.level
      FROM users u
      INNER JOIN user_relations r
        ON u.user_id = r.descendant_id
      WHERE r.ancestor_id = ?
        AND u.user_id != ?
      ORDER BY r.level ASC, u.user_id ASC
      `,
      [id, id],
    );

    return res.status(200).json({
      success: true,
      root: id,
      data: rows,
    });
  } catch (err) {
    console.log("getTreeChart error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// TT

export const getTreeChartForTT = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(
      `
      SELECT 
        u.user_id,
        u.name,
        r.level
      FROM users u
      INNER JOIN tt_user_relations r
        ON u.user_id = r.descendant_id
      WHERE r.ancestor_id = ?
        AND u.user_id != ?
      ORDER BY r.level ASC, u.user_id ASC
      `,
      [id, id],
    );

    return res.status(200).json({
      success: true,
      root: id,
      data: rows,
    });
  } catch (err) {
    console.log("getTreeChart error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getTreeForTT = async (req, res) => {
  try {
    const { user_id } = req.query || false;

    if (user_id !== req.user_id && req.role !== "admin") {
      return res.status(403).json({ message: "Action cannot be done!" });
    }

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const [data, id] = await TreeModel.getTreeTT(user_id);

    console.log(data, "from before build treee");

    if (!data) {
      res.status(400).json({ message: "User not found" });
    } else {
      const tree = buildTree(data, id);
      console.log(tree, "tree for build");
      
      res.status(200).json({ data: tree });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
