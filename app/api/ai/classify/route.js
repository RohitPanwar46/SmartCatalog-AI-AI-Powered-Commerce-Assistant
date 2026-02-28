import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { generateProductTags } from "@/services/aiService";
import Product from "@/models/Product";
import AiLog from "@/models/AiLog";

export async function POST(req) {
  try {
    await connectDB();

    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const {text: aiResponse, prompt} = await generateProductTags(title, description);
    const data = JSON.parse(aiResponse);

    // saving AI log
    await AiLog.create({
      title,
      description,
      prompt,
      response: data,
    });
    
    // saving product
    const product = await Product.create({
      title,
      description,
      category: data.category,
      subcategory: data.subcategory,
      seo_tags: data.seo_tags,
      sustainability: data.sustainability,
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
