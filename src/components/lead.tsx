import type { ReactNode } from "react";
import type { ColorScheme } from "@/lib/colours";
import { Text } from "./text";

interface LeadProps {
  children: ReactNode;
  className?: string;
  color?: ColorScheme;
}

export function Lead({ className, children, color = "white" }: LeadProps) {
  return (
    <Text as="p" variant="lead" color={color} className={className}>
      {children}
    </Text>
  );
}
