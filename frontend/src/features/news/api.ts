import { compressImage } from "@/lib/compress-image";
import type { CreateNewsImageInput, CreateNewsInput } from "./types";

const FALLBACK_TYPE = "application/octet-stream";

export async function uploadNewsImages(
  files: File[],
): Promise<{ keys: string[]; error?: string }> {
  const uploads = files.map(async (file): Promise<{ key: string }> => {
    const compressed = await compressImage(file);
    const res = await fetch("/api/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        size: compressed.size,
        content_type: compressed.type || FALLBACK_TYPE,
        filename: compressed.name,
      }),
    });
    if (!res.ok) throw new Error("presign failed");

    const { upload_url, key } = await res.json();
    const putRes = await fetch(upload_url, {
      method: "PUT",
      headers: { "Content-Type": compressed.type || FALLBACK_TYPE },
      body: compressed,
    });
    if (!putRes.ok) throw new Error("upload failed");
    return { key };
  });

  const results = await Promise.allSettled(uploads);
  const keys: string[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") keys.push(result.value.key);
  }

  if (keys.length < files.length) {
    for (const key of keys) {
      void fetch(`/api/files/${key}`, { method: "DELETE" });
    }
    return {
      keys: [],
      error: "Failed to upload one or more images. Please try again.",
    };
  }

  return { keys };
}

export async function createNews(
  input: CreateNewsInput,
): Promise<{ error?: string }> {
  try {
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (res.ok) return {};
    const err = await res.json().catch(() => null);
    return { error: err?.error ?? "Failed to add news. Please try again." };
  } catch {
    return { error: "Check your internet connection and try again." };
  }
}

export async function deleteNews(id: number): Promise<{ error?: string }> {
  try {
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    if (res.ok) return {};
    const err = await res.json().catch(() => null);
    return { error: err?.error ?? "Failed to delete news. Please try again." };
  } catch {
    return { error: "Check your internet connection and try again." };
  }
}

export function toCreateNewsImages(keys: string[]): CreateNewsImageInput[] {
  return keys.map((imageKey, displayOrder) => ({
    image_key: imageKey,
    display_order: displayOrder,
  }));
}
