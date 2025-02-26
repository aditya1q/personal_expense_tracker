import ExpenseBarChart from '@/components/charts/ExpenseBarChart'
import ProgressBar from '@/components/charts/ProgressBar'
import React from 'react'
import Settings from '../settings/Settings'

const Analytics = () => {
  return (
    <div className="min-h-screen flex flex-col gap-10 w-full font-[family-name:var(--font-geist-sans)] p-4">
      <div className='flex gap-10'>
        <ExpenseBarChart />
        <ProgressBar />
      </div>
      <Settings />
    </div>
  )
}

export default Analytics