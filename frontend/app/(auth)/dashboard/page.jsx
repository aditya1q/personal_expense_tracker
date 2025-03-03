import React from 'react';
import DashboardAreaChart from '@/components/charts/AreaChart';
import Card from '@/components/main/Card';
import DataTable from '@/components/main/DataTable';

const Dashboard = () => {
  const cardData = [
    { title: 'Total Balance', value: 24242 },
    { title: 'Monthly Spending', value: 343545 },
    { title: 'Monthly Savings', value: 64333 },
    { title: 'Monthly Income', value: 34433 },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-6 w-full font-[family-name:var(--font-geist-sans)] p-4">
      {/* <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1> */}
      <div className="flex gap-5 w-full">
        {cardData?.map((card, index) => (
          <Card key={index} title={card.title} value={card?.value.toLocaleString('en-IN')} />
        ))}
      </div>
      <DashboardAreaChart />
      <DataTable title='Recent Transactions' height='465px' limit={5}/>
    </div>
  );
};

export default Dashboard;