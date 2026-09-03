"use client";

import { OCCASIONS, occasionTitle } from "@/lib/constants";
import { missingPrompt } from "@/lib/outfit";
import { useApp } from "@/context/app-state";
import { PiecePhoto } from "@/components/photo";
import { ScreenHeader } from "@/components/screen-header";
import { Chip, PrimaryButton, TextLink } from "@/components/ui-kit";
import type { Occasion, OutfitLook } from "@/lib/types";

export function OutfitScreen({ occasion }: { occasion: Occasion }) {
  const { weather, looksFor, go, toggleSavedLook, isLookSaved } = useApp();
  const looks = looksFor(occasion);

  return (
    <div className="flex min-h-full flex-col pb-10">
      <ScreenHeader
        onBack={() => go({ name: "home" })}
        title={occasionTitle(occasion)}
      />

      <div className="screen-pad flex flex-col gap-5">
        <p className="hint">{weather.line}</p>

        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <Chip
              key={o.id}
              label={o.title}
              selected={o.id === occasion}
              onClick={() => go({ name: "outfit", occasion: o.id })}
            />
          ))}
        </div>

        {looks.length === 0 ? (
          <div className="card">
            <h2 className="text-[16px] font-semibold text-ink">
              Not enough pieces for this yet.
            </h2>
            <div className="mt-4">
              <PrimaryButton
                onClick={() =>
                  go({
                    name: "piece-form",
                    returnTo: { name: "outfit", occasion },
                  })
                }
              >
                Add something to your closet
              </PrimaryButton>
            </div>
          </div>
        ) : (
          looks.map((look, index) => (
            <LookCard
              key={look.key}
              look={look}
              index={index}
              occasion={occasion}
              saved={isLookSaved(look)}
              onToggleSave={() => toggleSavedLook(occasion, look)}
              onEditPiece={(id) =>
                go({
                  name: "piece-form",
                  pieceId: id,
                  returnTo: { name: "outfit", occasion },
                })
              }
              onAddMissing={(type) =>
                go({
                  name: "piece-form",
                  presetType: type,
                  returnTo: { name: "outfit", occasion },
                })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

function LookCard({
  look,
  index,
  occasion,
  saved,
  onToggleSave,
  onEditPiece,
  onAddMissing,
}: {
  look: OutfitLook;
  index: number;
  occasion: Occasion;
  saved: boolean;
  onToggleSave: () => void;
  onEditPiece: (id: string) => void;
  onAddMissing: (type: NonNullable<OutfitLook["missing"]>) => void;
}) {
  const missing = missingPrompt(look.missing);
  void occasion;

  return (
    <article className="card flex flex-col gap-3">
      <div>
        <h2 className="text-[16px] font-semibold text-ink">Look {index + 1}</h2>
        <p className="body-text mt-1">{look.why}</p>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {look.items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onEditPiece(item.id)}
            className="look-item"
          >
            <PiecePhoto
              src={item.photo}
              alt={item.nickname}
              className="aspect-square w-full rounded-[12px]"
            />
            <span className="look-item-name">{item.nickname}</span>
          </button>
        ))}
      </div>
      {missing && look.missing ? (
        <TextLink onClick={() => onAddMissing(look.missing!)}>{missing}</TextLink>
      ) : null}
      <PrimaryButton onClick={onToggleSave}>
        {saved ? "Saved" : "Save this look"}
      </PrimaryButton>
    </article>
  );
}
