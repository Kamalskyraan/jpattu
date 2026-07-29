import mysql from "mysql2";

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "rightshadow_user",
//   password: "Nm^VOyCZ!@e9S8Yq",
//   database: "rightshadow_db",
// });
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "right_shadow",
});
 
db.query("SET time_zone = '+05:30'");

export default db.promise();
