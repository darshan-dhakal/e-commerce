import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderAPI } from "../api/order.api";
import { Order } from "../types/order.types";

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Orders</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">
              You haven't placed any orders yet
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">
                    Delivery Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800 font-mono">
                      {order._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-semibold">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {order.isPaid ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
                          Paid
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-semibold">
                          Not Paid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {order.isDelivered ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
                          Delivered
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-semibold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/order/${order._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/orders")}
          className="text-blue-600 hover:text-blue-800 mb-6 font-semibold"
        >
          ← Back to Orders
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Order Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Order ID</p>
                  <p className="text-gray-800 font-mono">{order._id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p className="text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Shipping Address
              </h2>

              <p className="text-gray-800">{order.shippingAddress.address}</p>
              <p className="text-gray-800">
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-800">{order.shippingAddress.country}</p>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center pb-4 border-b"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-gray-600 text-sm">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    $
                    {(
                      order.totalPrice -
                      order.shippingPrice -
                      order.taxPrice
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span className="font-semibold">
                    ${order.shippingPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax:</span>
                  <span className="font-semibold">
                    ${order.taxPrice.toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Payment Status
              </h2>

              {order.isPaid ? (
                <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded">
                  <p className="font-semibold">
                    Paid on {new Date(order.paidAt!).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded">
                  <p className="font-semibold">Not Paid</p>
                </div>
              )}
            </div>

            {/* Delivery Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Delivery Status
              </h2>

              {order.isDelivered ? (
                <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded">
                  <p className="font-semibold">
                    Delivered on{" "}
                    {new Date(order.deliveredAt!).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
                  <p className="font-semibold">Not Delivered Yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
