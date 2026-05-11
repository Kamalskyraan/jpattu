import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import {
  AddPackageToUser,
  GetPackages,
  GetTTPackages,
} from "../controllers/packages.controller.js";
import { addPackageToUser } from "../validator/packageValidator.js";
import {
  sendMemberPackageMail,
  sendMembersPackageAdminMail,
} from "../helpers/mail.js";

const router = express.Router();

router.get("/", verifyAdmin, GetPackages);
router.get("/tt", verifyAdmin, GetTTPackages);
router.post("/", verifyAdmin, addPackageToUser, AddPackageToUser);

router.post("/send-mail", verifyAdmin, async (req, res) => {
  try {
    const { memberData, new_ids, level } = req.body;

    await sendMemberPackageMail({ memberData, new_ids, level });
    await sendMembersPackageAdminMail({ memberData, new_ids, level });

    res.status(200).json({ message: "Mail Sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Mail Sending Failed" });
  }
});

export default router;
