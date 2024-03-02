const nodemailer = require("nodemailer");

module.exports = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
            from: 'EG Tours <toursApp@gmail.com>', 
            to: options.to, 
            subject: options.subject,
            text: options.text, 
          }
      
    await transporter.sendMail(mailOptions);
    
    //   console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      //
      // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
      //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
      //       <https://github.com/forwardemail/preview-email>
      //
}
