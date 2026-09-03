"use client";

import { APP_NAME } from "@/lib/constants";
import { useApp } from "@/context/app-state";
import { PageTitle, PrimaryButton } from "@/components/ui-kit";

export function WelcomeScreen() {
  const { go } = useApp();

  return (
    <div className="screen-pad flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="wordmark">{APP_NAME}</p>
        <div className="mt-10">
          <PageTitle>What should I wear today?</PageTitle>
        </div>
      </div>
      <div className="pb-6">
        <PrimaryButton onClick={() => go({ name: "setup-taste" })}>
          Let’s set you up
        </PrimaryButton>
      </div>
    </div>
  );
}
