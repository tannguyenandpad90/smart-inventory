import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: { id: string } };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const existing = await prisma.product.findUnique({
    where: { id: params.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if ("name" in body) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      return NextResponse.json(
        { error: "name must be a non-empty string" },
        { status: 400 }
      );
    }
    updates.name = body.name.trim();
  }

  if ("category" in body) {
    if (typeof body.category !== "string" || body.category.trim() === "") {
      return NextResponse.json(
        { error: "category must be a non-empty string" },
        { status: 400 }
      );
    }
    updates.category = body.category.trim();
  }

  if ("stock" in body) {
    if (typeof body.stock !== "number" || body.stock < 0) {
      return NextResponse.json(
        { error: "stock must be a non-negative number" },
        { status: 400 }
      );
    }
    updates.stock = body.stock;
  }

  if ("price" in body) {
    if (typeof body.price !== "number" || body.price < 0) {
      return NextResponse.json(
        { error: "price must be a non-negative number" },
        { status: 400 }
      );
    }
    updates.price = body.price;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const updated = await prisma.product.update({
    where: { id: params.id },
    data: updates,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
