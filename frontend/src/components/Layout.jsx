import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, Package, ShoppingCart, Truck, BarChart3, Wallet, FileBarChart,
  Bell, Activity, Database, Factory, LogOut, Menu, X, Search, Users
} from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/master-data", label: "Master Data", icon: Database },
  { to: "/procurement", label: "Procurement", icon: ShoppingCart },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/production", label: "Production", icon: Factory },
  { to: "/sales", label: "Sales", icon: Users },
  { to: "/dispatch", label: "Dispatch", icon: Truck },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/health-score", label: "Health Score", icon: Activity },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        data-testid="sidebar"
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col z-50 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="px-6 h-16 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center font-heading font-black text-slate-900">C</div>
            <div>
              <div className="font-heading font-bold text-white text-sm leading-tight">CASHEW</div>
              <div className="font-heading text-[10px] tracking-[0.2em] text-slate-400">ERP SYSTEM</div>
            </div>
          </div>
          <button data-testid="sidebar-close" className="lg:hidden text-slate-400" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto sidebar-scroll py-4">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              data-testid={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-slate-800 text-white border-l-2 border-amber-500" : "hover:bg-slate-800 hover:text-white border-l-2 border-transparent"
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold text-white truncate" data-testid="user-name">{user?.name || 'User'}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider" data-testid="user-role">{user?.role?.replace(/_/g, ' ')}</div>
          </div>
          <button
            data-testid="logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Topbar */}
      <header className="lg:ml-64 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-3 flex-1">
          <button data-testid="sidebar-open" className="lg:hidden text-slate-600" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="relative max-w-md w-full hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="topbar-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search anything..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <NavLink to="/notifications" data-testid="topbar-notifications" className="p-2 hover:bg-slate-100 rounded-md text-slate-600 relative">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
          </NavLink>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="text-sm font-medium text-slate-700">{user?.name?.split(' ')[0]}</div>
          </div>
        </div>
      </header>

      <main className="lg:ml-64 p-4 lg:p-8" data-testid="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
