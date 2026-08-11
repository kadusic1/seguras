"use client";

import { ArrowRight, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Form, FormField, PasswordField } from "@/components/form";
import { ErrorText, Logo } from "@/components/ui";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Login");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex justify-center scale-150">
        <Logo />
      </div>
      <Form<LoginFormData>
        header={t("form.header")}
        subtitle={t("form.subtitle")}
        onSubmit={async (data) => {
          setError(null);
          const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });
          if (result?.error) {
            if (result.code === "rate_limited") {
              setError(t("error.rateLimited"));
            } else {
              setError(t("error.invalidCredentials"));
            }
          } else {
            router.push("/");
            router.refresh();
          }
        }}
        defaultValues={{ email: "", password: "" }}
        bgScheme="black"
        submitLabel={t("form.submitLabel")}
        submitIcon={<ArrowRight size={16} />}
        submitIconPosition="right"
        headerIcon={Shield}
        headerIconPosition="left"
        className="bg-black/80 backdrop-blur-sm border border-white/10"
      >
        <FormField
          name="email"
          label={t("form.emailLabel")}
          type="email"
          placeholder={t("form.emailPlaceholder")}
          rules={{ required: t("form.emailRequired") }}
        />
        <PasswordField
          name="password"
          label={t("form.passwordLabel")}
          placeholder={t("form.passwordPlaceholder")}
          rules={{ required: t("form.passwordRequired") }}
        />
        {error && <ErrorText className="mt-2 text-center">{error}</ErrorText>}
      </Form>
    </div>
  );
}
