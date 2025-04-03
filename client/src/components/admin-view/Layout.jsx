import React, { useState } from 'react'
import AdminSidebar from './sidebar'
import AdminHeader from './header'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const [openSidebar,setOpenSidebar] = useState(false)
  return (
    <div className="flex min-h-screen w-full">
      {/* {admin-sidebar} */}
      <AdminSidebar open={openSidebar} setOpen={setOpenSidebar}/>
        <div className="flex flex-1 flex-col">
            {/* {admin header} */}
            <AdminHeader setOpen={setOpenSidebar}r/>
            <main className='flex-1 flex bg-muted/40 p-4 md:p-6'>
                 <Outlet/>
            </main>
        </div>
    </div>
  )
}

export default AdminLayout
