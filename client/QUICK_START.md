# 🚀 Quick Start Guide

## Prerequisites

Before starting, ensure you have:
- Node.js 16+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:5000`
- A modern web browser

## Step 1: Install Dependencies

```bash
cd /home/darshan-dhakal/Desktop/e-commerce/client
npm install
```

## Step 2: Configure Environment

The `.env.local` file is already configured with:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

If your backend runs on a different port, update this value.

## Step 3: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Step 4: Start the Backend (in another terminal)

```bash
cd /home/darshan-dhakal/Desktop/e-commerce/api
npm run server
```

Backend will run on `http://localhost:5000`

## Testing the Application

### 1. Create a Test Account
- Go to `http://localhost:5173/register`
- Fill in name, email, and password
- Click Register (auto-logs in after registration)

### 2. Browse Products
- Click "Products" in navbar
- Click on any product to see details
- Select quantity and add to cart

### 3. Complete a Purchase
- Click cart icon in navbar
- Review items
- Click "Proceed to Checkout"
- Fill shipping address
- Click "Place Order"

### 4. View Orders
- Click "Orders" in navbar
- View order history
- Click "View" to see order details

### 5. Admin Access
- Register/login as an admin account (if seeded in backend)
- Click "Admin" in navbar
- View dashboard with statistics
- Click "Manage Products" to see all products

## File Structure Quick Reference

```
src/
├── api/           → API calls (axios, auth, product, order)
├── components/    → Reusable components (Navbar, Footer, ProductCard, ProtectedRoute)
├── context/       → AuthContext for global auth state
├── hooks/         → useAuth, useCart custom hooks
├── pages/         → All page components (10 pages)
├── types/         → TypeScript type definitions
├── utils/         → Token utilities
├── App.tsx        → Main app with routing
└── main.tsx       → Entry point
```

## Key Features

✅ **Authentication**
- Register new users
- Login with email/password
- Automatic token management
- Logout functionality

✅ **Products**
- Browse all products
- View product details
- See ratings and stock status
- Responsive product cards

✅ **Shopping**
- Add items to cart
- Update quantities
- Remove items
- Cart persists in localStorage
- Calculate totals with tax & shipping

✅ **Orders**
- Create orders with shipping address
- Select payment method
- View order history
- Track order status

✅ **Admin**
- View dashboard with analytics
- Manage products (view only in current version)
- See revenue and order stats

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Troubleshooting

### "Cannot connect to API"
- Check backend is running on port 5000
- Verify `.env.local` has correct API URL
- Check browser console (F12) for errors

### "Cart not saving"
- Make sure localStorage is enabled
- Don't use incognito/private mode
- Check browser storage limit

### "Login not working"
- Ensure backend user endpoint is working
- Check network tab in DevTools
- Verify credentials are correct

### "Port 5173 already in use"
```bash
# Kill process on port 5173, then:
npm run dev -- --port 5174
```

## API Endpoints Used

### Auth
- `POST /api/users` - Register
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Profile
- `PUT /api/users/profile` - Update profile

### Products
- `GET /api/products` - All products
- `GET /api/products/:id` - Product details

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - User orders
- `GET /api/orders/:id` - Order details
- `PUT /api/orders/:id/payment` - Mark as paid

## Browser DevTools Tips

**Network Tab**
- Check API requests and responses
- Verify token is being sent in headers
- Debug CORS issues

**Console Tab**
- Check for TypeScript errors
- View API error messages
- Monitor warnings

**Storage Tab**
- See localStorage data (user, token, cart)
- Clear storage if needed
- Check what's being saved

## Next Steps

1. ✅ Install dependencies
2. ✅ Start backend
3. ✅ Start frontend
4. ✅ Test registration & login
5. ✅ Test product browsing
6. ✅ Complete purchase flow
7. ✅ View order history
8. 🔮 Ready for deployment!

## Deployment

### Build Production Bundle
```bash
npm run build
```

This creates optimized files in `dist/` folder.

### Deploy to Vercel/Netlify
1. Connect your repo to Vercel or Netlify
2. Set environment variable: `VITE_API_BASE_URL=https://your-backend-url/api`
3. Deploy!

### Deploy to Custom Server
1. Build: `npm run build`
2. Upload `dist/` folder to your server
3. Configure web server to serve index.html for all routes (SPA configuration)

## Need Help?

Check these files:
- `FRONTEND_README.md` - Comprehensive documentation
- `IMPLEMENTATION_SUMMARY.md` - Architecture details
- Individual component files - Inline comments

---

**Happy coding! 🎉**
