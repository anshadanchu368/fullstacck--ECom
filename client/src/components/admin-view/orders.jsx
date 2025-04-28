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
import { Button } from "../button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice/inex";
import { Badge } from "../ui/badge";

const AdminOrdersView = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { orderList, orderDetails, isLoading } = useSelector(
    (state) => state.adminOrder
  );

  const dispatch = useDispatch();

  async function handleFetchOrder(getId) {
    await dispatch(getOrderDetailsForAdmin(getId));
    setOpenDetailsDialog(true);
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "order lsit forma dmin");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold pt-5">All orders</CardTitle>
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
                      className={`py-1 px-3 w-20 text-xs capitalize ${
                        orderItem?.orderStatus === "confirmed"
                          ? "bg-green-500"
                          : orderItem?.orderStatus === "rejected"
                          ? "bg-red-500"
                          : "bg-gray-700"
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{orderItem.totalAmount}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleFetchOrder(orderItem._id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false);
          dispatch(resetOrderDetails());
        }}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>Order Details</DialogHeader>
          {isLoading ? (
            <p>Loading...</p>
          ) : orderDetails ? (
            <AdminOrderDetailsView orderDetails={orderDetails} />
          ) : (
            <p>No details available</p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminOrdersView;
