import React, { FC, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const AddNewAgent: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogContent>
          <DialogHeader>
            <DialogTitle children="Add Wallet Address" />
          </DialogHeader>
          <div className="mt-3 space-y-2">
            <Label>Account Number</Label>
            <Input className="h-12" />
          </div>
          <div className="mt-3 space-y-2">
            <Label>Set Min Limit</Label>
            <Input className="h-12" />
          </div>
          <div className="mt-3 space-y-2">
            <Label>Set Max Limit</Label>
            <Input className="h-12" />
          </div>
          <DialogFooter>
            <Button className="h-12 bg-[#5B42F3] hover:bg-[#4835c4] text-white">
              Agent Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewAgent;
