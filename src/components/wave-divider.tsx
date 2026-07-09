import { type ColorScheme, schemes } from "@/lib/colours";

interface WaveDividerProps {
  fillScheme: ColorScheme;
  className?: string;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

const path = "M0,0 C 240,120 720,80 1440,0 L 1440,120 L 0,120 Z";

export function WaveDivider({
  fillScheme,
  className = "",
  flipHorizontal = false,
  flipVertical = false,
}: WaveDividerProps) {
  const flipX = flipHorizontal ? "-scale-x-100" : "";
  const flipY = flipVertical ? "-scale-y-100" : "";

  return (
    <div
      className={`overflow-hidden leading-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        className={`block w-full h-[30px] sm:h-[50px] md:h-[80px] lg:h-[120px] ${flipX} ${flipY}`}
      >
        <title>Section divider</title>
        <path d={path} fill={schemes[fillScheme].fill} />
      </svg>
    </div>
  );
}
