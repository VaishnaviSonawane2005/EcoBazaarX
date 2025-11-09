# EcobazaarX - Carbon Footprint Aware E-Commerce Platform

A modern, eco-themed e-commerce platform built with React, TypeScript, and Vite, featuring role-based authentication and carbon footprint tracking.

## 🚀 Quick Setup

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager (comes with Node.js)
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

### Installation Steps

1. **Open the project in VS Code**
   ```bash
   cd path/to/ecobazaarx
   code .
   ```

2. **Install dependencies**
   
   Open the integrated terminal in VS Code (`Ctrl+`` or `View > Terminal`) and run:
   
   ```bash
   npm install
   ```
   
   Or if you prefer yarn:
   
   ```bash
   yarn install
   ```

3. **Start the development server**
   
   ```bash
   npm run dev
   ```
   
   Or with yarn:
   
   ```bash
   yarn dev
   ```

4. **Open the application**
   
   The app will automatically open in your default browser at `http://localhost:3000`
   
   If it doesn't open automatically, navigate to: **http://localhost:3000**

## 👥 User Roles & Authentication

### Admin Login
- **Email**: `admin@ecobazaarx.com`
- **Password**: `Admin@123`
- **Note**: Admin accounts are login-only (no signup)

### Seller Account
- Can signup via the signup page
- Requires admin verification before listing products
- After verification, can manage products and view analytics

### Customer Account
- Full signup/login access
- Can browse products, manage cart, and track carbon footprint
- Earns carbon points for eco-friendly purchases

## 🎨 Features

- **Role-Based Dashboards**: Separate interfaces for Admin, Seller, and Customer
- **Authentication**: Email/Password login with role detection
- **Carbon Tracking**: Track carbon footprint of purchases
- **Product Management**: Full CRUD operations for products
- **Seller Verification**: Admin approval workflow for new sellers
- **Responsive Design**: Mobile-friendly eco-themed UI
- **Analytics**: Platform-wide and seller-specific analytics

## 📁 Project Structure

```
ecobazaarx/
├── components/          # Reusable React components
│   ├── admin/          # Admin-specific components
│   ├── customer/       # Customer-specific components
│   ├── seller/         # Seller-specific components
│   └── ui/             # Shadcn UI components
├── contexts/           # React Context providers
├── pages/              # Page components
├── services/           # Business logic & API services
├── styles/             # Global styles
└── App.tsx             # Main application component
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 VS Code Recommended Extensions

Install these extensions for the best development experience:

1. **ESLint** (`dbaeumer.vscode-eslint`)
2. **Prettier** (`esbenp.prettier-vscode`)
3. **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
4. **TypeScript and JavaScript Language Features** (built-in)
5. **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)

## 📦 Key Dependencies

### Core
- **React** 18.3.1 - UI library
- **TypeScript** 5.5.3 - Type safety
- **Vite** 5.4.3 - Build tool
- **React Router DOM** 6.26.0 - Routing

### UI & Styling
- **Tailwind CSS** 4.0.0 - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Pre-built components
- **Lucide React** - Icon library

### Charts & Visualization
- **Recharts** 2.12.7 - Chart library

### Utilities
- **date-fns** - Date manipulation
- **clsx** - Conditional classnames
- **tailwind-merge** - Merge Tailwind classes

## 🐛 Troubleshooting

### Port already in use
If port 3000 is already in use, you can change it in `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change to any available port
  open: true,
}
```

### Module not found errors
Make sure all dependencies are installed:

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
Clear the TypeScript cache:

```bash
rm -rf node_modules/.vite
npm run dev
```

## 🌱 Environment Variables (Optional)

Create a `.env` file in the root directory for any environment-specific variables:

```env
VITE_APP_NAME=EcobazaarX
VITE_API_URL=http://localhost:3000/api
```

## 📝 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, please contact the development team.
