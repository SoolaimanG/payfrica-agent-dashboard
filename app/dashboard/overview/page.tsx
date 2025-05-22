"use client";

import Agent from "@/components/agent";
import { AgentTransaction } from "@/components/agent-transaction";
import { DashboradNavBar } from "@/components/dashboard-navbar";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { config, isAdmin, payfrica } from "@/lib/utils";
import { Transaction } from "@mysten/sui/transactions";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import React, { FC, Fragment, ReactNode, useEffect, useState } from "react";

const Page = () => {
  const { address, connecting, signAndExecuteTransaction } = useWallet();
  const [isPending, startTransaction] = useState(false);
  const [addr, setAddr] = useState("");
  const [fullCoinType, setFullCoinType] = useState("");
  const [agentTypes, setAgentTypes] = useState<
    { fullType: string; shortName: string }[]
  >([]);

  const { data: transactions = [] } = useQuery({
    queryKey: ["all-transactions", address],
    queryFn: () => payfrica.getAllTransactions(address!),
    enabled: Boolean(address && !connecting && !isAdmin(address)),
    refetchInterval: 5000,
  });

  const { data } = useQuery({
    queryKey: ["agents"],
    queryFn: () => payfrica.getAgentsDetails(address!),
    enabled: Boolean(address && !connecting && !isAdmin(address)),
  });

  const { data: agents = [] } = useQuery({
    queryKey: ["all-agents"],
    queryFn: () => payfrica.getAllAgents(),
    enabled: isAdmin(address),
  });

  const totalPendingTransactions = transactions.filter(
    (transaction) => transaction.status === "PENDING"
  );

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "COMPLETED"
  );

  const { data: _agentTypes = [] } = useQuery({
    queryKey: ["valid-agent-types"],
    queryFn: () => payfrica.getValidAgentTypes(),
  });

  useEffect(() => {
    if (!_agentTypes?.length) return;

    setAgentTypes([]);

    _agentTypes.forEach((agentType) => {
      setAgentTypes((prev) => [
        ...prev,
        { fullType: agentType.fullType, shortName: agentType.shortName },
      ]);
    });
  }, [_agentTypes]);

  const addAgent = async () => {
    try {
      startTransaction(true);
      const tx = new Transaction();
      tx.moveCall({
        target: `${config.PAYFRICA_PACKAGE_ID}::agents::create_agent`,
        arguments: [
          tx.object(config.PUBLISHER),
          tx.object(config.PAYFRICA_AGENT_ID),
          tx.pure.address(addr),
        ],
        typeArguments: [fullCoinType],
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

  return (
    <div className="w-full">
      <DashboradNavBar />
      {/* This is the header of the dashboard */}
      <Header
        currency={data?.coinType?.split("::").pop()}
        balance={Number(data?.balance) || 0}
        transactions={{
          pending: totalPendingTransactions?.length || 0,
          completed: completedTransactions?.length || 0,
        }}
        header={
          <Fragment>
            <div className="w-full flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              {isAdmin(address) && (
                <AddAgent
                  fullCoinType={fullCoinType}
                  setFullCoinType={setFullCoinType}
                  addr={addr}
                  setAddr={setAddr}
                  isPending={isPending}
                  onSave={addAgent}
                  agentTypes={agentTypes}
                >
                  <Button className="text-[#624BFF] rounded-sm">
                    Add Agent
                  </Button>
                </AddAgent>
              )}
            </div>
          </Fragment>
        }
      >
        <div className="w-full max-w-7xl mx-auto md:px-0 px-3 mt-10 space-y-10">
          {isAdmin(address) && (
            <Card className="bg-accent-foreground rounded-sm text-accent">
              <CardHeader className="flex items-center flex-row justify-between">
                <CardTitle className="text-2xl">Agents</CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <Table className="w-full">
                  <TableHeader className="w-full bg-gray-200">
                    <TableRow className="hover:bg-gray-200">
                      <TableHead className="text-accent">Time</TableHead>
                      <TableHead className="text-accent">Name</TableHead>
                      <TableHead className="text-accent">Address</TableHead>

                      <TableHead className="text-accent">Token</TableHead>
                      <TableHead className="text-accent">Agent</TableHead>
                      <TableHead className="text-accent">Status</TableHead>
                      <TableHead className="text-accent">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agents.map((agent, idx) => (
                      <Agent key={idx} {...agent} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {!isAdmin(address) && (
            <Card className="bg-accent-foreground rounded-sm text-accent">
              <CardHeader className="flex items-center flex-row justify-between">
                <CardTitle className="text-2xl">All Transactions</CardTitle>
                <Input
                  className="w-[35%] border-accent/30"
                  placeholder="Search transaction"
                />
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
          )}
        </div>
      </Header>
    </div>
  );
};

export const AddAgent: FC<{
  children: ReactNode;
  agentTypes: { fullType: string; shortName: string }[];
  onSave: () => void;
  isPending: boolean;
  setAddr: React.Dispatch<React.SetStateAction<string>>;
  setFullCoinType: React.Dispatch<React.SetStateAction<string>>;
  fullCoinType: string;
  addr: string;
}> = ({
  children,
  agentTypes,
  onSave,
  isPending,
  addr,
  setAddr,
  setFullCoinType,
  fullCoinType,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Agent</DialogTitle>
        </DialogHeader>
        <div>
          <form action="" className="flex flex-col gap-2">
            <label className="space-y-1" htmlFor="">
              Address
              <Input value={addr} onChange={(e) => setAddr(e.target.value)} />
            </label>
            <label className="space-y-1" htmlFor="">
              Agent Type
              <Select
                value={fullCoinType}
                onValueChange={(e) => setFullCoinType(e)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Agent Type" />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes?.map((agentType, idx) => (
                    <SelectItem key={idx} value={agentType.fullType}>
                      {agentType.shortName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isPending} onClick={onSave} size="lg">
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Page;
