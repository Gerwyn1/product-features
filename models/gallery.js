import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type:String,
    required: true
  },
  description: String,
  roomtype_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  price: {
     type: Number,
     required: true,
  },
  publish_type: String,
}, {
  timestamps: true
});

const Gallery = new mongoose.model('Gallery', gallerySchema);

export default Gallery;