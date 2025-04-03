import React from 'react'
import { Button } from '../button'
import { AlignJustify, LogOut } from 'lucide-react'

const AdminHeader = ({setOpen}) => {
  return (
  <header className="flex justify-between items-center px-4 py-3">
      <Button onClick={()=> setOpen(true)} className="lg:hidden sm:block">
         <AlignJustify/>
         <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow">
        <LogOut />
        Logout
        </Button>
      </div>
  </header>
  )
}

export default AdminHeader
