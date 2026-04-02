import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api/admin.api";
import { User } from "../types/user.types";

export const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.listUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
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
          <h1 className="text-4xl font-bold text-gray-800">Manage Users</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Users List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {users.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  No users found
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-gray-800">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-800">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-800">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-gray-800">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 text-gray-800 font-semibold">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          {user.isAdmin ? (
                            <span className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm">
                              Admin
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                              User
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedUser(user)}
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

          {/* User Detail */}
          {selectedUser && (
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                User Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-600 text-sm font-semibold">
                    Name
                  </label>
                  <p className="text-gray-800 font-semibold">
                    {selectedUser.name}
                  </p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-semibold">
                    Email
                  </label>
                  <p className="text-gray-800 font-semibold">
                    {selectedUser.email}
                  </p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-semibold">
                    Role
                  </label>
                  <p className="text-gray-800 font-semibold">
                    {selectedUser.isAdmin ? "Administrator" : "User"}
                  </p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-semibold">
                    User ID
                  </label>
                  <p className="text-gray-800 font-mono text-sm">
                    {selectedUser._id}
                  </p>
                </div>

                <div>
                  <label className="text-gray-600 text-sm font-semibold">
                    Created
                  </label>
                  <p className="text-gray-800">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 mt-6"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
