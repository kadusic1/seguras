import { ArrowRight, type LucideIcon } from "lucide-react";
import { type ColorScheme, cardBorderBgColourMap } from "@/lib/colours";
import { Button } from "./button";
import { Heading } from "./heading";
import { Text } from "./text";

interface IconCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  colorScheme?: ColorScheme;
}

export function IconCard({
  icon: Icon,
  title,
  description,
  href,
  colorScheme = "red",
}: IconCardProps) {
  return (
    <div
      className={`group rounded-lg border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${cardBorderBgColourMap[colorScheme]}`}
    >
      <Heading as="h3" size="card" color={colorScheme} icon={Icon}>
        {title}
      </Heading>
      <Text variant="body" color={colorScheme} className="mt-2">
        {description}
      </Text>
      {href && (
        <Button
          variant="link"
          colorScheme={colorScheme}
          href={href}
          iconRight={<ArrowRight />}
          className="mt-4"
        >
          Learn more
        </Button>
      )}
    </div>
  );
}
