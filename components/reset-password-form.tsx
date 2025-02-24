"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  return (
    <div className="mx-auto mt-16 px-4 sm:max-w-sm">
      <h1 className="text-center text-2xl font-bold">Reset Password</h1>
      <form className="mt-12" noValidate>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" name="newPassword" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">Confirm new password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              name="confirmNewPassword"
            />
          </div>
          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </div>
      </form>
    </div>
  );
}
