import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  gallery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
    required: true,
  },
  payment_type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const Payment = new mongoose.model('Payment', paymentSchema);

export default Payment;