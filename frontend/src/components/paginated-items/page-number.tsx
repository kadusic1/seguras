interface PageNumberProps {
  page: number;
  className?: string;
}

const pageNumberBase =
  "inline-flex items-center justify-center rounded-md bg-gray-600 px-4 py-2.5 text-xs font-semibold text-white sm:px-5 sm:py-3 sm:text-sm";

export function PageNumber({ page, className }: PageNumberProps) {
  return (
    <span className={`${pageNumberBase}${className ? ` ${className}` : ""}`}>
      {page}
    </span>
  );
}
