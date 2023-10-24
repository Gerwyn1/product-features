import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  // media_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Media',
  //   required: true,
  // },
  type: {
    type: String,
    required: true,
  },
  properties: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const Media = new mongoose.model('Media', mediaSchema);

export default Media;