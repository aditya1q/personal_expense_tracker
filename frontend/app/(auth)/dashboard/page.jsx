
import DashboardAreaChart from '@/components/charts/AreaChart';
import Card from '@/components/main/Card';
import DataTable from '@/components/main/DataTable';
import { fetchCardData } from '@/app/api/card'

const Dashboard = async () => {
  const cardData = await fetchCardData();

  const data = [
    { title: 'Total Savings', value: cardData.total_savings },
    { title: 'Total Expenses', value: cardData.total_expense },
    { title: 'Monthly Spending', value: cardData.monthly_expense },
    { title: 'Monthly Savings', value: cardData.monthly_savings },
    { title: 'Monthly Income', value: cardData.monthly_income },
  ];

  return (
    <div className="min-h-screen flex flex-col gap-6 w-full font-[family-name:var(--font-geist-sans)] p-4">
      <div className="flex gap-5 w-full">
        {data?.map((card, index) => (
          <Card key={index} title={card.title} value={card.value} />
        ))}
      </div>
      <DashboardAreaChart />
      <DataTable title='Recent Transactions' height='465px' limit={5} />
    </div>
  );
};

export default Dashboard;