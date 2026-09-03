"use client";

import { useApp } from "@/context/app-state";
import { TabBar, shouldShowTabs } from "./tab-bar";
import { WelcomeScreen } from "@/screens/welcome";
import { SetupTasteScreen } from "@/screens/setup-taste";
import { SetupPiecesScreen } from "@/screens/setup-pieces";
import { HomeScreen } from "@/screens/home";
import { ClosetScreen } from "@/screens/closet";
import { YouScreen } from "@/screens/you";
import { PieceFormScreen } from "@/screens/piece-form";
import { OutfitScreen } from "@/screens/outfit";
import { SavedLooksScreen } from "@/screens/saved-looks";
import { SavedLookScreen } from "@/screens/saved-look";

function ScreenSwitch() {
  const { screen } = useApp();

  switch (screen.name) {
    case "welcome":
      return <WelcomeScreen />;
    case "setup-taste":
      return <SetupTasteScreen />;
    case "setup-pieces":
      return <SetupPiecesScreen />;
    case "home":
      return <HomeScreen />;
    case "closet":
      return <ClosetScreen />;
    case "you":
      return <YouScreen />;
    case "piece-form":
      return (
        <PieceFormScreen
          pieceId={screen.pieceId}
          presetType={screen.presetType}
          returnTo={screen.returnTo}
        />
      );
    case "outfit":
      return <OutfitScreen occasion={screen.occasion} />;
    case "saved-looks":
      return <SavedLooksScreen />;
    case "saved-look":
      return <SavedLookScreen lookId={screen.lookId} />;
    default:
      return <HomeScreen />;
  }
}

export function AppShell() {
  const { ready, screen } = useApp();
  const tabs = ready && shouldShowTabs(screen.name);

  return (
    <div className="phone-frame">
      <main className={tabs ? "phone-main has-tabs" : "phone-main"}>
        {ready ? <ScreenSwitch /> : null}
      </main>
      {tabs ? <TabBar /> : null}
    </div>
  );
}
