import { JpSuppliersModel } from "../models/suppliers.model.js";

export const getSuppliers = async (req, res) => {
  try {
    const data = await JpSuppliersModel.getSuppliers();
    res.status(200).json({ data: data, message: "data fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addSupplier = async (req, res) => {
  try {
    const { name } = req.body || false;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    await JpSuppliersModel.addSupplier(name);
    res.status(200).json({ message: "data updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { name, id } = req.body || false;
    if (!name) {
      return res.status(400).json({ message: "name is required" });
    } else if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    await JpSuppliersModel.updateSupplier({ name, id });
    res.status(200).json({ message: "data updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params || false;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    await JpSuppliersModel.deleteSupplier(id);
    res.status(200).json({ message: "data deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
