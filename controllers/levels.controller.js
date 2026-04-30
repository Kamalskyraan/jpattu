import LevelModel from "../models/levels.model.js";

export const getLevels = async (req, res) => {
  try {
    const data = await LevelModel.getLevels();
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
