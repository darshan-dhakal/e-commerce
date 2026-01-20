import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../api/product.api";
import { Product } from "../types/product.types";

export const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAllProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Manage Products</h1>
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-800">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800">
                  Price
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800">
                  Stock
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800">
                  Rating
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800 font-semibold">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    {product.countInStock}
                  </td>
                  <td className="px-6 py-4 text-gray-800">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-semibold text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-gray-600 text-sm mt-4">
          Note: Full CRUD operations for products would require additional
          backend endpoints.
        </p>
      </div>
    </div>
  );
};
