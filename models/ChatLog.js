import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  message: String,
  reply: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.ChatLog || mongoose.model("ChatLog", chatSchema);
