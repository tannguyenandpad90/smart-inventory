import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { name, stock, price, category } = body;

  if (
    typeof name !== "string" ||
    typeof stock !== "number" ||
    typeof price !== "number" ||
    typeof category !== "string"
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid body. Required: name (string), stock (number), price (number), category (string)",
      },
      { status: 400 }
    );
  }

  if (name.trim() === "" || category.trim() === "") {
    return NextResponse.json(
      { error: "name and category must not be empty" },
      { status: 400 }
    );
  }

  if (stock < 0 || price < 0) {
    return NextResponse.json(
      { error: "stock and price must be non-negative" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: { name: name.trim(), stock, price, category: category.trim() },
  });
  return NextResponse.json(product, { status: 201 });
}
