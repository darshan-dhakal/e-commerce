import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { productAPI } from "../api/product.api";
import { Product } from "../types/product.types";
import { useCart } from "../hooks/useCart";
import { Button, Badge, Loader, Card } from "../components/ui";
import {
  ArrowLeft,
  Check,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  Plus,
  Minus,
  Star,
} from "lucide-react";

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"specs" | "reviews">("specs");
  const [liked, setLiked] = useState(false);
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
            <p className="text-red-700 font-semibold">{error}</p>
            <Button
              onClick={() => navigate("/products")}
              className="mt-4 gap-2"
            >
              <ArrowLeft size={20} />
              Back to Products
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-lg mb-6">Product not found</p>
          <Button onClick={() => navigate("/products")} className="gap-2">
            <ArrowLeft size={20} />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/products")}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          <ArrowLeft size={20} />
          Back to Products
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative w-full bg-white rounded-2xl shadow-lg p-4 flex items-center justify-center min-h-[500px]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-[480px] object-contain rounded-xl"
              />

              {/* Stock Badge */}
              {product.countInStock > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-6 right-6"
                >
                  <Badge variant="success" className="gap-2">
                    <Check size={16} />
                    In Stock
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Product Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <Star
                        size={20}
                        className={
                          i < Math.round(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({product.numReview} reviews)
                </span>
              </motion.div>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-baseline gap-3"
              >
                <span className="text-5xl font-bold text-primary-600">
                  ${product.price}
                </span>
                {product.discount && (
                  <Badge variant="orange">
                    Save {Math.round((product.discount / product.price) * 100)}%
                  </Badge>
                )}
              </motion.div>

              {/* Description */}
              <p className="text-gray-600 text-lg mt-4 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <Card>
              {/* Stock Status */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {product.countInStock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600 font-semibold mb-4">
                    <Check size={20} />
                    <span>Available - {product.countInStock} in stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 font-semibold mb-4">
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.countInStock > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Minus size={20} className="text-gray-600" />
                    </button>
                    <span className="text-2xl font-bold min-w-[3rem] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty(Math.min(product.countInStock, qty + 1))
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus size={20} className="text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className="gap-2 col-span-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </Button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLiked(!liked)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    liked
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Heart
                    size={20}
                    className={liked ? "fill-red-500 text-red-500" : ""}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  <Share2 size={20} className="text-gray-600" />
                </motion.button>
              </div>
            </Card>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: Truck, label: "Fast Shipping", desc: "2-3 days" },
                { icon: RotateCcw, label: "Easy Returns", desc: "30 days" },
                { icon: Shield, label: "Secure", desc: "SSL encrypted" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <Icon size={24} className="text-primary-600 mb-2" />
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Tabs Section */}
            <Card>
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200 mb-6">
                {(["specs", "reviews"] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                      activeTab === tab
                        ? "text-primary-600 border-primary-600"
                        : "text-gray-600 border-transparent hover:text-gray-900"
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tab === "specs" ? "Specifications" : "Reviews"}
                  </motion.button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {[
                      { label: "Product ID", value: product._id },
                      { label: "Category", value: product.category },
                      { label: "Brand", value: product.brand || "N/A" },
                      { label: "Rating", value: `${product.rating}/5` },
                      {
                        label: "Availability",
                        value: `${product.countInStock} in stock`,
                      },
                    ].map((spec, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-600 font-medium">
                          {spec.label}
                        </span>
                        <span className="text-gray-900 font-semibold">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <p className="text-gray-600">
                      {product.numReview} customer{" "}
                      {product.numReview === 1 ? "review" : "reviews"}
                    </p>
                    <Button variant="secondary" size="sm">
                      Write a Review
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
