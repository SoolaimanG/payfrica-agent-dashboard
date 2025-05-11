"use client";

import React, { FC, ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Wallet2 } from "lucide-react";
import { ConnectModal, useWallet } from "@suiet/wallet-kit";

export const ConnectWallet: FC<{
  children?: ReactNode;
  className?: string;
}> = ({ ...props }) => {
  const [open, setOpen] = useState(false);
  const { connected, address, disconnect } = useWallet();

  if (!props.children) {
    props.children = (
      <Button className={cn("", props.className)}>
        <Wallet2 className="mr-1" />
        Connect Wallet
      </Button>
    );
  }

  if (connected) {
    props.children = (
      <Button onClick={disconnect} className={cn("", props.className)}>
        <Wallet2 className="mr-1" />
        {address?.slice(0, 6) + "..." + address?.slice(-4)}
      </Button>
    );
  }

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
      {props.children as any}
    </ConnectModal>
  );
};
