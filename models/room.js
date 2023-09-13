import mongoose from 'mongoose';

// Define a dynamic validator function
function validateDynamicValue(value, dynamicValue) {
  return value === dynamicValue;
}

// Define the size-to-number mapping object
const sizeMapping = {
  small: 10,
  medium: 20,
  large: 30,
};

const roomSchema = new mongoose.Schema({
  name: String,
  artwork_limit: String,
  filename: String,
  size: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required :true
  },
  sizeNumber: {
    type: Number,
    required: true
  },
  small: {
    type: Number,
    default: 10,
    // setSize : function (value) {
    //   console.log(this)
    //   console.log(this.small)
    //   console.log(this.medium)
    //   console.log(this.large)
    //   // this.dynamicValue = value;
    // },
  },
  medium: {
    type: Number,
    default: 20,
  },
  large: {
    type: Number,
    default: 30,
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
  console.log(this)
  // return this.where('name', new RegExp(name, 'i')).exec(cb);
};

roomSchema.setSize('example', (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});

// Middleware to update sizeNumber based on size
roomSchema.pre('save', function (next) {
  this.sizeNumber = sizeMapping[this.size];
  next();
});

// roomSchema.virtual('computedDynamicValue').get(function() {
//   return this.dynamicValue;
// });

const Room = new mongoose.model('Room', roomSchema);




export default Room;

// small - 10, medium - 20, large - 30 <---- editable by admin