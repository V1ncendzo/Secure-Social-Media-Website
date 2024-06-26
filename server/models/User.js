import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    failedLoginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: {
      type: Number,
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 8,
      max: 100,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewdProfile: Number,
    impressions: Number,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
    
  { timestamps: true }
);
  

const User = mongoose.model("User", UserSchema);
export default User;
