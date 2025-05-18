const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  // Use your actual email credentials here or environment variables
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use "ethereal.email" for testing
    auth: {
      user: "clapstudio53@gmail.com", // your Gmail or SMTP email
      pass: "xrbx supc ajdy rdnm", // your email password or app-specific password
    },
  });

  const mailOptions = {
    from: "clapstudio53@gmail.com",
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
