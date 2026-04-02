import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pages
import { Home } from "./pages/Home";
import { ProductList } from "./pages/ProductList";
import { ProductDetails } from "./pages/ProductDetails";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Orders, OrderDetail } from "./pages/Orders";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProducts } from "./pages/AdminProducts";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminOrders } from "./pages/AdminOrders";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: "products", element: <ProductList /> },
        { path: "product/:id", element: <ProductDetails /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },
        {
          path: "order/:id",
          element: (
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/dashboard",
          element: (
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/products",
          element: (
            <ProtectedRoute adminOnly>
              <AdminProducts />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/users",
          element: (
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/orders",
          element: (
            <ProtectedRoute adminOnly>
              <AdminOrders />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
