import { BellIcon } from 'lucide-react'
import React from 'react'
import Search from '../main/Search'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between w-full p-4'>
      <div className='flex flex-col items-start justify-center'>
        <h1 className='text-[16px] font-semibold'>Good Morning, Aditya</h1>
        <p className='text-[12px] text-[#9CA3AF]'>Here's your financial summary</p>
      </div>
      <div className='flex items-center gap-4'>
        <Search />
        <div className='bg-[#16171C] p-2 rounded-lg'>
          <BellIcon />
        </div>
      </div>
    </div>
  )
}

export default Navbar