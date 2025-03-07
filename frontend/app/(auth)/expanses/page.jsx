import DataTable from '@/components/main/DataTable';
import React from 'react'
import { Suspense } from 'react';
import { fetchTransactionData } from '@/app/api';

const Expanses = async () => {
  let transactionData;

  try {
    [transactionData] = await Promise.all([
      fetchTransactionData()
    ])
  } catch (error) {
    console.error('Failed to fetch Expense data:', error);
    transactionData = [];
  }

  return (
    <div className="h-full overflow-hidden flex flex-col gap-6 w-full font-[family-name:var(--font-geist-sans)] p-4">
      {/* <DataTable title="All Transactions" height='620px' /> */}
      <Suspense fallback={<div>Loading table...</div>}>
        <DataTable title="All Transactions" height='620px' initialData={transactionData} />
      </Suspense>
    </div>
  )
}

export default Expanses;