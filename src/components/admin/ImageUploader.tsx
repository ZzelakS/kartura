"use client";

import { useRef, useState } from "react";
import type { ProductImage } from "@/data/catalog";
import { imagekitUrl } from "@/lib/imagekit";

type Props = {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  folder: string;
  max?: number;
};

type Progress = { name: string; percent: number };

const UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

async function uploadOne(file: File, folder: string, onProgress: (p: number) => void) {
  const auth = await fetch("/api/imagekit/auth", { cache: "no-store" });
  if (!auth.ok) {
    const body = (await auth.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Could not get an upload signature.");
  }
  const { token, expire, signature } = (await auth.json()) as {
    token: string;
    expire: number;
    signature: string;
  };

  const form = new FormData();
  form.append("file", file);
  form.append("fileName", file.name);
  form.append("folder", folder);
  form.append("useUniqueFileName", "true");
  form.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "");
  form.append("token", token);
  form.append("expire", String(expire));
  form.append("signature", signature);

  return await new Promise<ProductImage>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", UPLOAD_URL);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText) as {
          filePath?: string;
          width?: number;
          height?: number;
          message?: string;
        };
        if (xhr.status >= 200 && xhr.status < 300 && res.filePath) {
          resolve({ path: res.filePath, width: res.width, height: res.height, alt: "" });
        } else {
          reject(new Error(res.message ?? "ImageKit rejected the upload."));
        }
      } catch {
        reject(new Error("ImageKit returned something unreadable."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed. Check the connection and try again."));
    xhr.send(form);
  });
}

export default function ImageUploader({ images, onChange, folder, max = 6 }: Props) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const accept = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const room = max - images.length;
    const chosen = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, Math.max(0, room));

    if (chosen.length === 0) {
      setError(room <= 0 ? `That is already ${max} images.` : "Those files were not images.");
      return;
    }

    setProgress(chosen.map((f) => ({ name: f.name, percent: 0 })));
    const uploaded: ProductImage[] = [];

    for (const file of chosen) {
      try {
        const doc = await uploadOne(file, folder, (percent) =>
          setProgress((prev) => prev.map((p) => (p.name === file.name ? { ...p, percent } : p))),
        );
        uploaded.push(doc);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed.");
      }
    }

    setProgress([]);
    if (uploaded.length > 0) onChange([...images, ...uploaded]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void accept(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`cursor-pointer border border-dashed px-6 py-10 text-center transition-colors ${
          dragging ? "border-amber bg-amber/5" : "border-linen/20 hover:border-linen/40"
        }`}
      >
        <p className="text-[14px]">Drop photos here, or click to browse</p>
        <p className="mt-2 text-[13px] text-muted">
          Up to {max}. The first one is used on the storefront.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            void accept(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {progress.length > 0 ? (
        <div className="mt-4 space-y-2">
          {progress.map((p) => (
            <div key={p.name}>
              <div className="flex justify-between text-[12px] text-muted">
                <span className="truncate">{p.name}</span>
                <span>{p.percent}%</span>
              </div>
              <div className="mt-1 h-[2px] bg-linen/10">
                <div
                  className="h-full bg-amber transition-all"
                  style={{ width: `${p.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-3 text-[13px] text-amber">{error}</p> : null}

      {images.length > 0 ? (
        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.path} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagekitUrl(img.path, { width: 320, crop: "at_max" })}
                alt={img.alt || ""}
                className="aspect-square w-full border border-linen/10 object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/85 px-2 py-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    if (i === 0) return;
                    const next = [...images];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}
                  disabled={i === 0}
                  className="text-muted hover:text-linen disabled:opacity-30"
                >
                  {i === 0 ? "Cover" : "Move up"}
                </button>
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, j) => j !== i))}
                  className="text-muted hover:text-amber"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
