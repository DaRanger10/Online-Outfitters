"use client";

import { occasionTitle } from "@/lib/constants";
import { useApp } from "@/context/app-state";
import { PiecePhoto } from "@/components/photo";
import { ScreenHeader } from "@/components/screen-header";
import { TextLink } from "@/components/ui-kit";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function SavedLooksScreen() {
  const { savedLooks, go, removeSavedLook } = useApp();

  return (
    <div className="flex min-h-full flex-col pb-10">
      <ScreenHeader onBack={() => go({ name: "you" })} title="Saved looks" />

      <div className="screen-pad flex flex-col gap-3">
        {savedLooks.length === 0 ? (
          <p className="body-text text-secondary">Looks you save will live here.</p>
        ) : (
          savedLooks.map((look) => (
            <article key={look.id} className="card">
              <button
                type="button"
                className="w-full text-left"
                onClick={() => go({ name: "saved-look", lookId: look.id })}
              >
                <p className="text-[16px] font-semibold text-ink">
                  {occasionTitle(look.occasion)} · {formatDate(look.createdAt)}
                </p>
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {look.items.map((item) => (
                    <div key={item.id} className="look-item">
                      <PiecePhoto
                        src={item.photo}
                        alt={item.nickname}
                        className="aspect-square w-full rounded-[12px]"
                      />
                    </div>
                  ))}
                </div>
              </button>
              <div className="mt-3">
                <TextLink danger onClick={() => removeSavedLook(look.id)}>
                  Remove from saved
                </TextLink>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
