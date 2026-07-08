import Image from "next/image";
import {
  type ColorScheme,
  captionBgColourMap,
  captionHeadingSchemeMap,
  sectionTextSchemeMap,
} from "@/lib/colours";
import { Button } from "./button";
import { Heading } from "./heading";
import { Text } from "./text";

export interface CaptionedImageCaption {
  heading: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface CaptionedImageProps {
  src: string;
  alt: string;
  caption?: CaptionedImageCaption;
  colorScheme: ColorScheme;
}

export function CaptionedImage({
  src,
  alt,
  caption,
  colorScheme,
}: CaptionedImageProps) {
  const headingScheme = captionHeadingSchemeMap[colorScheme];
  const bodyScheme = sectionTextSchemeMap[colorScheme];

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
          className={`${captionBgColourMap[colorScheme]} space-y-3 p-4 sm:p-5`}
        >
          <Heading size="small" color={headingScheme}>
            {caption.heading}
          </Heading>
          <Text variant="body" color={bodyScheme} className="font-bold">
            {caption.text}
          </Text>
          <Button href={caption.ctaHref} variant="primary" colorScheme="red">
            {caption.ctaLabel}
          </Button>
        </figcaption>
      )}
    </figure>
  );
}
