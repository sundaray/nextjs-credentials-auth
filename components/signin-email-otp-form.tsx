"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInEmailOtpForm() {
  return (
    <form className="grid gap-4" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="email" className="text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
        />
      </div>

      <Button type="submit">Send sign in OTP</Button>
    </form>
  );
}
