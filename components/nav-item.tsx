"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  title: string;
};

export function NavItem({ href, title }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Link
      className={cn(
        "text-muted-foreground hover:text-primary relative text-sm font-medium transition-colors",
        isActive && "text-primary"
      )}
      href={href}
    >
      {title}
    </Link>
  );
}
