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
export const getTTLevels = async (req, res) => {
  try {
    const data = await LevelModel.getTTLevels();
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getRTLevels = async (req, res) => {
  try {
    const data = await LevelModel.getRTLevels();
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getNPLevels = async (req, res) => {
  try {
    const data = await LevelModel.getNPLevels();
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// focus

export const getFSLevels = async (req, res) => {
  try {
    const data = await LevelModel.getFSLevels();
    res.status(200).json({ data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};