"use client";

import React, { FC } from "react";
import { TableCell, TableRow } from "./ui/table";
import { IAgentConfig } from "@/types";
import { cn, payfrica } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const AgentConfig: FC<IAgentConfig> = ({ ...agent }) => {
  const r = useRouter();
  return (
    <TableRow
      onClick={() =>
        r.push(`/dashboard/agents/${agent.addr}/?type=payfrica-lite`)
      }
      className="hover:bg-gray-200 h-14"
    >
      <TableCell className="font-medium">
        {agent.suiCoinType.split("::").pop()}
      </TableCell>
      <TableCell className="font-medium">{agent.accountName}</TableCell>
      <TableCell className="font-medium">
        {agent.baseCoinType.split("::").pop()}
      </TableCell>

      <TableCell className="font-medium">
        {payfrica.truncateString(agent.id)}
      </TableCell>
      <TableCell className="font-medium">
        {payfrica.truncateString(agent.addr)}
      </TableCell>
      <TableCell className="space-x-2 font-medium">
        {/*{agent.status === "active" ? (
          <p className={cn("capitalize text-destructive font-bold")}>
            {agent.status}
          </p>
        ) : agent.status === "inactive" ? (
          <p className={cn("capitalize text-destructive font-bold")}>
            {agent.status}
          </p>
        ) : (
          isAdmin("2") &&
          agent.actions.map((action, idx) => (
            <Button
              key={idx}
              className={cn(
                "capitalize h-8",
                action === "delete" && "bg-destructive hover:bg-destructive/80",
                action === "decline" && "bg-[#F5A70B] hover:bg-[#F5A70B]/80"
              )}
            >
              {action}
            </Button>
          ))
        )}*/}
        <Button
          //key={idx}
          className={cn(
            "capitalize h-8",
            "bg-destructive hover:bg-destructive/80"
            //action === "decline" && "bg-[#F5A70B] hover:bg-[#F5A70B]/80"
          )}
        >
          Deactivate
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AgentConfig;
