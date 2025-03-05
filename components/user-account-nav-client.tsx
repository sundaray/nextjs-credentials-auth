"use client";

import { useState } from "react";
import { User } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

type UserAccountNavClientProps = {
  user: User;
};

export function UserAccountNavClient({ user }: UserAccountNavClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Prevent dropdown from closing during sign out
  function handleOpenChange(open: boolean) {
    if (isSigningOut) return;
    setIsOpen(open);
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="flex items-center space-x-1">
        <span className="text-sm font-medium text-muted-foreground">
          My Account
        </span>
        <Icons.chevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.email && (
              <>
                <p className="text-xs text-muted-foreground">signed in as</p>
                <p className="w-[200px] truncate text-sm text-secondary-foreground">
                  {user.email}
                </p>
              </>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <button className="flex w-full items-center">
            {isSigningOut ? (
              <>
                <Icons.loader className="mr-2 size-3 animate-spin" />
                <p className="text-sm text-secondary-foreground">Sign out</p>
              </>
            ) : (
              <>
                <Icons.logOut className="mr-2 size-4 text-muted-foreground" />
                <span className="font-medium">Sign out</span>
              </>
            )}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
