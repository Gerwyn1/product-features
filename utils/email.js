import { createTransport } from "nodemailer";

const transporter = createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "gerwyn.sim@blaklabs.com",
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendVerificationCode(toEmail, verificationCode) {
    await transporter.sendMail({
        from: "noreply@blaklabs.com",
        to: toEmail,
        subject: "Your verification code",
        html: `<p>This is your verification code. It will expire in 10 minutes.</p><strong>${verificationCode}</strong>`
    });
}