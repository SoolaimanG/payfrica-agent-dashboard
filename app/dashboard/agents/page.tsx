import Image from "next/image";
import { ArrowLeft, Bell, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#1a1b1e] text-white">
      {/* Header */}
      <header className="bg-[#5B42F3] px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button className="p-2 rounded-full hover:bg-[#4835c4] transition">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-medium absolute left-1/2 transform -translate-x-1/2 md:static md:translate-x-0 md:text-2xl">
              Payfrica Agent
            </h1>
            <Button className="p-2 rounded-full hover:bg-[#4835c4] transition">
              <Bell className="w-6 h-6" />
            </Button>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-1">
              NGN 90,000
            </div>
            <div className="text-sm opacity-80">Available Balance</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/dashboard/withdraw" className="w-full">
            <Button className="bg-[#C1F8C7] hover:bg-[#a1ebaa] text-black font-semibold text-base py-6 rounded-full w-full cursor-pointer">
              Withdraw
            </Button>
          </Link>
          <Link href="/dashboard/send-to-agent" className="w-full">
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-white font-semibold text-base py-6 rounded-full w-full cursor-pointer"
            >
              Send To Agent
            </Button>
          </Link>
        </div>

        <div className="spca-y-6">
          <Card className="bg-[#24262b] border-none shadow-none">
            <CardContent className="p-4 md:p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-black p-3 rounded-full">
                  <ArrowDown className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Buys</div>
                  <div className="text-green-500 font-medium">$6210.19</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-black p-3 rounded-full">
                  <ArrowUp className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Sells</div>
                  <div className="text-red-500 font-medium">$2384.97</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Assets</h2>
            <div className="space-y-4">
              <AssetCard
                icon="/sui.png"
                name="Sui"
                symbol="SUI"
                amount="100 SUI"
                value="$13.38"
                change="+$0.33"
                positive={true}
              />
              <AssetCard
                icon="/naira.png"
                name="Naira"
                symbol="NGNc"
                amount="100,000 NGNc"
                value="$15.01"
                change="+$0.01"
                positive={true}
              />
              <AssetCard
                icon="/usd.png"
                name="USD Coin"
                symbol="USDC"
                amount="15 USDC"
                value="$15.01"
                change="+$0.01"
                positive={true}
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <div className="p-6 text-center text-gray-400">
              <p>Today</p>
              <p className="mt-4">No recent transactions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

interface AssetCardProps {
  icon: string;
  name: string;
  symbol: string;
  amount: string;
  value: string;
  change: string;
  positive: boolean;
}

function AssetCard({
  icon,
  name,
  symbol,
  amount,
  value,
  change,
  positive,
}: AssetCardProps) {
  return (
    <Card className="bg-[#24262b] border-none shadow-none">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
            {symbol === "SUI" && (
              <div className="bg-blue-500 rounded-full p-2">
                <Image
                  src={icon || "/placeholder.svg"}
                  alt={name}
                  width={30}
                  height={30}
                  className="object-cover"
                />
              </div>
            )}
            {symbol === "NGNc" && (
              <div className="bg-green-500 rounded-full p-2">
                <Image
                  src={icon || "/placeholder.svg"}
                  alt={name}
                  width={30}
                  height={30}
                  className="object-cover"
                />
              </div>
            )}
            {symbol === "USDC" && (
              <div className="bg-blue-500 rounded-full p-2">
                <Image
                  src={icon || "/placeholder.svg"}
                  alt={name}
                  width={30}
                  height={30}
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-gray-400 text-sm">{amount}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">{value}</div>
          <div
            className={`text-sm ${
              positive ? "text-green-500" : "text-red-500"
            }`}
          >
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
