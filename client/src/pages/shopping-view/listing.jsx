import ProductFilter from '@/components/shopping-view/filter'
import React from 'react'

const ShoppingList = () => {
  return (
    <div className="grid grd-cols-1 md:grid-cols-[300px].gap-6.md:p-6">
          <ProductFilter/>
    </div>
  )
}

export default ShoppingList
