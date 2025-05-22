"use client";

import { FC, ReactNode } from "react";
import { Chain, SuiTestnetChain, WalletProvider } from "@suiet/wallet-kit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "@suiet/wallet-kit/style.css";
import { Guard } from "./guard";

const SupportedChains: Chain[] = [SuiTestnetChain];

export const ClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider chains={SupportedChains}>
        <Guard>{children}</Guard>
      </WalletProvider>
      ;
    </QueryClientProvider>
  );
};
