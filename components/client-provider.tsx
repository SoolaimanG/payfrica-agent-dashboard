"use client";

import { FC } from "react";
import { Chain, SuiTestnetChain, WalletProvider } from "@suiet/wallet-kit";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "@suiet/wallet-kit/style.css";

const SupportedChains: Chain[] = [SuiTestnetChain];

export const ClientProvider: FC<{ children: any }> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider chains={SupportedChains}>{children}</WalletProvider>;
    </QueryClientProvider>
  );
};
