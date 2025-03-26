import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
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
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    viewedProfile: Number,
    impressions: Number,googleId: {
      type: String,
      unique: true,
      sparse: true // Allows null for non-Google users
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
