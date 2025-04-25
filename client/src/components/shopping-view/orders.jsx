import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import SHoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrderByUSer, getOrderDetails, resetOrderState } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

const ShoppingOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.shopOrder);

  useEffect(() => {
    if (user?.id) dispatch(getAllOrderByUSer(user.id));
  }, [dispatch, user?.id]);

  const handleViewDetails = async (id) => {
    setSelectedOrderId(id);
    await dispatch(getOrderDetails(id)); // wait for details before opening dialog
    setOpenDetailsDialog(true);
  };

  console.log(orderDetails,"orderDetaisl")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mt-7">Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.length > 0 &&
              orderList.map((orderItem) => (
                <TableRow key={orderItem._id}>
                  <TableCell>{orderItem._id}</TableCell>
                  <TableCell>{orderItem.orderDate?.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : "bg-black"
                      }`}
                    >
                      {orderItem.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{orderItem.totalAmount}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleViewDetails(orderItem._id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={openDetailsDialog} onOpenChange={()=>{
        setOpenDetailsDialog(false)
        dispatch(resetOrderState())
      }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>Order Details</DialogHeader>
          {isLoading ? (
            <p>Loading...</p>
          ) : orderDetails ? (
            <SHoppingOrderDetailsView orderDetails={orderDetails} />
          ) : (
            <p>No details available</p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ShoppingOrders;
