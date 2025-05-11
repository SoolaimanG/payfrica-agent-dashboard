import { ITransaction } from "@/types";

const allTransactions: ITransaction[] = [
  {
    id: "txn_001",
    time: "09:30am",
    amount: 25,
    agent: "Agent 101",
    status: "pending",
    actions: ["approve", "decline"],
    isApprove: false,
    outputAmount: 0,
  },
  {
    id: "txn_002",
    time: "10:15am",
    amount: 45,
    agent: "Agent 202",
    status: "approved",
    actions: ["approve", "decline"],
    isApprove: false,
    outputAmount: 0,
  },
  {
    id: "txn_003",
    time: "11:00am",
    amount: 60,
    agent: "Agent 303",
    status: "declined",
    actions: ["approve", "decline"],
    isApprove: false,
  },
  {
    id: "txn_004",
    time: "12:45pm",
    amount: 35,
    agent: "Agent 404",
    status: "pending",
    actions: ["approve", "decline"],
    isApprove: true,
    outputAmount: 0,
  },
  {
    id: "txn_005",
    time: "01:20pm",
    amount: 50,
    agent: "Agent 505",
    status: "approved",
    actions: ["approve", "decline"],
    isApprove: true,
  },
  {
    id: "txn_006",
    time: "02:10pm",
    amount: 75,
    agent: "Agent 606",
    status: "pending",
    actions: ["approve", "decline"],
    isApprove: true,
    outputAmount: 0,
  },
];

const AGENTID =
  "0x16526f26f4117e2f075960edadd9d744b07390af5451a640319a3ba04f09b79a";

export { allTransactions, AGENTID };
