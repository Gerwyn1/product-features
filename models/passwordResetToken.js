import mongoose from 'mongoose';

const passwordResetTokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    verificationCode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "10m" },
});

const passwordResetToken = new mongoose.model('passwordResetToken', passwordResetTokenSchema);

export default passwordResetToken;