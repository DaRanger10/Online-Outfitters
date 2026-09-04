"use client";

import { useState } from "react";
import { CLOSET_FILTERS, pieceDisplayName } from "@/lib/constants";
import { useApp } from "@/context/app-state";
import { PlusIcon } from "@/components/icons";
import { PiecePhoto } from "@/components/photo";
import { PageTitle } from "@/components/ui-kit";
import type { PieceType } from "@/lib/types";

export function ClosetScreen() {
  const { pieces, go } = useApp();
  const [filter, setFilter] = useState<"all" | PieceType>("all");
  const shown =
    filter === "all" ? pieces : pieces.filter((p) => p.type === filter);

  return (
    <div className="fill-view-tabs flex min-w-0 flex-col pb-8">
      <div className="screen-pad flex items-center justify-between pt-5">
        <PageTitle>Closet</PageTitle>
        <button
          type="button"
          className="icon-btn"
          aria-label="Add a piece"
          onClick={() => go({ name: "piece-form", returnTo: { name: "closet" } })}
        >
          <PlusIcon />
        </button>
      </div>

      <div className="filter-row">
        {CLOSET_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            data-selected={filter === f.id ? "" : undefined}
            className="chip"
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="screen-pad mt-8">
          <h2 className="text-[16px] font-semibold text-ink">Nothing here yet</h2>
          <p className="body-text mt-2 text-secondary">
            Add the clothes you actually wear.
          </p>
        </div>
      ) : (
        <div className="screen-pad grid grid-cols-2 gap-3">
          {shown.map((piece) => (
            <button
              key={piece.id}
              type="button"
              onClick={() =>
                go({
                  name: "piece-form",
                  pieceId: piece.id,
                  returnTo: { name: "closet" },
                })
              }
              className="closet-card"
            >
              <PiecePhoto
                src={piece.photo}
                alt={pieceDisplayName(piece)}
                className="aspect-square w-full"
              />
              <span className="closet-name">{pieceDisplayName(piece)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
