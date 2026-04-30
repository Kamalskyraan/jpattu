import { existsSync, rmSync } from "fs";
import db from "../configs/db.js";
import path from "path";

const ProductsModel = {
  getProducts: async () => {
    const query = "SELECT * FROM products";
    const [data] = await db.query(query);
    const updatedData = data.map((val) => ({
      ...val,
      // image: "http://localhost:8010/" + path.join("public", "products", val.image),
      image: `https://rightshadow.in/server/public/products/${val.image}`
    }));
    return updatedData;
  },

  addProduct: async ({ image }) => {
    try {
      const query = "INSERT INTO products (image) VALUES (?)";
      await db.query(query, [image]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  editProduct: async ({ image, id }) => {
    try {
      const [oldData] = await db.query("SELECT image FROM products WHERE id = ?", [id]);
      const [oldImage] = oldData;

      if (!oldImage) {
        const imagePath = path.join(process.cwd(), "public", "products", image);
        if (existsSync(imagePath)) {
          rmSync(imagePath);
        }
        return false;
      }

      if (oldImage) {
        const imagePath = path.join(process.cwd(), "public", "products", oldImage.image);
        if (existsSync(imagePath)) {
          rmSync(imagePath);
        }
      }

      const query = "UPDATE products SET image = ? WHERE id = ?";
      await db.query(query, [image, id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  deleteProduct: async ({ image, id }) => {
    try {
      const imagePath = path.join(process.cwd(), "public", "products", image);
      if (existsSync(imagePath)) {
        rmSync(imagePath);
      }

      const query = "DELETE FROM products WHERE id  = ?";
      await db.query(query, [id]);
    } catch (err) {
      throw err;
    }
  },
};

export default ProductsModel;
