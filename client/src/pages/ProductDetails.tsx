import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI } from "../api/product.api";
import { Product } from "../types/product.types";
import { useCart } from "../hooks/useCart";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await productAPI.getProductById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({ ...product, qty });
      navigate("/cart");
    }
  };

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/products")}
          className="text-blue-600 hover:text-blue-800 mb-6 font-semibold"
        >
          ← Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full h-96 object-cover rounded"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center mb-6">
              <span className="text-yellow-500 text-xl mr-2">★</span>
              <span className="text-gray-700 mr-2">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({product.numReview} reviews)
              </span>
            </div>

            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-600">
                ${product.price}
              </span>
            </div>

            <div className="mb-6">
              {product.countInStock > 0 ? (
                <div>
                  <span className="text-green-600 font-semibold text-lg">
                    In Stock
                  </span>
                  <div className="mt-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Quantity
                    </label>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                      {[...Array(product.countInStock)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <span className="text-red-600 font-semibold text-lg">
                  Out of Stock
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
