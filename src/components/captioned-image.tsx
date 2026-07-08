import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { type ColorScheme, schemes } from "@/lib/colours";
import { Button } from "./button";
import { Heading } from "./heading";
import { Text } from "./text";

export interface CaptionedImageCaption {
  heading: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  icon?: LucideIcon;
}

export interface CaptionedImageProps {
  src: string;
  alt: string;
  caption?: CaptionedImageCaption;
  bgScheme: ColorScheme;
}

export function CaptionedImage({
  src,
  alt,
  caption,
  bgScheme,
}: CaptionedImageProps) {
  const captionScheme = schemes[bgScheme].captionScheme;

  return (
    <figure className="group overflow-hidden rounded-xl shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      </div>
      {caption && (
        <figcaption
          className={`${schemes[captionScheme].bg} space-y-3 p-4 sm:p-5`}
        >
          <Heading size="md" bgScheme={captionScheme} icon={caption.icon}>
            {caption.heading}
          </Heading>
          <Text
            variant="base"
            emphasis="primary"
            bgScheme={captionScheme}
            className="font-semibold"
          >
            {caption.text}
          </Text>
          <Button href={caption.ctaHref} variant="primary" bgScheme="red">
            {caption.ctaLabel}
          </Button>
        </figcaption>
      )}
    </figure>
  );
}
