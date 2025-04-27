import React, { FC } from "react";
import { TableCell, TableRow } from "./ui/table";
import { IAgent } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const Agent: FC<IAgent> = ({ ...agent }) => {
  return (
    <TableRow className="hover:bg-gray-200 h-14">
      <TableCell className="font-medium">{agent.time}</TableCell>
      <TableCell className="font-medium">{agent.name}</TableCell>
      <TableCell className="font-medium">{agent.token} SUI</TableCell>
      <TableCell className="font-medium">{agent.agent}</TableCell>
      <TableCell className="font-medium capitalize">{agent.status}</TableCell>
      <TableCell className="space-x-2 font-medium">
        {agent.status === "active" ? (
          <p className={cn("capitalize text-destructive font-bold")}>
            {agent.status}
          </p>
        ) : agent.status === "inactive" ? (
          <p className={cn("capitalize text-destructive font-bold")}>
            {agent.status}
          </p>
        ) : (
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
        )}
      </TableCell>
    </TableRow>
  );
};

export default Agent;
