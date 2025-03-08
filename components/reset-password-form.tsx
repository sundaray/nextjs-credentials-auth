"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { ErrorMessage } from "@/components/error-message";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ResetPasswordFormSchema } from "@/schema";
import { resetPassword } from "@/app/auth-actions";

export function ResetPasswordForm() {
  const [lastResult, formAction, isPending] = useActionState(
    resetPassword,
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
        schema: ResetPasswordFormSchema,
      });
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }

  return (
    <div className="mx-auto px-4 sm:max-w-sm">
      <h2 className="text-2xl font-semibold tracking-tight text-secondary-foreground">
        Reset password
      </h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Enter a new password below
      </p>

      <form
        id={form.id}
        onSubmit={form.onSubmit}
        action={formAction}
        noValidate
      >
        {form.errors && <ErrorMessage id="form-error" errors={form.errors} />}

        <div className="mt-4 grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={isPasswordVisible ? "text" : "password"}
                name="newPassword"
                defaultValue={lastResult?.initialValue?.password as string}
                aria-invalid={fields.newPassword.errors ? "true" : undefined}
                aria-describedby={
                  fields.newPassword.errors ? "new-password-error" : undefined
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
            <ErrorMessage
              id="new-password-error"
              errors={fields.newPassword.errors}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmNewPassword">Confirm new password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              name="confirmNewPassword"
              aria-invalid={
                fields.confirmNewPassword.errors ? "true" : undefined
              }
              aria-describedby={
                fields.confirmNewPassword.errors
                  ? "confirm-new-password-error"
                  : undefined
              }
            />
            <ErrorMessage
              id="confirm-new-password-error"
              errors={fields.confirmNewPassword.errors}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Icons.loader className="size-3 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
