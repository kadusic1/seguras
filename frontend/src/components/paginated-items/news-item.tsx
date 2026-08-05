"use client";

import Image from "next/image";
import { Carousel } from "@/components/blocks";
import { Heading, Text } from "@/components/ui";
import type { NewsItemData } from "@/features/news/types";
import type { ColorScheme } from "@/lib/colours";
import { ItemCommon } from "./item-common";

export type { NewsImageData, NewsItemData } from "@/features/news/types";

interface NewsItemProps {
  item: NewsItemData;
  bgScheme?: ColorScheme;
  showDeleteButton?: boolean;
  onDeleteButtonClick?: () => void;
}

export function NewsItem({
  item,
  bgScheme = "white",
  showDeleteButton = false,
  onDeleteButtonClick,
}: NewsItemProps) {
  return (
    <ItemCommon
      bgScheme={bgScheme}
      showDeleteButton={showDeleteButton}
      onDeleteButtonClick={onDeleteButtonClick}
    >
      {(surface, s) => (
        <>
          <header className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <Image
                src="/logo.svg"
                alt="Seguras"
                width={24}
                height={24}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <Heading as="h3" size="sm" bgScheme={surface}>
              {item.heading}
            </Heading>
            <time
              className={`ml-auto shrink-0 text-sm ${s.text.muted}`}
              dateTime={item.created_at}
              title={new Date(item.created_at).toLocaleString()}
            >
              {item.time_ago}
            </time>
          </header>
          {item.images.length > 0 && (
            <Carousel
              className="mx-auto mt-4 max-w-2xl"
              autoplay={false}
              showArrows
              dotScheme={surface === "white" ? "dark" : "light"}
              slideClassName="min-w-0 flex-[0_0_100%]"
              slides={item.images.map((image) => ({
                id: String(image.id),
                content: (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 672px"
                    />
                  </div>
                ),
              }))}
            />
          )}
          <Text
            variant="base"
            bgScheme={surface}
            className="mt-4 whitespace-pre-line"
          >
            {item.text}
          </Text>
        </>
      )}
    </ItemCommon>
  );
}
