import React, { FC, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const AddWalletAddress: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Wallet Address</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-5">
          <Label>Input Wallet Address</Label>
          <Input className="h-12" />
        </div>
        <div className="mt-3 space-y-2">
          <Label>Input Wallet Address</Label>
          <Input className="h-12" />
        </div>
        <DialogFooter>
          <Button className="h-12 bg-[#5B42F3] hover:bg-[#4835c4] text-white">
            Save Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWalletAddress;
