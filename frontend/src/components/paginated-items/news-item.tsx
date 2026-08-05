import Image from "next/image";
import { Carousel } from "@/components/blocks";
import { Heading, Text } from "@/components/ui";
import { type ColorScheme, schemes } from "@/lib/colours";

export interface NewsImageData {
  id: number;
  url: string;
  display_order: number;
}

export interface NewsItemData {
  id: number;
  heading: string;
  text: string;
  created_at: string;
  time_ago: string;
  images: NewsImageData[];
}

interface NewsItemProps {
  item: NewsItemData;
  bgScheme?: ColorScheme;
}

export function NewsItem({ item, bgScheme = "white" }: NewsItemProps) {
  const surface: ColorScheme =
    bgScheme === "black" ? "white" : bgScheme === "white" ? "black" : "red";
  const s = schemes[surface];
  const cardSurface =
    surface === "red"
      ? schemes.red.card
      : surface === "white"
        ? "border-black/10 bg-white"
        : "border-white/10 bg-black";

  return (
    <article
      className={`mx-auto w-full max-w-3xl rounded-lg border p-6 sm:p-8 ${cardSurface}`}
    >
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
    </article>
  );
}
