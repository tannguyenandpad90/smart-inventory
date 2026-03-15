import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Product } from "@/types/inventory";

const client = new Anthropic();

function isProductArray(data: unknown): data is Product[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as Product).id === "string" &&
      typeof (item as Product).name === "string" &&
      typeof (item as Product).stock === "number" &&
      typeof (item as Product).price === "number" &&
      typeof (item as Product).category === "string"
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!isProductArray(body.products)) {
    return NextResponse.json(
      { error: "Invalid body. Required: products (Product[])" },
      { status: 400 }
    );
  }

  const products = body.products;

  const inventorySummary = products
    .map(
      (p: Product) =>
        `- ${p.name} | Category: ${p.category} | Stock: ${p.stock} | Price: $${p.price}`
    )
    .join("\n");

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Dựa trên dữ liệu kho này, hãy chỉ ra 3 mặt hàng cần nhập gấp và 1 chiến lược bán hàng nhanh cho hàng tồn lâu. Trả lời ngắn gọn bằng tiếng Việt.\n\nDữ liệu kho:\n${inventorySummary}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return NextResponse.json({
    analysis: textBlock?.text ?? "",
    model: response.model,
    usage: response.usage,
  });
}
