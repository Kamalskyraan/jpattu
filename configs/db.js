import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "rightshadow_user",
  password: "Nm^VOyCZ!@e9S8Yq",
  database: "rightshadow_db",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: "+05:30",
});

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "skyraantech_rightshadow_user",
//   password: "%[n6mU&iiEg~NSUZ",
//   database: "skyraantech_rightshadow_db",
//   connectionLimit: 10,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 10000,
// });

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "right_shadow",
// });

export default db;
