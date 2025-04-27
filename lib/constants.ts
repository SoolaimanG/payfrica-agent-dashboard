import { IAgent, ITransaction } from "@/types";

const allAgents: IAgent[] = [
  {
    time: "09:00am",
    name: "John Doe",
    token: "30 SUI",
    agent: "Agent 404",
    status: "active",
    actions: ["delete", "deactivate"],
  },
  {
    time: "10:30am",
    name: "Jane Smith",
    token: "50 SUI",
    agent: "Agent 505",
    status: "inactive",
    actions: ["activate", "delete"],
  },
  {
    time: "12:00pm",
    name: "Mike Johnson",
    token: "20 SUI",
    agent: "Agent 606",
    status: "active",
    actions: ["delete", "deactivate"],
  },
  {
    time: "01:45pm",
    name: "Emily Clark",
    token: "40 SUI",
    agent: "Agent 707",
    status: "suspended",
    actions: ["reactivate", "delete"],
  },
];

const allTransactions: ITransaction[] = [
  {
    id: "txn_001",
    time: "09:30am",
    amount: 25,
    agent: "Agent 101",
    status: "pending",
    actions: ["approve", "decline"],
    isApprove: false,
  },
  {
    id: "txn_002",
    time: "10:15am",
    amount: 45,
    agent: "Agent 202",
    status: "approved",
    actions: ["approve", "decline"],
    isApprove: false,
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
  },
];

export { allTransactions, allAgents };
