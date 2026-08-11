export async function deleteMessage(
  id: number,
): Promise<{ error?: string; networkError?: boolean }> {
  try {
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) return {};
    const err = await res.json().catch(() => null);
    return { error: err?.error };
  } catch {
    return { networkError: true };
  }
}
