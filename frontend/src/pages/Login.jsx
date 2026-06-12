import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, Mail, Factory, AlertCircle } from "lucide-react";

const DEMO_ACCOUNTS = [
  { email: "admin@cashewerp.com", password: "admin123", role: "Admin" },
  { email: "sales@cashewerp.com", password: "sales123", role: "Sales Manager" },
  { email: "production@cashewerp.com", password: "prod123", role: "Production Manager" },
  { email: "inventory@cashewerp.com", password: "inv123", role: "Inventory Manager" },
  { email: "accounts@cashewerp.com", password: "acc123", role: "Accounts Manager" },
  { email: "dispatch@cashewerp.com", password: "disp123", role: "Dispatch Manager" },
];

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@cashewerp.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user && user !== false) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const selectAccount = (a) => { setEmail(a.email); setPassword(a.password); };

  return (
    <div className="min-h-screen flex">
      {/* Left: visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 text-white p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200)",
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-900/95" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md bg-amber-500 flex items-center justify-center">
              <Factory size={26} className="text-slate-900" />
            </div>
            <div>
              <div className="font-heading text-2xl font-black tracking-tight">CASHEW ERP</div>
              <div className="font-heading text-xs tracking-[0.3em] text-amber-400">ENTERPRISE EDITION</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h1 className="font-heading text-4xl xl:text-5xl font-black leading-tight tracking-tight">
            Industrial-grade ERP for cashew processors.
          </h1>
          <p className="mt-6 text-slate-300 text-lg leading-relaxed">
            Procurement to dispatch — real-time control over production, inventory, sales and profitability.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-sm">
            <div><div className="font-heading text-2xl font-bold text-amber-400">12</div><div className="text-slate-400">Modules</div></div>
            <div><div className="font-heading text-2xl font-bold text-amber-400">6</div><div className="text-slate-400">Roles</div></div>
            <div><div className="font-heading text-2xl font-bold text-amber-400">24/7</div><div className="text-slate-400">Operations</div></div>
          </div>
        </div>
        <div className="relative z-10 text-xs text-slate-500 uppercase tracking-[0.2em]">
          v1.0 · Production Ready
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-slate-900 flex items-center justify-center">
              <Factory size={20} className="text-amber-500" />
            </div>
            <div>
              <div className="font-heading text-lg font-black">CASHEW ERP</div>
            </div>
          </div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Welcome back</div>
          <h2 className="font-heading text-3xl font-black text-slate-900 mb-2">Sign in</h2>
          <p className="text-slate-600 mb-8 text-sm">Access the executive console for Cashew operations.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  data-testid="login-email"
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  data-testid="login-password"
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
            {error && (
              <div data-testid="login-error" className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <button
              data-testid="login-submit"
              type="submit" disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Demo accounts</div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  data-testid={`demo-${a.role.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => selectAccount(a)}
                  className="text-left px-3 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <div className="text-xs font-semibold text-slate-900">{a.role}</div>
                  <div className="text-[11px] text-slate-500 truncate">{a.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
