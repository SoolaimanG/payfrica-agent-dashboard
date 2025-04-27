"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SavedAgents from "@/components/saved-agents";
import ProcessTransactionModal from "@/components/process-transaction-modal";
import { ITransactionStatus } from "@/types";
import DashboardHeader from "@/components/dashbaord-header";

export default function Page() {
  const [selectedWallet, setSelectedWallet] = useState("287z...91cmbhpej");
  const [transactionStatus, setTransactionStatus] =
    useState<ITransactionStatus>("pending");

  const onClick = () => {
    const options: ITransactionStatus[] = ["approved", "declined"];

    setTimeout(() => {
      setTransactionStatus(options[Math.floor(Math.random() + options.length)]);
    }, 2500);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <DashboardHeader title="Send to agent" />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3">Search</h2>
              <Input
                placeholder="To: Name, Agent ID"
                className="bg-[#24262b] h-14 rounded-lg"
              />
            </div>

            <SavedAgents
              selectedWallet={selectedWallet}
              setSelectedWallet={setSelectedWallet}
            />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3">Amount</h2>
              <div className="relative">
                <Input
                  className="bg-[#24262b] border-none text-white text-lg h-14 px-4"
                  defaultValue="0000000"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  Max
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-3">Select Token</h2>
              <div className="relative">
                <Input
                  className="bg-[#24262b] border-none text-white text-lg h-14 px-4"
                  defaultValue="0000000"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <ArrowLeft className="rotate-90 h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6 w-full">
          <ProcessTransactionModal
            onClick={onClick}
            transactionStatus={transactionStatus}
            setTransactionStatus={setTransactionStatus}
            //key={transactionStatus}
          >
            <Button className="w-full bg-[#5B42F3] hover:bg-[#4835c4] text-white font-semibold text-base py-6 h-auto">
              Send to agent
            </Button>
          </ProcessTransactionModal>
        </div>
      </main>
    </div>
  );
}
