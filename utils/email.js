import { createTransport } from "nodemailer";

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "gerwyn.sim@blaklabs.com",
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendEmailVerificationCode(toEmail, verificationCode) {
    await transporter.sendMail({
        from: "noreply@blaklabs.com",
        to: toEmail,
        subject: "Your Email verification code",
        html: `<p>This is your Email verification code. It will expire in 10 minutes.</p><strong>${verificationCode}</strong>`
    });
}

export async function sendPasswordVerificationCode(toEmail, verificationCode) {
    await transporter.sendMail({
        from: "noreply@blaklabs.com",
        to: toEmail,
        subject: "Your Password verification code",
        html: `<p>This is your Password verification code. It will expire in 10 minutes.</p><strong>${verificationCode}</strong>`
    });
}