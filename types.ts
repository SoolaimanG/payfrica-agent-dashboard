import { LucideProps } from "lucide-react";

export type IColor = "purple" | "cyan" | "red" | "green";

export interface IOverviewCard {
  title: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  value: string;
  color?: IColor;
  completed: number;
}

export type ITransactionStatus = "pending" | "approved" | "declined";
export type IAgentStatus = "active" | "suspended" | "inactive";

export interface ITransaction {
  id: string;
  time: string;
  amount: number;
  agent: string;
  status: ITransactionStatus;
  actions: string[];
  isApprove: boolean;
  outputAmount?: number;
}

export interface IAgentTransaction {
  id: string;
  amount: number;
  user: string;
  agentId: string;
  coinType: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  requestTime: string;
  statusTime: null | string;
  createdAt: string;
  updatedAt: string;
  type: "withdrawal" | "deposit";
  successfulAgentId?: string;
  comment?: string;
}

export interface IAgentDetails {
  accountNumber: string;
  addr: string;
  balance: string;
  bank: string;
  coinType: string;
  createdAt: string;
  id: string;
  maxDepositLimit: string;
  maxWithdrawLimit: string;
  minDepositLimit: string;
  minWithdrawLimit: string;
  name: string;
  pendingDeposits: any[];
  pendingWithdrawals: any[];
  successfulDeposits: any[];
  successfulWithdrawals: any[];
  totalPendingDeposits: string;
  totalPendingDepositsAmount: string;
  totalPendingWithdrawals: number;
  totalPendingWithdrawalsAmount: string;
  totalSuccessfulDeposits: string;
  totalSuccessfulDepositsAmount: string;
  totalSuccessfulWithdrawals: number;
  totalSuccessfulWithdrawalsAmount: string;
  totalUnsuccessfulDeposits: number;
  unsuccessfulDeposits: any[];
  updatedAt: string;
}

export interface IAgent {
  id: string;
  addr: string;
  balance: number;
  coinType: string;
  accountNumber: string;
  bank: string;
  name: string;
  pendingWithdrawals: string[];
  successfulWithdrawals: string[];
  totalSuccessfulWithdrawals: number;
  totalPendingWithdrawals: number;
  totalSuccessfulWithdrawalsAmount: number;
  totalPendingWithdrawalsAmount: number;
  pendingDeposits: string[];
  successfulDeposits: string[];
  totalSuccessfulDeposits: number;
  totalPendingDeposits: number;
  totalSuccessfulDepositsAmount: number;
  totalPendingDepositsAmount: number;
  unsuccessfulDeposits: string[];
  totalUnsuccessfulDeposits: number;
  maxWithdrawLimit: number;
  maxDepositLimit: number;
  minWithdrawLimit: number;
  minDepositLimit: number;
  createdAt: string;
  updatedAt: string;
}
