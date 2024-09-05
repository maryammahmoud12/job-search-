import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "maryammahmoud307@gmail.com",
      pass: "jqlnppjcrqrcrhmf",
    },
  });

  const info = await transporter.sendMail({
    from: "maryammahmoud307@gmail.com",
    to: to ? to : "",
    subject: subject ? subject : "hi",
    html: html ? html : "<h2> hello </h2>",
  });

  if(info.accepted.length){
    return true
  }
  return false
};


