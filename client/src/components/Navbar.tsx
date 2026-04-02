import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { Button } from "./ui";
import { Menu, X, ShoppingCart, User } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent"
          >
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            Shop
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-500 transition-colors duration-200 font-medium"
            >
              Products
            </Link>

            {isAuthenticated && !user?.isAdmin && (
              <>
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-primary-500 transition-colors duration-200 font-medium flex items-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-md">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-primary-500 transition-colors duration-200 font-medium"
                >
                  Orders
                </Link>
              </>
            )}

            {isAuthenticated && user?.isAdmin && (
              <Link
                to="/admin/dashboard"
                className="text-gray-700 hover:text-primary-500 transition-colors duration-200 font-medium"
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-primary-500" />
                  <span className="text-gray-700 font-medium">
                    {user?.name}
                  </span>
                </div>
                <Button variant="danger" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3 animate-slide-down">
            <Link
              to="/"
              className="block text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/products"
              className="block text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>

            {isAuthenticated && !user?.isAdmin && (
              <>
                <Link
                  to="/cart"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingCart size={18} />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>

                <Link
                  to="/orders"
                  className="block text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              </>
            )}

            {isAuthenticated && user?.isAdmin && (
              <Link
                to="/admin/dashboard"
                className="block text-gray-700 hover:text-primary-500 transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <p className="text-gray-700 font-medium">{user?.name}</p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
