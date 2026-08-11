import { compressImage } from "@/lib/compress-image";
import type { CreateNewsImageInput, CreateNewsInput } from "./types";

const FALLBACK_TYPE = "application/octet-stream";

export type NewsMutationResult = {
  ok: boolean;
  error?: string;
  networkError?: boolean;
};

export async function uploadNewsImages(
  files: File[],
): Promise<{ keys: string[]; failed?: boolean }> {
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
    return { keys: [], failed: true };
  }

  return { keys };
}

export async function createNews(
  input: CreateNewsInput,
): Promise<NewsMutationResult> {
  try {
    const res = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (res.ok) return { ok: true };
    const err = await res.json().catch(() => null);
    return { ok: false, error: err?.error };
  } catch {
    return { ok: false, networkError: true };
  }
}

export async function deleteNews(id: number): Promise<NewsMutationResult> {
  try {
    const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
    if (res.ok) return { ok: true };
    const err = await res.json().catch(() => null);
    return { ok: false, error: err?.error };
  } catch {
    return { ok: false, networkError: true };
  }
}

export function toCreateNewsImages(keys: string[]): CreateNewsImageInput[] {
  return keys.map((imageKey, displayOrder) => ({
    image_key: imageKey,
    display_order: displayOrder,
  }));
}
