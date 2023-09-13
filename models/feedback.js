import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  galleryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
    required: true,
  },
  notes: String,
  rating: Number,
}, {
  timestamps: true
});

const Feedback = new mongoose.model('Feedback', feedbackSchema);

export default Feedback;