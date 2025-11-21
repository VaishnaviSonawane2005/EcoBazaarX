// src/components/DashboardLayout.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Leaf, LogOut, Menu, X, ShoppingCart, User, Bell, Settings, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import ProfileSettings from "./ProfileSettings";
import EditProfile from "./EditProfile";
import NotificationsPanel from "./NotificationsPanel";

export default function DashboardLayout({ children, title, role, menuItems }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActivePath = (path) => {
    if (!path) return false;
    const normalized = path.replace(/\/+$/, "");
    const current = location.pathname.replace(/\/+$/, "");
    if (normalized === `/${role?.toLowerCase()}`) return current === normalized;
    return current.startsWith(normalized);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X /> : <Menu />}
              </Button>

              <Link to="/" className="flex items-center gap-2 text-emerald-600">
                <Leaf className="w-6 h-6" />
                <span className="hidden sm:inline font-semibold">EcoBazaarX</span>
              </Link>

              {role === "CUSTOMER" && user?.carbonPoints !== undefined && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <Leaf className="w-3 h-3 mr-1" />
                  {user.carbonPoints} Points
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {role === "CUSTOMER" && (
                <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/customer/cart")}>
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-emerald-600">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              )}

              <Button variant="ghost" size="icon" className="relative" onClick={() => setNotificationsOpen(true)}>
                <Bell className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <User className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name || user?.username || "Guest"}</span>
                      <span className="text-xs text-gray-500">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
                    <UserCircle className="w-4 h-4 mr-2" /> Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r z-20 transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <nav className="p-4 space-y-1 overflow-y-auto h-full">
            {menuItems?.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActivePath(item.path) ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 lg:p-8 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {title && <h1 className="mb-6 text-2xl font-semibold">{title}</h1>}
            {children}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-10 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <ProfileSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
      <EditProfile open={editProfileOpen} onOpenChange={setEditProfileOpen} />
      <NotificationsPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </div>
  );
}
