import React from 'react'
import { Outlet } from 'react-router-dom'
import ShoppinHeader from './header'

const ShoppingLayout = () => {
  return (
    <div className='flex flex-col bg-white min-h-screen'>
      {/* {common header} */}
      <ShoppinHeader />
      <main className='flex-1 overflow-y-auto bg-white'>
        <Outlet />
      </main>
    </div>
  )
}

export default ShoppingLayout
