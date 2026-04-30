import db from "../configs/db.js";

const LevelModel = {
  getLevels: async () => {
    const [data] = await db.query("SELECT * FROM levels ORDER BY level ASC");
    return data;
  },

  //   addLevel: async ({ level, members, share, total_income }) => {
  //     const query = "INSERT INTO LEVELS (level, members, share, total_income) VALUES (?, ?, ?, ?)";
  //     await db.query(query, [level, members, share, total_income]);
  //   },
};

export default LevelModel;
