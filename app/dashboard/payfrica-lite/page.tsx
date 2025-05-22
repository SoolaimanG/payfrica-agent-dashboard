"use client";

import AgentConfig from "@/components/agent-config";
import { DashboradNavBar } from "@/components/dashboard-navbar";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, config, isAdmin, payfrica, splitTokenString } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { Fragment, useEffect, useState } from "react";
import { Transaction as Trans } from "@mysten/sui/transactions";
import { AddAgent } from "@/components/add-agent";
import { ITransaction } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

const Page = () => {
  const { address = "", signAndExecuteTransaction } = useWallet();
  const [agentTypes, setAgentTypes] = useState<
    { fullType: string; shortName: string }[]
  >([]);
  const [fullCoinType, setFullCoinType] = useState("");
  const [isPending, startTransaction] = useState(false);
  const [addr, setAddr] = useState("");
  const qc = useQueryClient();

  const { data: transactions } = useQuery({
    queryKey: ["agents-request"],
    queryFn: () => payfrica.getPayfricaLiteAgentsRequest(address),
  });

  const { data: payfricaAgents = [] } = useQuery({
    queryKey: [""],
    queryFn: () => payfrica.getAllAPayfricaAgents(),
  });

  const { data: _agentTypes } = useQuery({
    queryKey: ["get-all-agent-types"],
    queryFn: async () => await payfrica.getAllAgentTypes(),
  });

  useEffect(() => {
    if (!_agentTypes?.length) return;

    _agentTypes.forEach((type) => {
      const { firstFullType, secondFullType, shortName } =
        splitTokenString(type);

      setAgentTypes((prev) => [
        ...prev,
        {
          fullType: firstFullType + "-" + secondFullType,
          shortName,
        },
      ]);
    });
  }, [_agentTypes]);

  const addAgent = async () => {
    const [first, second] = fullCoinType.split("-");

    try {
      startTransaction(true);
      const tx = new Trans();
      tx.moveCall({
        target: `${config.BRIDGE_PACKAGE_ID}::bridge_agents::create_agent`,
        arguments: [
          tx.object(config.BRIDGE_PUBLISHER_ID!),
          tx.object(config.BRIDGE_AGENT_ID),
          tx.pure.address(addr),
        ],
        typeArguments: [first, second],
      });

      const txResult = await signAndExecuteTransaction({
        transaction: tx,
      });

      if (txResult) {
      }
    } catch (error) {
      console.log(error);
    } finally {
      startTransaction(false);
    }
  };

  const approveOrDecline = async (
    type = "approve_deposits",
    agentId: string,
    id: string,
    coinType: string[],
    amount: number
  ) => {
    try {
      startTransaction(true);
      //Calling the smart contract

      const coins = await payfrica.client.getCoins({
        owner: address,
        coinType: "0x" + coinType[0],
      });

      const tx = new Trans();

      let txObjects = [
        tx.object(config.BRIDGE_AGENT_ID),
        tx.object(agentId),
        tx.object(id),
        tx.object("0x6"),
      ];

      if (type === "approve_deposits") {
        const coin = payfrica.handleMergeSplit(tx, coins?.data, BigInt(amount));
        //@ts-ignore
        txObjects.push(coin);
      }

      tx.moveCall({
        target: `${config.BRIDGE_PACKAGE_ID}::bridge_agents::${type}`,
        arguments: txObjects,
        typeArguments: coinType,
      });

      const txResult = await signAndExecuteTransaction({
        transaction: tx,
      });

      if (txResult) {
        qc.invalidateQueries({
          queryKey: ["agents-request"],
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      startTransaction(false);
    }
  };

  return (
    <div className="w-full">
      <DashboradNavBar />
      <Header
        type="payfrica-lite"
        header={
          <Fragment>
            <div className="w-full flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              {isAdmin(address) && (
                <AddAgent
                  onSave={addAgent}
                  isPending={isPending}
                  addr={addr}
                  setAddr={setAddr}
                  agentTypes={agentTypes}
                  setFullCoinType={setFullCoinType}
                  fullCoinType={fullCoinType}
                >
                  <Button className="text-[#624BFF] rounded-sm">
                    Add Agents
                  </Button>
                </AddAgent>
              )}
            </div>
          </Fragment>
        }
      >
        <div className="w-full max-w-7xl mx-auto md:px-0 px-3 mt-10 space-y-10">
          {/* TODO: add another amount i.e output amount */}
          {isAdmin(address) && (
            <Card className="bg-accent-foreground rounded-sm text-accent">
              <CardHeader className="flex items-center flex-row justify-between">
                <CardTitle className="text-2xl">Agents</CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <Table className="w-full">
                  <TableHeader className="w-full bg-gray-200">
                    <TableRow className="hover:bg-gray-200">
                      <TableHead className="text-accent">
                        Sui Coin Type
                      </TableHead>
                      <TableHead className="text-accent">Name</TableHead>
                      <TableHead className="text-accent">
                        Base Token Type
                      </TableHead>
                      <TableHead className="text-accent">Agent</TableHead>
                      <TableHead className="text-accent">Address</TableHead>
                      <TableHead className="text-accent">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payfricaAgents.map((agent, idx) => (
                      <AgentConfig key={idx} {...agent} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {!isAdmin(address) && (
            <Card className="bg-accent-foreground rounded-sm text-accent">
              <CardHeader className="flex items-center flex-row justify-between">
                <CardTitle className="text-2xl">Agents</CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <Table className="w-full">
                  <TableHeader className="w-full bg-gray-200">
                    <TableRow className="hover:bg-gray-200">
                      <TableHead className="text-accent">Time</TableHead>
                      <TableHead className="text-accent">ID</TableHead>
                      <TableHead className="text-accent">User Addr</TableHead>
                      <TableHead className="text-accent">
                        Input Amount
                      </TableHead>
                      <TableHead className="text-accent">
                        Output Amount
                      </TableHead>
                      <TableHead className="text-accent">
                        Input Coin Type
                      </TableHead>
                      <TableHead className="text-accent">
                        Output Coin Type
                      </TableHead>
                      <TableHead className="text-accent">Status</TableHead>
                      <TableHead className="text-accent">Comment</TableHead>
                      <TableHead className="text-accent">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="hover:bg-gray-200 h-14 cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {format(transaction.requestTime, "PPP")}
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
                          {payfrica.truncateString(transaction.user)}{" "}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.type === "deposit"
                            ? Number(transaction.inputAmount) / Math.pow(10, 6)
                            : Number(transaction.outputAmount) /
                              Math.pow(10, 6)}{" "}
                        </TableCell>

                        <TableCell className="font-medium">
                          {transaction.type === "deposit"
                            ? Number(transaction.outputAmount) / Math.pow(10, 6)
                            : Number(transaction.inputAmount) /
                              Math.pow(10, 6)}{" "}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.type === "deposit"
                            ? transaction.inputCoinType.split("::").pop()
                            : transaction.outputCoinType.split("::").pop()}{" "}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.type === "deposit"
                            ? transaction.outputCoinType.split("::").pop()
                            : transaction.inputCoinType.split("::").pop()}{" "}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "font-medium capitalize",
                            transaction.status === "Completed" &&
                              "text-green-600",
                            transaction.status === "Cancelled" &&
                              "text-destructive",
                            transaction.status === "Pending" &&
                              "text-yellow-500"
                          )}
                        >
                          {transaction.status}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.comment}{" "}
                        </TableCell>

                        <TableCell className="space-x-2 font-medium">
                          {transaction.status !== "Pending" ? (
                            <p
                              className={cn(
                                "capitalize text-destructive font-bold",
                                transaction.status === "Completed" &&
                                  "text-green-600",
                                transaction.status === "Cancelled" &&
                                  "text-destructive"
                              )}
                            >
                              {transaction.status}
                            </p>
                          ) : (
                            !isAdmin(address) && (
                              <div className="flex items-center gap-2">
                                <Button
                                  disabled={isPending}
                                  onClick={() =>
                                    approveOrDecline(
                                      transaction.type === "deposit"
                                        ? "approve_deposits"
                                        : "approve_withdrawals",
                                      transaction.agentId,
                                      transaction.id,
                                      [
                                        transaction.inputCoinType,
                                        transaction.outputCoinType,
                                      ],
                                      Number(transaction?.inputAmount)
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
                                  onClick={() => {
                                    if (transaction.type === "deposit") {
                                      approveOrDecline(
                                        "cancel_deposits",
                                        transaction.agentId,
                                        transaction.id,
                                        [
                                          transaction.inputCoinType,
                                          transaction.outputCoinType,
                                        ],
                                        0
                                      );
                                    }
                                  }}
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </Header>
    </div>
  );
};

export default Page;
