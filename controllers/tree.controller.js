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

// export const getTreeChartForTT = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Root + descendants upto 3 levels
//     const [users] = await db.query(
//       `
//       SELECT DISTINCT
//           u.user_id,
//           u.name
//       FROM tt_users u
//       WHERE u.user_id = ?

//       UNION

//       SELECT DISTINCT
//           u.user_id,
//           u.name
//       FROM tt_user_relations r
//       INNER JOIN tt_users u
//           ON u.user_id = r.descendant_id
//       WHERE r.ancestor_id = ?
//       AND r.level <= 3
//       `,
//       [id, id],
//     );

//     // Direct parent-child relationships only
//     const [relations] = await db.query(
//       `
//       SELECT
//           ancestor_id AS parent_id,
//           descendant_id AS child_id
//       FROM tt_user_relations
//       WHERE level = 1
//       `,
//     );

//     const nodeMap = {};

//     users.forEach((user) => {
//       nodeMap[user.user_id] = {
//         user_id: user.user_id,
//         name: user.name,
//         children: [],
//       };
//     });

//     relations.forEach((rel) => {
//       const parent = nodeMap[rel.parent_id];
//       const child = nodeMap[rel.child_id];

//       if (parent && child) {
//         parent.children.push(child);
//       }
//     });

//     const tree = nodeMap[id];

//     return res.status(200).json({
//       success: true,
//       data: tree || null,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

export const getTreeChartForTT = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT
          u.user_id,
          u.name,
          r.level,
          p.ancestor_id AS parent_id
      FROM tt_user_relations r

      INNER JOIN tt_users u
          ON u.user_id = r.descendant_id

      LEFT JOIN tt_user_relations p
          ON p.descendant_id = r.descendant_id
          AND p.level = 1

      WHERE r.ancestor_id = ?
      AND r.level <= 3

      ORDER BY r.level ASC, u.user_id ASC
      `,
      [id],
    );

    return res.status(200).json({
      success: true,
      root: id,
      data: rows,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// TT---

export const getTreeChart = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await db.query(
      `
      SELECT
        r.descendant_id AS user_id,
        u.name,
        r.level
      FROM tt_user_relations r
      INNER JOIN tt_users u
        ON u.user_id = r.descendant_id
      WHERE r.ancestor_id = ?
        AND r.level > 0
      ORDER BY r.level ASC, r.descendant_id ASC
      `,
      [id],
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

    if (!data) {
      res.status(400).json({ message: "User not found" });
    } else {
      const tree = buildTree(data, id);

      res.status(200).json({ data: tree, message: "abcd" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//

export const getTTMembersCount = async (req, res) => {
  try {
    const { user_id } = req.query || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    const data = await TreeModel.getTTMembersCount(user_id);

    data.sort((a, b) => a.level - b.level);
    const maxLevel = 3;
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

export const getTTMemberOnLevel = async (req, res) => {
  try {
    const { level } = req.params || false;
    const { user_id } = req.query || false;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }
    const data = await TreeModel.getTTMemberOnLevel({ user_id, level });

    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
