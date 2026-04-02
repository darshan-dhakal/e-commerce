import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { orderAPI } from "../api/order.api";
import { Order } from "../types/order.types";
import { Button, Card, Badge, Loader } from "../components/ui";
import {
  ArrowLeft,
  Package,
  Check,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
} from "lucide-react";

export const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderAPI.getUserOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your purchases</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center py-16">
              <Package size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 text-lg mb-6">
                You haven't placed any orders yet
              </p>
              <Button onClick={() => navigate("/products")} className="gap-2">
                <Package size={20} />
                Start Shopping
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-4"
          >
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="w-full text-left"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-grow">
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900">
                            Order #{order._id.substring(0, 8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-4">
                          {/* Payment Status */}
                          <Badge
                            variant={order.isPaid ? "success" : "orange"}
                            className="gap-2"
                          >
                            <CreditCard size={14} />
                            {order.isPaid ? "Paid" : "Pending Payment"}
                          </Badge>

                          {/* Delivery Status */}
                          <Badge
                            variant={order.isDelivered ? "success" : "default"}
                            className="gap-2"
                          >
                            {order.isDelivered ? (
                              <>
                                <Check size={14} />
                                Delivered
                              </>
                            ) : (
                              <>
                                <Clock size={14} />
                                In Transit
                              </>
                            )}
                          </Badge>

                          {/* Items Count */}
                          <Badge variant="secondary" className="gap-2">
                            <Package size={14} />
                            {order.orderItems.length}{" "}
                            {order.orderItems.length === 1 ? "item" : "items"}
                          </Badge>
                        </div>

                        {/* Order Items Preview */}
                        <div className="flex flex-wrap gap-2">
                          {order.orderItems.slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded border border-gray-200"
                            />
                          ))}
                          {order.orderItems.length > 3 && (
                            <div className="w-10 h-10 rounded border-2 border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 bg-gray-50">
                              +{order.orderItems.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Total and Action */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600 mb-4">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 text-primary-600 font-semibold">
                          View Details
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const data = await orderAPI.getOrderById(id);
        setOrder(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block"
          >
            <p className="text-red-700 font-semibold mb-4">{error}</p>
            <Button onClick={() => navigate("/orders")} className="gap-2">
              <ArrowLeft size={20} />
              Back to Orders
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-lg mb-6">Order not found</p>
          <Button onClick={() => navigate("/orders")} className="gap-2">
            <ArrowLeft size={20} />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = order.totalPrice - order.shippingPrice - order.taxPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order #{order._id.substring(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-600">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12 bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-8">
            {[
              { label: "Order Placed", status: "complete" },
              {
                label: "Payment",
                status: order.isPaid ? "complete" : "pending",
              },
              {
                label: "Shipped",
                status: order.isDelivered ? "complete" : "pending",
              },
              {
                label: "Delivered",
                status: order.isDelivered ? "complete" : "pending",
              },
            ].map((step, index, arr) => (
              <div key={step.label} className="flex items-center flex-1">
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    step.status === "complete"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.status === "complete" ? <Check size={24} /> : index + 1}
                </motion.div>

                {/* Label */}
                <p className="ml-3 text-sm font-semibold text-gray-900">
                  {step.label}
                </p>

                {/* Line connector */}
                {index < arr.length - 1 && (
                  <motion.div
                    className={`h-1 flex-1 mx-4 ${
                      step.status === "complete"
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Shipping Address */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <MapPin className="text-primary-600" size={28} />
                Shipping Address
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">
                  {order.shippingAddress.address}
                </p>
                <p className="text-gray-700 mt-1">
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-gray-700">{order.shippingAddress.country}</p>
              </div>
            </Card>

            {/* Order Items */}
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Package className="text-primary-600" size={28} />
                Order Items ({order.orderItems.length})
              </h2>

              <div className="space-y-4">
                {order.orderItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Qty: {item.qty}
                      </p>
                      <p className="text-primary-600 font-semibold mt-2">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Order Summary */}
            <Card className="sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-between text-gray-700"
                >
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between text-gray-700"
                >
                  <span>Shipping</span>
                  <span className="font-semibold">
                    ${order.shippingPrice.toFixed(2)}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-between text-gray-700"
                >
                  <span>Tax</span>
                  <span className="font-semibold">
                    ${order.taxPrice.toFixed(2)}
                  </span>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-primary-50 rounded-lg mb-6"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            </Card>

            {/* Status Cards */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-primary-600" size={24} />
                Payment Status
              </h3>
              <Badge
                variant={order.isPaid ? "success" : "orange"}
                className="w-full justify-center py-3 text-base font-bold"
              >
                {order.isPaid
                  ? `Paid on ${new Date(order.paidAt!).toLocaleDateString()}`
                  : "Pending Payment"}
              </Badge>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="text-primary-600" size={24} />
                Delivery Status
              </h3>
              <Badge
                variant={order.isDelivered ? "success" : "default"}
                className="w-full justify-center py-3 text-base font-bold"
              >
                {order.isDelivered
                  ? `Delivered on ${new Date(order.deliveredAt!).toLocaleDateString()}`
                  : "In Transit"}
              </Badge>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
