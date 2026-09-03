"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextLink } from "./ui-kit";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-[340px] rounded-2xl border border-[#E6E0D8] bg-white p-5 text-[#1C1917] shadow-none"
      >
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold text-[#1C1917]">
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-[14px] text-[#6B645C]">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter className="mx-0 mb-0 border-0 bg-transparent p-0">
          <div className="flex w-full items-center justify-end gap-6">
            <TextLink onClick={onCancel}>Cancel</TextLink>
            <TextLink danger onClick={onConfirm}>
              {confirmLabel}
            </TextLink>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
