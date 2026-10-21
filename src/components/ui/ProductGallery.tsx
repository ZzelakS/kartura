"use client";

import { useState } from "react";
import type { ProductImage } from "@/data/catalog";
import { imagekitUrl } from "@/lib/imagekit";

type Props = {
  images?: ProductImage[];
  name: string;
  /** Tailwind aspect class. Bottles are portrait, bags closer to square. */
  aspect?: string;
  className?: string;
};

/**
 * Images come from ImageKit, which already serves the right format and size
 * through the `tr=` transformation, so they are rendered with a plain <img>
 * rather than routed through next/image for a second optimisation pass.
 *
 * A product with no photos renders nothing at all. An empty grey box would be
 * worse than the text-only layout the page was designed around.
 */
export default function ProductGallery({
  images,
  name,
  aspect = "aspect-[3/4]",
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const active = images[Math.min(index, images.length - 1)];

  return (
    <div className={`product-gallery ${className}`}>
      <div className={`${aspect} w-full overflow-hidden bg-bark`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagekitUrl(active.path, { width: 720, crop: "maintain_ratio" })}
          alt={active.alt || name}
          width={active.width}
          height={active.height}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.path}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${name}, photo ${i + 1}`}
              aria-current={i === index}
              className={`h-14 w-14 overflow-hidden border transition-colors ${
                i === index ? "border-amber" : "border-transparent hover:border-linen/30"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagekitUrl(img.path, { width: 120, crop: "at_max" })}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
