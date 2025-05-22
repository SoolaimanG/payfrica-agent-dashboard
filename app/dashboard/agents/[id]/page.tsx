"use client";

import { AgentTransaction } from "@/components/agent-transaction";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, config, payfrica } from "@/lib/utils";
import { Transaction } from "@mysten/sui/transactions";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Ban, Eye, Infinity, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams() as { id: string };
  const [isOpen, setIsOpen] = useState(false);
  const qc = useQueryClient();
  const [isPending, startTransaction] = useState(false);
  const { address: owner = "", ...wallet } = useWallet();
  const q = useSearchParams();

  const { isLoading, data: transactions = [] } = useQuery({
    queryKey: ["get-agent-transactions", id],
    queryFn: () => payfrica.getAllTransactions(id),
    enabled: q.get("type") === "payfrica",
  });
  const [limits, setLimits] = useState({
    maxDeposit: 0,
    maxWithdrawal: 0,
    minDeposit: 0,
    minWithdrawal: 0,
  });

  const { data: payfriaAgentTransactions = [] } = useQuery({
    queryKey: ["get-payfria-agent-transactions", id],
    queryFn: () => payfrica.getPayfricaLiteAgentsRequest(id),
    enabled: q.get("type") === "payfrica-lite",
  });

  const { data: agentDetail } = useQuery({
    queryKey: ["agent-detail", id],
    queryFn: () => payfrica.getAgentsDetails(id),
    enabled: Boolean(q.get("type") === "payfrica"),
  });

  const { data: payfricaAgentsDetail } = useQuery({
    queryKey: ["payfrica-agent-detail"],
    queryFn: () => payfrica.getPayfricaLiteAgentDetail(id),
    enabled: Boolean(q.get("type") === "payfrica-lite"),
  });

  const [agentAccount, setAgentAccount] = useState({
    accountNumber: "",
    name: "",
    bank: "",
    balance: 0,
    type: "inc",
    baseCoinType: "",
    suiCoinType: "",
    suiBalance: 0,
    type2: "inc",
  });

  useEffect(() => {
    if (!(agentDetail || payfricaAgentsDetail)) return;

    const {
      accountNumber,
      bank,
      name,
      maxDepositLimit,
      minDepositLimit,
      maxWithdrawLimit,
      minWithdrawLimit,
    } = agentDetail || {};

    const {
      accountBank: pAccountBank,
      accountName: pAccountName,
      accountNumber: pAccountNumber,
      minDepositLimit: pminDepositLimit,
      maxDepositLimit: pmaxDepositLimit,
      maxWithdrawLimit: pmaxWithdrawalLimit,
      minWithdrawLimit: pminWithdrawalLimit,
    } = payfricaAgentsDetail || {};

    setAgentAccount({
      ...agentAccount,
      bank: bank || pAccountBank || "",
      accountNumber: accountNumber || pAccountNumber || "",
      name: name || pAccountName || "",
      balance:
        Number(agentDetail?.balance || payfricaAgentsDetail?.baseBalance) /
        Math.pow(10, 6),
      suiBalance:
        Number(payfricaAgentsDetail?.suiCoinBalance || 0) / Math.pow(10, 6),
    });
    setLimits({
      ...limits,
      minDeposit: Number(minDepositLimit || pminDepositLimit) / Math.pow(10, 6),
      maxDeposit: Number(maxDepositLimit || pmaxDepositLimit) / Math.pow(10, 6),
      minWithdrawal:
        Number(minWithdrawLimit || pminWithdrawalLimit) / Math.pow(10, 6),
      maxWithdrawal:
        Number(maxWithdrawLimit || pmaxWithdrawalLimit) / Math.pow(10, 6),
    });
  }, [agentDetail?.id, isOpen, payfricaAgentsDetail?.id]);

  const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAgentAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleLimitChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLimits((prev) => ({ ...prev, [name]: value }));
  };

  const updateAgentAccount = async () => {
    startTransaction(true);
    try {
      await payfrica.updateAgentAccountDetails(agentDetail?.id!, {
        accountBank: agentAccount.bank!,
        accountName: agentAccount.name!,
        accountNumber: agentAccount.accountNumber!,
      });

      qc.invalidateQueries({ queryKey: ["agent-detail", agentDetail?.id] });
    } catch (error) {
      console.log(error);
    } finally {
      startTransaction(false);
    }
  };

  const updatePayfricaAgentAccount = async () => {
    startTransaction(true);
    try {
      await payfrica.updatePayfricaAgentAccountDetails(
        payfricaAgentsDetail?.id!,
        {
          accountBank: agentAccount.bank!,
          accountName: agentAccount.name!,
          accountNumber: agentAccount.accountNumber!,
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      startTransaction(false);
    }
  };

  const setWithdrawalAndDepositsLimits = async () => {
    startTransaction(true);
    try {
      const tx = new Transaction();

      if (
        Number(agentDetail?.maxDepositLimit) !== limits.maxDeposit ||
        Number(agentDetail?.minDepositLimit) !== limits.minDeposit
      ) {
        tx.moveCall({
          target: `${
            q.get("type") === "payfrica-lite"
              ? config.BRIDGE_PACKAGE_ID
              : config.PAYFRICA_PACKAGE_ID
          }::${
            q.get("type") === "payfrica-lite" ? "bridge_agents" : "agents"
          }::set_agent_deposit_limit`,
          arguments: [
            tx.object(
              q.get("type") === "payfrica-lite"
                ? config.BRIDGE_PUBLISHER_ID!
                : config.PUBLISHER
            ),
            tx.object(agentDetail?.id! || payfricaAgentsDetail?.id || ""),
            tx.pure.u64(limits.minDeposit * Math.pow(10, 6)),
            tx.pure.u64(limits.maxDeposit * Math.pow(10, 6)),
          ],
          typeArguments:
            q.get("type") === "payfrica-lite"
              ? [
                  payfricaAgentsDetail?.baseCoinType!,
                  payfricaAgentsDetail?.suiCoinType!,
                ]
              : [agentDetail?.coinType!],
        });
      }

      if (
        Number(agentDetail?.maxWithdrawLimit) !== limits.maxWithdrawal ||
        Number(agentDetail?.minWithdrawLimit) !== limits.minWithdrawal
      ) {
        tx.moveCall({
          target: `${
            q.get("type") === "payfrica-lite"
              ? config.BRIDGE_PACKAGE_ID
              : config.PAYFRICA_PACKAGE_ID
          }::${
            q.get("type") === "payfrica-lite" ? "bridge_agents" : "agents"
          }::set_agent_withdrawal_limit`,
          arguments: [
            tx.object(
              q.get("type") === "payfrica-lite"
                ? config.BRIDGE_PUBLISHER_ID!
                : config.PUBLISHER
            ),
            tx.object(agentDetail?.id! || payfricaAgentsDetail?.id || ""),
            tx.pure.u64(limits.minWithdrawal * Math.pow(10, 6)),
            tx.pure.u64(limits.maxWithdrawal * Math.pow(10, 6)),
          ],
          typeArguments:
            q.get("type") === "payfrica-lite"
              ? [
                  payfricaAgentsDetail?.baseCoinType!,
                  payfricaAgentsDetail?.suiCoinType!,
                ]
              : [agentDetail?.coinType!],
        });
      }

      const txResult = await wallet.signAndExecuteTransaction({
        transaction: tx!,
      });

      console.log(txResult);
    } catch (error) {
      console.log(error);
    } finally {
      startTransaction(false);
    }
  };

  const updateAgentDetails = (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="">Id</label>
        <Input
          value={agentDetail?.id || payfricaAgentsDetail?.id || ""}
          readOnly
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Address</label>
        <Input
          value={agentDetail?.addr || payfricaAgentsDetail?.addr || ""}
          readOnly
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Account Number</label>
        <Input
          name="accountNumber"
          onChange={handleChangeEvent}
          value={agentAccount?.accountNumber}
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Account Name</label>
        <Input
          name="name"
          onChange={handleChangeEvent}
          value={agentAccount?.name}
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Bank</label>
        <Input
          name="bank"
          onChange={handleChangeEvent}
          value={agentAccount.bank}
          className="h-11"
        />
      </div>
      {q.get("type") === "payfrica-lite" && (
        <Fragment>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Sui Coin Type</label>
            <Input value={payfricaAgentsDetail?.suiCoinType} readOnly />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="">Base Coin Type</label>
            <Input value={payfricaAgentsDetail?.baseCoinType} readOnly />
          </div>
        </Fragment>
      )}
    </div>
  );

  const setAgentLimit = (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="">Min Withdrawal</label>
        <Input
          name="minWithdrawal"
          value={limits.minWithdrawal}
          onChange={handleLimitChangeEvent}
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Max Withdrawal</label>
        <Input
          name="maxWithdrawal"
          value={limits.maxWithdrawal}
          onChange={handleLimitChangeEvent}
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Min Deposits</label>
        <Input
          onChange={handleLimitChangeEvent}
          value={limits.minDeposit}
          name="minDeposit"
          className="h-11"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Max Deposits</label>
        <Input
          value={limits.maxDeposit}
          onChange={handleLimitChangeEvent}
          name="maxDeposit"
          className="h-11"
        />
      </div>
    </div>
  );

  const addToAgentBalance = async () => {
    try {
      const tx = new Transaction();

      const willChange = q.get("type") === "payfrica-lite";

      if (agentAccount.balance > 0) {
        const clientRes = await payfrica.client.getCoins({
          owner,
          coinType:
            "0x" +
            (agentDetail?.coinType || payfricaAgentsDetail?.baseCoinType),
        });

        const mergeRes = payfrica.handleMergeSplit(
          tx,
          clientRes?.data,
          BigInt(agentAccount.balance * Math.pow(10, 6))
        );

        tx.moveCall({
          target: `${
            willChange ? config.BRIDGE_PACKAGE_ID : config.PAYFRICA_PACKAGE_ID
          }::${willChange ? "bridge_agents" : "agents"}::add_${
            willChange ? "agent_base_balance_admin" : "agent_balance_admin"
          }`,
          arguments: [
            tx.object(
              willChange ? config.BRIDGE_PUBLISHER_ID! : config.PUBLISHER
            ),
            tx.object(
              willChange ? config.BRIDGE_AGENT_ID : config.PAYFRICA_AGENT_ID
            ),
            tx.object(agentDetail?.id! || payfricaAgentsDetail?.id!),
            tx.object(mergeRes),
            tx.object("0x6"),
          ],
          typeArguments: willChange
            ? [
                "0x" + payfricaAgentsDetail?.baseCoinType!,
                "0x" + payfricaAgentsDetail?.suiCoinType!,
              ]
            : ["0x" + agentDetail?.coinType!],
        });
      }

      if (willChange && agentAccount?.suiBalance > 0) {
        const clientRes2 = await payfrica.client.getCoins({
          owner,
          coinType: "0x" + payfricaAgentsDetail?.suiCoinType,
        });

        const mergeRes2 = payfrica.handleMergeSplit(
          tx,
          clientRes2?.data,
          BigInt(agentAccount.suiBalance * Math.pow(10, 6))
        );

        tx.moveCall({
          target: `${config.BRIDGE_PACKAGE_ID}::bridge_agents::add_agent_sui_coin_balance_admin`,
          arguments: [
            tx.object(config.BRIDGE_PUBLISHER_ID!),
            tx.object(config.BRIDGE_AGENT_ID),
            tx.object(payfricaAgentsDetail?.id!),
            tx.object(mergeRes2),
            tx.object("0x6"),
          ],
          typeArguments: [
            "0x" + payfricaAgentsDetail?.baseCoinType!,
            "0x" + payfricaAgentsDetail?.suiCoinType!,
          ],
        });
      }

      const txResult = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });

      console.log(txResult);
    } catch (error) {
      console.log(error);
    }
  };

  const removeToAgentBalance = async () => {
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${config.PAYFRICA_PACKAGE_ID}::agents::withdraw_agent_balance_admin`,
        arguments: [
          tx.object(config.PUBLISHER),
          tx.object(config.PAYFRICA_AGENT_ID),
          tx.object(agentDetail?.id!),
          tx.pure.u64(agentAccount.balance * Math.pow(10, 6)),
          tx.object("0x6"),
        ],
        typeArguments: ["0x" + agentDetail?.coinType!],
      });

      const txResult = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });
      console.log(txResult);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Header
        balance={
          Number(agentDetail?.balance || payfricaAgentsDetail?.baseBalance) || 0
        }
        activeCards={[
          "balance",
          "total-transactions",
          "pending-transactions",
          "failed-transactions",
          "successful-transactions",
          "sui-token-balance",
        ]}
        showActiveAgents={false}
        transactions={{
          completed:
            Number(
              agentDetail?.totalSuccessfulWithdrawals ||
                payfricaAgentsDetail?.totalSuccessfulWithdrawals ||
                0
            ) +
            Number(
              agentDetail?.totalSuccessfulDeposits ||
                payfricaAgentsDetail?.totalSuccessfulDeposits ||
                0
            ),
          failed:
            Number(
              agentDetail?.totalUnsuccessfulDeposits ||
                payfricaAgentsDetail?.totalUnsuccessfulDeposits
            ) + 0,
          pending:
            Number(
              agentDetail?.totalPendingDeposits ||
                payfricaAgentsDetail?.totalPendingDeposits
            ) +
            Number(
              agentDetail?.totalPendingWithdrawals ||
                payfricaAgentsDetail?.totalPendingWithdrawals
            ),
        }}
        suiTokenBalance={
          Number(payfricaAgentsDetail?.suiCoinBalance || 0) / Math.pow(10, 6)
        }
        header={
          <Fragment>
            <div className="w-full flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard</h2>

              <div className="space-x-3">
                <Button
                  variant="destructive"
                  size="icon"
                  className="rounded-sm"
                >
                  <Ban />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" className="text-[#624BFF] rounded-sm">
                      <Plus />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Agent Balance</DialogTitle>
                      <DialogDescription>
                        Increment and Decrement agent balance
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center gap-1 w-full">
                      <label className="w-[85%]" htmlFor="">
                        Base Balance
                        <Input
                          value={agentAccount?.balance}
                          onChange={(e) => {
                            if (typeof Number(e) !== "number") return;

                            setAgentAccount({
                              ...agentAccount,
                              balance: Number(e.target.value),
                            });
                          }}
                        />
                      </label>
                      <div className="w-[15%] flex items-center gap-1 mt-6">
                        <Button
                          variant={
                            agentAccount?.type === "inc" ? "default" : "outline"
                          }
                          onClick={() =>
                            setAgentAccount({ ...agentAccount, type: "inc" })
                          }
                          size="icon"
                        >
                          <Plus />
                        </Button>
                        <Button
                          variant={
                            agentAccount?.type === "dec" ? "default" : "outline"
                          }
                          onClick={() =>
                            setAgentAccount({ ...agentAccount, type: "dec" })
                          }
                          size="icon"
                        >
                          <Minus />
                        </Button>
                      </div>
                    </div>
                    {q.get("type") === "payfrica-lite" && (
                      <div className="flex items-center gap-1 w-full">
                        <label className="w-[85%]" htmlFor="">
                          Sui Coin Balance
                          <Input
                            value={agentAccount?.suiBalance}
                            onChange={(e) => {
                              if (typeof Number(e) !== "number") return;

                              setAgentAccount({
                                ...agentAccount,
                                suiBalance: Number(e.target.value),
                              });
                            }}
                          />
                        </label>
                        <div className="w-[15%] flex items-center gap-1 mt-6">
                          <Button
                            variant={
                              agentAccount?.type2 === "inc"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setAgentAccount({ ...agentAccount, type2: "inc" })
                            }
                            size="icon"
                          >
                            <Plus />
                          </Button>
                          <Button
                            variant={
                              agentAccount?.type2 === "dec"
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              setAgentAccount({ ...agentAccount, type2: "dec" })
                            }
                            size="icon"
                          >
                            <Minus />
                          </Button>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                      <Button
                        onClick={() => {
                          if (agentAccount.type === "inc") {
                            addToAgentBalance();
                          } else {
                            removeToAgentBalance();
                          }
                        }}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button size="icon" className="text-[#624BFF] rounded-sm">
                      <Eye />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agent Details</DialogTitle>
                      <DialogDescription>
                        View and Update Agent Detail
                      </DialogDescription>
                    </DialogHeader>
                    <div>{updateAgentDetails}</div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                      <Button
                        onClick={() => {
                          if (q.get("type") === "payfrica-lite") {
                            updatePayfricaAgentAccount();
                          } else {
                            updateAgentAccount();
                          }
                        }}
                        disabled={isPending || isLoading}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="icon" className="text-[#624BFF] rounded-sm">
                      <Infinity />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Agent Limit</DialogTitle>
                    </DialogHeader>
                    <div>{setAgentLimit}</div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                      </DialogClose>
                      <Button
                        onClick={setWithdrawalAndDepositsLimits}
                        disabled={isPending || isLoading}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Fragment>
        }
      >
        <div className="w-full max-w-7xl mx-auto md:px-0 px-3 mt-10 space-y-10">
          <Card className="bg-accent-foreground rounded-sm text-accent">
            <CardHeader className="flex items-center flex-row justify-between">
              <CardTitle className="text-2xl">All Transactions</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
              {q.get("type") === "payfrica" && (
                <Table className="w-full">
                  <TableHeader className="w-full bg-gray-200">
                    <TableRow className="hover:bg-gray-200">
                      <TableHead className="text-accent">Time</TableHead>
                      <TableHead className="text-accent">ID</TableHead>
                      <TableHead className="text-accent">Amount</TableHead>
                      <TableHead className="text-accent">Type</TableHead>
                      <TableHead className="text-accent">Status</TableHead>
                      <TableHead className="text-accent">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <AgentTransaction key={transaction.id} {...transaction} />
                    ))}
                  </TableBody>
                </Table>
              )}
              {q.get("type") === "payfrica-lite" && (
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
                    {payfriaAgentTransactions.map((transaction) => (
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
                            ? transaction.inputAmount
                            : transaction.outputAmount}{" "}
                        </TableCell>

                        <TableCell className="font-medium">
                          {transaction.type === "deposit"
                            ? transaction.outputAmount
                            : transaction.inputAmount}{" "}
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
                        <TableCell>{transaction.status}</TableCell>
                        <TableCell className="font-medium">
                          {transaction.comment}{" "}
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

                        {/*<TableCell className="space-x-2 font-medium">
                          {transaction.status !== "PENDING" ? (
                            <p
                              className={cn(
                                "capitalize text-destructive font-bold",
                                transaction.status === "COMPLETED" &&
                                  "text-green-600",
                                transaction.status === "CANCELLED" &&
                                  "text-destructive"
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
                                  onClick={() =>
                                    approveOrDecline("cancel_deposits")
                                  }
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
                        </TableCell>*/}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </Header>
    </div>
  );
};

export default Page;
