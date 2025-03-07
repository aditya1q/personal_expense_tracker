import DashboardAreaChart from '@/components/charts/AreaChart';
import Card from '@/components/main/Card';
import DataTable from '@/components/main/DataTable';
import { fetchCardData, fetchExpenseOverview, fetchTransactionData } from '@/app/api';
import { Suspense } from 'react';
import { groupByDate } from '@/utils/groupByDate';

export const dynamic = 'force-dynamic';

const Dashboard = async () => {
  let cardData, chartData, transactionData;
  try {
    [cardData, chartData, transactionData] = await Promise.all([
      fetchCardData(),
      fetchExpenseOverview(),
      fetchTransactionData(),
    ]);
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    cardData = { total_savings: 0, total_expense: 0, monthly_expense: 0, monthly_savings: 0, monthly_income: 0 };
    chartData = [];
    transactionData = [];
  }

  const cardList = [
    { title: 'Total Savings', value: cardData.total_savings },
    { title: 'Total Expenses', value: cardData.total_expense },
    { title: 'Monthly Spending', value: cardData.monthly_expense },
    { title: 'Monthly Savings', value: cardData.monthly_savings },
    { title: 'Monthly Income', value: cardData.monthly_income },
  ];

  const groupedChartData = groupByDate(chartData); 

  return (
    <div className="min-h-screen flex flex-col gap-6 w-full font-[family-name:var(--font-geist-sans)] p-4">
      <Suspense fallback={<div>Loading cards...</div>}>
        <div className="flex gap-5 w-full">
          {cardList.map((card, index) => (
            <Card key={index} title={card.title} value={card.value} />
          ))}
        </div>
      </Suspense>
      <Suspense fallback={<div>Loading chart...</div>}>
        <DashboardAreaChart initialData={groupedChartData} />
      </Suspense>
      <Suspense fallback={<div>Loading table...</div>}>
        <DataTable title="Recent Transactions" height="465px" limit={5} initialData={transactionData} />
      </Suspense>
    </div>
  );
};

export default Dashboard;