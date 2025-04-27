import React, { FC, ReactNode } from "react";
import OverviewCard from "./overview-card";
import { ArrowLeftRight, BadgeDollarSign, Target, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const Header: FC<{ children: ReactNode; header: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <div className="w-full bg-[#624BFF] relative">
      <div className="w-full max-w-7xl px-3 md:px-0 mx-auto relative h-[191px] pt-10">
        {props.header}
      </div>
      <div className="absolute left-0 md:-mb-[6rem] md:mt-0 mt-[10rem] top-0 md:top-[7rem] w-full">
        <div className="w-full max-w-7xl mx-auto md:px-0 px-3 grid lg:grid-cols-4 grid-cols-1 gap-5">
          <OverviewCard
            title="Active Agents"
            icon={Users}
            value="2"
            completed={2}
            color="purple"
          />
          <OverviewCard
            title="Swaps"
            value="132"
            completed={28}
            icon={ArrowLeftRight}
            color="cyan"
          />
          <OverviewCard
            title="Pending Transactions"
            value="12"
            completed={1}
            icon={BadgeDollarSign}
            color="red"
          />
          <OverviewCard
            title="Total Volume"
            value="NGN 1000"
            completed={5}
            icon={Target}
            color="green"
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Header;
