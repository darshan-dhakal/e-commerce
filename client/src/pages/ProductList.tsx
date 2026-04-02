import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { productAPI } from "../api/product.api";
import { Product } from "../types/product.types";
import { ProductCard } from "../components/ProductCard";
import { Button, Loader, Card, Input } from "../components/ui";
import { Filter, X, ChevronDown } from "lucide-react";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterOpen, setFilterOpen] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedRating, setSelectedRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;
      const matchesRating = product.rating >= selectedRating;
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesPrice && matchesRating && matchesSearch;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) => new Date(b._id).getTime() - new Date(a._id).getTime(),
        );
        break;
    }

    setFilteredProducts(filtered);
  }, [products, priceRange, selectedRating, searchQuery, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-primary-50 text-lg">
            Discover our collection of {products.length} premium products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`lg:col-span-1 ${filterOpen ? "block" : "hidden"} lg:block`}
          >
            <Card className="sticky top-24">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Filter size={20} /> Filters
                </h3>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Price Range
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">
                      Min: ${priceRange.min}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          min: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Max: ${priceRange.max}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({
                          ...priceRange,
                          max: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1, 0].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedRating === rating
                          ? "bg-primary-100 text-primary-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {rating === 0 ? (
                        "All Products"
                      ) : (
                        <>
                          {"★".repeat(rating)}
                          {" ".repeat(5 - rating)} ({rating}+)
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => {
                  setPriceRange({ min: 0, max: 10000 });
                  setSelectedRating(0);
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </Card>
          </motion.div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-900">
                    {products.length}
                  </span>{" "}
                  products
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Filter size={18} /> Filters
                </button>

                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-gray-700 font-medium">
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader size="lg" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={index}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <p className="text-gray-600 text-lg mb-4">
                  No products found matching your criteria
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setPriceRange({ min: 0, max: 10000 });
                    setSelectedRating(0);
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
