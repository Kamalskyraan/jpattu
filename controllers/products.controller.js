import path from "path";
import ProductsModel from "../models/products.model.js";
import { existsSync, rmSync } from "fs";

export const getProducts = async (req, res) => {
  try {
    const data = await ProductsModel.getProducts();
    res.status(200).json({ data: data });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addProduct = async (req, res) => {
  const image = req.file?.filename;
  try {
    console.log(image);

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    await ProductsModel.addProduct({ image });
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.log(err);
    const imagePath = path.join(process.cwd(), "public", "products", image);
    if (existsSync(imagePath)) {
      rmSync(imagePath);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editProduct = async (req, res) => {
  const image = req.file?.filename;
  try {
    const id = req.body.id;

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
      });
    } else if (!id) {
      return res.status(400).json({
        message: "Id is required",
      });
    }

    const updated = await ProductsModel.editProduct({ id, image });
    if (updated) {
      res.status(200).json({ message: "Product edited successfully" });
    } else {
      res.status(200).json({ message: "Product not found" });
    }
  } catch (err) {
    console.log(err);
    const imagePath = path.join(process.cwd(), "public", "products", image);
    if (existsSync(imagePath)) {
      rmSync(imagePath);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id, image } = req.body || false;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    } else if (!image) {
      return res.status(400).json({ message: "image name is required" });
    }

    await ProductsModel.deleteProduct({ id, image });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
