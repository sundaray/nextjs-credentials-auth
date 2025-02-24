"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  return (
    <div className="mt-16 mx-auto sm:mx-auto sm:max-w-sm px-4">
      <h2 className="text-center text-2xl font-bold tracking-tight text-primary">
        Forgot Password
      </h2>
      <form className="mt-12" noValidate>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-700">
              Email
            </Label>
            <Input id="email" type="email" name="email" />
          </div>

          <Button type="submit" className="w-full">
            Send password reset link
          </Button>
        </div>
      </form>
    </div>
  );
}
