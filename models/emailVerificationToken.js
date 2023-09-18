import mongoose from 'mongoose';

const emailVerificationTokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    verificationCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "10m" },
});

const emailVerificationToken = new mongoose.model('emailVerificationToken', emailVerificationTokenSchema);

export default emailVerificationToken;