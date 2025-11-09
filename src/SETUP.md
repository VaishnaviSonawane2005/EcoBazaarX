# 🚀 Complete Setup Guide for EcobazaarX

## Step-by-Step Setup Instructions

### 1️⃣ Install Node.js

**Windows/Mac:**
- Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- Run the installer and follow the prompts
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2️⃣ Install VS Code

- Download from [code.visualstudio.com](https://code.visualstudio.com/)
- Install and launch VS Code

### 3️⃣ Open Project in VS Code

```bash
# Navigate to your project folder
cd path/to/ecobazaarx

# Open in VS Code
code .
```

### 4️⃣ Install Dependencies

Open the integrated terminal in VS Code:
- **Windows/Linux**: `Ctrl + \`` (backtick)
- **Mac**: `Cmd + \``

Or use: `View > Terminal` from the menu

Run:
```bash
npm install
```

This will install all dependencies listed in `package.json`. It may take 2-5 minutes.

### 5️⃣ Start Development Server

```bash
npm run dev
```

You should see output like:
```
  VITE v5.4.3  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 6️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

The app should automatically open in your default browser.

---

## 📦 All Dependencies Explained

### Production Dependencies

#### Core Framework
- `react` (18.3.1) - Core React library
- `react-dom` (18.3.1) - React DOM rendering
- `react-router-dom` (6.26.0) - Client-side routing

#### UI Components (Radix UI Primitives)
- `@radix-ui/react-*` - Accessible, unstyled UI primitives for building the Shadcn components:
  - `react-accordion` - Collapsible content sections
  - `react-alert-dialog` - Modal alerts
  - `react-avatar` - User avatars with fallback
  - `react-checkbox` - Checkbox inputs
  - `react-dialog` - Modal dialogs
  - `react-dropdown-menu` - Dropdown menus
  - `react-popover` - Popover components
  - `react-select` - Select dropdowns
  - `react-tabs` - Tab interfaces
  - `react-tooltip` - Tooltips
  - And many more...

#### Icons & Styling
- `lucide-react` (0.445.0) - Icon library (eco-friendly, leaf, shopping cart, etc.)
- `tailwind-merge` (2.5.2) - Merge Tailwind CSS classes intelligently
- `clsx` (2.1.1) - Utility for constructing className strings
- `class-variance-authority` (0.7.0) - Managing variant-based styles

#### Charts & Data Visualization
- `recharts` (2.12.7) - Charts for analytics dashboards

#### Utilities
- `date-fns` (3.6.0) - Date formatting and manipulation
- `sonner` (1.5.0) - Toast notifications
- `cmdk` (1.0.0) - Command palette component
- `embla-carousel-react` (8.3.0) - Carousel component
- `input-otp` (1.2.4) - OTP input fields
- `react-day-picker` (8.10.1) - Calendar/date picker
- `react-resizable-panels` (2.1.2) - Resizable panel layouts
- `vaul` (0.9.9) - Drawer component

### Development Dependencies

#### TypeScript
- `typescript` (5.5.3) - TypeScript compiler
- `@types/react` (18.3.5) - React type definitions
- `@types/react-dom` (18.3.0) - React DOM type definitions

#### Build Tools
- `vite` (5.4.3) - Next-generation frontend build tool
- `@vitejs/plugin-react` (4.3.1) - Vite plugin for React

#### CSS Processing
- `tailwindcss` (4.0.0) - Utility-first CSS framework
- `postcss` (8.4.45) - CSS transformation tool
- `autoprefixer` (10.4.20) - Automatically adds vendor prefixes

#### Linting
- `eslint` (8.57.0) - JavaScript/TypeScript linter
- `@typescript-eslint/eslint-plugin` (7.18.0) - ESLint rules for TypeScript
- `@typescript-eslint/parser` (7.18.0) - TypeScript parser for ESLint
- `eslint-plugin-react-hooks` (4.6.2) - ESLint rules for React Hooks
- `eslint-plugin-react-refresh` (0.4.11) - ESLint rules for React Refresh

---

## 🎯 What Each Configuration File Does

### `package.json`
- Lists all project dependencies
- Defines npm scripts (dev, build, preview, lint)
- Project metadata

### `vite.config.ts`
- Vite build tool configuration
- Sets up React plugin
- Configures path aliases
- Sets development server port (3000)

### `tsconfig.json`
- TypeScript compiler configuration
- Defines how TypeScript should compile your code
- Sets up path aliases for imports

### `postcss.config.js`
- PostCSS configuration for processing Tailwind CSS
- Required for Tailwind v4.0

### `index.html`
- Entry HTML file
- Loads the React application
- Sets page title and meta tags

### `.gitignore`
- Tells Git which files/folders to ignore
- Prevents committing node_modules, build artifacts, etc.

### `.vscode/` folder
- VS Code workspace settings
- Recommended extensions
- Editor formatting preferences

---

## 🔧 Common Commands

### Development
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

### Package Management
```bash
# Install all dependencies
npm install

# Install a new package
npm install package-name

# Remove a package
npm uninstall package-name

# Update dependencies
npm update

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 VS Code Extensions to Install

1. **ESLint** - Code linting
2. **Prettier** - Code formatting
3. **Tailwind CSS IntelliSense** - Tailwind autocomplete
4. **ES7+ React/Redux/React-Native snippets** - React code snippets

Install these by:
1. Opening VS Code
2. Click Extensions icon (or `Ctrl+Shift+X`)
3. Search for each extension
4. Click "Install"

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] VS Code installed and opened
- [ ] Dependencies installed (`node_modules` folder exists)
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] App opens in browser at `http://localhost:3000`
- [ ] Can navigate between pages
- [ ] Can login as admin (admin@ecobazaarx.com / Admin@123)

---

## 🆘 Troubleshooting

### "npm is not recognized"
- Node.js not installed or not in PATH
- Solution: Reinstall Node.js, restart terminal

### Port 3000 already in use
```bash
# Option 1: Find and kill process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Option 2: Change port in vite.config.ts
```

### Module not found errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Tailwind styles not applying
- Make sure `styles/globals.css` is imported in `App.tsx`
- Check that `@tailwind` directives are in `globals.css`

---

## 📧 Login Credentials

### Admin
- **Email**: admin@ecobazaarx.com
- **Password**: Admin@123

### Test Accounts
You can create:
- **Seller accounts** - Requires admin verification
- **Customer accounts** - Full access immediately

---

## 🎉 You're Ready!

Your EcobazaarX application should now be running successfully!

Next steps:
1. Explore the landing page
2. Login as admin to see the admin dashboard
3. Create a customer account to test shopping features
4. Create a seller account to test product management

Happy coding! 🌱
