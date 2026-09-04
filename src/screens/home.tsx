"use client";

import { MIN_PIECES_TO_SUGGEST, NUDGE_UNDER, OCCASIONS } from "@/lib/constants";
import { useApp } from "@/context/app-state";
import { PageTitle, PrimaryButton } from "@/components/ui-kit";
import type { Occasion } from "@/lib/types";

export function HomeScreen() {
  const { pieces, weather, go } = useApp();
  const count = pieces.length;
  const empty = count === 0;
  const ready = count >= MIN_PIECES_TO_SUGGEST;
  const nudge = count > MIN_PIECES_TO_SUGGEST && count < NUDGE_UNDER;

  function openOccasion(id: Occasion) {
    go({ name: "outfit", occasion: id });
  }

  function addPiece() {
    go({ name: "piece-form", returnTo: { name: "home" } });
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

      {!ready ? (
        <div className="card flex flex-col gap-3">
          <h2 className="text-[16px] font-semibold text-ink">
            {empty ? "Your closet is empty" : "A few more pieces first"}
          </h2>
          <p className="body-text text-secondary">
            {empty
              ? "Add a few pieces and I’ll dress you."
              : `${count} of ${MIN_PIECES_TO_SUGGEST} — add a couple more and I’ll dress you.`}
          </p>
          <PrimaryButton onClick={addPiece}>Add a piece</PrimaryButton>
        </div>
      ) : (
        <>
          {nudge ? (
            <div className="quiet-bar">More pieces can make ideas feel more like you</div>
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
