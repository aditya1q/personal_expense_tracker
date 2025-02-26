import DashboardAreaChart from '@/components/charts/AreaChart';
import Card from '@/components/main/Card';
import DataTable from '@/components/main/DataTable';
import React from 'react';

const Dashboard = () => {
  const cardData = [
    { title: 'Total Balance', value: 24242 },
    { title: 'Total Income', value: 343545 },
    { title: 'Total Expense', value: 34433 },
  ];

  return (
    <main className="min-h-screen flex flex-col gap-6 w-full font-[family-name:var(--font-geist-sans)] p-4">
      {/* <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1> */}
      <div className="flex gap-5 w-full">
        {cardData?.map((card, index) => (
          <Card key={index} title={card.title} value={card?.value.toLocaleString('en-IN')} />
        ))}
      </div>
      <DashboardAreaChart />
      <DataTable />
    </main>
  );
};

export default Dashboard;