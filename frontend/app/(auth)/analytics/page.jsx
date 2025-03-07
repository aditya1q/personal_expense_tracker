import React, { Suspense } from 'react';
import ExpenseBarChart from '@/components/charts/ExpenseBarChart';
import ProgressBar from '@/components/charts/ProgressBar';
import Settings from '@/components/Settings';
import { fetchExpenseOverview } from '@/app/api';
import { groupByCategory } from '@/utils/groupByCategory';
import { groupByDate } from '@/utils/groupByDate';

const AnalyticsPage = async () => {
  let chartData = [];
  try {
    chartData = await fetchExpenseOverview();
  } catch (error) {
    console.error('Failed to fetch chart data:', error);
  }

  const groupChartCategory = groupByCategory(chartData);
  const groupChartByDate = groupByDate(chartData)

  return (
    <div className="h-full flex flex-col gap-3 w-full font-[family-name:var(--font-geist-sans)] p-4">
      <div className="flex gap-10 max-h-[50%] overflow-hidden">
        <Suspense fallback={<div>Loading chart...</div>}>
          <ExpenseBarChart data={groupChartByDate} />
        </Suspense>
        <Suspense fallback={<div>Loading ProgressBar...</div>}>
          <ProgressBar data={groupChartCategory} />
        </Suspense>
      </div>
      <Settings />
    </div>
  );
};

export default AnalyticsPage;
