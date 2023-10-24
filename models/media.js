import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  mediatypes_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MediaType',
    required: true,
  },
  gallery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gallery',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const Media = new mongoose.model('Media', mediaSchema);

export default Media;