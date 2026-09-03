"use client";

import { cn } from "@/lib/utils";
import { TASTE_COLORS } from "@/lib/constants";
import type { TasteColor } from "@/lib/types";

export function PrimaryButton({
  children,
  disabled,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="btn-primary"
    >
      {children}
    </button>
  );
}

export function TextLink({
  children,
  onClick,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn("text-link", danger && "text-link-danger")}
    >
      {children}
    </button>
  );
}

export function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-selected={selected ? "" : undefined}
      className="chip"
    >
      {label}
    </button>
  );
}

export function ChipRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="hint">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function ColorDots({
  selected,
  onToggle,
}: {
  selected: TasteColor[];
  onToggle: (color: TasteColor) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="hint">Colors I like</p>
      <div className="flex flex-wrap gap-3">
        {TASTE_COLORS.map((c) => {
          const on = selected.includes(c.id);
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              aria-label={c.label}
              onClick={() => onToggle(c.id)}
              className="flex min-h-11 min-w-11 flex-col items-center gap-1"
            >
              <span
                className={cn("color-dot", on && "color-dot-selected")}
                style={{ background: c.hex }}
              />
              <span className="hint leading-none">{c.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="hint">{label}</span> : null}
      {children}
      {hint ? <span className="hint">{hint}</span> : null}
    </label>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="page-title">{children}</h1>;
}

export function BodyText({
  children,
  dim,
}: {
  children: React.ReactNode;
  dim?: boolean;
}) {
  return <p className={cn("body-text", dim && "text-secondary")}>{children}</p>;
}
