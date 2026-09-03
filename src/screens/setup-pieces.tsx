"use client";

import { MIN_PIECES_TO_SUGGEST } from "@/lib/constants";
import { useApp } from "@/context/app-state";
import { CameraIcon } from "@/components/icons";
import { BodyText, PageTitle, PrimaryButton, TextLink } from "@/components/ui-kit";

export function SetupPiecesScreen() {
  const { pieces, go, completeOnboarding } = useApp();
  const count = pieces.length;
  const ready = count >= MIN_PIECES_TO_SUGGEST;

  function skip() {
    completeOnboarding();
    go({ name: "home" });
  }

  function seeOutfit() {
    completeOnboarding();
    go({ name: "outfit", occasion: "casual" });
  }

  return (
    <div className="screen-pad fill-view flex flex-col gap-6 pb-8">
      <div className="pt-6">
        <PageTitle>Add what’s in your closet</PageTitle>
        <BodyText dim>A photo and a few tags. Five pieces is enough to start.</BodyText>
        <p className="mt-3 text-[16px] font-semibold text-ink">
          {count} of {MIN_PIECES_TO_SUGGEST}
        </p>
      </div>

      <button
        type="button"
        onClick={() => go({ name: "piece-form", returnTo: { name: "setup-pieces" } })}
        className="add-piece-card"
      >
        <CameraIcon />
        <span className="text-[16px] font-semibold">Add a piece</span>
      </button>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <PrimaryButton disabled={!ready} onClick={seeOutfit}>
          See my first outfit
        </PrimaryButton>
        {!ready ? (
          <p className="hint text-center">A couple more and we can dress you.</p>
        ) : null}
        <TextLink onClick={skip}>Skip for now</TextLink>
      </div>
    </div>
  );
}
