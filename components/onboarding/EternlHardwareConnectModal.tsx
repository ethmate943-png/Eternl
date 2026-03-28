"use client";

import { ChevronLeft } from "lucide-react";
import EternlModalShell from "./EternlModalShell";

export type EternlHardwareConnectModalProps = {
  open: boolean;
  onBack: () => void;
  onSelect: (device: string) => void;
  onClose?: () => void;
  zIndexClass?: string;
};

const devices = [
  {
    key: "keystone",
    name: "Keystone",
    desc: "Keystone 3 Pro",
    icon: "/images/pair/dark/keystone.svg",
  },
  {
    key: "ledger",
    name: "Ledger",
    desc: "Stax, Flex, and Nano (X, S, and S Plus)",
    icon: "/images/pair/dark/ledger.svg",
  },
  {
    key: "trezor",
    name: "Trezor",
    desc: "Model T and Safe 3/5",
    icon: "/images/pair/dark/trezor.svg",
  },
  {
    key: "onekey",
    name: "OneKey",
    desc: "OneKey Pro verified",
    icon: "/images/pair/dark/onekey.svg",
  },
];

export default function EternlHardwareConnectModal({
  open,
  onBack,
  onSelect,
  onClose,
  zIndexClass = "z-[66]",
}: EternlHardwareConnectModalProps) {
  return (
    <EternlModalShell
      open={open}
      title="Connect hardware wallet"
      subtitle="If you own a hardware wallet, this is the place to be."
      onBack={onBack}
      onClose={onClose}
      zIndexClass={zIndexClass}
    >
      <div className="relative min-h-0 flex-1 overflow-y-auto pt-6">
        <div className="grid gap-3 sm:gap-4">
          {devices.map((device) => (
            <button
              key={device.key}
              onClick={() => onSelect(device.key)}
              className="group relative flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10 active:scale-[0.98]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2">
                <img
                  src={device.icon}
                  alt={device.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/brand/cardano.svg";
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-white">
                  {device.name}
                </div>
                <div className="text-sm text-white/50">
                  {device.desc}
                </div>
              </div>
              <div className="text-white/30 transition group-hover:text-white/60">
                <ChevronLeft className="h-5 w-5 rotate-180" strokeWidth={1.5} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </EternlModalShell>
  );
}
