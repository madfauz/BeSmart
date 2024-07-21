import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema(
  {
    url: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// membuat Collection Resource
export default mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
