"use client";

import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const barChartData = {
  2023: [
    { name: "Jan", value: 300 },
    { name: "Feb", value: 450 },
    { name: "Mar", value: 600 },
    { name: "Apr", value: 800 },
    { name: "May", value: 950 },
    { name: "June", value: 950 },
    { name: "July", value: 950 },
    { name: "Aug", value: 950 },
  ],
  2024: [
    { name: "Jan", value: 500 },
    { name: "Feb", value: 700 },
    { name: "Mar", value: 300 },
    { name: "Apr", value: 900 },
    { name: "June", value: 650 },
    { name: "July", value: 650 },
    { name: "Aug", value: 650 },
  ],
};

const ExpenseBarChart = () => {
  const [selectedYear, setSelectedYear] = useState("2024");

  return (
    <>
      {/* Bar Chart with Dropdown */}
      <div className="w-full h-64">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[15px] font-semibold">Monthly Expenses</h2>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(barChartData).map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barChartData[selectedYear]}>
            <XAxis dataKey="name" stroke="#ffffff" tick={{ fontSize: '11px' }} />
            <YAxis stroke="#ffffff" tick={{ fontSize: '11px' }} />
            <Tooltip cursor={{ fill: "#2c2c2c" }} contentStyle={{ background: "#1a1a1a", border: "none" }} />
            <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]}>
              {barChartData[selectedYear].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.value > 600 ? "#22C55E" : "#4F46E5"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </>
  );
};

export default ExpenseBarChart;
