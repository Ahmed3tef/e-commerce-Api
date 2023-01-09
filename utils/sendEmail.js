import nodemailer from 'nodemailer';

export const sendEmail = async options => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } = process.env;
  // console.log(EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD);
  // 1) create transporter (service that will send email like gmail, mailgun, mailTrap, sendGrid)
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT, // if secure is true it is 465 else it is 587
    secureConnection: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  // 2) define email options like (from, to, subject,text)
  const mailOptions = {
    from: `E-shop app <atteff032@gmail.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
