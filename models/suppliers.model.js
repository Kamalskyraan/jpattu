import db from "../configs/db.js";

export const SuppliersModel = {
  getSuppliers: async () => {
    try {
      const query = "SELECT * FROM suppliers WHERE deleted_at IS NULL";
      const [data] = await db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  },
  addSupplier: async (name) => {
    try {
      const query = "INSERT INTO suppliers (name) VALUES (?)";
      await db.query(query, [name]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateSupplier: async ({ name, id }) => {
    try {
      const query = "UPDATE suppliers SET name = ? WHERE id = ?";
      await db.query(query, [name, id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteSupplier: async (id) => {
    try {
      const query = "DELETE FROM suppliers WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export const JpSuppliersModel = {
  getSuppliers: async () => {
    try {
      const query = "SELECT * FROM jp_suppliers WHERE deleted_at IS NULL";
      const [data] = await db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  },
  addSupplier: async (name) => {
    try {
      const query = "INSERT INTO jp_suppliers (name) VALUES (?)";
      await db.query(query, [name]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateSupplier: async ({ name, id }) => {
    try {
      const query = "UPDATE jp_suppliers SET name = ? WHERE id = ?";
      await db.query(query, [name, id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteSupplier: async (id) => {
    try {
      const query = "DELETE FROM jp_suppliers WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
};
