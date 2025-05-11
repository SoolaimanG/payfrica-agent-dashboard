import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AGENTID } from "./constants";
import axios, { AxiosInstance } from "axios";
import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import queryString from "query-string";
import { IAgent, IAgentDetails, IAgentTransaction } from "@/types";

export const isAdmin = (id = "1") => {
  return id === AGENTID;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const rpcUrl = getFullnodeUrl("testnet");

export const config = {
  PAYFRICA_AGENT_ID: process.env.NEXT_PUBLIC_PAYFRICA_AGENT_ID!,
  PAYFRICA_PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID!,
  PUBLISHER: process.env.NEXT_PUBLIC_PUBLISHER!,
};

class Payfrica {
  private adminAgentId = "";
  private payfricaApi: AxiosInstance = axios.create({
    baseURL: "https://payfrica-backend.onrender.com",
    withCredentials: true,
  });
  client: SuiClient;

  constructor() {
    this.client = new SuiClient({ url: rpcUrl });
  }

  handleMergeSplit(tx: Transaction, coinObjects: any[], amount: bigint) {
    if (!coinObjects.length) throw new Error("No coins");
    let primary = coinObjects[0].coinObjectId;
    if (coinObjects.length > 1) {
      const rest = coinObjects.slice(1).map((c) => c.coinObjectId);
      tx.mergeCoins(
        tx.object(primary),
        rest.map((id) => tx.object(id))
      );
    }
    const [split] = tx.splitCoins(primary, [amount]);
    return split;
  }

  async getAllTransactions(address: string, limit = 100) {
    const q = queryString.stringify({
      address,
      limit,
    });
    const res = await this.payfricaApi.get<IAgentTransaction[]>(
      `/agent/requests?${q}`
    );
    return res.data;
  }

  truncateString(str: string) {
    return str.slice(0, 6) + "..." + str.slice(-4);
  }

  async getAgentsDetails(address: string) {
    const q = queryString.stringify({
      address,
    });
    const res = await this.payfricaApi.get<IAgentDetails>(`/agent/agent/?${q}`);

    return res.data;
  }

  async getAllAgents() {
    const res = await this.payfricaApi.get<IAgent[]>(`/agent/`);

    return res.data;
  }

  async updateAgentAccountDetails(
    id: string,
    data: { accountName: string; accountNumber: string; accountBank: string }
  ) {
    const res = await this.payfricaApi.patch(`/agent/${id}/account`, data);

    return res.data;
  }

  formatAmount(amount: number, currency: string) {}
}

export const payfrica = new Payfrica();
