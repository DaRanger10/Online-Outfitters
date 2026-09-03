"use client";

import { BackIcon } from "./icons";

export function ScreenHeader({
  left,
  title,
  right,
  onBack,
}: {
  left?: React.ReactNode;
  title?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <header className="screen-header">
      <div className="screen-header-side">
        {onBack ? (
          <button type="button" onClick={onBack} className="icon-btn" aria-label="Back">
            <BackIcon />
          </button>
        ) : (
          left
        )}
      </div>
      <h1 className="screen-header-title">{title}</h1>
      <div className="screen-header-side screen-header-side-right">{right}</div>
    </header>
  );
}
