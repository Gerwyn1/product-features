import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action_type: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const ActivityLog = new mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog;