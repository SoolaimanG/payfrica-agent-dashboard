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
}

export interface IAgent {
  time: string;
  name: string;
  token: string;
  agent: string;
  status: IAgentStatus;
  actions: string[];
}
