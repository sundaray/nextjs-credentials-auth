"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/error-message";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ForgotPasswordFormSchema } from "@/schema";
import { forgotPassword } from "@/app/auth-actions";

export function ForgotPasswordForm() {
  const [lastResult, formAction, isPending] = useActionState(
    forgotPassword,
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
        schema: ForgotPasswordFormSchema,
      });
    },
  });

  return (
    <div className="mx-auto px-4 sm:mx-auto sm:max-w-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-secondary-foreground">
        Forgot password?
      </h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Enter your email to request a password reset link
      </p>
      {form.errors && <ErrorMessage id="form-error" errors={form.errors} />}
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={formAction}
        noValidate
      >
        <div className="grid gap-2">
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
          </div>{" "}
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.loader className="size-3 animate-spin" />
                Sending...
              </>
            ) : (
              "Send password reset link"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
