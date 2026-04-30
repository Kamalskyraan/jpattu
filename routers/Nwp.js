import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import {
  AddNewPackageToUser,
  DeleteMember,
  EarningsList,
  Earningspaid,
  getWithdrawEarningsForUser,
  MembersList,
  PackageApproved,
  PackageList,
  UserDetails,
  withdrawMoney,
} from "../controllers/nwp.controller.js";

const router = express.Router();

router.post("/", AddNewPackageToUser);
router.post("/packagelist", PackageList);
router.post("/approve", PackageApproved);
router.post("/memberslist", MembersList);
router.post(`/expenses`, EarningsList);
router.post(`/earningspaid`, Earningspaid);
router.post(`/userdetails`, UserDetails);
router.post("/deletemembers", DeleteMember);
// kamal
router.post("/get-earnings-fromuser", getWithdrawEarningsForUser);
router.post("/withdraw-money", withdrawMoney);

export default router;
