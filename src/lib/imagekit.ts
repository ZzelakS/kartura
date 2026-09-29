import type { ProductImage } from "@/data/catalog";

const ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL ?? "";

type Transform = {
  width?: number;
  height?: number;
  quality?: number;
  crop?: "maintain_ratio" | "at_max" | "force";
};

/**
 * Builds a delivery URL from an ImageKit filePath. Transformations go in the
 * query string so a stored path stays a plain path and can be resized anywhere
 * it is rendered.
 */
export function imagekitUrl(path: string, t: Transform = {}): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const parts: string[] = [];
  if (t.width) parts.push(`w-${t.width}`);
  if (t.height) parts.push(`h-${t.height}`);
  parts.push(`q-${t.quality ?? 80}`);
  if (t.crop) parts.push(`c-${t.crop}`);
  parts.push("f-auto");

  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${ENDPOINT}${clean}?tr=${parts.join(",")}`;
}

export function firstImage(images?: ProductImage[]): ProductImage | null {
  return images && images.length > 0 ? images[0] : null;
}
