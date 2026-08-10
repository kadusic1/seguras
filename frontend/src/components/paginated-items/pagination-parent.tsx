"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AddButton, NextPageButton, PreviousPageButton } from "@/components/ui";
import { EmptyState } from "./empty-state";
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
  /** Empty-state copy. Defaults to EmptyState's own default message. */
  emptyMessage?: string;
}

export function PaginationParent<T>({
  initialData,
  url,
  renderItem,
  showAddButton = false,
  onAddButtonClick,
  refreshToken,
  emptyMessage,
}: PaginationParentProps<T>) {
  const [data, setData] = useState(initialData);

  const page = data.page;
  const perPage = Math.max(data.per_page, 1);
  const totalPages = Math.ceil(data.total / perPage);

  const pageRef = useRef(page);
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const listRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef(page);

  useEffect(() => {
    if (prevPageRef.current === data.page) return;
    prevPageRef.current = data.page;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }, [data.page]);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      try {
        const res = await fetch(`${url}?page=${nextPage}&per_page=${perPage}`);
        if (!res.ok) return;
        const result = (await res.json()) as PaginatedResponse<T>;
        const lastPage = Math.max(
          1,
          Math.ceil(result.total / Math.max(result.per_page, 1)),
        );
        if (nextPage > lastPage) return fetchPage(lastPage);
        setData(result);
      } catch {
        // network or JSON error: keep the current page
      }
    },
    [url, perPage],
  );

  useEffect(() => {
    if (!refreshToken) return;
    void fetchPage(pageRef.current);
  }, [refreshToken, fetchPage]);

  async function goToPage(nextPage: number) {
    if (nextPage < 1 || nextPage > totalPages) return;
    await fetchPage(nextPage);
  }

  return (
    <div className="pt-4">
      {showAddButton && (
        <div className="flex justify-end">
          <AddButton type="button" onClick={onAddButtonClick} />
        </div>
      )}
      <div ref={listRef} className="mt-4 scroll-mt-24">
        {data.items.length === 0 && page === 1 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          data.items.map((item, index) => renderItem(item, index))
        )}
      </div>
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
