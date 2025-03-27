import React from 'react'
import { Outlet } from 'react-router-dom'
import ShoppinHeader from './header'

const ShoppingLayout = () => {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
      {/* {common header} */}
      <ShoppinHeader/>
      <main className='flex flex-col bg-white overflow-hidden'>
        <Outlet/>
      </main>
    </div>
  )
}

export default ShoppingLayout
