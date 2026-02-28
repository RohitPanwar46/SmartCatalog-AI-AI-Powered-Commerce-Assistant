import mongoose from "mongoose";

const aiLogSchema = new mongoose.Schema({
  title: String,
  description: String,
  prompt: String,
  response: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.AiLog || mongoose.model("AiLog", aiLogSchema);