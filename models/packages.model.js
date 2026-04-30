import db from "../configs/db.js";

export const PackageModel = {
  getPackages: async (req, res) => {
    try {
      const query = "SELECT id, name, amount, description, created_at from packages ORDER BY id";
      const [result] = await db.query(query);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
