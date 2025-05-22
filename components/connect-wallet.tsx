"use client";

import React, { FC, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Wallet2 } from "lucide-react";
import { ConnectModal, useWallet } from "@suiet/wallet-kit";

export const ConnectWallet: FC<{
  children?: any;
  className?: string;
}> = ({
  children = (
    <Button className={cn("")}>
      <Wallet2 className="mr-1" />
      Connect Wallet
    </Button>
  ),
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const { connected, address, disconnect } = useWallet();

  return (
    <ConnectModal
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          setOpen(false);
          return;
        } else {
          setOpen(e && !connected);
        }
      }}
      onConnectSuccess={() => setOpen(false)}
    >
      {connected ? (
        <Button onClick={disconnect} className={cn("", props.className)}>
          <Wallet2 className="mr-1" />
          {address?.slice(0, 6) + "..." + address?.slice(-4)}
        </Button>
      ) : (
        children
      )}
    </ConnectModal>
  );
};
