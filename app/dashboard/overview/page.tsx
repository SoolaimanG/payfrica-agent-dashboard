"use client";

import Agent from "@/components/agent";
import { AgentTransaction } from "@/components/agent-transaction";
import { DashboradNavBar } from "@/components/dashboard-navbar";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isAdmin, payfrica } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Fragment } from "react";

const Page = () => {
  const { address, connecting } = useWallet();

  const { data: transactions = [] } = useQuery({
    queryKey: ["all-transactions", address],
    queryFn: () => payfrica.getAllTransactions(address!),
    enabled: Boolean(address && !connecting),
    refetchInterval: 5000,
  });

  const { data } = useQuery({
    queryKey: ["agents"],
    queryFn: () => payfrica.getAgentsDetails(address!),
    enabled: Boolean(address && !connecting),
  });

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["all-agents"],
    queryFn: () => payfrica.getAllAgents(),
    enabled: isAdmin("2"),
  });

  console.log({ agents, isLoading });

  const totalPendingTransactions = transactions.filter(
    (transaction) => transaction.status === "PENDING"
  );

  const completedTransactions = transactions.filter(
    (transaction) => transaction.status === "COMPLETED"
  );

  const q = useSearchParams();

  const agentId = q.get("agent");

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
                <Link href="/dashboard/transactions">
                  <Button className="text-[#624BFF] rounded-sm">
                    View All Transactions
                  </Button>
                </Link>
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

          {(isAdmin(address) || !!agentId) && (
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

export default Page;
