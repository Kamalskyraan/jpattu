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
      const query =
        "SELECT COUNT(*) as count, level FROM user_relations WHERE ancestor_id = ? GROUP BY level";
      const [data] = await db.query(query, [user_id]);
      return data;
    } catch (err) {
      throw err;
    }
  },
};

export default TreeModel;
