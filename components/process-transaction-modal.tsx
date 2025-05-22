import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle, CheckCircle2Icon, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { ITransactionStatus } from "@/types";

const ProcessTransactionModal: FC<{
  children: ReactNode;
  onClick: () => void;
  title?: string;
  transactionStatus?: ITransactionStatus;
  setTransactionStatus: Dispatch<SetStateAction<ITransactionStatus>>;
}> = ({ transactionStatus = "pending", ...props }) => {
  const [open, setOpen] = useState(false);

  const pending = (
    <div className="w-full flex items-center flex-col justify-center gap-5">
      <Loader2 size={120} className="animate-spin" />
      <div>
        <h2 className="text-3xl font-semibold">Confirming Transaction</h2>
        <p className="text-center mt-2 text-gray-300">Withdrawing</p>
      </div>
      <Separator />
      <Link href="/">View In Explorer</Link>
    </div>
  );

  const approved = (
    <div className="w-full flex items-center flex-col justify-center gap-5">
      <CheckCircle2Icon size={120} />
      <div>
        <h2 className="text-3xl font-semibold">Approved</h2>
        <p className="text-center mt-2 text-gray-300">Withdraw Successful</p>
      </div>
      <Separator />
      <Link href="/">View In Explorer</Link>
    </div>
  );

  const declined = (
    <div className="w-full flex items-center flex-col justify-center gap-5">
      <AlertTriangle size={120} className="text-destructive" />
      <div>
        <h2 className="text-3xl font-semibold text-center">Declined</h2>
        <p className="text-center mt-2 text-gray-300">Something went wrong</p>
      </div>
      <Separator />
      <Link href="/">Contact Support</Link>
    </div>
  );

  //@ts-ignore
  const views: Record<ITransactionStatus, any> = {
    approved,
    pending,
    declined,
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);

        if (e) {
          props.onClick();
        } else {
          props.setTransactionStatus("pending");
        }
      }}
    >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogTitle />
        {views[transactionStatus]}
        <DialogFooter>
          <DialogClose asChild className="w-full">
            <Button className="w-full">
              {transactionStatus === "approved" ? "Check Wallet" : "Close"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessTransactionModal;
