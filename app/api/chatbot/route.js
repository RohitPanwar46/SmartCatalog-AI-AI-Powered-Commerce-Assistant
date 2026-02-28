import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { GoogleGenAI } from "@google/genai";
import ChatLog from "@/models/ChatLog";


const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    await connectDB();

    const { message } = await req.json();
    let orderContext = "";

    // 🔎 detect order id
    const orderMatch = message.match(/ORD\d+/i);

    if (orderMatch) {
      const orderId = orderMatch[0];

      const order = await Order.findOne({ orderId });

      if (order) {
        orderContext = `
Order Details:
Order ID: ${order.orderId}
Product: ${order.product}
Status: ${order.status}
Amount: ₹${order.amount}
`;
      } else {
        orderContext = `User asked about order ${orderId} but no order found.`;
      }
    }

    const prompt = `
You are an AI customer support assistant for an ecommerce store.

Rules:
- Answer politely and shortly.
- If order details provided, explain order status.
- If refund/return/cancel request, say it will be escalated to human agent.
- If normal question, answer normally.

${orderContext}

User message: ${message}
`;

    const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
    });

    const text =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand.";

    // save chat log
    await ChatLog.create({
      message,
      reply: text,
    });

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ reply: "Server error" }, { status: 500 });
  }
}
