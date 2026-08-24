import db from "../configs/db.js";
import { UserModel } from "./users.model.js";

const TreeModel = {
  getTree: async (user_id) => {
    try {
      let id = user_id;
      const [userData] = await UserModel.getUser(id);

      if (userData === undefined) {
        const [adminData] = await UserModel.hasMembers(id);
        if (adminData === undefined) return [false];

        id = adminData.user_id;
      }

      const query = `WITH RECURSIVE user_relations AS (
                      SELECT user_id, referral_id, name, mobile, 0 AS level
                      FROM users
                      WHERE user_id = ?
  
                      UNION ALL
  
                      SELECT u.user_id, u.referral_id, u.name, u.mobile, ut.level + 1
                      FROM users u
                      JOIN user_relations ut ON u.referral_id = ut.user_id WHERE ut.level < 9 AND status = "approved"
                      )
                      SELECT * FROM user_relations`;
      const [data] = await db.query(query, [id]);
      return [data, id];
    } catch (err) {
      throw err;
    }
  },

  getMemberOnLevel: async ({ user_id, level = 1 }) => {
    try {
      const query = `WITH RECURSIVE user_relations AS (
                        SELECT user_id, referral_id, name, mobile, created_at, 0 AS level
                        FROM users
                        WHERE user_id = ?

                        UNION ALL

                        SELECT u.user_id, u.referral_id, u.name, u.mobile, u.created_at, ut.level + 1
                        FROM users u
                        JOIN user_relations ut ON u.referral_id = ut.user_id AND status = "approved"
                        )
                        SELECT * FROM user_relations WHERE level = ?`;
      const [data] = await db.query(query, [user_id, level]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getMembersCount: async (user_id) => {
    try {
      const query = `
      SELECT COUNT(*) AS count, level
      FROM user_relations
      WHERE ancestor_id = ?
        AND level IN (1, 2, 3 , 4 , 5,6, 7, 8, 9)
      GROUP BY level
      ORDER BY level
    `;

      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getMembersCount: async (user_id) => {
    try {
      const query = `
      SELECT COUNT(*) AS count, level
      FROM user_relations
      WHERE ancestor_id = ?
        AND level IN (1, 2, 3)
      GROUP BY level
      ORDER BY level
    `;

      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getMembersCountForTotal: async (user_id) => {
    try {
      const query = `
      SELECT COUNT(*) AS count, level
      FROM user_relations
      WHERE ancestor_id = ?
        AND level IN (1, 2, 3 , 4,5,6,7,8,9)
      GROUP BY level
      ORDER BY level
    `;

      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  // TT

  getTreeTT: async (user_id) => {
    try {
      let id = user_id;
      const [userData] = await UserModel.getUserTT(id);

      if (userData === undefined) {
        const [adminData] = await UserModel.hasTTMembers(id);
        if (adminData === undefined) return [false];

        id = adminData.user_id;
      }

      const query = `WITH RECURSIVE tt_user_relations AS (
                      SELECT user_id, referral_id, name, mobile, 0 AS level
                      FROM tt_users
                      WHERE user_id = ?
  
                      UNION ALL
  
                      SELECT u.user_id, u.referral_id, u.name, u.mobile, ut.level + 1
                      FROM tt_users u
                      JOIN tt_user_relations ut ON u.referral_id = ut.user_id WHERE ut.level < 3 AND u.status = "approved"
                      )
                      SELECT * FROM tt_user_relations`;
      const [data] = await db.query(query, [id]);
      return [data, id];
    } catch (err) {
      throw err;
    }
  },

  // getTTMembersCount: async (user_id) => {
  //   try {
  //     const query =
  //       "SELECT COUNT(*) as count, level FROM tt_user_relations WHERE ancestor_id = ? GROUP BY level";
  //     const [data] = await db.query(query, [user_id]);

  //     return data;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  getTTMembersCount: async (user_id) => {
    try {
      const query = `
      SELECT COUNT(*) AS count, level
      FROM tt_user_relations
      WHERE ancestor_id = ?
        AND level IN (1, 2, 3)
      GROUP BY level
      ORDER BY level
    `;

      const [data] = await db.query(query, [user_id]);

      return data;
    } catch (err) {
      throw err;
    }
  },
  getTTMemberOnLevel: async ({ user_id, level = 1 }) => {
    try {
      const query = `WITH RECURSIVE tt_user_relations AS (
                        SELECT user_id, referral_id, name, mobile, created_at, 0 AS level
                        FROM tt_users
                        WHERE user_id = ?

                        UNION ALL

                        SELECT u.user_id, u.referral_id, u.name, u.mobile, u.created_at, ut.level + 1
                        FROM tt_users u
                        JOIN tt_user_relations ut ON u.referral_id = ut.user_id AND status = "approved"
                        )
                        SELECT * FROM tt_user_relations WHERE level = ?`;
      const [data] = await db.query(query, [user_id, level]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  // RT
  getTreeRT: async (user_id) => {
    try {
      let id = user_id;
      const [userData] = await UserModel.getUserRT(id);

      if (userData === undefined) {
        const [adminData] = await UserModel.hasRTMembers(id);
        if (adminData === undefined) return [false];

        id = adminData.user_id;
      }

      const query = `WITH RECURSIVE rpt_user_relations AS (
                      SELECT user_id, referral_id, name, mobile, 0 AS level
                      FROM rpt_users
                      WHERE user_id = ?
  
                      UNION ALL
  
                      SELECT u.user_id, u.referral_id, u.name, u.mobile, ut.level + 1
                      FROM rpt_users u
                      JOIN rpt_user_relations ut ON u.referral_id = ut.user_id WHERE ut.level < 3 AND u.status = "approved"
                      )
                      SELECT * FROM rpt_user_relations`;
      const [data] = await db.query(query, [id]);
      return [data, id];
    } catch (err) {
      throw err;
    }
  },
  getRTMemberOnLevel: async ({ user_id, level = 1 }) => {
    try {
      const query = `WITH RECURSIVE rpt_user_relations AS (
                        SELECT user_id, referral_id, name, mobile, created_at, 0 AS level
                        FROM rpt_users
                        WHERE user_id = ?

                        UNION ALL

                        SELECT u.user_id, u.referral_id, u.name, u.mobile, u.created_at, ut.level + 1
                        FROM rpt_users u
                        JOIN rpt_user_relations ut ON u.referral_id = ut.user_id AND status = "approved"
                        )
                        SELECT * FROM rpt_user_relations WHERE level = ?`;
      const [data] = await db.query(query, [user_id, level]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getRTMembersCount: async (user_id) => {
    try {
      const query = `
      SELECT COUNT(*) AS count, level
      FROM rpt_user_relations
      WHERE ancestor_id = ?
        AND level IN (1, 2, 3, 4,5,6,7,8,9)
      GROUP BY level
      ORDER BY level
    `;

      const [data] = await db.query(query, [user_id]);

      return data;
    } catch (err) {
      throw err;
    }
  },
  // NP

  getTreeNP: async (user_id) => {
    try {
      let id = user_id;
      const [userData] = await UserModel.getUserNP(id);

      if (userData === undefined) {
        const [adminData] = await UserModel.hasNPMembers(id);
        if (adminData === undefined) return [false];

        id = adminData.user_id;
      }

      const query = `WITH RECURSIVE np_user_relations AS (
                      SELECT user_id, referral_id, name, mobile, 0 AS level
                      FROM np_users
                      WHERE user_id = ?
  
                      UNION ALL
  
                      SELECT u.user_id, u.referral_id, u.name, u.mobile, ut.level + 1
                      FROM np_users u
                      JOIN np_user_relations ut ON u.referral_id = ut.user_id WHERE ut.level < 3 AND u.status = "approved"
                      )
                      SELECT * FROM np_user_relations`;
      const [data] = await db.query(query, [id]);
      return [data, id];
    } catch (err) {
      throw err;
    }
  },

  getNPMemberOnLevel: async ({ user_id, level = 1 }) => {
    try {
      const query = `WITH RECURSIVE np_user_relations AS (
                        SELECT user_id, referral_id, name, mobile, created_at, 0 AS level
                        FROM np_users
                        WHERE user_id = ?

                        UNION ALL

                        SELECT u.user_id, u.referral_id, u.name, u.mobile, u.created_at, ut.level + 1
                        FROM np_users u
                        JOIN np_user_relations ut ON u.referral_id = ut.user_id AND status = "approved"
                        )
                        SELECT * FROM np_user_relations WHERE level = ?`;
      const [data] = await db.query(query, [user_id, level]);
      return data;
    } catch (err) {
      throw err;
    }
  },

  getMRMembersCount: async (user_id) => {
    try {
      const query = `
      SELECT COUNT(*) AS count, level
      FROM np_user_relations
      WHERE ancestor_id = ?
        AND level IN (1, 2, 3 , 4,5,6,7,8,9)
      GROUP BY level
      ORDER BY level
    `;

      const [data] = await db.query(query, [user_id]);

      return data;
    } catch (err) {
      throw err;
    }
  },

  // Focus

    getTreeFS: async (user_id) => {
    try {
      let id = user_id;
      const [userData] = await UserModel.getUserFS(id);

      if (userData === undefined) {
        const [adminData] = await UserModel.hasFSMembers(id);
        if (adminData === undefined) return [false];

        id = adminData.user_id;
      }

      const query = `WITH RECURSIVE fs_user_relations AS (
                      SELECT user_id, referral_id, name, mobile, 0 AS level
                      FROM fs_users
                      WHERE user_id = ?
  
                      UNION ALL
  
                      SELECT u.user_id, u.referral_id, u.name, u.mobile, ut.level + 1
                      FROM fs_users u
                      JOIN fs_user_relations ut ON u.referral_id = ut.user_id WHERE ut.level < 10 AND u.status = "approved"
                      )
                      SELECT * FROM fs_user_relations`;
      const [data] = await db.query(query, [id]);
      return [data, id];
    } catch (err) {
      throw err;
    }
  },
};

export default TreeModel;
