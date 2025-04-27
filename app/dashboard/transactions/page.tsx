import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/dashbaord-header";

export default function TransactionHistoryPage() {
  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <DashboardHeader title="Transaction History" />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center md:text-left mb-6">
            Recent Activity
          </h2>

          <Tabs
            defaultValue="all"
            className="w-full md:max-w-xs mb-6 hidden md:block"
          >
            <TabsList className="grid grid-cols-4 bg-sidebar">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="buys">Buys</TabsTrigger>
              <TabsTrigger value="sells">Sells</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid md:grid-cols-[1fr_auto] gap-4 md:gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-3">Today</h3>
                <div className="space-y-3">
                  <TransactionCard
                    id="cb930c05399f1043"
                    type="Buy Sui"
                    amount="+$142.83"
                    time="4:23 AM"
                    positive={true}
                  />
                  <TransactionCard
                    id="7669bd7d66faa576435"
                    type="Buy Sui"
                    amount="+$142.83"
                    time="4:23 AM"
                    positive={true}
                  />
                  <TransactionCard
                    id="86894e0eccef165d8"
                    type="Sell Sui"
                    amount="-$142.83"
                    time="4:23 AM"
                    positive={false}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-3">Yesterday</h3>
                <div className="space-y-3">
                  <TransactionCard
                    id="0x339ak4933"
                    type="Buy Sui"
                    amount="+$142.83"
                    time="4:23 AM"
                    positive={true}
                  />
                  <TransactionCard
                    id="0x339ak4933"
                    type="Buy Sui"
                    amount="+$142.83"
                    time="4:23 AM"
                    positive={true}
                  />
                  <TransactionCard
                    id="0x339ak4933"
                    type="Sell Sui"
                    amount="-$142.83"
                    time="4:23 AM"
                    positive={false}
                  />
                  <TransactionCard
                    id="0x339ak4933"
                    type="Sell Sui"
                    amount="-$142.83"
                    time="4:23 AM"
                    positive={false}
                  />
                  <TransactionCard
                    id="0x339ak4933"
                    type="Sell Sui"
                    amount="-$142.83"
                    time="4:23 AM"
                    positive={false}
                  />
                </div>
              </div>
            </div>

            <div className="hidden md:block w-80 lg:w-96">
              <div className="bg-sidebar rounded-lg p-6 sticky top-24">
                <h3 className="text-xl font-medium mb-4">
                  Transaction Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Buys</span>
                    <span className="font-medium text-green-500">+$714.15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Sells</span>
                    <span className="font-medium text-red-500">-$714.15</span>
                  </div>
                  <div className="border-t border-gray-700 my-2 pt-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Net Change</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Transaction Count</span>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface TransactionCardProps {
  id: string;
  type: string;
  amount: string;
  time: string;
  positive: boolean;
}

function TransactionCard({
  id,
  type,
  amount,
  time,
  positive,
}: TransactionCardProps) {
  return (
    <Card className="bg-sidebar border-none shadow-none hover:bg-[#2a2d35] transition cursor-pointer">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-blue-500 flex items-center justify-center">
            <AvatarImage src="/sui.png" />
          </Avatar>
          <div>
            <div className="font-medium text-gray-300 text-sm md:text-base">
              {id}
            </div>
            <div className="text-gray-400 text-sm">{type}</div>
          </div>
        </div>
        <div className="text-right">
          <div
            className={`font-medium ${
              positive ? "text-green-500" : "text-red-500"
            }`}
          >
            {amount}
          </div>
          <div className="text-gray-400 text-sm">{time}</div>
        </div>
      </CardContent>
    </Card>
  );
}
