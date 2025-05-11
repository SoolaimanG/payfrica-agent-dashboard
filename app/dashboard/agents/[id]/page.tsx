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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { config, payfrica } from "@/lib/utils";
import { Transaction } from "@mysten/sui/transactions";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Ban, Eye, Minus, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams() as { id: string };
  const [isOpen, setIsOpen] = useState(false);
  const qc = useQueryClient();
  const [isPending, startTransaction] = useState(false);
  const { address: owner = "", ...wallet } = useWallet();
  const { isLoading, data: transactions = [] } = useQuery({
    queryKey: ["get-agent-transactions", id],
    queryFn: () => payfrica.getAllTransactions(id),
  });

  const { data: agentDetail } = useQuery({
    queryKey: ["agent-detail", id],
    queryFn: () => payfrica.getAgentsDetails(id),
  });

  const [agentAccount, setAgentAccount] = useState({
    accountNumber: "",
    name: "",
    bank: "",
    balance: 0,
    type: "inc",
  });

  useEffect(() => {
    if (!agentDetail) return;

    const { accountNumber, bank, name } = agentDetail;

    setAgentAccount({ ...agentAccount, bank, accountNumber, name });
  }, [agentDetail, isOpen]);

  const handleChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setAgentAccount((prev) => ({ ...prev, [name]: value }));
  };

  const updateAgentAccount = async () => {
    startTransaction(true);
    try {
      await payfrica.updateAgentAccountDetails(agentDetail?.id!, {
        accountBank: agentAccount.bank,
        accountName: agentAccount.name,
        accountNumber: agentAccount.accountNumber,
      });

      qc.invalidateQueries({ queryKey: ["agent-detail", id] });
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
        <Input readOnly value={agentDetail?.id} className="h-11" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="">Address</label>
        <Input readOnly value={agentDetail?.addr} className="h-11" />
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
    </div>
  );

  const addToAgentBalance = async () => {
    try {
      const tx = new Transaction();

      const clientRes = await payfrica.client.getCoins({
        owner,
        coinType: "0x" + agentDetail?.coinType,
      });

      const mergeRes = payfrica.handleMergeSplit(
        tx,
        clientRes?.data,
        BigInt(agentAccount.balance * Math.pow(10, 6))
      );

      tx.moveCall({
        target: `${config.PAYFRICA_PACKAGE_ID}::agents::add_agent_balance_admin`,
        arguments: [
          tx.object(config.PUBLISHER),
          tx.object(config.PAYFRICA_AGENT_ID),
          tx.object(agentDetail?.id!),
          tx.object(mergeRes),
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
        balance={Number(agentDetail?.balance) || 0}
        activeCards={[
          "balance",
          "total-transactions",
          "pending-transactions",
          "failed-transactions",
          "successful-transactions",
        ]}
        showActiveAgents={false}
        transactions={{
          completed:
            Number(agentDetail?.totalSuccessfulWithdrawals || 0) +
            Number(agentDetail?.totalSuccessfulDeposits || 0),
          failed: Number(agentDetail?.totalUnsuccessfulDeposits) + 0,
          pending:
            Number(agentDetail?.totalPendingDeposits) +
            Number(agentDetail?.totalPendingWithdrawals),
        }}
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
                      <div className="w-[15%] flex items-center gap-1">
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
                        onClick={updateAgentAccount}
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
            </CardContent>
          </Card>
        </div>
      </Header>
    </div>
  );
};

export default Page;
