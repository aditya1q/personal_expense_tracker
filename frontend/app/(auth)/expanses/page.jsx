import DataTable from '@/components/main/DataTable';
import React from 'react'

const Expanses = () => {
  return (
    <div className="h-full overflow-hidden flex flex-col gap-6 w-full font-[family-name:var(--font-geist-sans)] p-4">
      <DataTable title="All Transactions" height='620px' />
    </div>
  )
}

export default Expanses;