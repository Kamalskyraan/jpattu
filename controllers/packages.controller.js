import { validationResult } from "express-validator";
import { UserModel } from "../models/users.model.js";
import { PackageModel } from "../models/packages.model.js";

export const GetPackages = async (req, res) => {
  try {
    const packages = await PackageModel.getPackages();
    res
      .status(200)
      .json({ packages: packages, message: "Packages fetched successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const AddPackageToUser = async (req, res) => {
  try {
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.map((val) => val.msg),
      });
    }
    const { user_data, level } = req.body;

    const user = await UserModel.getUser(user_data.user_id);

    if (user.length === 0) {
      return res.status(200).json({ message: "User not found" });
    }
    const members = await UserModel.hasMembers(user_data.user_id);

    if (members.length !== 0) {
      return res
        .status(200)
        .json({ message: "This member is not eligible for these packages" });
    } else if (level < 1 && level > 2) {
      return res.status(400).json({ message: "Level must be in range 1-2" });
    } else {
      const new_ids = await UserModel.addPackageToUser({ user_data, level });
      return res.status(201).json({ message: "Success", new_ids: new_ids });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// TT

export const AddPackageToTTUser = async (req, res) => {
  try {
    const result = validationResult(req);
    const { errors } = result;
    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.map((val) => val.msg),
      });
    }
    const { user_data, level } = req.body;

    const user = await UserModel.getUserTT(user_data.user_id);

    if (user.length === 0) {
      return res.status(200).json({ message: "User not found" });
    }
    const members = await UserModel.hasTTMembers(user_data.user_id);

    if (members.length !== 0) {
      return res
        .status(200)
        .json({ message: "This member is not eligible for these packages" });
    } else if (level < 1 && level > 2) {
      return res.status(400).json({ message: "Level must be in range 1-2" });
    } else {
      const new_ids = await UserModel.addPackageToTTUser({ user_data, level });
      return res.status(201).json({ message: "Success", new_ids: new_ids });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetTTPackages = async (req, res) => {
  try {
    const packages = await PackageModel.getTTPackages();
    res
      .status(200)
      .json({ packages: packages, message: "Packages fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
