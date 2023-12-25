import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: function (value) {
    //     // Custom email validation logic
    //     // Return true if valid, false otherwise
    //     console.log(value)
    //   },
    //   message: props => `${props.value} is not a valid email address!`
    // }
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  repeatPassword: {
    type: String,
    required: [true, 'Repeat password is required.'],
  },
  roles: {
    type: [String],
    default: ['user'],
    // enum: ['user', 'admin', 'superadmin']
    // default: 'admin'
  },
  postcode: {
    type: String,
    minLength: 6,
    maxLength: 10
  },
  is_disabled: {
    type: Boolean,
    default: false
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  passwordExpiresAt: {
    type: Date,
    default: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000), // 3 months ahead
    // required: true
  },
  setting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Setting',
    // required: true,
  },
  passwordHistory : {
    type: [String],
    default: []
  },
  mobile_no: Number,
  address_1: String,
  address_2: String,
  company_name: String,
  country: String,
  profile_image: {
    type: String,
    required: [true, 'Profile image is required.'],
  },
  banner_image: {
    type: String,
    required: [true, 'Banner image is required.'],
  }
}, {
  timestamps: true
})

// {
//   lastModified: Number,
//   lastModifiedDate: Date,
//   name: String,
//   size: Number,
//   type: String,
//   webkitRelativePath: String,
//   "[[Prototype]]": Object
// }


        // username: "",
        // email: "",
        // password: "",
        // repeatPassword: "",
        // first_name: "",
        // last_name: "",
        // postcode: "",
        // mobile_no: "",
        // address_1: "",
        // address_2: "",
        // company_name: "",
        // country: "",
        // profile_image: "",
        // banner_image: "",

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('match password?')
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if the entered password matches any previous passwords or the current password
userSchema.methods.checkPasswordHistory = async function (enteredPassword) {
  return await this.passwordHistory.some((prevPassword) => bcrypt.compareSync(enteredPassword, prevPassword));
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  // if modified or creating pw
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // store hashed password in history
  this.passwordHistory.push(this.password);
});

const User = new mongoose.model("User", userSchema);

export default User;