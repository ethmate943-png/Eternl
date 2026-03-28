"use client";

import { useState } from "react";
import { ETERNL_MODAL_BACKDROP } from "./eternlModalBackdrop";
import EternlNetworkSwitcherModal, {
  type NetworkOption,
} from "./EternlNetworkSwitcherModal";
import EternlWalletCreatedIllustration from "./EternlWalletCreatedIllustration";

function GradientDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient
        id={id}
        x1="0"
        y1="0"
        x2="24"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#44FFF9" />
        <stop offset="0.2" stopColor="#7188FF" />
        <stop offset="0.55" stopColor="#FF5178" />
        <stop offset="0.85" stopColor="#FFB719" />
        <stop offset="1" stopColor="#D153D1" />
      </linearGradient>
    </defs>
  );
}

const OPTIONS = [
  {
    key: "new",
    title: "New Wallet",
    desc: "Generate a brand new wallet",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 xs:w-10 ml-1 xs:ml-2 shrink-0"
        aria-hidden="true"
      >
        <GradientDefs id="gradient_icon_gold_orange_new" />
        <path
          d="M16.002 13.5C16.002 14.3284 16.6735 15 17.502 15C18.3304 15 19.002 14.3284 19.002 13.5C19.002 12.6716 18.3304 12 17.502 12C16.6735 12 16.002 12.6716 16.002 13.5Z"
          strokeWidth="1.5"
          stroke="url(#gradient_icon_gold_orange_new)"
        />
        <path
          d="M2.00195 11C2.00195 7.22876 2.00195 5.34315 3.17353 4.17157C4.3451 3 6.23072 3 10.002 3H14.002C14.9319 3 15.3969 3 15.7784 3.10222C16.8137 3.37962 17.6223 4.18827 17.8997 5.22354C18.002 5.60504 18.002 6.07003 18.002 7M10.002 7H16.002C18.8304 7 20.2446 7 21.1233 7.87868C22.002 8.75736 22.002 10.1716 22.002 13V15C22.002 17.8284 22.002 19.2426 21.1233 20.1213C20.2446 21 18.8304 21 16.002 21H12.5005"
          stroke="url(#gradient_icon_gold_orange_new)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10 17H6M6 17H2M6 17V21M6 17L6 13"
          stroke="url(#gradient_icon_gold_orange_new)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "hardware",
    title: "Connect Hardware",
    desc: "Use your Ledger, Trezor or Keystone device with Eternl",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 xs:w-10 ml-1 xs:ml-2 shrink-0"
        aria-hidden="true"
      >
        <GradientDefs id="gradient_icon_gold_orange_hw" />
        <path
          d="M4.03751 12.5387L9.9765 6.59975C11.3763 5.19992 12.0763 4.5 12.946 4.5C13.8157 4.5 14.5157 5.19992 15.9155 6.59975L17.4002 8.0845C18.8001 9.48434 19.5 10.1843 19.5 11.054C19.5 11.9237 18.8001 12.6237 17.4002 14.0235L11.4613 19.9625C9.41124 22.0125 6.08752 22.0125 4.03751 19.9625C1.9875 17.9125 1.9875 14.5888 4.03751 12.5387Z"
          stroke="url(#gradient_icon_gold_orange_hw)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 17C8.5 16.1716 7.82843 15.5 7 15.5C6.17157 15.5 5.5 16.1716 5.5 17C5.5 17.8284 6.17157 18.5 7 18.5C7.82843 18.5 8.5 17.8284 8.5 17Z"
          stroke="url(#gradient_icon_gold_orange_hw)"
          strokeWidth="1.5"
        />
        <path
          d="M14.5 5.35034L15.8832 3.96713C16.8613 2.98904 17.3503 2.5 17.958 2.5C18.5657 2.5 19.0548 2.98904 20.0329 3.96713C21.011 4.94521 21.5 5.43425 21.5 6.04195C21.5 6.64966 21.011 7.1387 20.0329 8.11678L18.6497 9.5"
          stroke="url(#gradient_icon_gold_orange_hw)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "seed",
    title: "Enter a Seed-phrase",
    desc: "Use your 24, 15 or 12 word seed-phrase",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 xs:w-10 ml-1 xs:ml-2 shrink-0"
        aria-hidden="true"
      >
        <GradientDefs id="gradient_icon_gold_orange_seed" />
        <path
          d="M15.5 14.5C18.8137 14.5 21.5 11.8137 21.5 8.5C21.5 5.18629 18.8137 2.5 15.5 2.5C12.1863 2.5 9.5 5.18629 9.5 8.5C9.5 9.38041 9.68962 10.2165 10.0303 10.9697L2.5 18.5V21.5H5.5V19.5H7.5V17.5H9.5L13.0303 13.9697C13.7835 14.3104 14.6196 14.5 15.5 14.5Z"
          stroke="url(#gradient_icon_gold_orange_seed)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 6.5L16.5 7.5"
          stroke="url(#gradient_icon_gold_orange_seed)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "multisig",
    title: "Multi-Sig Wallet",
    desc: "Create or join a multi-signature wallet",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className="w-8 xs:w-10 ml-1 xs:ml-2 shrink-0"
        aria-hidden="true"
      >
        <GradientDefs id="gradient_icon_gold_orange_multisig" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.3541 3.64593C18.5085 1.8004 13.2722 4.04455 8.65837 8.65837C4.04455 13.2722 1.8004 18.5085 3.64593 20.3541C5.49146 22.1996 10.7278 19.9555 15.3416 15.3416C19.9555 10.7278 22.1996 5.49146 20.3541 3.64593Z"
          stroke="url(#gradient_icon_gold_orange_multisig)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.64593 3.64593C1.8004 5.49146 4.04455 10.7278 8.65837 15.3416C13.2722 19.9555 18.5085 22.1996 20.3541 20.3541C22.1996 18.5085 19.9555 13.2722 15.3416 8.65837C10.7278 4.04455 5.49146 1.8004 3.64593 3.64593Z"
          stroke="url(#gradient_icon_gold_orange_multisig)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.009 12H12"
          stroke="url(#gradient_icon_gold_orange_multisig)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "more",
    title: "More",
    desc: "Show additional wallet import options",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-8 xs:w-10 ml-1 xs:ml-2 shrink-0"
        aria-hidden="true"
      >
        <GradientDefs id="gradient_icon_gold_orange_more" />
        <path
          d="M2 18c0-1.54 0-2.31.347-2.876c.194-.317.46-.583.777-.777C3.689 14 4.46 14 6 14s2.31 0 2.876.347c.317.194.583.46.777.777C10 15.689 10 16.46 10 18s0 2.31-.347 2.877c-.194.316-.46.582-.777.776C8.311 22 7.54 22 6 22s-2.31 0-2.876-.347a2.35 2.35 0 0 1-.777-.776C2 20.31 2 19.54 2 18m12 0c0-1.54 0-2.31.347-2.876c.194-.317.46-.583.777-.777C15.689 14 16.46 14 18 14s2.31 0 2.877.347c.316.194.582.46.776.777C22 15.689 22 16.46 22 18s0 2.31-.347 2.877a2.36 2.36 0 0 1-.776.776C20.31 22 19.54 22 18 22s-2.31 0-2.876-.347a2.35 2.35 0 0 1-.777-.776C14 20.31 14 19.54 14 18M2 6c0-1.54 0-2.31.347-2.876c.194-.317.46-.583.777-.777C3.689 2 4.46 2 6 2s2.31 0 2.876.347c.317.194.583.46.777.777C10 3.689 10 4.46 10 6s0 2.31-.347 2.876c-.194.317-.46.583-.777.777C8.311 10 7.54 10 6 10s-2.31 0-2.876-.347a2.35 2.35 0 0 1-.777-.777C2 8.311 2 7.54 2 6m12 0c0-1.54 0-2.31.347-2.876c.194-.317.46-.583.777-.777C15.689 2 16.46 2 18 2s2.31 0 2.877.347c.316.194.582.46.776.777C22 3.689 22 4.46 22 6s0 2.31-.347 2.876c-.194.317-.46.583-.776.777C20.31 10 19.54 10 18 10s-2.31 0-2.876-.347a2.35 2.35 0 0 1-.777-.777C14 8.311 14 7.54 14 6"
          stroke="url(#gradient_icon_gold_orange_more)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    ),
  },
] as const;

export type EternlWalletTypeModalProps = {
  open: boolean;
  onClose?: () => void;
  onSelect?: (key: (typeof OPTIONS)[number]["key"]) => void;
  /** @deprecated — network switching is now handled internally */
  networkLabel?: string;
  /** @deprecated — network switching is now handled internally */
  networkIconSrc?: string;
  /** @deprecated — network switching is now handled internally */
  onNetworkClick?: () => void;
  zIndexClass?: string;
  suppressBackdrop?: boolean;
  onNetworkSelect?: (network: NetworkOption) => void;
};

export default function EternlWalletTypeModal({
  open,
  onClose,
  onSelect,
  networkLabel: _networkLabelProp = "Cardano mainnet",
  networkIconSrc: _networkIconSrcProp = "/brand/cardano.svg",
  onNetworkClick: _onNetworkClickProp,
  zIndexClass = "z-[65]",
  suppressBackdrop = false,
  onNetworkSelect,
}: EternlWalletTypeModalProps) {
  const [networkSwitcherOpen, setNetworkSwitcherOpen] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkOption>({
    key: "cardano-mainnet",
    chain: "cardano",
    label: "Cardano mainnet",
    description: "The official Cardano network launched by IOG in 2017.",
    iconSrc: "/brand/cardano.svg",
    isMainnet: true,
  });

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-end justify-center px-3 pb-0 pt-24 sm:px-6`}
      role="presentation"
    >
      {!suppressBackdrop ? (
        <button
          type="button"
          className={`absolute inset-0 ${ETERNL_MODAL_BACKDROP}`}
          aria-label="Close"
          onClick={onClose}
        />
      ) : null}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="et-wallet-type-title"
        className="relative flex max-h-[90vh] w-full max-w-[640px] flex-col rounded-3xl border border-white/10 bg-[hsl(0_0%_8%)] shadow-[0_-12px_48px_rgba(0,0,0,0.55)] ring-1 ring-white/10 overflow-visible"
      >
        {/* Gradient top bar (re-added as per layout) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 overflow-hidden rounded-t-3xl">
          <div className="absolute top-0 h-[3px] w-full bg-gradient-to-r from-pink-400 to-orange-400" />
        </div>

        {/* Floating SVG correctly resized to screenshot */}
        <div className="pointer-events-none absolute -top-[300px] -mr-[7rem] sm:-right-[40px] z-10 drop-shadow-[0_16px_24px_rgba(0,0,0,0.6)]">
          <EternlWalletCreatedIllustration className="w-[500px] h-[500px] object-contain" />
        </div>

        <header className="relative shrink-0 px-6 sm:px-8 pt-8 sm:pt-10 pb-4 z-20">
          <div className="flex w-[70%] sm:w-3/4 flex-col gap-2 text-left">
            <h2
              id="et-wallet-type-title"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight"
            >
              Select wallet type
            </h2>
            <p className="text-base text-white/70 leading-snug">
              If you&apos;re a new user, create a new wallet.
              <br />
              Connect your Ledger or import a JSON backup.
            </p>
          </div>
        </header>

        <div className="modal-content flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="min-h-0 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex flex-col gap-4">
              {/* Network selector pill */}
              <div className="flex justify-end pt-2 pb-1">
                <button
                  type="button"
                  onClick={() =>
                    !suppressBackdrop && setNetworkSwitcherOpen(true)
                  }
                  className={`p-button p-component p-button-secondary network-button flex h-10 items-center rounded-full border border-white/10 bg-white/[0.04] p-0 text-left shadow-sm transition hover:bg-white/[0.07] sm:h-11 ${
                    suppressBackdrop ? "pointer-events-none" : ""
                  }`}
                >
                  <div className="flex flex-row items-center gap-2.5 h-10 pl-1 pr-4">
                    <img
                      className="shrink-0 aspect-square rounded-full size-7 sm:size-8"
                      src={activeNetwork.iconSrc}
                      alt="current network icon"
                    />
                    <span className="whitespace-nowrap pr-5 leading-tight font-medium text-white">
                      {activeNetwork.label}
                    </span>
                  </div>
                </button>
              </div>

              {/* Wallet type options */}
              {OPTIONS.map(({ key, title, desc, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelect?.(key)}
                  className={`p-button p-component p-button-secondary p-button-outlined button-card-horizontal flex w-full flex-row items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-left shadow-sm transition hover:bg-white/[0.07] sm:gap-5 sm:px-5 sm:py-5 ${
                    suppressBackdrop ? "pointer-events-none" : ""
                  }`}
                >
                  {icon}
                  <div className="grow flex flex-col text-left">
                    <div className="text-[15px] font-semibold text-white">
                      {title}
                    </div>
                    <div className="text-sm text-white/50 mt-0.5">{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Network Switcher modal — overlays on top of this modal */}
      <EternlNetworkSwitcherModal
        open={networkSwitcherOpen}
        activeNetworkKey={activeNetwork.key}
        onClose={() => setNetworkSwitcherOpen(false)}
        onSelect={(network) => {
          setActiveNetwork(network);
          setNetworkSwitcherOpen(false);
          onNetworkSelect?.(network);
        }}
        zIndexClass="z-[75]"
      />
    </div>
  );
}
