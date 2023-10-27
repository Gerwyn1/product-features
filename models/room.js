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
      return !this.customSize; // if customSize not exist, then sizeName is required
    }
  },
  sizeValue: {
    type: Number,
  },
  customSize: {
    type: String,
    validate: {
      validator: function (value) { // validate if positive integer
        if (!value || !(!isNaN(parseInt(value)) && parseInt(value) > 0)) { // if value not exist OR NOT(is a number AND greater than 0)
          throw new Error('Invalid custom size');
        }
      },
    },
  },
}, {
  timestamps: true
});

// Change schema default sizes by admin
roomSchema.statics.updateSchemaDefaultRoomSizes = (
  small = roomSchema.path('ROOM_SIZE.small').defaultValue,
  medium = roomSchema.path('ROOM_SIZE.medium').defaultValue,
  large = roomSchema.path('ROOM_SIZE.large').defaultValue) => {
  roomSchema.path('ROOM_SIZE.small').defaultValue = small;
  roomSchema.path('ROOM_SIZE.medium').defaultValue = medium;
  roomSchema.path('ROOM_SIZE.large').defaultValue = large;
}

// Middleware to update sizeNumber based on size
roomSchema.pre('save', function (next) {
  this.sizeValue = this.ROOM_SIZE[this.sizeName];
  next();
});

const Room = new mongoose.model('Room', roomSchema);

export default Room;

// Default room sizes

// Change database default sizes by admin
roomSchema.statics.updateDatabaseDefaultRoomSizes = async () => {
  const sizesToUpdate = {
    "small": roomSchema.path('ROOM_SIZE.small').defaultValue,
    "medium": roomSchema.path('ROOM_SIZE.medium').defaultValue,
    "large": roomSchema.path('ROOM_SIZE.large').defaultValue,
  };
  await Room.updateMany({}, {
    $set: {
      ROOM_SIZE: {
        small: roomSchema.path('ROOM_SIZE.small').defaultValue,
        medium: roomSchema.path('ROOM_SIZE.medium').defaultValue,
        large: roomSchema.path('ROOM_SIZE.large').defaultValue
      }
    }
  });
  for (const sizeName in sizesToUpdate) {
    await Room.updateMany(
      { sizeName },
      {
        $set: {
          sizeValue: sizesToUpdate[sizeName],
        }
      }
    );
  }
}

