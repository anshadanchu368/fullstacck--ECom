import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { User, MapPin, ShoppingBag } from 'lucide-react'
import accountImage from "../../assets/banner/bannerImage.png"
import Address from "./address"
import ShoppingOrders from "@/components/shopping-view/orders"

const ShoppingAccount = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Banner with Overlay */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] w-full overflow-hidden">
        <img
          src={accountImage || "/placeholder.svg"}
          alt="Account banner"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="container mx-auto p-6 md:p-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-bold text-white"
            >
              My Account
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Account Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 -mt-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <Tabs defaultValue="orders" className="w-full">
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none bg-transparent border-b p-0">
                <TabsTrigger 
                  value="orders" 
                  className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">My Orders</span>
                  <span className="sm:hidden">Orders</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="address" 
                  className="data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium transition-all flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">My Addresses</span>
                  <span className="sm:hidden">Address</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="orders" className="p-0 m-0">
              <ShoppingOrders />
            </TabsContent>
            
            <TabsContent value="address" className="p-0 m-0">
              <Address />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

export default ShoppingAccount
