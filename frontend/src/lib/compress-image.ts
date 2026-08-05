import encode from "@jsquash/webp/encode";

/**
 * Browser-only. Formats a canvas can't decode (SVG, animated GIF) and
 * non-image files are passed through untouched rather than skipped silently
 * per-caller.
 */
const UNSUPPORTED_IMAGE_TYPES = new Set(["image/svg+xml", "image/gif"]);

/** Options for {@link compressImage}. */
export interface CompressImageOptions {
  /** Longest edge, in pixels, the output may have. Defaults to `1200`. */
  maxSize?: number;
  /** WebP quality in `[0, 1]`. Defaults to `0.75`. */
  quality?: number;
}

/**
 * Downsizes an image to fit within `maxSize`x`maxSize` (preserving aspect
 * ratio, never upscaling) and re-encodes it as WebP at `quality`.
 *
 * Resizing uses native `createImageBitmap` + `<canvas>` (near-universal
 * support). Encoding uses `@jsquash/webp`, a WebAssembly build of libwebp,
 * instead of `canvas.toBlob(..., "image/webp")` because Safari (desktop and
 * iOS, as of 2026) silently ignores that request and returns a PNG instead -
 * WASM encoding sidesteps that gap entirely and gives real, identical WebP
 * output on every browser.
 *
 * SVGs and GIFs are returned unchanged (rasterizing would lose vector scaling
 * / animation), as is anything that isn't an image. Intended to be run on
 * files picked via {@link FileInputField} right before they're uploaded, so
 * the bytes sent to Backblaze are already small.
 *
 * @example
 * ```ts
 * const small = await compressImage(file); // <= 1200x1200, image/webp, q=0.75
 * ```
 */
export async function compressImage(
  file: File,
  { maxSize = 1200, quality = 0.75 }: CompressImageOptions = {},
): Promise<File> {
  if (
    !file.type.startsWith("image/") ||
    UNSUPPORTED_IMAGE_TYPES.has(file.type)
  ) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const imageData = ctx.getImageData(0, 0, width, height);
  const buffer = await encode(imageData, { quality: quality * 100 });

  return new File([buffer], `${file.name.replace(/\.[^./]+$/, "")}.webp`, {
    type: "image/webp",
    lastModified: file.lastModified,
  });
}
