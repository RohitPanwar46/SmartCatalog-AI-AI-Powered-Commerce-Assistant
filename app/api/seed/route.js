import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET() {
  await connectDB();

  await Order.deleteMany({});

  await Order.insertMany([
    {
      orderId: "ORD123",
      customerName: "Rohit",
      product: "Bamboo Toothbrush Pack",
      status: "shipped",
      amount: 499
    },
    {
      orderId: "ORD456",
      customerName: "Amit",
      product: "Steel Bottle",
      status: "processing",
      amount: 799
    }
  ]);

  return NextResponse.json({ message: "Demo orders inserted" });
}