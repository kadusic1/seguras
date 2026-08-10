import "server-only";

import type { PaginatedResponse } from "@/components/paginated-items";
import { ITEMS_PER_PAGE } from "@/lib/pagination";
import type { MessageItemData } from "./types";

const EMPTY_PAGE: PaginatedResponse<MessageItemData> = {
  items: [],
  total: 0,
  page: 1,
  per_page: ITEMS_PER_PAGE,
};

export async function getMessagesPage(
  page: number,
  perPage: number,
  accessToken: string,
): Promise<PaginatedResponse<MessageItemData>> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return EMPTY_PAGE;

  try {
    const res = await fetch(
      `${apiUrl}/contact?page=${page}&per_page=${perPage}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      },
    );
    if (!res.ok) return EMPTY_PAGE;
    return (await res.json()) as PaginatedResponse<MessageItemData>;
  } catch {
    return EMPTY_PAGE;
  }
}
