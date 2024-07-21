import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

const classSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    owner: {
      type: Array,
      required: true,
    },
    list_teachers: {
      type: Array,
      required: true,
    },
    access_code: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    learning_materials: {
      type: Array,
    },
    list_students: {
      type: Array,
    },
    image_url: {
      type: String,
    },
    image_directory: {
      type: String,
    },
  },
  { timestamps: true }
);

// membuat Collection Teacher
export default mongoose.models.Class || mongoose.model("Class", classSchema);
