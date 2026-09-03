"use client";

import { NUDGE_UNDER, OCCASIONS } from "@/lib/constants";
import { useApp } from "@/context/app-state";
import { PageTitle, PrimaryButton } from "@/components/ui-kit";
import type { Occasion } from "@/lib/types";

export function HomeScreen() {
  const { pieces, weather, go } = useApp();
  const empty = pieces.length === 0;
  const nudge = pieces.length > 0 && pieces.length < NUDGE_UNDER;

  function openOccasion(id: Occasion) {
    go({ name: "outfit", occasion: id });
  }

  return (
    <div className="screen-pad fill-view-tabs flex flex-col gap-6 pb-8">
      <div className="pt-5">
        <button
          type="button"
          className="hint text-left"
          onClick={() => {
            if (weather.status === "no-city") go({ name: "you" });
          }}
        >
          {weather.line}
        </button>
        <div className="mt-2">
          <PageTitle>What should I wear?</PageTitle>
        </div>
      </div>

      {empty ? (
        <div className="card flex flex-col gap-3">
          <h2 className="text-[16px] font-semibold text-ink">Your closet is empty</h2>
          <p className="body-text text-secondary">
            Add a few pieces and I’ll dress you.
          </p>
          <PrimaryButton onClick={() => go({ name: "piece-form", returnTo: { name: "home" } })}>
            Add a piece
          </PrimaryButton>
        </div>
      ) : (
        <>
          {nudge ? (
            <div className="quiet-bar">Add a few more pieces for better ideas</div>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            {OCCASIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => openOccasion(o.id)}
                className="occasion-tile"
              >
                <span className="text-[16px] font-semibold text-ink">{o.title}</span>
                <span className="hint mt-1">{o.subtitle}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
