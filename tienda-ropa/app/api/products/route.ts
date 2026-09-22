import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/store";
import type { Product } from "@/lib/types";

function checkAuth(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const pass = process.env.ADMIN_PASSWORD || "admin123";
  return auth === `Bearer ${pass}`;
}

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products.sort((a, b) => b.createdAt - a.createdAt));
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const products = await getProducts();
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: body.name,
      price: Number(body.price),
      category: body.category,
      image: body.image,
      description: body.description || "",
      available: body.available ?? true,
      createdAt: Date.now(),
    };
    products.push(newProduct);
    await saveProducts(products);
    return NextResponse.json(newProduct);
  } catch (err) {
    console.error("Error al crear producto:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const products = await getProducts();
    const idx = products.findIndex((p) => p.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }
    products[idx] = { ...products[idx], ...body };
    await saveProducts(products);
    return NextResponse.json(products[idx]);
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await req.json();
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  await saveProducts(filtered);
  return NextResponse.json({ ok: true });
}
