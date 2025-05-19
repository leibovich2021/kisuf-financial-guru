
import { Transaction, Category, Budget } from "../types";

export const categories: Category[] = [
  { id: "1", name: "משכורת", type: "income" },
  { id: "2", name: "מתנות", type: "income" },
  { id: "3", name: "השקעות", type: "income" },
  { id: "4", name: "אחר", type: "income" },
  { id: "5", name: "מזון", type: "expense" },
  { id: "6", name: "תחבורה", type: "expense" },
  { id: "7", name: "בידור", type: "expense" },
  { id: "8", name: "קניות", type: "expense" },
  { id: "9", name: "חשבונות", type: "expense" },
  { id: "10", name: "דיור", type: "expense" },
  { id: "11", name: "בריאות", type: "expense" },
  { id: "12", name: "חינוך", type: "expense" },
  { id: "13", name: "אחר", type: "expense" }
];

export const transactions: Transaction[] = [
  {
    id: "1",
    amount: 10000,
    category: "1",
    description: "משכורת חודשית",
    date: "2025-05-01",
    type: "income",
    paymentMethod: "bankTransfer"
  },
  {
    id: "2",
    amount: 150,
    category: "5",
    description: "סופרמרקט",
    date: "2025-05-05",
    type: "expense",
    paymentMethod: "credit"
  },
  {
    id: "3",
    amount: 200,
    category: "6",
    description: "דלק",
    date: "2025-05-06",
    type: "expense",
    paymentMethod: "credit"
  },
  {
    id: "4",
    amount: 500,
    category: "9",
    description: "חשמל",
    date: "2025-05-10",
    type: "expense",
    paymentMethod: "bankTransfer"
  },
  {
    id: "5",
    amount: 100,
    category: "7",
    description: "סרט",
    date: "2025-05-15",
    type: "expense",
    paymentMethod: "cash"
  },
  {
    id: "6",
    amount: 2500,
    category: "10",
    description: "שכירות",
    date: "2025-05-01",
    type: "expense",
    paymentMethod: "bankTransfer"
  },
  {
    id: "7",
    amount: 1000,
    category: "2",
    description: "מתנה מההורים",
    date: "2025-05-20",
    type: "income",
    paymentMethod: "bankTransfer"
  },
  {
    id: "8",
    amount: 300,
    category: "8",
    description: "בגדים",
    date: "2025-05-22",
    type: "expense",
    paymentMethod: "credit"
  }
];

export const budgets: Budget[] = [
  {
    id: "1",
    category: "5",
    amount: 2000,
    spent: 150,
    period: "monthly"
  },
  {
    id: "2",
    category: "6",
    amount: 800,
    spent: 200,
    period: "monthly"
  },
  {
    id: "3",
    category: "7",
    amount: 500,
    spent: 100,
    period: "monthly"
  },
  {
    id: "4",
    category: "8",
    amount: 1000,
    spent: 300,
    period: "monthly"
  },
  {
    id: "5",
    category: "9",
    amount: 1500,
    spent: 500,
    period: "monthly"
  }
];
