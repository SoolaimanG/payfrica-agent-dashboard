import React, { Dispatch, FC, SetStateAction } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import AddWalletAddress from "./add-wallet-address";

const SavedAgents: FC<{
  selectedWallet: string;
  setSelectedWallet: Dispatch<SetStateAction<string>>;
}> = ({ selectedWallet, setSelectedWallet }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Saved Wallets</h2>
      <div className="space-y-3">
        <AddWalletAddress>
          <Card className="bg-sidebar border-none shadow-none">
            <CardContent className="p-3 flex items-center">
              <Button className="h-10 w-10 rounded-full">
                <Plus className="h-5 w-5" />
              </Button>
              <span className="ml-3 font-medium">Add Wallet</span>
            </CardContent>
          </Card>
        </AddWalletAddress>

        <Card
          className={`${
            selectedWallet === "287z...91cmbhpej"
              ? "bg-sidebar"
              : "bg-sidebar/90"
          } border-none shadow-none cursor-pointer hover:bg-sidebar/85 transition`}
          onClick={() => setSelectedWallet("287z...91cmbhpej")}
        >
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 bg-blue-500 text-white">
                <AvatarImage src="/profile-1.png" />
                <AvatarFallback>SU</AvatarFallback>
              </Avatar>
              <span className="ml-3 font-medium">287z...91cmbhpej</span>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-gray-300">Sui Wallet</span>
              {selectedWallet === "287z...91cmbhpej" && (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${
            selectedWallet === "287z...91cmbhpej"
              ? "bg-sidebar"
              : "bg-sidebar/90"
          } border-none shadow-none cursor-pointer hover:bg-sidebar/85 transition`}
          onClick={() => setSelectedWallet("f3rh...frw88ifcl")}
        >
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 bg-purple-500 text-white">
                <AvatarImage src="/profile-2.png" />
                <AvatarFallback>NI</AvatarFallback>
              </Avatar>
              <span className="ml-3 font-medium">f3rh...frw88ifcl</span>
            </div>
            <div className="flex items-center">
              <span className="mr-3 text-gray-300">Nightly</span>
              {selectedWallet === "f3rh...frw88ifcl" && (
                <Check className="h-5 w-5 text-green-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SavedAgents;
