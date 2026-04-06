const nodemailer = require('nodemailer')

const sendmail = async (email,subject,message) => {

    console.log( process.env.NODEMAILER_MAIL,process.env.NODEMAILER_APPKEY)
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_MAIL,
                pass: process.env.NODEMAILER_APPKEY
            },
                tls: {
                    rejectUnauthorized: false
                } //accept connection even if certificate is invalid.
        });

        const mailoption = {
            from: process.env.NODEMAILER_MAIL,
            to: email,
            subject: subject,
            text: message
        }

        // transporter.sendMail(mailoption, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('Email sent: ' + info.response);
        //         return 'Email sent: ' + info.response;
        //     }
        // })

        const info = await transporter.sendMail(mailoption);

        console.log("Email sent:", info.response);
        return info;

    } catch (error) {
        console.log("Mail error:", error.message);
        throw new Error("send mail error" + error.message)
    }
}

module.exports = sendmail;