"use client";

import { useState, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/error-message";

import { signInWithEmailAndPassword } from "@/app/auth-actions";
import { SignInEmailPasswordFormSchema } from "@/schema";

export function SignInEmailPasswordForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const boundSignInWithEmailAndPassword = signInWithEmailAndPassword.bind(
    null,
    next,
  );

  const [lastResult, formAction, isPending] = useActionState(
    boundSignInWithEmailAndPassword,
    undefined,
  );

  const [form, fields] = useForm({
    lastResult,
    // Validate when field loses focus
    shouldValidate: "onBlur",
    // Re-validate as user types
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: SignInEmailPasswordFormSchema,
      });
    },
  });

  console.log("Field Errors: ", fields.password.errors);
  console.log("Field Errors: ", fields.email.errors);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  return (
    <div className="px-4 sm:mx-auto sm:max-w-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-secondary-foreground">
        Welcome back
      </h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Sign in to your account
      </p>

      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={formAction}
        noValidate
        aria-describedby={form.errors ? "form-error" : undefined}
      >
        {form.errors && <ErrorMessage id="form-error" errors={form.errors} />}
        <div className="mt-4 grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              defaultValue={lastResult?.initialValue?.email as string}
              placeholder="you@example.com"
              aria-invalid={fields.email.errors ? "true" : undefined}
              aria-describedby={fields.email.errors ? "email-error" : undefined}
            />
            <ErrorMessage id="email-error" errors={fields.email.errors} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                defaultValue={lastResult?.initialValue?.password as string}
                aria-invalid={fields.password.errors ? "true" : undefined}
                aria-describedby={
                  fields.password.errors ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                aria-pressed={isPasswordVisible}
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground outline-offset-0 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPasswordVisible ? (
                  <Icons.eyeOff size={16} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Icons.eye size={16} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            </div>
            <ErrorMessage id="password-error" errors={fields.password.errors} />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.loader className="size-3 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
