const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  // Use your actual email credentials here or environment variables
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use "ethereal.email" for testing
    auth: {
      user: "anshadanchu368@gmail.com", // your Gmail or SMTP email
      pass: "fpcy ffhd ravg crnv", // your email password or app-specific password
    },
  });

  const mailOptions = {
    from: "anshadanchu368@gmail.com",
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
