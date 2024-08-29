const nodemailer = require("nodemailer");

/**
 * @argument emailContent 
 * {
 * from: 'vijayshagara1221@gmail.com',
      to: 'vijay@mailinator.com',
      subject: 'Subject for Test',
      text: '1234'
 * }
 */

const sendMail = async (emailContent, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vijayshagara1221@gmail.com",
        pass: process.env.Email_password,
      },
    });

    transporter.sendMail(emailContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMail,
};
