import mongoose from 'mongoose';
// import {
//   ROOM_SIZE
// } from '../config/room_size.js';


const roomSchema = new mongoose.Schema({
  name: String,
  artwork_limit: String,
  filename: String,
  ROOM_SIZE: {
    small: {
      type: Number,
      default: 10
    },
    medium: {
      type: Number,
      default: 20
    },
    large: {
      type: Number,
      default: 30
    }
  },
  sizeName: {
    type: String,
    enum: ["small", "medium", "large"],
    required: function () {
      return !this.customSize;
    }
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

roomSchema.statics.setSize = function setSize(name, cb) {
  console.log('set sizing works')
  console.log('this: ', this.prototype.obj)
  // return this.where('name', new RegExp(name, 'i')).exec(cb);
};

// Middleware to update sizeNumber based on size
roomSchema.pre('save', function (next) {
  console.log(this) // instance of model
  this.sizeValue = this.ROOM_SIZE[this.sizeName];
  next();
});

const Room = new mongoose.model('Room', roomSchema);

console.log(roomSchema.obj.ROOM_SIZE.small.default);



export default Room;