import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
  },
  medium: {
    type: String, // The medium or materials used to create the artwork (e.g., oil on canvas, watercolor, digital).
  },
  description: {
    type: String,
  },
  image: {
    type: Buffer, // Store image binary data as a Buffer
    required: true,
  },

}, {
  timestamps: true
});

const Artwork = new mongoose.model('Artwork', artworkSchema);

export default Artwork;