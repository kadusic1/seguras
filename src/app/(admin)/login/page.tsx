"use client";

import { ArrowRight, Shield } from "lucide-react";
import { Form, FormField } from "@/components/form";
import { Logo } from "@/components/logo";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex justify-center scale-150">
        <Logo />
      </div>
      <Form<LoginFormData>
        header="Login"
        subtitle="Enter your email and password"
        onSubmit={(data) => console.log(data)}
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
        <FormField
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          rules={{ required: "Password is required" }}
        />
      </Form>
    </div>
  );
}
