import express from "express";
import { verifyAdmin } from "../middlewares/auth.js";
import {
  AddPackageToNPUser,
  AddPackageToRTUser,
  AddPackageToTTUser,
  AddPackageToUser,
  GetNPPackages,
  GetPackages,
  GetRTPackages,
  GetTTPackages,
} from "../controllers/packages.controller.js";
import { addPackageToUser } from "../validator/packageValidator.js";
import {
  sendMemberNPPackageMail,
  sendMemberPackageMail,
  sendMemberRepeatPackageMail,
  sendMembersNPPackageAdminMail,
  sendMembersPackageAdminMail,
  sendMembersRepeatPackageAdminMail,
  sendMembersTargetPackageAdminMail,
  sendMemberTargetPackageMail,
} from "../helpers/mail.js";

const router = express.Router();

router.get("/", verifyAdmin, GetPackages);
router.get("/tt", verifyAdmin, GetTTPackages);
router.post("/", verifyAdmin, addPackageToUser, AddPackageToUser);
router.post("/tt", verifyAdmin, addPackageToUser, AddPackageToTTUser);

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
router.post("/tt-send-mail", verifyAdmin, async (req, res) => {
  try {
    const { memberData, new_ids, level } = req.body;

    await sendMemberTargetPackageMail({ memberData, new_ids, level });
    await sendMembersTargetPackageAdminMail({ memberData, new_ids, level });

    res.status(200).json({ message: "Mail Sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Mail Sending Failed" });
  }
});

// rt
router.get("/rt", verifyAdmin, GetRTPackages);

router.post("/rt", verifyAdmin, addPackageToUser, AddPackageToRTUser);

router.post("/rt-send-mail", verifyAdmin, async (req, res) => {
  try {
    const { memberData, new_ids, level } = req.body;

    await sendMemberRepeatPackageMail({ memberData, new_ids, level });
    await sendMembersRepeatPackageAdminMail({ memberData, new_ids, level });

    res.status(200).json({ message: "Mail Sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Mail Sending Failed" });
  }
});

// np

router.get("/np", verifyAdmin, GetNPPackages);
router.post("/np", verifyAdmin, addPackageToUser, AddPackageToNPUser);

router.post("/np-send-mail", verifyAdmin, async (req, res) => {
  try {
    const { memberData, new_ids, level } = req.body;

    await sendMemberNPPackageMail({ memberData, new_ids, level });
    await sendMembersNPPackageAdminMail({ memberData, new_ids, level });

    res.status(200).json({ message: "Mail Sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Mail Sending Failed" });
  }
});

export default router;
