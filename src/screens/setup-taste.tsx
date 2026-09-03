"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  BodyText,
  Chip,
  ChipRow,
  ColorDots,
  Field,
  PageTitle,
  PrimaryButton,
  TextLink,
} from "@/components/ui-kit";
import { useApp } from "@/context/app-state";
import type { TasteColor, Vibe } from "@/lib/types";

export function SetupTasteScreen() {
  const { prefs, updatePrefs, go } = useApp();
  const [cityError, setCityError] = useState(false);

  function toggleColor(color: TasteColor) {
    const next = prefs.colors.includes(color)
      ? prefs.colors.filter((c) => c !== color)
      : [...prefs.colors, color];
    updatePrefs({ colors: next });
  }

  function continueSetup() {
    if (!prefs.city.trim()) {
      setCityError(true);
      return;
    }
    setCityError(false);
    go({ name: "setup-pieces" });
  }

  return (
    <div className="screen-pad fill-view flex flex-col gap-6 pb-8">
      <div className="pt-6">
        <PageTitle>A few things about you</PageTitle>
        <BodyText dim>So suggestions feel like you, not a magazine.</BodyText>
      </div>

      <Field hint="For today’s weather.">
        <Input
          value={prefs.city}
          onChange={(e) => {
            updatePrefs({ city: e.target.value });
            if (e.target.value.trim()) setCityError(false);
          }}
          placeholder="Home city"
          autoComplete="address-level2"
          aria-invalid={cityError}
          className="field-input"
        />
        {cityError ? (
          <span className="hint text-delete">City is needed to continue.</span>
        ) : null}
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

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <PrimaryButton onClick={continueSetup}>Continue</PrimaryButton>
        <TextLink onClick={() => go({ name: "setup-pieces" })}>
          I’ll do this later
        </TextLink>
      </div>
    </div>
  );
}
