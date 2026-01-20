import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">E-Shop</h3>
            <p className="text-gray-400">
              Your one-stop destination for quality products.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition">
                  About
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="/" className="hover:text-white transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="text-gray-400 space-y-2">
              <li>
                <a href="/" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
