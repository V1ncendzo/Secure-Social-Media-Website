import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
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
      required: true,
      min: 5,
      max: 100,
      validate: {
        validator: function (v) {
          return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid password! It must contain at least one letter, one number, and one special character (!@#$%^&*).`,
      },
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
    otp: String,
    otpExpiry: Date,
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
