"use client"

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
import { Eye, Package, ShoppingBag, AlertCircle, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"

const ShoppingOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [paginatedOrders, setPaginatedOrders] = useState([])

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.shopOrder)

  useEffect(() => {
    if (user?.id) dispatch(getAllOrderByUSer(user.id))
  }, [dispatch, user?.id])

  // Apply pagination when orderList changes
  useEffect(() => {
    if (orderList && orderList.length > 0) {
      const indexOfLastItem = currentPage * itemsPerPage
      const indexOfFirstItem = indexOfLastItem - itemsPerPage
      setPaginatedOrders(orderList.slice(indexOfFirstItem, indexOfLastItem))
    } else {
      setPaginatedOrders([])
    }
  }, [orderList, currentPage, itemsPerPage])

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

  // Pagination logic
  const totalPages = orderList ? Math.ceil(orderList.length / itemsPerPage) : 0

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of the middle section
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis1")
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis2")
      }

      // Always include last page
      pageNumbers.push(totalPages)
    }

    return pageNumbers
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
          <>
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
                    {paginatedOrders.map((orderItem, index) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    {/* First page button */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                        className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </PaginationLink>
                    </PaginationItem>

                    {/* Previous button */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {/* Page numbers */}
                    {getPageNumbers().map((number, index) => (
                      <PaginationItem key={index}>
                        {number === "ellipsis1" || number === "ellipsis2" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => paginate(number)}
                            isActive={currentPage === number}
                            className="cursor-pointer"
                          >
                            {number}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    {/* Next button */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {/* Last page button */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
