
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog"
import SHoppingOrderDetailsView from "./order-details"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrderByUSer, getOrderDetails, resetOrderState } from "@/store/shop/order-slice"
import { Badge } from "../ui/badge"
import { Eye, Package, ShoppingBag, AlertCircle } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

const ShoppingOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.shopOrder)

  useEffect(() => {
    if (user?.id) dispatch(getAllOrderByUSer(user.id))
  }, [dispatch, user?.id])

  const handleViewDetails = async (id) => {
    setSelectedOrderId(id)
    await dispatch(getOrderDetails(id)) // wait for details before opening dialog
    setOpenDetailsDialog(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <Package className="h-3.5 w-3.5" />
      case "rejected":
        return <AlertCircle className="h-3.5 w-3.5" />
      default:
        return <ShoppingBag className="h-3.5 w-3.5" />
    }
  }

  // Loading skeleton
  if (isLoading && (!orderList || orderList.length === 0)) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="px-6">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-6">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 overflow-auto">
        {orderList?.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="hidden md:table-cell">Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[100px] text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {orderList.map((orderItem, index) => (
                    <motion.tr
                      key={orderItem._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                        {orderItem._id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(orderItem.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`py-1 px-2 text-xs capitalize flex items-center gap-1 w-fit ${getStatusColor(
                            orderItem?.orderStatus,
                          )}`}
                        >
                          {getStatusIcon(orderItem?.orderStatus)}
                          <span>{orderItem?.orderStatus}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">₹{orderItem.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleViewDetails(orderItem._id)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No orders yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              When you place orders, they will appear here for you to track and review.
            </p>
          </div>
        )}
      </CardContent>

      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false)
          dispatch(resetOrderState())
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <h2 className="text-xl font-semibold">Order Details</h2>
          </DialogHeader>
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : orderDetails ? (
            <SHoppingOrderDetailsView orderDetails={orderDetails} />
          ) : (
            <div className="p-6 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p>No details available</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default ShoppingOrders
