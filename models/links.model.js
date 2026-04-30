import db from "../configs/db.js";

const LinksModel = {
  getLinks: async () => {
    const query = "SELECT * FROM links WHERE deleted_at IS NULL";
    const [data] = await db.query(query, []);
    return data;
  },

  addLink: async ({ name, type, link }) => {
    try {
      const query = "INSERT INTO links (name, type, link) VALUES (?, ?, ?)";
      await db.query(query, [name, type, link]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  editLink: async ({ id, name, type, link }) => {
    try {
      const query = "UPDATE links SET name = ?, type = ?, link = ? WHERE id = ?";
      await db.query(query, [name, type, link, id]);
      return true;
    } catch (err) {
      throw err;
    }
  },

  deleteLink: async (id) => {
    try {
      const query = "DELETE FROM links WHERE id  = ?";
      await db.query(query, [id]);
      return true;
    } catch (err) {
      throw err;
    }
  },
};

export default LinksModel;
