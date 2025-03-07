'use client'; // it should be client component because we are using recharts here and Libraries like recharts rely on browser APIs, which require client-side rendering only.

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ExpenseBarChart = ({ data }) => {
  return (
    <div className="w-full h-64">
      <h2 className="text-[15px] font-semibold mb-2">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="date" stroke="#ffffff" tick={{ fontSize: '11px' }} />
          <YAxis stroke="#ffffff" tick={{ fontSize: '11px' }} />
          <Tooltip
            cursor={{ fill: "#2c2c2c" }}
            contentStyle={{ background: "#1a1a1a", border: "none" }}
            itemStyle={{ color: '#fff' }}
            formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
          />

          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.amount > 600 ? "#22C55E" : "#4F46E5"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBarChart;
