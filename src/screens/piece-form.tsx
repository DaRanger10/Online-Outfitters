"use client";

import { useMemo, useRef, useState } from "react";
import {
  DRESSY_OPTIONS,
  PIECE_COLORS,
  PIECE_TYPES,
  SEASONS,
  typeLabel,
} from "@/lib/constants";
import { compressImage } from "@/lib/image";
import { useApp } from "@/context/app-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { PiecePhoto } from "@/components/photo";
import { ScreenHeader } from "@/components/screen-header";
import { Chip, ChipRow, TextLink } from "@/components/ui-kit";
import { Input } from "@/components/ui/input";
import type {
  Dressy,
  Piece,
  PieceColor,
  PieceType,
  Screen,
  SeasonFeel,
} from "@/lib/types";

export function PieceFormScreen({
  pieceId,
  presetType,
  returnTo,
}: {
  pieceId?: string;
  presetType?: PieceType;
  returnTo?: Screen;
}) {
  const { pieces, savePiece, removePiece, go } = useApp();
  const existing = pieces.find((p) => p.id === pieceId);
  const editing = Boolean(existing);
  const fileRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<PieceType | undefined>(
    existing?.type ?? presetType,
  );
  const [color, setColor] = useState<PieceColor>(existing?.color ?? "black");
  const [season, setSeason] = useState<SeasonFeel>(existing?.season ?? "anytime");
  const [dressy, setDressy] = useState<Dressy>(existing?.dressy ?? "casual");
  const [nickname, setNickname] = useState(existing?.nickname ?? "");
  const [photo, setPhoto] = useState<string | null>(existing?.photo ?? null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const backTarget = useMemo<Screen>(
    () => returnTo ?? { name: "closet" },
    [returnTo],
  );

  function leave() {
    go(backTarget);
  }

  async function onPickPhoto(file: File | undefined) {
    if (!file) return;
    setPhotoError(null);
    try {
      const data = await compressImage(file);
      setPhoto(data);
    } catch {
      setPhotoError("Couldn’t read that photo. Try another one.");
    }
  }

  async function onSave() {
    if (!type || busy) return;
    setBusy(true);
    const piece: Piece = {
      id: existing?.id ?? crypto.randomUUID(),
      type,
      color,
      season,
      dressy,
      nickname: nickname.trim(),
      photo,
      createdAt: existing?.createdAt ?? Date.now(),
    };
    try {
      await savePiece(piece);
      leave();
    } catch {
      setPhotoError("Couldn’t save this piece. Try another photo.");
      setBusy(false);
    }
  }

  async function onRemove() {
    if (!existing) return;
    await removePiece(existing.id);
    setConfirmDelete(false);
    leave();
  }

  return (
    <div className="flex min-h-full flex-col pb-10">
      <ScreenHeader
        left={
          <button type="button" onClick={leave} className="header-text-btn">
            Cancel
          </button>
        }
        title={editing ? "Edit piece" : "New piece"}
        right={
          <button
            type="button"
            onClick={onSave}
            disabled={!type || busy}
            className="header-text-btn header-text-btn-primary"
          >
            Save
          </button>
        }
      />

      <div className="screen-pad flex flex-col gap-6">
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="photo-tap"
          >
            <PiecePhoto
              src={photo}
              alt={nickname || (type ? typeLabel(type) : "New piece")}
              className="h-full w-full"
            />
          </button>
          <p className="hint mt-2 text-center">
            {photoError ?? "A clear shot on a plain background works best."}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,image/jpeg,image/png,image/webp,image/heic,image/heif"
            className="hidden"
            onChange={(e) => {
              void onPickPhoto(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        <ChipRow label="What is it?">
          {PIECE_TYPES.map((t) => (
            <Chip
              key={t.id}
              label={t.label}
              selected={type === t.id}
              onClick={() => setType(t.id)}
            />
          ))}
        </ChipRow>

        <ChipRow label="Color">
          {PIECE_COLORS.map((c) => (
            <Chip
              key={c.id}
              label={c.label}
              selected={color === c.id}
              onClick={() => setColor(c.id)}
            />
          ))}
        </ChipRow>

        <ChipRow label="Season feel">
          {SEASONS.map((s) => (
            <Chip
              key={s.id}
              label={s.label}
              selected={season === s.id}
              onClick={() => setSeason(s.id)}
            />
          ))}
        </ChipRow>

        <ChipRow label="How dressy?">
          {DRESSY_OPTIONS.map((d) => (
            <Chip
              key={d.id}
              label={d.label}
              selected={dressy === d.id}
              onClick={() => setDressy(d.id)}
            />
          ))}
        </ChipRow>

        <label className="flex flex-col gap-2">
          <span className="hint">Nickname</span>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Blue oxford, my jeans…"
            className="field-input"
          />
        </label>

        {editing ? (
          <div className="pt-2">
            <TextLink danger onClick={() => setConfirmDelete(true)}>
              Delete this piece
            </TextLink>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Remove this from your closet?"
        confirmLabel="Remove"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => void onRemove()}
      />
    </div>
  );
}
