import React from "react";

import { NavItem } from "@/components/nav-item";
import { UserAccountNav } from "@/components/user-account-nav";

type NavItemType = {
  title: string;
  href: string;
};

type MainNavProps = {
  items: NavItemType[];
};

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex h-14 items-center justify-between bg-accent px-4">
      <nav>
        <ul className="flex space-x-6">
          {items.map((item) => (
            <li key={item.title}>
              <NavItem title={item.title} href={item.href} />
            </li>
          ))}
        </ul>
      </nav>
      <UserAccountNav />
    </div>
  );
}
