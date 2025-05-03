
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog"
import AdminOrderDetailsView from "./order-details"
import { useDispatch, useSelector } from "react-redux"
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  deleteOrder,
  deleteAllOrders,
  resetDeleteStatus,
} from "@/store/admin/order-slice/inex" // Fixed import path
import { Badge } from "../ui/badge"
import { Eye, Package, ShoppingBag, AlertCircle, ClipboardList, Search, Trash, AlertTriangle } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { Input } from "../ui/input"
import { toast } from "sonner"

const AdminOrdersView = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOrders, setFilteredOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const dispatch = useDispatch()

  const {
    orderList: rawOrderList,
    orderDetails,
    isLoading,
    deleteSuccess,
    error,
  } = useSelector((state) => state.adminOrder)

  // Ensure orderList is always an array
  const orderList = Array.isArray(rawOrderList) ? rawOrderList : []

  async function handleFetchOrder(getId) {
    await dispatch(getOrderDetailsForAdmin(getId))
    setOpenDetailsDialog(true)
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin())
  }, [dispatch])

  useEffect(() => {
    let filtered = orderList
    if (searchTerm.trim() !== "") {
      filtered = orderList.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredOrders(filtered)
    setTotalPages(Math.max(1, Math.ceil(filtered.length / ordersPerPage)))
    if (searchTerm) setCurrentPage(1)
  }, [orderList, searchTerm, ordersPerPage])

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Order deleted successfully")
      setOpenDeleteDialog(false)
      setOpenDeleteAllDialog(false)
      setOrderToDelete(null)
      dispatch(resetDeleteStatus())
    }
  }, [deleteSuccess, dispatch])

  useEffect(() => {
    if (error) {
      toast.error("Error", {
        description: error,
      })
    }
  }, [error])

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      dispatch(deleteOrder(orderToDelete))
    }
  }

  const handleConfirmDeleteAll = () => {
    dispatch(deleteAllOrders())
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

  const getPaginatedOrders = () => {
    const startIndex = (currentPage - 1) * ordersPerPage
    const endIndex = startIndex + ordersPerPage
    return filteredOrders.slice(startIndex, endIndex)
  }

  // Loading skeleton
  if (isLoading && orderList.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ClipboardList className="h-5 w-5 text-primary " />
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
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
    <Card className="border shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ClipboardList className="h-5 w-5 text-primary" />
          All Orders
        </CardTitle>
        {orderList.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setOpenDeleteAllDialog(true)}
          >
            <Trash className="h-4 w-4" />
            Delete All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or status..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto max-h-[60vh] scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-16">No.</TableHead>
                  <TableHead className="hidden md:table-cell">Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  getPaginatedOrders().map((orderItem, index) => (
                    <TableRow
                      key={orderItem._id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-medium">{(currentPage - 1) * ordersPerPage + index + 1}</TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                        {orderItem._id}
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
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button
                          onClick={() => handleFetchOrder(orderItem._id)}
                          size="sm"
                          className="h-8 w-8 p-0"
                          variant="outline"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(orderItem._id)}
                          size="sm"
                          className="h-8 w-8 p-0"
                          variant="outline"
                          color="destructive"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Delete order</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-center py-4">
                        <div className="rounded-full bg-muted p-3 mb-2">
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        </div>
                        {searchTerm ? (
                          <>
                            <h3 className="text-sm font-medium mb-1">No matching orders found</h3>
                            <p className="text-xs text-muted-foreground">Try a different search term</p>
                          </>
                        ) : (
                          <>
                            <h3 className="text-sm font-medium mb-1">No orders yet</h3>
                            <p className="text-xs text-muted-foreground">
                              Orders will appear here when customers place them
                            </p>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
              {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1
                  if (totalPages > 5) {
                    if (currentPage > 3) pageNum = currentPage - 3 + i
                    if (pageNum > totalPages - 4 && currentPage > totalPages - 2) pageNum = totalPages - 4 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
            {orderDetails && <AdminOrderDetailsView orderData={orderDetails.data || orderDetails} />}
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setOpenDetailsDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Order
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete} className="gap-1">
                <Trash className="h-4 w-4" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete All Confirmation Dialog */}
        <Dialog open={openDeleteAllDialog} onOpenChange={setOpenDeleteAllDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete All Orders
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete all orders? This action cannot be undone and will remove all order data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDeleteAllDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDeleteAll} className="gap-1">
                <Trash className="h-4 w-4" />
                Delete All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default AdminOrdersView