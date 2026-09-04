"use client";

import { occasionTitle } from "@/lib/constants";
import { photoForLookItem } from "@/lib/image";
import { missingPrompt } from "@/lib/outfit";
import { useApp } from "@/context/app-state";
import { PiecePhoto } from "@/components/photo";
import { ScreenHeader } from "@/components/screen-header";
import { TextLink } from "@/components/ui-kit";

export function SavedLookScreen({ lookId }: { lookId: string }) {
  const { savedLookById, pieces, go, removeSavedLook } = useApp();
  const look = savedLookById(lookId);

  if (!look) {
    return (
      <div className="flex min-h-full flex-col">
        <ScreenHeader onBack={() => go({ name: "saved-looks" })} title="Saved look" />
        <p className="screen-pad body-text text-secondary">This look is gone.</p>
      </div>
    );
  }

  const missing = missingPrompt(look.missing);

  return (
    <div className="flex min-h-full flex-col pb-10">
      <ScreenHeader
        onBack={() => go({ name: "saved-looks" })}
        title={occasionTitle(look.occasion)}
      />
      <div className="screen-pad">
        <article className="card flex flex-col gap-3">
          <p className="body-text">{look.why}</p>
          <div className="flex gap-2 overflow-x-auto">
            {look.items.map((item) => (
              <div key={item.id} className="look-item">
                <PiecePhoto
                  src={photoForLookItem(item, pieces)}
                  alt={item.nickname}
                  className="aspect-square w-full rounded-[12px]"
                />
                <span className="look-item-name">{item.nickname}</span>
              </div>
            ))}
          </div>
          {missing ? <p className="hint">{missing}</p> : null}
          <TextLink
            danger
            onClick={() => {
              removeSavedLook(look.id);
              go({ name: "saved-looks" });
            }}
          >
            Remove from saved
          </TextLink>
        </article>
      </div>
    </div>
  );
}
