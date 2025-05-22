"use client";

import React, { FC, ReactNode, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface AddAgentProps {
  children: ReactNode;
  agentTypes: { fullType: string; shortName: string }[];
  onSave: () => void;
  isPending: boolean;
  setAddr: React.Dispatch<React.SetStateAction<string>>;
  setFullCoinType: React.Dispatch<React.SetStateAction<string>>;
  fullCoinType: string;
  addr: string;
}

export const AddAgent: FC<AddAgentProps> = ({
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
