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

  getTTLevels: async () => {
    const [data] = await db.query("SELECT * FROM tt_levels ORDER BY level ASC");
    return data;
  },
  getRTLevels: async () => {
    const [data] = await db.query(
      "SELECT * FROM rpt_levels ORDER BY level ASC",
    );
    return data;
  },
  getNPLevels: async () => {
    const [data] = await db.query(
      "SELECT * FROM np_levels ORDER BY level ASC",
    );
    return data;
  },

  // focus

   getFSLevels: async () => {
    const [data] = await db.query(
      "SELECT * FROM fs_levels ORDER BY level ASC",
    );
    return data;
  },

  // kerchief

   getKRLevels: async () => {
    const [data] = await db.query(
      "SELECT * FROM kr_levels ORDER BY level ASC",
    );
    return data;
  },
};

export default LevelModel;
