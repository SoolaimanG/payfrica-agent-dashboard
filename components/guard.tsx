import React, { FC, ReactNode } from "react";
import { EmptyState } from "./empty";
import { ConnectWallet } from "./connect-wallet";
import { CircleSlash2 } from "lucide-react";
import { useWallet } from "@suiet/wallet-kit";

export const Guard: FC<{ children: ReactNode }> = ({ children }) => {
  const { connected = false } = useWallet();

  if (!connected) {
    return (
      <EmptyState
        icon={CircleSlash2}
        message="Please connect your wallet before you can view this page!"
        header="No Wallet Connected"
        className="mt-20"
      >
        <ConnectWallet className="rounded-sm h-12" />
      </EmptyState>
    );
  }

  return <div>{children}</div>;
};
