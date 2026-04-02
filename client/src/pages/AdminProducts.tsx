import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../api/admin.api";
import { productAPI } from "../api/product.api";
import { Product } from "../types/product.types";

export const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    price: 0,
    countInStock: 0,
    category: "",
    discount: 0,
    discountType: "percent" as const,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      image: "",
      description: "",
      price: 0,
      countInStock: 0,
      category: "",
      discount: 0,
      discountType: "percent",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      image: product.image,
      description: product.description,
      price: product.price,
      countInStock: product.countInStock,
      category: product.category,
      discount: product.discount,
      discountType: product.discountType,
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await adminAPI.deleteProduct(id);
      setSuccess("Product deleted successfully");
      setProducts(products.filter((p) => p._id !== id));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || !formData.image || !formData.price) {
      setError("Name, image, and price are required");
      return;
    }

    try {
      if (editingId) {
        const updated = await adminAPI.updateProduct(editingId, formData);
        setProducts(products.map((p) => (p._id === editingId ? updated : p)));
        setSuccess("Product updated successfully");
      } else {
        const created = await adminAPI.createProduct(formData);
        setProducts([...products, created]);
        setSuccess("Product created successfully");
      }
      handleReset();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  if (loading && products.length === 0) {
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

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border rounded px-4 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="border rounded px-4 py-2 w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="border rounded px-4 py-2 w-full"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock Count"
                  value={formData.countInStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      countInStock: Number(e.target.value),
                    })
                  }
                  className="border rounded px-4 py-2 w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="border rounded px-4 py-2 w-full"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Discount"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: Number(e.target.value),
                      })
                    }
                    className="border rounded px-4 py-2 w-full"
                  />
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as "percent" | "amount",
                      })
                    }
                    className="border rounded px-4 py-2"
                  >
                    <option value="percent">%</option>
                    <option value="amount">$</option>
                  </select>
                </div>
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border rounded px-4 py-2 w-full rows-4"
                rows={4}
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  {editingId ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
          >
            + Add New Product
          </button>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {products.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No products yet</div>
          ) : (
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
                    Category
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-800">
                    Discount
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
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-gray-800">
                      {product.discount > 0 && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                          {product.discount}
                          {product.discountType === "percent" ? "%" : "$"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800 font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
