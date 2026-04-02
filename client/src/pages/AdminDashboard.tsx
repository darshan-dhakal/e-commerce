import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api/admin.api";
import { productAPI } from "../api/product.api";
import { Order } from "../types/order.types";
import { Product } from "../types/product.types";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData, usersData] = await Promise.all([
          adminAPI.listAllOrders(),
          productAPI.getAllProducts(),
          adminAPI.listUsers(),
        ]);
        setOrders(ordersData);
        setProducts(productsData);
        setUsers(usersData);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.isPaid)
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const paidOrders = orders.filter((o) => o.isPaid).length;

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
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-green-600">{totalOrders}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Paid Orders
            </h3>
            <p className="text-3xl font-bold text-purple-600">{paidOrders}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {totalProducts}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-indigo-600">{users.length}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate("/admin/products")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <h3 className="text-xl font-bold text-gray-800">Manage Products</h3>
            <p className="text-gray-600">Add, edit, or delete products</p>
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <h3 className="text-xl font-bold text-gray-800">View Orders</h3>
            <p className="text-gray-600">Manage customer orders</p>
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
          >
            <h3 className="text-xl font-bold text-gray-800">Manage Users</h3>
            <p className="text-gray-600">View user details</p>
          </button>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recent Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-600">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-800">
                      Order ID
                    </th>
                    <th className="px-6 py-3 font-semibold text-gray-800">
                      Date
                    </th>
                    <th className="px-6 py-3 font-semibold text-gray-800">
                      Total
                    </th>
                    <th className="px-6 py-3 font-semibold text-gray-800">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
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
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
                            Paid
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
