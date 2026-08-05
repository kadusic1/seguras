"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { AddButton, NextPageButton, PreviousPageButton } from "@/components/ui";
import { PageNumber } from "./page-number";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

interface PaginationParentProps<T> {
  initialData: PaginatedResponse<T>;
  url: string;
  renderItem: (item: T, index: number) => ReactNode;
  showAddButton?: boolean;
  onAddButtonClick?: () => void;
  /** Increment to refetch the current page (e.g. after add/delete). */
  refreshToken?: number;
}

export function PaginationParent<T>({
  initialData,
  url,
  renderItem,
  showAddButton = false,
  onAddButtonClick,
  refreshToken,
}: PaginationParentProps<T>) {
  const [data, setData] = useState(initialData);

  const page = data.page;
  const perPage = Math.max(data.per_page, 1);
  const totalPages = Math.ceil(data.total / perPage);

  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    if (!refreshToken) return;
    void (async () => {
      try {
        const res = await fetch(
          `${url}?page=${pageRef.current}&per_page=${perPage}`,
        );
        if (!res.ok) return;
        setData((await res.json()) as PaginatedResponse<T>);
      } catch {
        // network or JSON error: keep the current page
      }
    })();
  }, [refreshToken, url, perPage]);

  async function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return;

    try {
      const res = await fetch(`${url}?page=${nextPage}&per_page=${perPage}`);
      if (!res.ok) return;
      setData((await res.json()) as PaginatedResponse<T>);
    } catch {
      // network or JSON error: keep the current page
    }
  }

  return (
    <div>
      {showAddButton && (
        <div className="flex justify-end">
          <AddButton type="button" onClick={onAddButtonClick} />
        </div>
      )}
      <div>{data.items.map((item, index) => renderItem(item, index))}</div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <PreviousPageButton
            type="button"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          />
          <PageNumber page={page} />
          <NextPageButton
            type="button"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          />
        </div>
      )}
    </div>
  );
}
