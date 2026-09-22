import { put, list } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";
import type { Product } from "./types";

const BLOB_KEY = "fashion-ale-products.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "products.json");
const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

async function readLocal(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLocal(products: Product[]) {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(products, null, 2));
}

export async function getProducts(): Promise<Product[]> {
  if (!hasBlob) return readLocal();
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (!hasBlob) {
    await writeLocal(products);
    return;
  }
  await put(BLOB_KEY, JSON.stringify(products, null, 2), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}
