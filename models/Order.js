import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: String,
  customerName: String,
  product: String,
  status: String, // shipped, processing, delivered
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);