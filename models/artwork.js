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
    type: String,
    required: true,
  },


  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Reference to the User model
  //   required: true,
  // },
}, {
  timestamps: true
});

const Artwork = new mongoose.model('Artwork', artworkSchema);

export default Artwork;



// title: String,
//   description: String,
//   filename: String, // Original filename
//   mimeType: String, // MIME type (e.g., image/jpeg)
//   sizeInBytes: Number,
  // Store binary data or reference to external storage URL
  // mediaContent: Buffer, or mediaContentUrl: String,