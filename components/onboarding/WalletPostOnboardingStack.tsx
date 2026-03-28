"use client";

import { useEffect, useState } from "react";
import EternlMnemonicPhraseModal from "./EternlMnemonicPhraseModal";
import EternlRestoreMnemonicEntryModal, {
  seedOptionToWordCount,
} from "./EternlRestoreMnemonicEntryModal";
import EternlSeedPhraseTypeModal from "./EternlSeedPhraseTypeModal";
import type { SeedPhraseLengthOption } from "./EternlSeedPhraseTypeModal";
import EternlHardwareConnectModal from "./EternlHardwareConnectModal";
import EternlTermsDrawer from "./EternlTermsDrawer";
import EternlWalletTypeModal from "./EternlWalletTypeModal";
import type { NetworkOption } from "./EternlNetworkSwitcherModal";

export type WalletPostOnboardingStackProps = {
  open: boolean;
  onDismiss?: () => void;
  onTermsConfirmed?: () => void;
  /** Picker and sub-flows: key is wallet-type; payload optional detail */
  onWalletSelect?: (key: string, payload?: unknown) => void;
  /**
   * If false, skip the initial Terms drawer step.
   * Useful when Terms were already accepted earlier in the flow.
   */
  showTerms?: boolean;
  /**
   * When opening this stack from an external picker, you can start directly on
   * a sub-view (e.g. after the user already chose "New Wallet" or "Seed phrase").
   * Note: the Terms drawer always appears first.
   */
  initialSubView?: Exclude<SubView, null> | null;
  /**
   * Only used when `initialSubView` is `"restoreEntry"`.
   * If omitted, the restore entry defaults to 24 words once the flow starts.
   */
  initialRestoreLength?: SeedPhraseLengthOption;
  /** Called when the user switches the active network from the network-switcher. */
  onNetworkSelect?: (network: NetworkOption) => void;
};

type SubView = null | "mnemonic" | "seedType" | "restoreEntry" | "hardware";

/**
 * After the PIN preloader: terms (z-75) → picker (z-65) → new-wallet mnemonic
 * or seed type → **restore entry** (same word count as chosen type).
 */
export default function WalletPostOnboardingStack({
  open,
  onDismiss,
  onTermsConfirmed,
  onWalletSelect,
  showTerms = true,
  initialSubView = null,
  initialRestoreLength,
  onNetworkSelect,
}: WalletPostOnboardingStackProps) {
  const [termsOpen, setTermsOpen] = useState<boolean>(showTerms);
  const [subView, setSubView] = useState<SubView>(null);
  const [restoreLength, setRestoreLength] =
    useState<SeedPhraseLengthOption | null>(null);

  useEffect(() => {
    if (!open) {
      setTermsOpen(showTerms);
      setSubView(null);
      setRestoreLength(null);
      return;
    }

    setTermsOpen(showTerms);
    setSubView(initialSubView);
    setRestoreLength(
      initialSubView === "restoreEntry" ? initialRestoreLength ?? null : null
    );
  }, [open, showTerms, initialSubView, initialRestoreLength]);

  if (!open) return null;

  /** Keep options sheet mounted under seed flows (blurred) so Back returns to it. */
  const showPicker = !termsOpen && subView !== "mnemonic";

  // When Terms are open we intentionally hide all other sheets (they stay mounted
  // behind, but are not user-visible/interactive).
  const effectiveSubView: SubView = termsOpen ? null : subView;

  const seedFlowOpen =
    effectiveSubView === "seedType" || effectiveSubView === "restoreEntry";

  const restoreWordCount =
    restoreLength != null ? seedOptionToWordCount(restoreLength) : 24;

  return (
    <>
      <EternlWalletTypeModal
        open={showPicker}
        suppressBackdrop={seedFlowOpen}
        onClose={onDismiss}
        onNetworkSelect={onNetworkSelect}
        onSelect={(key) => {
          if (key === "new") {
            setSubView("mnemonic");
            return;
          }
          if (key === "seed") {
            setSubView("seedType");
            return;
          }
          if (key === "hardware") {
            setSubView("hardware");
            return;
          }
          onWalletSelect?.(key);
        }}
      />

      <EternlMnemonicPhraseModal
        open={effectiveSubView === "mnemonic"}
        onBack={() => setSubView(null)}
        onClose={onDismiss}
      />

      <EternlSeedPhraseTypeModal
        open={effectiveSubView === "seedType"}
        onBack={() => setSubView(null)}
        onNext={(length: SeedPhraseLengthOption) => {
          setRestoreLength(length);
          setSubView("restoreEntry");
        }}
        onClose={onDismiss}
      />

      <EternlRestoreMnemonicEntryModal
        open={
          effectiveSubView === "restoreEntry" && restoreLength != null
        }
        wordCount={restoreWordCount}
        onBack={() => {
          setSubView("seedType");
        }}
        onClose={onDismiss}
      />

      <EternlHardwareConnectModal
        open={effectiveSubView === "hardware"}
        onBack={() => setSubView(null)}
        onSelect={(device) => {
          onWalletSelect?.("hardware", { device });
          setSubView(null);
        }}
        onClose={onDismiss}
      />

      {showTerms ? (
        <EternlTermsDrawer
          open={termsOpen}
          onConfirm={() => {
            setTermsOpen(false);
            onTermsConfirmed?.();
          }}
        />
      ) : null}
    </>
  );
}
