"use client";

import { Input } from "@/components/ui/input";
import {
  Chip,
  ChipRow,
  ColorDots,
  Field,
  PageTitle,
} from "@/components/ui-kit";
import { ChevronIcon } from "@/components/icons";
import { useApp } from "@/context/app-state";
import type { TasteColor, Vibe } from "@/lib/types";

export function YouScreen() {
  const { prefs, updatePrefs, go } = useApp();

  function toggleColor(color: TasteColor) {
    const next = prefs.colors.includes(color)
      ? prefs.colors.filter((c) => c !== color)
      : [...prefs.colors, color];
    updatePrefs({ colors: next });
  }

  return (
    <div className="screen-pad fill-view-tabs flex flex-col gap-6 pb-8">
      <div className="pt-5">
        <PageTitle>You</PageTitle>
      </div>

      <Field label="Home city" hint="Suggestions use today’s weather here.">
        <Input
          value={prefs.city}
          onChange={(e) => updatePrefs({ city: e.target.value })}
          placeholder="Home city"
          autoComplete="address-level2"
          className="field-input"
        />
      </Field>

      <ColorDots selected={prefs.colors} onToggle={toggleColor} />

      <ChipRow label="When in doubt">
        <Chip
          label="Keep it safe"
          selected={!prefs.mixItUp}
          onClick={() => updatePrefs({ mixItUp: false })}
        />
        <Chip
          label="Mix it up"
          selected={prefs.mixItUp}
          onClick={() => updatePrefs({ mixItUp: true })}
        />
      </ChipRow>

      <ChipRow label="Usual vibe">
        {(["clean", "relaxed", "polished"] as Vibe[]).map((vibe) => (
          <Chip
            key={vibe}
            label={vibe[0].toUpperCase() + vibe.slice(1)}
            selected={prefs.vibe === vibe}
            onClick={() => updatePrefs({ vibe })}
          />
        ))}
      </ChipRow>

      <button
        type="button"
        onClick={() => go({ name: "saved-looks" })}
        className="saved-row"
      >
        <span>Saved looks</span>
        <ChevronIcon />
      </button>
    </div>
  );
}
