"use client";

import Image from "next/image";
import { useState } from "react";
import { Carousel } from "@/components/blocks";
import { Heading, Skeleton, Text } from "@/components/ui";
import type { NewsItemData } from "@/features/news/types";
import { ItemCommon } from "./item-common";
import { RelativeTime } from "./relative-time";

export type { NewsImageData, NewsItemData } from "@/features/news/types";

interface NewsItemProps {
  item: NewsItemData;
  showDeleteButton?: boolean;
  onDeleteButtonClick?: () => void;
}

function NewsSlideImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
      <Skeleton className="absolute inset-0 h-full w-full rounded-lg" />
      <Image
        src={src}
        alt=""
        fill
        className={`object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="(max-width: 768px) 100vw, 672px"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export function NewsItem({
  item,
  showDeleteButton = false,
  onDeleteButtonClick,
}: NewsItemProps) {
  return (
    <ItemCommon
      showDeleteButton={showDeleteButton}
      onDeleteButtonClick={onDeleteButtonClick}
    >
      <header className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full mb-4">
          <Image
            src="/logo.svg"
            alt="Seguras"
            width={24}
            height={24}
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <Heading as="h3" size="md" bgScheme="white">
          {item.heading}
        </Heading>
        <RelativeTime date={item.time_ago} />
      </header>
      {item.images.length > 0 && (
        <Carousel
          className="mx-auto mt-4 max-w-2xl"
          autoplay={false}
          showArrows
          dotScheme="dark"
          slideClassName="min-w-0 flex-[0_0_100%]"
          slides={item.images.map((image) => ({
            id: String(image.id),
            content: <NewsSlideImage src={image.url} />,
          }))}
        />
      )}
      <Text
        variant="base"
        bgScheme="white"
        className="mt-4 whitespace-pre-line"
      >
        {item.text}
      </Text>
    </ItemCommon>
  );
}
