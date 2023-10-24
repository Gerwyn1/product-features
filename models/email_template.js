import mongoose from 'mongoose';

const EmailTemplateSchema = new mongoose.Schema({
  gallery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
    required: true,
  },
  email_action_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmailAction',
    required: true,
  },
  payment_type: {
    type:  String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  email_content: {
    type: String,
    required: true
  },
  from_address: {
    type: String,
    required: true
  },
  reminder: {
    type: Number,
    required: true
  },


}, {
  timestamps: true
});

const EmailTemplate = new mongoose.model('EmailTemplate', EmailTemplateSchema);

export default EmailTemplate;