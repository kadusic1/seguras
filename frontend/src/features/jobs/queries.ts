import "server-only";

import type { PaginatedResponse } from "@/components/paginated-items";
import { ITEMS_PER_PAGE } from "@/lib/pagination";
import type { JobApplicationItemData } from "./types";

const EMPTY_PAGE: PaginatedResponse<JobApplicationItemData> = {
  items: [],
  total: 0,
  page: 1,
  per_page: ITEMS_PER_PAGE,
};

export async function getApplicationsPage(
  page: number,
  perPage: number,
  accessToken: string,
): Promise<PaginatedResponse<JobApplicationItemData>> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return EMPTY_PAGE;

  try {
    const res = await fetch(`${apiUrl}/jobs?page=${page}&per_page=${perPage}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return EMPTY_PAGE;
    return (await res.json()) as PaginatedResponse<JobApplicationItemData>;
  } catch {
    return EMPTY_PAGE;
  }
}
