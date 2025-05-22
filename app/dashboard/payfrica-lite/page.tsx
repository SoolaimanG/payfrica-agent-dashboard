"use client";

import AgentConfig from "@/components/agent-config";
import { DashboradNavBar } from "@/components/dashboard-navbar";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { config, isAdmin, payfrica, splitTokenString } from "@/lib/utils";
import { useWallet } from "@suiet/wallet-kit";
import { useQuery } from "@tanstack/react-query";
import React, { Fragment, useEffect, useState } from "react";
import { Transaction as Trans } from "@mysten/sui/transactions";
import { AddAgent } from "@/components/add-agent";

const Page = () => {
  const { address = "", signAndExecuteTransaction } = useWallet();
  const [agentTypes, setAgentTypes] = useState<
    { fullType: string; shortName: string }[]
  >([]);
  const [fullCoinType, setFullCoinType] = useState("");
  const [isPending, startTransaction] = useState(false);
  const [addr, setAddr] = useState("");

  const {} = useQuery({
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

          {/*<Card className="bg-accent-foreground rounded-sm text-accent">
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
                    {false && (
                      <TableHead className="text-accent">Agent</TableHead>
                    )}
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
          </Card>*/}
        </div>
      </Header>
    </div>
  );
};

export default Page;
