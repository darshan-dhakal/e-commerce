import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export const Cart: React.FC = () => {
  const { cart, removeItem, updateQty, getTotalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg mb-8">Your cart is empty</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">
                      Subtotal
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <span className="text-gray-800 font-semibold">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-semibold">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={item.qty}
                          onChange={(e) =>
                            updateQty(item._id, Number(e.target.value))
                          }
                          className="px-2 py-1 border border-gray-300 rounded"
                        >
                          {[...Array(item.countInStock)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-semibold">
                        ${(item.price * item.qty).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-semibold">$10.00</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (10%):</span>
                <span className="font-semibold">
                  ${((getTotalPrice() + 10) * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-800">
                <span>Total:</span>
                <span className="text-blue-600">
                  $
                  {(
                    getTotalPrice() +
                    10 +
                    (getTotalPrice() + 10) * 0.1
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full block bg-blue-600 text-white py-3 rounded font-semibold text-center hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="w-full block bg-gray-200 text-gray-800 py-3 rounded font-semibold text-center hover:bg-gray-300 transition mt-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
