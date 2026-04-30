import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userAuthRoutes from "./routers/UserAuth.js";
import adminAuthRoutes from "./routers/AdminAuth.js";
import adminRoutes from "./routers/Admin.js";
import userRoutes from "./routers/Users.js";
import levelRoutes from "./routers/Levels.js";
import linkRoutes from "./routers/Links.js";
import productRoutes from "./routers/Products.js";
import treeRoutes from "./routers/Tree.js";
import cashbackRoutes from "./routers/Cashbacks.js";
import userBalanceRoutes from "./routers/UserBalance.js";
import purchaseRoutes from "./routers/Purchase.js";
import suppliersRoutes from "./routers/Suppliers.js";
import jppurchaseRoutes from "./routers/JpPurchase.js";
import jpsuppliersRoutes from "./routers/JpSuppliers.js";
import salesRoutes from "./routers/Sales.js";
import PackageRoutes from "./routers/Packages.js";
import NwpRoutes from "./routers/Nwp.js";
import "./cron/monthEndSettlement.js";
import { getAdminData } from "./controllers/users.controller.js";

const app = express();
configDotenv();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5175",
      "http://localhost:5174",
      "http://192.168.38.16:5173",
      "http://172.20.10.5:5174",
      "http://192.168.100.177:5173",
      "http://192.168.100.177:5174",
      "http://192.168.100.177:5175",
      "http://192.168.100.177:4173",
      "http://192.168.66.16:5173",
      "http://192.168.100.103:5173",
      "http://192.168.100.103:5174",
      "http://192.168.100.178:5174",
      "http://192.168.100.115:5174",
      "http://192.168.0.110:5174",
      "http://192.168.0.140:5173",
      "http://192.168.0.140:5174",
      "*",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use(cookieParser());
app.use("/users/auth", userAuthRoutes);
app.use("/admin/auth", adminAuthRoutes);

app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/levels", levelRoutes);
app.use("/links", linkRoutes);
app.use("/products", productRoutes);
app.use("/treeview", treeRoutes);
app.use("/cashbacks", cashbackRoutes);
app.use("/balance", userBalanceRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/suppliers", suppliersRoutes);
app.use("/jp/purchases", jppurchaseRoutes);
app.use("/jp/suppliers", jpsuppliersRoutes);
app.use("/sales", salesRoutes);
app.use("/packages", PackageRoutes);
app.use("/nwp", NwpRoutes);
app.get("/get-admin-data", getAdminData);

app.listen(process.env.PORT, () => {
  console.log(`Server running @ ${process.env.PORT}`);
});
