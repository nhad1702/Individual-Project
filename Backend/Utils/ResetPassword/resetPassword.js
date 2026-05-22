import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
    }
})

const resetPasswordEmail = (to, pin) => {
    const mailOptions = {
        from: `'OCR test app' <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Reset password code',
        html: `
            <h2>Reset password</h2>
            <p>Your reset password code is</p>
            <h1>${pin}</h1>
            <p>This code will expire in 5 minutes.</p>
        `
    }

    return transporter.sendMail(mailOptions)
}

export default resetPasswordEmail