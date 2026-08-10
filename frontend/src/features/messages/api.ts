export async function deleteMessage(id: number): Promise<{ error?: string }> {
  try {
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) return {};
    const err = await res.json().catch(() => null);
    return {
      error: err?.error ?? "Failed to delete message. Please try again.",
    };
  } catch {
    return { error: "Check your internet connection and try again." };
  }
}
