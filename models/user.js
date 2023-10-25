import mongoose from "mongoose";
import bcrypt from "bcryptjs";

//user schema
export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
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
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    default: ['user']
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
    required: true
  },
  setting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Setting',
    // required: true,
  },
  mobile_no: Number,
  address_1: String,
  address_2: String,
  company_name: String,
  country: String,
}, {
  timestamps: true
})

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  // if modified or creating pw
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = new mongoose.model("User", userSchema)

export default User;