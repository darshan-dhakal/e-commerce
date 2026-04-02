import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { productAPI } from "../api/product.api";
import { Product } from "../types/product.types";
import { ProductCard } from "../components/ProductCard";
import { Button, Card, Loader } from "../components/ui";
import { Truck, Shield, RotateCw, Zap, ChevronRight } from "lucide-react";

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAllProducts();
        setProducts(data.slice(0, 8)); // Show 8 featured products
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over $50. Fast and reliable delivery.",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure transactions with industry-leading encryption.",
    },
    {
      icon: RotateCw,
      title: "Easy Returns",
      description: "30-day hassle-free return policy on all items.",
    },
    {
      icon: Zap,
      title: "24/7 Support",
      description: "Round-the-clock customer support team ready to help.",
    },
  ];

  const categories = [
    { name: "Electronics", color: "from-blue-400 to-blue-600", icon: "📱" },
    { name: "Fashion", color: "from-pink-400 to-pink-600", icon: "👗" },
    { name: "Home & Garden", color: "from-green-400 to-green-600", icon: "🏠" },
    { name: "Sports", color: "from-orange-400 to-orange-600", icon: "⚽" },
  ];

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 pt-20 pb-32 md:pt-32 md:pb-44">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-secondary-400 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white z-10"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Discover Premium Products
              </h1>
              <p className="text-xl text-primary-50 mb-8 leading-relaxed">
                Explore our carefully curated collection of high-quality
                products. Shop with confidence and enjoy seamless checkout, fast
                shipping, and exceptional customer service.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Start Shopping <ChevronRight size={20} />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold">10K+</p>
                  <p className="text-primary-100 text-sm">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50K+</p>
                  <p className="text-primary-100 text-sm">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">99%</p>
                  <p className="text-primary-100 text-sm">Satisfaction</p>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                  alt="Hero"
                  className="relative w-full rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                      <Icon className="text-primary-600" size={28} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our diverse range of products across different categories
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                <div
                  className={`bg-gradient-to-br ${category.color} rounded-xl p-8 text-white cursor-pointer group overflow-hidden relative h-40 flex flex-col justify-between`}
                >
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div>
                    <p className="text-4xl mb-2">{category.icon}</p>
                    <h3 className="text-2xl font-bold relative z-10">
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-white relative z-10 group-hover:translate-x-2 transition-transform">
                    <span className="font-semibold">Shop Now</span>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked collection of our best-selling and highest-rated items
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8"
            >
              {error}
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader size="lg" />
            </div>
          ) : products.length > 0 ? (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
              >
                {products.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={index}
                  />
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link to="/products">
                  <Button size="lg">View All Products</Button>
                </Link>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-xl text-primary-50 mb-8">
              Get exclusive deals, product launches, and shopping tips delivered
              to your inbox
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <Button variant="secondary" size="md">
                Subscribe
              </Button>
            </div>

            <p className="text-sm text-primary-100 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
