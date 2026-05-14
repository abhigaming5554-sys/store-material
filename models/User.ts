import mongoose from "mongoose";

const UserSchema =
  new mongoose.Schema({

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileimage: {
      type: String.apply,
      default:"",
    },
    
    resetOtp: {
      type: String,
    },
    resetOtpExpire: {
      type: Date,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

  });

export default mongoose.models.User ||
mongoose.model(
  "User",
  UserSchema
);