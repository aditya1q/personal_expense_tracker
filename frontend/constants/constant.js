import { LayoutDashboard, Wallet, PieChart, Settings } from "lucide-react";

export const MenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Expenses",
    url: "/expanses",
    icon: Wallet,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: PieChart,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export const Expense_List = Array.from({ length: 100 }, (_, index) => ({
  Date: `2025-02-${String((index % 28) + 1).padStart(2, "0")}`,
  Description: `Expense ${index + 1} - ${["Groceries", "Rent", "Utilities", "Entertainment", "Transport"][index % 5]}`,
  Category: ["Groceries", "Housing", "Utilities", "Entertainment", "Transport"][index % 5],
  Amount: (Math.random() * 500 + 10).toFixed(2),
  Payment: ["Cash", "Credit Card", "Debit Card", "Bank Transfer"][index % 4],
}));

export const headers = [
  { id: "Date", label: "Date", width: "20%" },
  { id: "Description", label: "Description", width: "30%" },
  { id: "Category", label: "Category", width: "20%" },
  { id: "Amount", label: "Amount ($)", width: "15%" },
  { id: "Payment", label: "Payment Method", width: "15%" },
];