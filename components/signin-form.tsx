"use client";

import { SignInEmailMagicLinkForm } from "@/components/signin-email-magiclink-form";
import { SignInEmailOtpForm } from "@/components/signin-email-otp-form";
import { SignInEmailPasswordForm } from "@/components/signin-email-password-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SigninForm() {
  return (
    <div className="mt-16 px-4 sm:mx-auto sm:max-w-sm">
      <h2 className="text-center text-2xl font-bold tracking-tight text-primary">
        Sign in to your account
      </h2>
      <Tabs defaultValue="email-link" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
          <TabsTrigger value="otp">OTP</TabsTrigger>
        </TabsList>
        <TabsContent value="magic-link">
          <SignInEmailMagicLinkForm />
        </TabsContent>
        <TabsContent value="otp">
          <SignInEmailOtpForm />
        </TabsContent>
      </Tabs>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm text-muted-foreground">
          <span className="bg-background px-2">Or continue with</span>
        </div>
      </div>
      <SignInEmailPasswordForm />
    </div>
  );
}
