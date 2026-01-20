import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/product.types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mt-2">
            {product.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price}
            </span>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-gray-700">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm ml-1">
                ({product.numReview})
              </span>
            </div>
          </div>
          <div className="mt-3">
            {product.countInStock > 0 ? (
              <span className="text-green-600 font-semibold">In Stock</span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
