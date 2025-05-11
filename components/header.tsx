import React, { FC, ReactNode } from "react";
import OverviewCard from "./overview-card";
import {
  ArrowLeftRight,
  BadgeDollarSign,
  Check,
  DollarSign,
  Landmark,
  Users,
  X,
} from "lucide-react";
import { isAdmin } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";

const Header: FC<{
  children: ReactNode;
  header: ReactNode;
  type?: "payfrica-lite" | "payfrica";
  balance?: number;
  currency?: string;
  transactions?: {
    pending?: number;
    completed?: number;
    failed?: number;
  };
  activeCards?: string[];
  showActiveAgents?: boolean;
}> = ({
  children,
  type = "payfrica",
  currency = "NGNC",
  balance = 0,
  transactions,
  activeCards = [],
  showActiveAgents = true,
  ...props
}) => {
  const { address } = useWallet();
  const a = new Set(activeCards);

  return (
    <div className="w-full bg-[#624BFF] relative">
      <div className="w-full max-w-7xl px-3 md:px-0 mx-auto relative h-[191px] pt-10">
        {props.header}
      </div>
      <div className="absolute left-0 md:-mb-[6rem] md:mt-0 mt-[10rem] top-0 md:top-[7rem] w-full">
        <div className="w-full max-w-7xl mx-auto md:px-0 px-3 grid lg:grid-cols-4 grid-cols-1 gap-5">
          {isAdmin(address) && showActiveAgents && (
            <OverviewCard
              title="Active Agents"
              icon={Users}
              value="2"
              completed={2}
              color="purple"
            />
          )}
          {isAdmin(address) && a.has("balance") && (
            <OverviewCard
              title="Balance"
              icon={DollarSign}
              value={balance + ""}
              completed={2}
              color="purple"
            />
          )}
          {isAdmin(address) && a.has("total-transactions") && (
            <OverviewCard
              title="Total Successful"
              icon={Check}
              value={transactions?.completed + ""}
              completed={2}
              color="green"
            />
          )}
          {isAdmin(address) && a.has("failed-transactions") && (
            <OverviewCard
              title="Failed Transactions"
              icon={X}
              value={transactions?.failed + ""}
              completed={2}
              color="red"
            />
          )}
          {/*<OverviewCard
            title="Swaps"
            value="132"
            completed={28}
            icon={ArrowLeftRight}
            color="cyan"
          />*/}
          {type === "payfrica-lite" && (
            <OverviewCard
              title="USDC"
              value="132"
              completed={28}
              icon={ArrowLeftRight}
              color="cyan"
            />
          )}

          {!isAdmin(address) && (
            <OverviewCard
              title={currency}
              value={(balance || 0).toLocaleString()}
              completed={transactions?.completed || 0}
              icon={Landmark}
              color="green"
            />
          )}
          {(isAdmin(address) || a.has("pending-transactions")) && (
            <OverviewCard
              title="Pending Transactions"
              value={(transactions?.pending || 0) + ""}
              completed={1}
              icon={BadgeDollarSign}
              color="red"
            />
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;
