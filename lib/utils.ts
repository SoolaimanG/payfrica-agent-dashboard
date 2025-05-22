import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AGENTID } from "./constants";
import axios, { AxiosInstance } from "axios";
import { Transaction } from "@mysten/sui/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import queryString from "query-string";
import {
  IAgent,
  IAgentConfig,
  IAgentDetails,
  IAgentTransaction,
  IPayfricaAgentTransaction,
} from "@/types";

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
  BRIDGE_PACKAGE_ID: process.env.NEXT_PUBLIC_BRIDGE_PACKAGE_ID!,
  BRIDGE_AGENT_ID: process.env.NEXT_PUBLIC_BRIDGE_AGENT_ID!,
  BRIDGE_PUBLISHER_ID: process.env.NEXT_PUBLIC_BRIDGE_PUBLISHER,
};

class Payfrica {
  private adminAgentId = "";
  private payfricaApi: AxiosInstance = axios.create({
    baseURL: "https://payfrica-backend.onrender.com",
    withCredentials: true,
  });
  private payfricaBridgeApi: AxiosInstance = axios.create({
    baseURL: `https://payfrica-bridge-backend.onrender.com`,
  });
  client: SuiClient;

  constructor() {
    this.client = new SuiClient({ url: rpcUrl });
  }

  handleMergeSplit(
    tx: Transaction,
    coinObjects: { coinObjectId: string }[],
    amount: bigint
  ) {
    if (!coinObjects.length) throw new Error("No coins");
    const primary = coinObjects[0].coinObjectId;
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

  async updatePayfricaAgentAccountDetails(
    id: string,
    data: { accountName: string; accountNumber: string; accountBank: string }
  ) {
    const res = await this.payfricaBridgeApi.patch(
      `/agents/${id}/account`,
      data
    );

    return res.data;
  }

  async getValidAgentTypes() {
    interface IRes {
      fullType: string;
      shortName: string;
    }

    const res = await this.payfricaApi.get<IRes[]>(`/agent/valid-types/`);

    return res.data;
  }

  async getPayfricaLiteAgentsRequest(addr: string) {
    const res = await this.payfricaBridgeApi.get<IPayfricaAgentTransaction[]>(
      `/agents/requests-by-address/${addr}`
    );

    return res.data;
  }

  async getAllAPayfricaAgents() {
    const res = await this.payfricaBridgeApi.get<IAgentConfig[]>(`/agents/`);

    return res.data;
  }

  async getAllAgentTypes() {
    const res = await this.payfricaBridgeApi.get<string[]>(
      `/agents/all-agent-types`
    );
    return res.data;
  }

  async getPayfricaLiteAgentDetail(addr = "") {
    const res = await this.payfricaBridgeApi.get<IAgentConfig>(
      `/agents/wallet/${addr}`
    );
    return res.data;
  }
}

export function splitTokenString(input: string) {
  if (!input) return { shortName: "", firstFullType: "", secondFullType: "" };
  const parts = input.split("::");

  const firstThreeLetters = parts[2].slice(0, 4);

  const firstFullType =
    "0x" + parts[0] + "::" + parts[1] + "::" + firstThreeLetters;

  const secondFullType =
    "0x" + parts[2].slice(4) + "::" + parts[3] + "::" + parts[4];

  const shortName = parts[1]?.toUpperCase() + "/" + parts[3]?.toUpperCase();

  return {
    firstFullType,
    secondFullType,
    shortName,
  };
}

export const payfrica = new Payfrica();
