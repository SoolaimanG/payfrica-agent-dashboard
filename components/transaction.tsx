import React, { FC } from "react";
import { TableCell, TableRow } from "./ui/table";
import { ITransaction } from "@/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Transaction: FC<ITransaction> = ({ ...transaction }) => {
  return (
    <TableRow className="hover:bg-gray-200 h-14">
      <TableCell className="font-medium">{transaction.time}</TableCell>
      <TableCell className="font-medium">{transaction.id}</TableCell>
      <TableCell className="font-medium">{transaction.amount} SUI</TableCell>
      <TableCell className="font-medium">{transaction.agent}</TableCell>
      <TableCell className="font-medium capitalize">
        {transaction.status}
      </TableCell>
      <TableCell className="space-x-2 font-medium">
        {transaction.status === "approved" ? (
          <p className={cn("capitalize text-destructive font-bold")}>
            {transaction.status}
          </p>
        ) : transaction.status === "declined" ? (
          <p className={cn("capitalize text-destructive font-bold")}>
            {transaction.status}
          </p>
        ) : (
          transaction.actions.map((action, idx) => (
            <Button
              key={idx}
              className={cn(
                "capitalize h-8",
                action === "approve" && "bg-[#0BF526] hover:bg-[#0BF526]/80",
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

export default Transaction;
