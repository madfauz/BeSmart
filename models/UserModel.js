import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      require: true,
    },
    class_taken: {
      type: Array,
    },
    password: {
      type: String,
      required: true,
    },
    refresh_token: {
      type: String,
      default: null,
    },
    confirmed: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

// membuat Collection Teacher
export default mongoose.models.User || mongoose.model("User", userSchema);
