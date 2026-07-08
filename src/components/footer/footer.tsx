import Link from "next/link";
import { Logo } from "@/components/logo";
import { navLinks } from "@/components/navbar/navbar-data";
import { Text } from "@/components/text";
import { contactInfo } from "./footer-data";

export function Footer() {
  return (
    <footer className="border-t-2 border-zinc-600 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="space-y-4">
            <Logo />
            <Text variant="base" bgScheme="black" emphasis="primary">
              Professional security and service you can trust.
            </Text>
          </div>

          <div className="space-y-4">
            <Text variant="lg" bgScheme="black">
              Contact
            </Text>
            <ul className="space-y-3">
              {contactInfo.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-3 transition-opacity hover:opacity-80"
                    >
                      <item.icon className="size-5 shrink-0 text-red-500" />
                      <Text
                        as="span"
                        variant="base"
                        bgScheme="black"
                        emphasis="primary"
                      >
                        {item.label}
                      </Text>
                    </a>
                  ) : (
                    <span className="flex items-center gap-3">
                      <item.icon className="size-5 shrink-0 text-red-500" />
                      <Text
                        as="span"
                        variant="base"
                        bgScheme="black"
                        emphasis="primary"
                      >
                        {item.label}
                      </Text>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <Text variant="lg" bgScheme="black">
              Quick Links
            </Text>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block transition-opacity hover:opacity-80"
                  >
                    <Text
                      as="span"
                      variant="base"
                      bgScheme="black"
                      emphasis="primary"
                    >
                      {link.label}
                    </Text>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Text
            variant="base"
            bgScheme="black"
            emphasis="primary"
            className="text-center"
          >
            &copy; {new Date().getFullYear()} Seguras Security. All rights
            reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
}
