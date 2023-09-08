import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
  },
  customSize: {
    type: String,
    validate: {
      validator: function (value) {
        if (!value || !(!isNaN(parseInt(value)) && parseInt(value) > 0)) {
          throw new Error('Invalid custom size');
        }
      },
    },
  },
}, {
  timestamps: true
});

const Room = new mongoose.model('Room', roomSchema);

export default Room;