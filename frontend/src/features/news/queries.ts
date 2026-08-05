import "server-only";

import type { PaginatedResponse } from "@/components/paginated-items";
import type { NewsItemData } from "./types";

const EMPTY_PAGE: PaginatedResponse<NewsItemData> = {
  items: [],
  total: 0,
  page: 1,
  per_page: 10,
};

export async function getNewsPage(
  page: number,
  perPage: number,
): Promise<PaginatedResponse<NewsItemData>> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return EMPTY_PAGE;

  try {
    const res = await fetch(`${apiUrl}/news?page=${page}&per_page=${perPage}`, {
      cache: "no-store",
    });
    if (!res.ok) return EMPTY_PAGE;
    return (await res.json()) as PaginatedResponse<NewsItemData>;
  } catch {
    return EMPTY_PAGE;
  }
}
