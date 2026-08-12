import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Logo, Text } from "@/components/ui";
import { contactInfo } from "./footer-data";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t-2 border-zinc-600 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <Logo />
            <Text variant="base" bgScheme="black" emphasis="primary">
              {t("msg")}
            </Text>
          </div>

          <div className="space-y-4">
            <Text variant="lg" bgScheme="black">
              {t("contact_title")}
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
        </div>
      </div>

      <div className="border-t-2 border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
          <Text
            variant="base"
            bgScheme="black"
            emphasis="primary"
            className="text-center"
          >
            &copy; {new Date().getFullYear()} {t("copyright")}
          </Text>
          <Link
            href="/privacy"
            className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline"
          >
            {t("privacyLink")}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
