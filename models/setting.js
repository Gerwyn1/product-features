import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  privileges: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type:  String,
  },
  color_code: {
    type: String,
  },
  mailer: {
    type: String,
    minLength : 10,
    maxLength : 10,
  },
  mail_host: {
    type: String,
  },
  mail_port: {
    type: String,
  },
  mail_username: {
    type: String,
  },
  mail_password: {
    type: String,
  },
  mail_encryption: {
    type: String,
  },
  log_expiry: {
    type: Number,
  },


}, {
  timestamps: true
});

const Setting = new mongoose.model('Setting', SettingSchema);

export default Setting;