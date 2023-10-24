import mongoose from 'mongoose';

const EmailActionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  event_name: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const EmailAction = new mongoose.model('EmailAction', EmailActionSchema);

export default EmailAction;