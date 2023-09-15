import mongoose from 'mongoose';

export let roomSchema = new mongoose.Schema({
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

// Change default sizes by admin 
roomSchema.statics.setSize = (small = roomSchema.path('ROOM_SIZE.small').defaultValue, medium = roomSchema.path('ROOM_SIZE.medium').defaultValue, large = roomSchema.path('ROOM_SIZE.large').defaultValue) => {
  roomSchema.path('ROOM_SIZE.small').defaultValue = small;
  roomSchema.path('ROOM_SIZE.medium').defaultValue = medium;
  roomSchema.path('ROOM_SIZE.large').defaultValue = large;
}

// Middleware to update sizeNumber based on size
roomSchema.pre('save', function (next) {
  this.sizeValue = this.ROOM_SIZE[this.sizeName];
  next();
});

let Room = new mongoose.model('Room', roomSchema);

export default Room;



// import mongoose from 'mongoose';

// export let roomSchema = new mongoose.Schema({
//   // ... your existing schema fields
// }, {
//   timestamps: true
// });

// // Change default sizes by admin 
// roomSchema.statics.setSize = function(small, medium, large) {
//   const updatedRoomSchema = new mongoose.Schema({
//     ROOM_SIZE: {
//       small: {
//         type: Number,
//         default: small
//       },
//       medium: {
//         type: Number,
//         default: medium
//       },
//       large: {
//         type: Number,
//         default: large
//       }
//     },
//   });

//   return mongoose.model('Room', updatedRoomSchema);
// }

// // Middleware to update sizeNumber based on size
// roomSchema.pre('save', function (next) {
//   // ... your existing middleware logic
//   next();
// });

// let Room = new mongoose.model('Room', roomSchema);

// export default Room;