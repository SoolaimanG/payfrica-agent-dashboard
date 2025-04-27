import Agent from "@/components/agent";
import { DashboradNavBar } from "@/components/dashboard-navbar";
import Header from "@/components/header";
import Transaction from "@/components/transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { allAgents, allTransactions } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { Fragment } from "react";

const Page = () => {
  return (
    <div className="w-full">
      <DashboradNavBar />
      {/* This is the header of the dashboard */}
      <Header
        header={
          <Fragment>
            <div className="w-full flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <Link href="/dashboard/transactions">
                <Button className="text-[#624BFF] rounded-sm">
                  View All Transactions
                </Button>
              </Link>
            </div>
          </Fragment>
        }
      >
        <div className="w-full max-w-7xl mx-auto md:px-0 px-3 mt-10 space-y-10">
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
                    <TableHead className="text-accent">Token</TableHead>
                    <TableHead className="text-accent">Agent</TableHead>
                    <TableHead className="text-accent">Status</TableHead>
                    <TableHead className="text-accent">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAgents.map((agent, idx) => (
                    <Agent key={idx} {...agent} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

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
                    <TableHead className="text-accent">Agent</TableHead>
                    <TableHead className="text-accent">Status</TableHead>
                    <TableHead className="text-accent">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allTransactions.map((transaction) => (
                    <Transaction key={transaction.id} {...transaction} />
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
