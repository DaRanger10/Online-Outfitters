"use client";

import { HangerIcon, HouseIcon, PersonIcon } from "./icons";
import { useApp } from "@/context/app-state";
import { cn } from "@/lib/utils";

const TABS = [
  { name: "home" as const, label: "Home", Icon: HouseIcon },
  { name: "closet" as const, label: "Closet", Icon: HangerIcon },
  { name: "you" as const, label: "You", Icon: PersonIcon },
];

export function TabBar() {
  const { screen, go } = useApp();
  const current = screen.name;

  return (
    <nav className="tab-bar" aria-label="Main">
      {TABS.map(({ name, label, Icon }) => {
        const active = current === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => go({ name })}
            className={cn("tab-item", active && "tab-item-active")}
            aria-current={active ? "page" : undefined}
          >
            <Icon active={active} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function shouldShowTabs(name: string): boolean {
  return name === "home" || name === "closet" || name === "you";
}
