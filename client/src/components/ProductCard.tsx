import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "../types/product.types";
import { Badge } from "./ui/Badge";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const discountPercentage = Math.floor(Math.random() * 20) + 5; // Mock discount

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`}>
        <div className="bg-white rounded-xl shadow-elevation-2 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-gray-100 aspect-square">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              variants={imageVariants}
              initial="initial"
              animate={isHovered ? "hover" : "initial"}
              transition={{ duration: 0.3 }}
            />

            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {product.countInStock > 0 && product.countInStock < 5 && (
                <Badge variant="warning" size="sm">
                  Only {product.countInStock} left
                </Badge>
              )}
              <Badge variant="info" size="sm">
                -{discountPercentage}%
              </Badge>
            </div>

            {/* Out of Stock Overlay */}
            {product.countInStock === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Quick Cart Button */}
            {isHovered && product.countInStock > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors"
              >
                <ShoppingCart size={18} />
                Quick Add
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-grow">
            {/* Title */}
            <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-primary-500 transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-2 mt-2 mb-4">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              <div className="flex items-center text-primary-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(product.rating) ? "fill-current" : ""
                    }
                    fill={
                      i < Math.floor(product.rating) ? "currentColor" : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({product.numReview} reviews)
              </span>
            </div>

            {/* Price Section - Flex grow to push to bottom */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary-600">
                  ${(product.price * (1 - discountPercentage / 100)).toFixed(2)}
                </span>
                <span className="text-sm line-through text-gray-400">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mt-3">
                {product.countInStock > 0 ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
                    ✓ In Stock
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded inline-block">
                    ✗ Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
