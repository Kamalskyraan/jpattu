import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";
import dayjs from "dayjs";
configDotenv();

const configOptions = {
  host: "mail.rightshadow.in",
  port: 587,
  secure: false,

  auth: {
    user: process.env.SENDER_MAIL,
    pass: process.env.SENDER_PASSWORD,
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 20,
};

const transporter = nodemailer.createTransport(configOptions);

// transporter
//   .verify()
//   .then(() => console.log("SMTP connected successfully!"))
//   .catch((err) => console.error(" SMTP connection failed:", err));

// --------------------

export const sendMail = (user) => {
  const EMAIL_ASSET_BASE_URL = "https://rightshadow.in/server/public/email";

  const mailContent = `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome Letter</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #fff;
      font-family: Arial, sans-serif;
      font-size: 14px;
    "
  >
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background-color: #fff; padding: 0; margin: 0"
    >
      <tr>
        <td align="center">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 800px !important;
              min-width: 320px !important;
              background-color: #c4eab1;
              border-radius: 4px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            "
          >
            <tr>
              <td style="padding: 5px 20px">
                <table width="100%" style="margin-bottom: 6px">
                  <tr>
                    <td align="center" style="padding-bottom: 6px">
                      <div
                        style="
                          display: flex !important;
                          align-items: center !important;
                          justify-content: start;
                          gap: 20px;
                        "
                      >
                        
                        <img
                          src="${EMAIL_ASSET_BASE_URL}/jkwing.png"
                          width="48"
                          height="48"
                          alt="Right Shadow Logo"
                          style="display: block; border-radius: 4px"
                        />

                        
                        <span
                          style="
                            font-size: 18px;
                            font-weight: bold;
                            font-style: italic;
                            color: #000;
                            margin-top: 12px;
                          "
                        >
                          Jarikai
                        </span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td align="start">welcome to the Jarikai team.</td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table
                        cellpadding="0"
                        cellspacing="0"
                        style="margin: 0 auto"
                      ></table>
                    </td>
                  </tr>
                </table>
                <table width="100%" style="margin-bottom: 5px">
                  <tr>
                    <td style="font-weight: 600; padding-bottom: 1px">
                      Mr/Ms. ${user.name},
                    </td>
                  </tr>
                </table>

                <div
                  style="
                    border: 1px solid white;
                    border-collapse: collapse;
                    padding: 5px 2px;
                  "
                >
                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="margin-bottom: 2px"
                  >
                    <tr>
                      <td style="font-weight: 600; padding: 6px 0; width: 35%">
                        Member
                      </td>
                      <td style="color: #000; padding: 6px 0">
                        : ${user.user_id}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600; padding: 6px 0">Joining</td>
                      <td style="color: #000; padding: 6px 0">
                        : ${new Date(user.created_at).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td style="font-weight: 600; padding: 6px 0">Mobile</td>
                      <td style="color: #000; padding: 6px 0">
                        : ${user.mobile}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600; padding: 6px 0">Sponsor</td>
                      <td style="color: #000; padding: 6px 0">
                        : ${user.referral_id}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600; padding: 6px 0">Password</td>
                      <td style="color: #000; padding: 6px 0">
                        : ${user.password}
                      </td>
                    </tr>
                  </table>
                </div>

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="color: #000; font-size: 16px; line-height: 1.5"
                >
                  <tr>
                    <td
                      style="
                        padding-bottom: 4px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      <strong>Customer Care</strong><br />
                      Jarikai Pattu Team
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 6px; font-size: 14px">
                      Mobile:
                      <a
                        href="tel:9944550804"
                        style="text-decoration: none; color: #000"
                      >
                        99 44 55 08 04
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 3px; font-size: 14px">
                      Mobile:
                      <a
                        href="tel:9955441130"
                        style="text-decoration: none; color: #000"
                      >
                        99 55 44 11 30
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 5px; font-size: 14px">
                      Mail:
                      <a
                        href="mailto:rightshadow.in@gmail.com"
                        style="text-decoration: none; color: #000"
                      >
                        rightshadow.in@gmail.com
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 6px; font-size: 14px">
                      Web
                      <a
                        href="https://www.rightshadow.in"
                        style="text-decoration: none; color: #000"
                      >
                        www.rightshadow.in
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;

  var mailOptions = {
    from: process.env.SENDER_MAIL,
    to: user.email,
    subject: "Welcome to Jarikai Pattu",
    html: mailContent,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
      console.log("Accepted:", info.accepted);
      console.log("Rejected:", info.rejected);
    }
  });
};

export const sendNWPMail = async ({
  email,
  userName,
  userId,
  joinDate,
  mobile,
  packageAmount,
  countingDays,
  dailyAmount,
  benefitAmount,
  settlementAmount,
  totalAmount,
}) => {
  const planDetails = {
    countingDays: 400,
    dailyAmount: "₹ 75",
    benefitAmount: "₹ 30,000",
    settlementAmount: "₹ 30,000",
    totalAmount: "₹ 60,000",
    customerCare: "99 44 55 08 04",
    mobile: "99 55 44 11 30",
    email: "rightshadow.in@gmail.com",
    website: "rightshadow.in",
  };

  const EMAIL_ASSET_BASE_URL = "https://rightshadow.in/server/public/email";

  const mailContent = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Non Working Plan Approved</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background: #fff;
      font-family: Arial, sans-serif;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 3px   12px">
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 700px;      
              padding: 18px;
              color: #5b4000;
              background-color:#FFD878;
              border: 1px solid #e6d38c;
            "
          >
            <tr>
              <td align="center" style="padding-bottom: 2px">
                <div
                  style="
                    display: flex !important;
                    align-items: end !important;
                    justify-content: start;
                    gap: 20px;
                  "
                >
                  <!-- Logo -->
                  <img
                    src="${EMAIL_ASSET_BASE_URL}/jkwing.png"
                    width="48"
                    height="48"
                    alt="Right Shadow Logo"
                    style="display: block; border-radius: 4px"
                  />

                  <!-- Text -->
                  <span
                    style="
                      font-size: 18px;
                      font-weight: bold;
                      font-style: italic;
                      color: #000;
                      margin-top: 2px;
                    "
                  >
                    Jarikai
                  </span>
                </div>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-bottom: 0px">
                <div style="font-size: 18px; font-weight: bold; color: #4b1b09">
                  Non Working Plan
                </div>
              </td>
            </tr>

          
              <tr>
                <td style="font-size: 14px; color: #000; padding-bottom: 5px">
                  <p><strong>Mr / Ms. ${userName}</strong>,</p>

                  <div style="border: 1px solid #723b03;padding: 5px;">
                  <table width="100%" cellpadding="4">
                    <tr>
                      <td width="100"><strong>Member</strong></td>
                      <td>: ${userId}</td>
                    </tr>
                    <tr>
                      <td><strong>Joining</strong></td>
                      <td>: ${joinDate}</td>
                    </tr>

                    <tr>
                      <td><strong>Mobile</strong></td>
                      <td>: ${mobile}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
              <td style="padding-bottom: 4px">
                <table
                  width="100%"
                  cellpadding="5"
                  style="background: #723b03; color: #fff"
                >
                  <tr>
                    <td align="center">
                      <strong>Package Amount - ₹ ${packageAmount}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="font-size: 14px; color: #000; padding-bottom: 5px">
                <div style="border: 1px solid ; width: 100%;">
                <table width="100%" cellpadding="4">
                  <tr>
                    <td width="100"><strong>Days</strong></td>
                    <td>: ₹ ${countingDays}</td>
                  </tr>
                  <tr>
                    <td><strong>Daily Amt</strong></td>
                    <td>: ₹ ${dailyAmount}</td>
                  </tr>
                  <tr>
                    <td><strong>Benefit</strong></td>
                    <td>: ₹ ${benefitAmount}</td>
                  </tr>
                  <tr>
                    <td><strong>Settlement</strong></td>
                    <td>: ₹ ${settlementAmount}</td>
                  </tr>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td>: ₹ ${totalAmount}</td>
                  </tr>
                </table>
              </td>
            </tr>

             <tr>
              <td
                style="
                  font-size: 12px;
                  color: #000;
                  padding-bottom: 5px;
                  line-height: 1.8;
                "
              >
                mobile : ${planDetails.mobile}<br />
                mail : ${planDetails.email}<br />
                Website : ${planDetails.website}
              </td>
            </tr>
           </div>

           

           

            </div>

                      </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: `"Jarikai Pattu" <${process.env.SENDER_MAIL}>`,
        to: email,
        subject: "Welcome to Jarikai Pattu",
        html: mailContent,
      },
      (error, info) => {
        if (error) {
          console.error(" User mail error:", error);
          return reject(error);
        }

        console.log(" User mail sent:", info.accepted);
        resolve(info);
      },
    );
  });
};

export const sendAdminMail = (user) => {
  const EMAIL_ASSET_BASE_URL = "https://rightshadow.in/server/public/email";

  const users = [user];
  const membersHtml = users
    .map(
      (usr) => `
   <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome Letter</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #fff;
      font-family: Arial, sans-serif;
      font-size: 14px;
    "
  >
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background-color: #fff; padding: 0; margin: 0"
    >
      <tr>
        <td align="center">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 800px !important;
              min-width: 320px !important;
              background-color: #c4eab1;
              border-radius: 4px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            "
          >
            <tr>
              <td style="padding: 5px 20px">
                <table width="100%" style="margin-bottom: 6px">
                  <tr>
                    <td align="center" style="padding-bottom: 6px">
                      <div
                        style="
                          display: flex !important;
                          align-items: center !important;
                          justify-content: start;
                          gap: 20px;
                        "
                      >
                        
                        <img
                          src="${EMAIL_ASSET_BASE_URL}/jkwing.png"
                          width="48"
                          height="48"
                          alt="Right Shadow Logo"
                          style="display: block; border-radius: 4px"
                        />

                        
                        <span
                          style="
                            font-size: 18px;
                            font-weight: bold;
                            font-style: italic;
                            color: #000;
                            margin-top: 12px;
                          "
                        >
                          Jarikai
                        </span>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td align="start">welcome to the Jarikai team.</td>
                  </tr>
                  <tr>
                    <td align="center">
                      <table
                        cellpadding="0"
                        cellspacing="0"
                        style="margin: 0 auto"
                      ></table>
                    </td>
                  </tr>
                </table>
                <table width="100%" style="margin-bottom: 5px">
                  <tr>
                    <td style="font-weight: 600; padding-bottom: 1px">
                      Mr/Ms. ${usr.name},
                    </td>
                  </tr>
                </table>

                <div
                  style="
                    border: 1px solid white;
                    border-collapse: collapse;
                    padding: 5px 2px;
                  "
                >
                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="margin-bottom: 2px"
                  >
                    <tr>
                      <td style="font-weight: 600; padding: 6px 0; width: 35%">
                        Member
                      </td>
                      <td style="color: #000; padding: 6px 0">
                        : ${usr.user_id}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600; padding: 6px 0">Joining</td>
                      <td style="color: #000; padding: 6px 0">
                        : ${new Date(user.created_at).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td style="font-weight: 600; padding: 6px 0">Mobile</td>
                      <td style="color: #000; padding: 6px 0">
                        : ${usr.mobile}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600; padding: 6px 0">Sponsor</td>
                      <td style="color: #000; padding: 6px 0">
                        : ${usr.referral_id}
                      </td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600; padding: 6px 0">Password</td>
                      <td style="color: #000; padding: 6px 0">
                        : ${usr.password}
                      </td>
                    </tr>
                  </table>
                </div>

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  style="color: #000; font-size: 16px; line-height: 1.5"
                >
                  <tr>
                    <td
                      style="
                        padding-bottom: 4px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      <strong>Customer Care</strong><br />
                      Jarikai Pattu Team
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 6px; font-size: 14px">
                      Mobile:
                      <a
                        href="tel:9944550804"
                        style="text-decoration: none; color: #000"
                      >
                        99 44 55 08 04
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 3px; font-size: 14px">
                      Mobile:
                      <a
                        href="tel:9955441130"
                        style="text-decoration: none; color: #000"
                      >
                        99 55 44 11 30
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 5px; font-size: 14px">
                      Mail:
                      <a
                        href="mailto:rightshadow.in@gmail.com"
                        style="text-decoration: none; color: #000"
                      >
                        rightshadow.in@gmail.com
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 6px; font-size: 14px">
                      Web
                      <a
                        href="https://www.rightshadow.in"
                        style="text-decoration: none; color: #000"
                      >
                        www.rightshadow.in
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `,
    )
    .join("");

  const htmlContent = `
 
`;

  const mailOptions = {
    from: process.env.SENDER_MAIL,
    to: process.env.ADMIN_MAIL,
    subject: `Approved members - ${dayjs().format("DD-MM-YYYY")}`,
    html: membersHtml,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Admin Mail Error:", err);
    } else {
      console.log("Admin Mail Sent ✅", info.accepted);
    }
  });
};

export const sendNWPAdminMail = async ({
  userName,
  userId,
  joinDate,
  mobile,
  packageAmount,
  countingDays,
  dailyAmount,
  benefitAmount,
  settlementAmount,
  totalAmount,
}) => {
  const planDetails = {
    countingDays: 400,
    dailyAmount: "₹75",
    benefitAmount: "₹30,000",
    settlementAmount: "₹60,000",
    totalAmount: "₹60,000",
    customerCare: " 99 44 55 08 04",
    mobile: " 99 55 44 11 30",
    email: "rightshadow.in@gmail.com",
    website: "rightshadow.in",
  };

  const EMAIL_ASSET_BASE_URL = "https://rightshadow.in/server/public/email";
  const mailContent = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Non Working Plan Approved</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background: #fff;
      font-family: Arial, sans-serif;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 3px   12px">
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 700px;      
              padding: 18px;
              color: #5b4000;
              background-color:#FFD878;
              border: 1px solid #e6d38c;
            "
          >
            <tr>
              <td align="center" style="padding-bottom: 2px">
                <div
                  style="
                    display: flex !important;
                    align-items: end !important;
                    justify-content: start;
                    gap: 20px;
                  "
                >
                  <!-- Logo -->
                  <img
                    src="${EMAIL_ASSET_BASE_URL}/jkwing.png"
                    width="48"
                    height="48"
                    alt="Right Shadow Logo"
                    style="display: block; border-radius: 4px"
                  />

                  <!-- Text -->
                  <span
                    style="
                      font-size: 18px;
                      font-weight: bold;
                      font-style: italic;
                      color: #000;
                      margin-top: 2px;
                    "
                  >
                    Jarikai
                  </span>
                </div>
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-bottom: 0px">
                <div style="font-size: 18px; font-weight: bold; color: #4b1b09">
                  Non Working Plan
                </div>
              </td>
            </tr>

          
              <tr>
                <td style="font-size: 14px; color: #000; padding-bottom: 5px">
                  <p><strong>Mr / Ms. ${userName}</strong>,</p>

                  <div style="border: 1px solid #723b03;padding: 5px;">
                  <table width="100%" cellpadding="4">
                    <tr>
                      <td width="100"><strong>Member</strong></td>
                      <td>: ${userId}</td>
                    </tr>
                    <tr>
                      <td><strong>Joining</strong></td>
                      <td>: ${joinDate}</td>
                    </tr>

                    <tr>
                      <td><strong>Mobile</strong></td>
                      <td>: ${mobile}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
              <td style="padding-bottom: 4px">
                <table
                  width="100%"
                  cellpadding="5"
                  style="background: #723b03; color: #fff"
                >
                  <tr>
                    <td align="center">
                      <strong>Package Amount - ₹ ${packageAmount}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="font-size: 14px; color: #000; padding-bottom: 5px">
                <div style="border: 1px solid ; width: 100%;">
                <table width="100%" cellpadding="4">
                  <tr>
                    <td width="100"><strong>Days</strong></td>
                    <td>: ${countingDays}</td>
                  </tr>
                  <tr>
                    <td><strong>Daily Amt</strong></td>
                    <td>: ₹ ${dailyAmount}</td>
                  </tr>
                  <tr>
                    <td><strong>Benefit</strong></td>
                    <td>: ₹ ${benefitAmount}</td>
                  </tr>
                  <tr>
                    <td><strong>Settlement</strong></td>
                    <td>: ₹ ${settlementAmount}</td>
                  </tr>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td>: ₹ ${totalAmount}</td>
                  </tr>
                </table>
              </td>
            </tr>
           </div>

            <tr>
              <td
                style="
                  font-size: 16px;
                  color: #000;
                  line-height: 1.8;
                "
              >
              
                <strong>Customer Service</strong><br />
                <strong>Jarikai Pattu Team</strong>
              </td>
            </tr>

            <tr>
              <td
                style="
                  font-size: 14px;
                  color: #000;
                  padding-bottom: 5px;
                  line-height: 1.8;
                "
              >
                mobile : ${planDetails.customerCare}<br />
                mail : ${planDetails.email}<br />
                Website : ${planDetails.website}
              </td>
            </tr>

            </div>

                      </table>
        </td>
      </tr>
    </table>
  </body>
</html>


`;

  var mailOptions = {
    from: process.env.SENDER_MAIL,
    to: process.env.ADMIN_MAIL_NWP,
    subject: "Approved Non working Plan",
    html: mailContent,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
      console.log("Accepted:", info.accepted);
      console.log("Rejected:", info.rejected);
    }
  });
};

//

export const sendMemberPackageMail = async ({
  memberData,
  new_ids = [],
  level,
}) => {
  try {
    const recipient = memberData?.email;
    const EMAIL_ASSET_BASE_URL = "https://rightshadow.in/server/public/email";
    if (!recipient) {
      console.log("No email found. Skipping mail.");
      return;
    }
    const firstId = new_ids?.[0];
    const lastId = new_ids?.[new_ids.length - 1];

    const mailContent = `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Package Added</title>
  </head>
  <body style="margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;font-size:14px">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff">
      <tr>
        <td align="center">
          <table style="max-width:800px;background:#c4eab1;border-radius:4px;padding:15px">
            
            <!-- HEADER -->
            <tr>
              <td style="padding-bottom:5px">
                <div style="display:flex;align-items:center;gap:15px">
                  <img src="${EMAIL_ASSET_BASE_URL}/jkwing.png" width="48" height="48" />
                  <span style="font-size:18px;font-weight:bold;font-style:italic">Jarikai</span>
                </div>
              </td>
            </tr>

            <!-- TITLE -->
            <tr>
              <td style="font-size:16px;font-weight:bold;padding-bottom:5px">
                New Package Added
              </td>
            </tr>

            <!-- MEMBER NAME -->
            <tr>
              <td style="padding-bottom:5px">
                Mr/Ms. ${memberData.name},
              </td>
            </tr>

            <!-- MEMBER DETAILS -->
            <tr>
              <td>
                <table width="100%" style="background:#fff;border-radius:4px;padding:5px">
                  <tr>
                    <td style="font-weight:600;width:35%">User ID</td>
                    <td>: ${memberData.user_id}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:600">Mobile</td>
                    <td>: ${memberData.mobile}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- NEW IDS -->
         <tr>
  <td style="padding-top:2px">
    <b>New IDs Added:</b>

    <div style="
      margin-top:4px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:600;
      font-size:14px;
      letter-spacing:0.5px;
    ">
      ${firstId && lastId ? `${firstId} to ${lastId}` : "No IDs Generated"}
    </div>
  </td>
</tr>

            <!-- FOOTER -->
        
                  <tr>
                    <td
                      style="
                        padding-bottom: 4px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      <strong>Customer Care</strong><br />
                      Jarikai Pattu Team
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 5px; font-size: 14px">
                      Mobile:
                      <a
                        href="tel:9944550804"
                        style="text-decoration: none; color: #000"
                      >
                        99 44 55 08 04
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 3px; font-size: 14px">
                      Mobile:
                      <a
                        href="tel:9955441130"
                        style="text-decoration: none; color: #000"
                      >
                        99 55 44 11 30
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 5px; font-size: 14px">
                      Mail:
                      <a
                        href="mailto:rightshadow.in@gmail.com"
                        style="text-decoration: none; color: #000"
                      >
                        rightshadow.in@gmail.com
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 6px; font-size: 14px">
                      Web
                      <a
                        href="https://www.rightshadow.in"
                        style="text-decoration: none; color: #000"
                      >
                        www.rightshadow.in
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
         

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const info = await transporter.sendMail({
      from: `"Right Shadow" <${process.env.SENDER_MAIL}>`,
      to: recipient,
      subject: "New Package Member Added",
      html: mailContent,
    });

    console.log(" Mail sent:", info.response);
  } catch (error) {
    console.log(" Mail error:", error);
  }
};

export const sendMembersPackageAdminMail = async ({
  memberData,
  new_ids = [],
  level,
}) => {
  try {
    const firstId = new_ids?.[0];
    const lastId = new_ids?.[new_ids.length - 1];
    const EMAIL_ASSET_BASE_URL = "https://rightshadow.in/server/public/email";

    const mailContent = `
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Package Added</title>
  </head>
  <body style="margin:0;padding:0;background:#fff;font-family:Arial,sans-serif;font-size:14px">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff">
      <tr>
        <td align="center">
          <table style="max-width:800px;background:#c4eab1;border-radius:4px;padding:15px">
            
            <!-- HEADER -->
            <tr>
              <td style="padding-bottom:5px">
                <div style="display:flex;align-items:center;gap:15px">
                  <img src="${EMAIL_ASSET_BASE_URL}/jkwing.png" width="48" height="48" />
                  <span style="font-size:18px;font-weight:bold;font-style:italic">Jarikai</span>
                </div>
              </td>
            </tr>

            <!-- TITLE -->
            <tr>
              <td style="font-size:16px;font-weight:bold;padding-bottom:5px">
                New Package Added
              </td>
            </tr>

            <!-- MEMBER NAME -->
            <tr>
              <td style="padding-bottom:5px">
                Mr/Ms. ${memberData.name},
              </td>
            </tr>

            <!-- MEMBER DETAILS -->
            <tr>
              <td>
                <table width="100%" style="background:#fff;border-radius:4px;padding:5px">
                  <tr>
                    <td style="font-weight:600;width:35%">User ID</td>
                    <td>: ${memberData.user_id}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:600">Mobile</td>
                    <td>: ${memberData.mobile}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- NEW IDS -->
         <tr>
  <td style="padding-top:2px">
    <b>New IDs Added:</b>

    <div style="
      margin-top:4px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:600;
      font-size:14px;
      letter-spacing:0.5px;
    ">
      ${firstId && lastId ? `${firstId} to ${lastId}` : "No IDs Generated"}
    </div>
  </td>
</tr>

            <!-- FOOTER -->
        
                  <tr>
                    <td
                      style="
                        padding-bottom: 4px;
                        font-size: 15px;
                        font-weight: bold;
                      "
                    >
                      <strong>Customer Care</strong><br />
                      Jarikai Pattu Team
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 5px; font-size: 14px">
                      Mobile:
                      <a
                        href="tel:9944550804"
                        style="text-decoration: none; color: #000"
                      >
                        99 44 55 08 04
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 3px; font-size: 14px">
                      Mobile:
                      <a
                        href="tel:9955441130"
                        style="text-decoration: none; color: #000"
                      >
                        99 55 44 11 30
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 5px; font-size: 14px">
                      Mail:
                      <a
                        href="mailto:rightshadow.in@gmail.com"
                        style="text-decoration: none; color: #000"
                      >
                        rightshadow.in@gmail.com
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding-bottom: 6px; font-size: 14px">
                      Web
                      <a
                        href="https://www.rightshadow.in"
                        style="text-decoration: none; color: #000"
                      >
                        www.rightshadow.in
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
         

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const info = await transporter.sendMail({
      from: process.env.SENDER_MAIL,
      to: process.env.ADMIN_MAIL,
      subject: "New Package Member Added",
      html: mailContent,
    });

    console.log(" Mail sent:", info.response);
  } catch (error) {
    console.log(" Mail error:", error);
  }
};
