import { put, list, get } from "@vercel/blob";
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

async function streamToString(stream: ReadableStream): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result;
}

export async function getProducts(): Promise<Product[]> {
  if (!hasBlob) return readLocal();
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];
    const result = await get(blobs[0].pathname, { access: "private" });
    if (!result || !result.stream) return [];
    const text = await streamToString(result.stream);
    return JSON.parse(text);
  } catch (err) {
    console.error("Error leyendo productos de Blob:", err);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  if (!hasBlob) {
    await writeLocal(products);
    return;
  }
  await put(BLOB_KEY, JSON.stringify(products, null, 2), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
  });
}
