"use client";

import { ArrowRight, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Form, FormField, PasswordField } from "@/components/form";
import { ErrorText, Logo } from "@/components/ui";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex justify-center scale-150">
        <Logo />
      </div>
      <Form<LoginFormData>
        header="Login"
        subtitle="Enter your email and password"
        onSubmit={async (data) => {
          setError(null);
          const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
          });
          if (result?.error) {
            setError("Invalid email or password.");
          } else {
            router.push("/");
            router.refresh();
          }
        }}
        defaultValues={{ email: "", password: "" }}
        bgScheme="black"
        submitLabel="Log In"
        submitIcon={<ArrowRight size={16} />}
        submitIconPosition="right"
        headerIcon={Shield}
        headerIconPosition="left"
        className="bg-black/80 backdrop-blur-sm border border-white/10"
      >
        <FormField
          name="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          rules={{ required: "Email is required" }}
        />
        <PasswordField
          name="password"
          label="Password"
          placeholder="Enter your password"
          rules={{ required: "Password is required" }}
        />
        {error && <ErrorText className="mt-2 text-center">{error}</ErrorText>}
      </Form>
    </div>
  );
}
