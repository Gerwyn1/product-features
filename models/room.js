import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: String,
  artwork_limit: String,
  filename: String,
  sizeName: {
    type: String,
    enum: ["small", "medium", "large"],
  },
  sizeValue: {
    type: Number,
  },
  customSize: {
    type: String,
    validate: {
      validator: function (value) {
        if (!value || !(!isNaN(parseInt(value)) && parseInt(value) > 0)) { // if value not exist OR (not a number AND not greater than 0)
          throw new Error('Invalid custom size');
        }
      },
    },
  },
}, {
  timestamps: true
});

roomSchema.statics.setSize = function setSize (name, cb) {
  console.log('set sizing works')
  // return this.where('name', new RegExp(name, 'i')).exec(cb);
};

// // Middleware to update sizeNumber based on size
// roomSchema.pre('save', function (next) {
//   this.sizeNumber = sizeMapping[this.size];
//   next();
// });

const Room = new mongoose.model('Room', roomSchema);

export default Room;