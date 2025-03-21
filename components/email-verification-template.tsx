import * as React from "react";

import { Button } from "@react-email/button";
import { Html } from "@react-email/html";
import { Tailwind } from "@react-email/tailwind";
import { Text } from "@react-email/text";

export function EmailVerificationTemplate({ url }: { url: string }) {
  return (
    <Html>
      <Tailwind>
        <Text className="text-base font-medium text-gray-900">Hi,</Text>
        <Text className="text-base font-medium text-gray-900">
          Click the buttton below to verify your email:
        </Text>
        <Button
          href={url}
          className="rounded bg-blue-600 px-4 py-2 text-base font-medium text-white"
        >
          Verify Email
        </Button>
        <Text className="text-base font-medium text-gray-900">
          Note: The link will expire in 1 hour.
        </Text>

        <Text className="text-sm font-medium text-gray-500">
          If you did not try to log in to your account, you can safely ignore
          this email.
        </Text>
      </Tailwind>
    </Html>
  );
}