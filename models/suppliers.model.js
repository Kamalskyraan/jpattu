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

  // tt

  addTTSupplier: async (name) => {
    try {
      const query = "INSERT INTO tt_suppliers (name) VALUES (?)";
      await db.query(query, [name]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  updateTTSupplier: async ({ name, id }) => {
    try {
      const query = "UPDATE tt_suppliers SET name = ? WHERE id = ?";
      await db.query(query, [name, id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteTTSupplier: async (id) => {
    try {
      const query = "DELETE FROM tt_suppliers WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  getTTSuppliers: async () => {
    try {
      const query = "SELECT * FROM tt_suppliers WHERE deleted_at IS NULL";
      const [data] = await db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  },
  // RT
  getRTSuppliers: async () => {
    try {
      const query = "SELECT * FROM rpt_suppliers WHERE deleted_at IS NULL";
      const [data] = await db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  },

  addRTSupplier: async (name) => {
    try {
      const query = "INSERT INTO rpt_suppliers (name) VALUES (?)";
      await db.query(query, [name]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  updateRTSupplier: async ({ name, id }) => {
    try {
      const query = "UPDATE rpt_suppliers SET name = ? WHERE id = ?";
      await db.query(query, [name, id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteRTSupplier: async (id) => {
    try {
      const query = "DELETE FROM rpt_suppliers WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // NP
    getNPSuppliers: async () => {
    try {
      const query = "SELECT * FROM np_suppliers WHERE deleted_at IS NULL";
      const [data] = await db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  },

    addNPSupplier: async (name) => {
    try {
      const query = "INSERT INTO np_suppliers (name) VALUES (?)";
      await db.query(query, [name]);
      return true;
    } catch (error) {
      throw error;
    }
  },

    updateNPSupplier: async ({ name, id }) => {
    try {
      const query = "UPDATE np_suppliers SET name = ? WHERE id = ?";
      await db.query(query, [name, id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
   deleteNPSupplier: async (id) => {
    try {
      const query = "DELETE FROM np_suppliers WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },


  // FS

  getFSSuppliers: async () => {
    try {
      const query = "SELECT * FROM fs_suppliers WHERE deleted_at IS NULL";
      const [data] = await db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  },





   addFSSupplier: async (name) => {
    try {
      const query = "INSERT INTO fs_suppliers (name) VALUES (?)";
      await db.query(query, [name]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  updateFSSupplier: async ({ name, id }) => {
    try {
      const query = "UPDATE fs_suppliers SET name = ? WHERE id = ?";
      await db.query(query, [name, id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteFSSupplier: async (id) => {
    try {
      const query = "DELETE FROM fs_suppliers WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },


  // KR


  
  getKRSuppliers: async () => {
    try {
      const query = "SELECT * FROM kr_suppliers WHERE deleted_at IS NULL";
      const [data] = await db.query(query);
      return data;
    } catch (error) {
      throw error;
    }
  },





   addKRSupplier: async (name) => {
    try {
      const query = "INSERT INTO kr_suppliers (name) VALUES (?)";
      await db.query(query, [name]);
      return true;
    } catch (error) {
      throw error;
    }
  },

  updateKRSupplier: async ({ name, id }) => {
    try {
      const query = "UPDATE kr_suppliers SET name = ? WHERE id = ?";
      await db.query(query, [name, id]);
      return true;
    } catch (error) {
      throw error;
    }
  },
  deleteKRSupplier: async (id) => {
    try {
      const query = "DELETE FROM kr_suppliers WHERE id = ?";
      await db.query(query, [id]);
      return true;
    } catch (error) {
      throw error;
    }
  },


};
