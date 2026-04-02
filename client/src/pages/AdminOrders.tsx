import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api/admin.api";
import { Order } from "../types/order.types";

export const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.listAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const updated = await adminAPI.updateOrderStatus(orderId, status);
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      setSuccess("Order status updated");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !noteText.trim()) {
      setError("Please enter a note");
      return;
    }

    try {
      const updated = await adminAPI.addOrderNote(selectedOrder._id, noteText);
      setOrders(orders.map((o) => (o._id === selectedOrder._id ? updated : o)));
      setSelectedOrder(updated);
      setNoteText("");
      setShowNoteForm(false);
      setSuccess("Note added successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add note");
    }
  };

  const handleApproveRefund = async (orderId: string) => {
    try {
      const updated = await adminAPI.approveRefund(orderId);
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      setSuccess("Refund approved");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to approve refund");
    }
  };

  const handleCompleteRefund = async (orderId: string) => {
    try {
      const updated = await adminAPI.completeRefund(orderId);
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      setSuccess("Refund completed");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to complete refund");
    }
  };

  const handleRejectRefund = async (orderId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      const updated = await adminAPI.rejectRefund(orderId, reason);
      setOrders(orders.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      setSuccess("Refund rejected");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reject refund");
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Manage Orders</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {orders.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  No orders found
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">
                        Paid
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-4 text-gray-800 font-mono text-xs">
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-4 text-gray-800 font-semibold">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {order.isPaid ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              Yes
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Order Detail */}
          {selectedOrder && (
            <div className="bg-white rounded-lg shadow p-6 h-fit max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Order Details
              </h2>

              {/* Order Info */}
              <div className="border-b pb-4 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total:</strong> ${selectedOrder.totalPrice.toFixed(2)}
                </p>
              </div>

              {/* Status Update */}
              <div className="border-b pb-4 mb-4">
                <label className="text-sm font-semibold text-gray-800 block mb-2">
                  Update Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusUpdate(selectedOrder._id, e.target.value)
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Refund Status */}
              {selectedOrder.refund.status !== "none" && (
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Refund Info
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Status:</strong> {selectedOrder.refund.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Amount:</strong> $
                    {selectedOrder.refund.amount?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Reason:</strong> {selectedOrder.refund.reason}
                  </p>

                  {selectedOrder.refund.status === "requested" && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleApproveRefund(selectedOrder._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRefund(selectedOrder._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {selectedOrder.refund.status === "approved" && (
                    <button
                      onClick={() => handleCompleteRefund(selectedOrder._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 mt-2"
                    >
                      Complete Refund
                    </button>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="border-b pb-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto mb-2">
                  {selectedOrder.notes.length === 0 ? (
                    <p className="text-sm text-gray-600">No notes</p>
                  ) : (
                    selectedOrder.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-2 rounded border-l-2 border-blue-500"
                      >
                        <p className="text-xs font-semibold text-gray-800">
                          {note.createdBy}
                        </p>
                        <p className="text-xs text-gray-600">{note.note}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {!showNoteForm ? (
                  <button
                    onClick={() => setShowNoteForm(true)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    + Add Note
                  </button>
                ) : (
                  <form onSubmit={handleAddNote} className="space-y-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Enter note..."
                      className="w-full border rounded px-2 py-1 text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNoteForm(false);
                          setNoteText("");
                        }}
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
