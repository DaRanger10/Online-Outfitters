"use client";

import { useState } from "react";
import { CameraIcon } from "./icons";
import { usablePhotoSrc } from "@/lib/image";
import { cn } from "@/lib/utils";

export function PiecePhoto({
  src,
  alt,
  className,
  onClick,
}: {
  src: string | null;
  alt: string;
  className?: string;
  onClick?: () => void;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const usable = usablePhotoSrc(src);
  const inner = usable && failedSrc !== usable ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={usable}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setFailedSrc(usable)}
    />
  ) : (
    <div className="photo-placeholder flex h-full w-full items-center justify-center text-secondary">
      <CameraIcon />
      <span className="sr-only">{alt}</span>
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn("overflow-hidden", className)}
      >
        {inner}
      </button>
    );
  }

  return <div className={cn("overflow-hidden", className)}>{inner}</div>;
}
