"use client";

import { IAgentTransaction } from "@/types";
import React, { FC, useState } from "react";
import { TableCell, TableRow } from "./ui/table";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { cn, config, isAdmin, payfrica } from "@/lib/utils";
import { Transaction } from "@mysten/sui/transactions";
import { useWallet } from "@suiet/wallet-kit";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

export const AgentTransaction: FC<IAgentTransaction> = ({ ...transaction }) => {
  const wallet = useWallet();
  const qc = useQueryClient();
  const [isPending, startTransaction] = useState(false);

  const approveOrDecline = async (type = "approve_deposits") => {
    try {
      startTransaction(true);
      //Calling the smart contract
      const tx = new Transaction();
      tx.moveCall({
        target: `${config.PAYFRICA_PACKAGE_ID}::agents::${type}`,
        arguments: [
          tx.object(config.PAYFRICA_AGENT_ID),
          tx.object(transaction.agentId),
          tx.object(transaction.id),
          tx.object("0x6"),
        ],
        typeArguments: [transaction.coinType],
      });

      const txResult = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });

      if (txResult) {
        qc.invalidateQueries({
          queryKey: ["all-transactions", wallet?.address],
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      startTransaction(false);
    }
  };

  return (
    <TableRow className="hover:bg-gray-200 h-14 cursor-pointer">
      <TableCell className="font-medium">
        {format(transaction.createdAt, "PPP")}
      </TableCell>
      <TableCell className="font-medium">
        <Link
          target="__blank"
          href={`https://testnet.suivision.xyz/object/${transaction.id}`}
          className=" hover:underline text-purple-500"
        >
          {payfrica.truncateString(transaction.id)}
        </Link>
      </TableCell>
      <TableCell className="font-medium">
        {transaction.amount} {transaction.coinType.split("::").pop()}
      </TableCell>
      <TableCell>{transaction.type.toUpperCase()}</TableCell>
      <TableCell
        className={cn(
          "font-medium capitalize",
          transaction.status === "COMPLETED" && "text-green-600",
          transaction.status === "CANCELLED" && "text-destructive",
          transaction.status === "PENDING" && "text-yellow-500"
        )}
      >
        {transaction.status}
      </TableCell>
      <TableCell className="space-x-2 font-medium">
        {transaction.status !== "PENDING" ? (
          <p
            className={cn(
              "capitalize text-destructive font-bold",
              transaction.status === "COMPLETED" && "text-green-600",
              transaction.status === "CANCELLED" && "text-destructive"
            )}
          >
            {transaction.status}
          </p>
        ) : (
          !isAdmin(wallet.address) && (
            <div className="flex items-center gap-2">
              <Button
                disabled={isPending}
                onClick={() =>
                  approveOrDecline(
                    transaction.type === "deposit"
                      ? "approve_deposits"
                      : "approve_withdrawal"
                  )
                }
                className={cn(
                  "capitalize h-8 cursor-pointer",
                  "bg-[#0BF526] hover:bg-[#0BF526]/80"
                )}
              >
                APPROVE
              </Button>
              <Button
                disabled={isPending}
                onClick={() => approveOrDecline("cancel_deposits")}
                className={cn(
                  "capitalize h-8",
                  "bg-[#F5A70B] hover:bg-[#F5A70B]/80"
                )}
              >
                DECLINE
              </Button>
            </div>
          )
        )}
      </TableCell>
    </TableRow>
  );
};
