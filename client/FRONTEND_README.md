# E-Commerce Frontend

A complete React.js + TypeScript e-commerce frontend integrated with a Node.js backend API.

## 🚀 Features

- **Authentication**: JWT-based login, registration, and logout
- **Products**: Browse all products with details and ratings
- **Shopping Cart**: Add/remove items, manage quantities, persist to localStorage
- **Checkout**: Complete order flow with shipping address and payment method
- **Orders**: View order history and order details
- **Admin Dashboard**: View analytics and manage products
- **Role-based Access**: User and Admin routes with protection
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 📋 Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:5000`
- Modern web browser

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the client directory:

```bash
cp .env.example .env.local
```

Update the API base URL if your backend runs on a different port:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── api/
│   ├── axios.ts          # Axios instance with interceptors
│   ├── auth.api.ts       # Authentication API calls
│   ├── product.api.ts    # Product API calls
│   └── order.api.ts      # Order API calls
├── components/
│   ├── Navbar.tsx        # Navigation bar
│   ├── Footer.tsx        # Footer
│   ├── ProductCard.tsx   # Product card component
│   └── ProtectedRoute.tsx # Route protection wrapper
├── context/
│   └── AuthContext.tsx   # Authentication context
├── hooks/
│   ├── useAuth.ts        # Auth hook
│   └── useCart.ts        # Cart management hook
├── pages/
│   ├── Home.tsx          # Home/landing page
│   ├── ProductList.tsx   # All products listing
│   ├── ProductDetails.tsx# Product details page
│   ├── Login.tsx         # Login page
│   ├── Register.tsx      # Registration page
│   ├── Cart.tsx          # Shopping cart page
│   ├── Checkout.tsx      # Checkout page
│   ├── Orders.tsx        # Orders history and detail
│   ├── AdminDashboard.tsx # Admin dashboard
│   └── AdminProducts.tsx  # Admin products management
├── types/
│   ├── user.types.ts     # User type definitions
│   ├── product.types.ts  # Product type definitions
│   └── order.types.ts    # Order type definitions
├── utils/
│   └── token.ts          # JWT token utilities
├── App.tsx               # Main app component with routing
└── main.tsx              # Entry point
```

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor automatically attaches token to requests
5. On 401 error, user is redirected to login
6. Protected routes check authentication status

## 🛒 Cart Management

- Cart data persisted in localStorage
- Add/remove items from product details or cart page
- Update quantities directly from cart
- Cart persists across browser sessions
- Clear cart after successful order

## 📊 API Integration

All API calls are fully typed and follow a consistent pattern:

```typescript
// Example: Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get('/products');
  return res.data;
};
```

### Available API Endpoints

#### Authentication
- `POST /api/users` - Register
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get profile (protected)
- `PUT /api/users/profile` - Update profile (protected)

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

#### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id/payment` - Mark order as paid (protected)

## 🎨 UI Components

### Navbar
- Logo and navigation links
- User menu with logout
- Cart item count badge
- Admin link for admins

### ProductCard
- Product image, name, and description
- Price and rating display
- In-stock status
- Link to product details

### ProtectedRoute
- Protects routes requiring authentication
- Redirects unauthenticated users to login
- Admin-only route protection

## 🧪 Testing the Application

### Test User Credentials

Create test users via the registration page, or use admin seeded user if available:

```
Email: admin@test.com
Password: admin123
```

### User Flow

1. Register a new account
2. Browse products from home or products page
3. Click on a product to see details
4. Add items to cart
5. Go to cart and adjust quantities
6. Proceed to checkout
7. Fill shipping address and select payment method
8. Place order
9. View order history from "Orders" page

### Admin Flow

1. Login with admin account
2. Click "Admin" in navbar
3. View dashboard with analytics
4. Manage products

## 🔧 Troubleshooting

### API Connection Issues

- Ensure backend is running on `http://localhost:5000`
- Check `.env.local` has correct API URL
- Check browser console for CORS errors

### Token Issues

- Token is stored in localStorage
- Clear browser storage if facing auth issues: Settings > Clear browsing data
- Check token format in Network tab of DevTools

### Cart Not Persisting

- Enable localStorage in browser
- Check that browser isn't in private/incognito mode
- Verify localStorage limit not exceeded

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel, Netlify, or any static host

1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Set environment variable `VITE_API_BASE_URL` to your backend API URL

## 🚀 Performance Optimizations

- Lazy loading of product images
- Code splitting with React Router
- CSS compiled with Tailwind CSS
- Axios request caching through HTTP headers

## 📝 Type Safety

Full TypeScript support with:
- Strongly typed API responses
- User, Product, and Order interfaces
- Type-safe hooks and context
- Strict mode enabled

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Add proper error handling
4. Test with backend API

## 📄 License

This project is part of an e-commerce fullstack application.

## 🔗 Related Repositories

- Backend API: https://github.com/darshan-dhakal/e-commerce/tree/main/api
