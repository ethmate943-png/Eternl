"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ETERNL_MODAL_BACKDROP } from "./eternlModalBackdrop";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type NetworkChain = "cardano" | "apex";

export type NetworkOption = {
  key: string;
  chain: NetworkChain;
  label: string;
  description: string;
  iconSrc: string;
  isMainnet?: boolean;
};

export type EternlNetworkSwitcherModalProps = {
  open: boolean;
  /** The currently active network key */
  activeNetworkKey?: string;
  onClose?: () => void;
  onSelect?: (network: NetworkOption) => void;
  zIndexClass?: string;
};

// ─────────────────────────────────────────────
// Static network list (mirrors live app data)
// ─────────────────────────────────────────────
const NETWORKS: NetworkOption[] = [
  // ── Cardano ──────────────────────────────────
  {
    key: "cardano-mainnet",
    chain: "cardano",
    label: "Cardano mainnet",
    description: "The official Cardano network launched by IOG in 2017.",
    iconSrc: "/brand/cardano.svg",
    isMainnet: true,
  },
  {
    key: "cardano-preprod",
    chain: "cardano",
    label: "Pre-Production testnet",
    description: "A pre-production testnet that mimics mainnet parameters.",
    iconSrc: "/brand/cardano.svg",
  },
  {
    key: "cardano-preview",
    chain: "cardano",
    label: "Preview testnet",
    description:
      "A network for testing mainnet releases. Leads mainnet hard forks by at least 4 weeks.",
    iconSrc: "/brand/cardano.svg",
  },
  {
    key: "cardano-guild",
    chain: "cardano",
    label: "Guild Network",
    description:
      "A testnet operated by the Guild Operators community group with short epochs.",
    iconSrc: "/brand/cardano.svg",
  },
  {
    key: "cardano-sancho",
    chain: "cardano",
    label: "Sancho Network",
    description:
      "A testnet operated by the Guild Operators community group with short epochs.",
    iconSrc: "/brand/cardano.svg",
  },
  // ── APEX ─────────────────────────────────────
  {
    key: "apex-vector-mainnet",
    chain: "apex",
    label: "Apex Fusion Vector mainnet",
    description: "The official Apex Fusion Vector mainnet.",
    iconSrc: "/brand/apex-fusion.svg",
    isMainnet: true,
  },
  {
    key: "apex-nexus-mainnet",
    chain: "apex",
    label: "Apex Fusion Nexus mainnet",
    description: "The official Apex Fusion Nexus mainnet.",
    iconSrc: "/brand/apex-fusion.svg",
    isMainnet: true,
  },
  {
    key: "apex-prime-mainnet",
    chain: "apex",
    label: "Apex Fusion Prime mainnet",
    description: "The official Apex Fusion Prime mainnet.",
    iconSrc: "/brand/apex-fusion.svg",
    isMainnet: true,
  },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function NetworkCard({
  network,
  isActive,
  onClick,
}: {
  network: NetworkOption;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={isActive ? "" : undefined}
      className={`
        flex w-full flex-row items-center gap-4 rounded-2xl border px-3 py-3
        text-left shadow-sm transition
        xs:gap-5 xs:px-4 xs:py-4
        bg-[var(--p-card-background,hsl(0_0%_10%))]
        hover:bg-white/[0.07]
        ${
          isActive
            ? "border-rose-400/50 hover:border-rose-400"
            : "border-white/10 hover:border-white/20"
        }
      `}
    >
      {/* Network logo */}
      <div className="relative shrink-0 flex items-center justify-center rounded-full overflow-hidden">
        <img
          className="w-10 sm:w-14 aspect-square rounded-full"
          src={network.iconSrc}
          alt={`${network.label} logo`}
          loading="lazy"
          onError={(e) => {
            // fallback: hide broken image
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Text */}
      <div className="flex grow flex-col gap-0.5">
        <div className="flex flex-row items-center gap-2 text-left text-white">
          <span className="text-[15px] font-medium leading-snug">
            {network.label}
          </span>
          {isActive && (
            <span className="shrink-0 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-400">
              active
            </span>
          )}
        </div>
        <div className="text-sm leading-snug text-white/50">
          {network.description}
        </div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function EternlNetworkSwitcherModal({
  open,
  activeNetworkKey = "cardano-mainnet",
  onClose,
  onSelect,
  zIndexClass = "z-[70]",
}: EternlNetworkSwitcherModalProps) {
  const [activeChain, setActiveChain] = useState<NetworkChain>("cardano");

  if (!open) return null;

  const visibleNetworks = NETWORKS.filter((n) => n.chain === activeChain);
  const mainnets = visibleNetworks.filter((n) => n.isMainnet);
  const testnets = visibleNetworks.filter((n) => !n.isMainnet);
  const hasTestnets = testnets.length > 0;

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-end justify-center px-3 pb-0 pt-0 sm:px-6`}
      role="presentation"
    >
      {/* Backdrop */}
      <button
        type="button"
        className={`absolute inset-0 ${ETERNL_MODAL_BACKDROP}`}
        aria-label="Close"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="et-network-switcher-title"
        className="relative flex max-h-[min(92vh,860px)] w-full max-w-[640px] flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[hsl(0_0%_8%)] shadow-[0_-12px_48px_rgba(0,0,0,0.55)] ring-1 ring-white/10"
      >
        {/* Gradient top bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 overflow-hidden rounded-t-3xl">
          <div className="absolute top-0 h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-fuchsia-500" />
        </div>

        {/* Header */}
        <header className="relative shrink-0 px-4 pb-2 pt-5 sm:px-6">
          <div className="relative mt-2 flex min-h-12 w-full flex-row items-start justify-center gap-2">
            <div className="flex w-full flex-col items-center gap-1.5 px-14 text-center">
              <h2
                id="et-network-switcher-title"
                className="min-h-12 w-full text-xl font-semibold capitalize text-white"
              >
                Network Switcher
              </h2>
              <p className="text-sm leading-snug text-white/55">
                Instantly connect to a different network.
              </p>
            </div>

            {/* Close button */}
            <div className="absolute right-0 top-0">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white/90 backdrop-blur-sm transition hover:bg-white/10 sm:h-12 sm:w-12"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="modal-content flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-4 pt-1 sm:px-5">
          {/* Chain tab switcher */}
          <div className="mb-3 flex shrink-0 flex-row gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1">
            {(["cardano", "apex"] as NetworkChain[]).map((chain) => (
              <button
                key={chain}
                type="button"
                onClick={() => setActiveChain(chain)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                  activeChain === chain
                    ? "bg-white/[0.12] text-white shadow-sm"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                {chain === "apex" ? "APEX" : "Cardano"}
              </button>
            ))}
          </div>

          {/* Scrollable list */}
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="flex flex-col gap-3 pb-1">
              {/* Mainnets */}
              {mainnets.map((network) => (
                <NetworkCard
                  key={network.key}
                  network={network}
                  isActive={network.key === activeNetworkKey}
                  onClick={() => onSelect?.(network)}
                />
              ))}

              {/* Testnet divider + cards */}
              {hasTestnets && (
                <>
                  <div className="flex flex-row items-center gap-3 my-1">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="shrink-0 text-xs font-medium capitalize text-white/40">
                      testnet(s)
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  {testnets.map((network) => (
                    <NetworkCard
                      key={network.key}
                      network={network}
                      isActive={network.key === activeNetworkKey}
                      onClick={() => onSelect?.(network)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
