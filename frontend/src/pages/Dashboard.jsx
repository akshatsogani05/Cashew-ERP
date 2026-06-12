import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";
import { TrendingUp, TrendingDown, Factory, Truck, DollarSign, Package, Activity, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";

const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n || 0));
const fmtCurrency = (n) => `₹${new Intl.NumberFormat('en-IN').format(Math.round(n || 0))}`;

const KPI = ({ label, value, sub, icon: Icon, accent = "slate", trend }) => {
  const colorMap = {
    slate: "bg-slate-900 text-amber-500",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div data-testid={`kpi-${label.toLowerCase().replace(/\s+/g, '-')}`} className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
        <div className={`w-9 h-9 rounded-md flex items-center justify-center ${colorMap[accent]}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="font-heading text-3xl font-black text-slate-900 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
      {trend != null && (
        <div className={`flex items-center gap-1 text-xs font-medium mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend).toFixed(1)}% vs last month
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [health, setHealth] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    (async () => {
      const [s, t, h, o, n] = await Promise.all([
        api.get("/dashboard/summary"),
        api.get("/dashboard/trends"),
        api.get("/health-score"),
        api.get("/sales"),
        api.get("/notifications"),
      ]);
      setSummary(s.data); setTrends(t.data.series || []); setHealth(h.data);
      setOrders((o.data || []).slice(0, 6)); setNotes((n.data || []).slice(0, 5));
    })();
  }, []);

  if (!summary) return <div className="p-10 text-slate-500">Loading dashboard...</div>;

  const healthColor = health?.overall_status === "green" ? "text-green-600 bg-green-50 border-green-200"
    : health?.overall_status === "yellow" ? "text-amber-700 bg-amber-50 border-amber-200"
    : "text-red-600 bg-red-50 border-red-200";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Executive Console</div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
        </div>
        <div className="text-sm text-slate-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
      </div>

      {/* Today KPIs */}
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Today</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPI label="Production" value={`${fmt(summary.today.production_kg)} kg`} sub="Today's output" icon={Factory} />
          <KPI label="Dispatch" value={summary.today.dispatch_count} sub="Shipments today" icon={Truck} />
          <KPI label="Sales" value={fmtCurrency(summary.today.sales_value)} sub="Booked today" icon={DollarSign} accent="green" />
          <KPI label="Inventory Value" value={fmtCurrency(summary.today.inventory_value)} sub="Current stock" icon={Package} accent="amber" />
        </div>
      </div>

      {/* Month + YTD */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">This Month</div>
          <div className="grid grid-cols-2 gap-4">
            <KPI label="Revenue" value={fmtCurrency(summary.month.revenue)} icon={DollarSign} accent="green" />
            <KPI label="Production" value={`${fmt(summary.month.production_kg)} kg`} icon={Factory} />
            <KPI label="Profit" value={fmtCurrency(summary.month.profit)} icon={TrendingUp} accent="amber" />
            <KPI label="Orders" value={summary.month.orders} icon={Activity} />
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Year to Date</div>
          <div className="grid grid-cols-2 gap-4">
            <KPI label="Revenue" value={fmtCurrency(summary.ytd.revenue)} icon={DollarSign} accent="green" />
            <KPI label="Profit" value={fmtCurrency(summary.ytd.profit)} icon={TrendingUp} accent="amber" />
            <div className="col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">YoY Growth</div>
              <div className={`font-heading text-4xl font-black tabular-nums ${summary.ytd.growth_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {summary.ytd.growth_pct >= 0 ? '+' : ''}{summary.ytd.growth_pct}%
              </div>
              <div className="text-xs text-slate-500 mt-1">Current month vs previous</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F172A" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="sales" stroke="#0F172A" fill="url(#rev)" strokeWidth={2} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">Production vs Profit</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trends}>
              <CartesianGrid stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="production" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} name="Production (kg)" />
              <Line type="monotone" dataKey="profit" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} name="Profit (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health Score + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`border rounded-lg p-5 ${healthColor}`} data-testid="dashboard-health-card">
          <div className="text-xs font-bold uppercase tracking-wider mb-2">Factory Health Score</div>
          <div className="flex items-baseline gap-2 mb-2">
            <div className="font-heading text-5xl font-black tabular-nums">{health?.overall_score || 0}</div>
            <div className="text-sm font-bold uppercase">/100</div>
          </div>
          <div className="text-sm font-semibold uppercase tracking-wider mb-3">
            Status: {health?.overall_status}
          </div>
          <div className="space-y-1 text-xs">
            {(health?.recommendations || []).slice(0, 2).map((r, i) => (
              <div key={i} className="opacity-80">• {r}</div>
            ))}
          </div>
          <NavLink to="/health-score" className="inline-block mt-3 text-xs font-bold underline">View full report →</NavLink>
        </div>

        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-slate-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { to: "/sales", label: "New Order" },
              { to: "/production", label: "New Batch" },
              { to: "/procurement", label: "Add Purchase" },
              { to: "/dispatch", label: "New Dispatch" },
              { to: "/inventory", label: "Stock Check" },
              { to: "/reports", label: "Run Report" },
              { to: "/master-data", label: "Add Customer" },
              { to: "/accounts", label: "Record Txn" },
            ].map((a) => (
              <NavLink key={a.to + a.label} to={a.to} data-testid={`qa-${a.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-md hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors text-sm font-medium text-slate-700">
                <Plus size={14} /> {a.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="text-left py-2 font-bold">Order #</th>
                  <th className="text-left font-bold">Customer</th>
                  <th className="text-left font-bold">Product</th>
                  <th className="text-right font-bold">Qty</th>
                  <th className="text-right font-bold">Value</th>
                  <th className="text-right font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-2.5 font-mono text-xs">{o.order_no}</td>
                    <td className="font-medium text-slate-900">{o.customer_name}</td>
                    <td className="text-slate-600">{o.product_name}</td>
                    <td className="text-right tabular-nums">{fmt(o.quantity_kg)} kg</td>
                    <td className="text-right tabular-nums font-semibold">{fmtCurrency(o.total_value)}</td>
                    <td className="text-right">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">Alerts</h3>
          <div className="space-y-3">
            {notes.length === 0 && <div className="text-sm text-slate-500">No active alerts</div>}
            {notes.map((n) => {
              const sev = n.severity === "danger" ? "border-red-500 bg-red-50" : n.severity === "warning" ? "border-amber-500 bg-amber-50" : "border-slate-300 bg-slate-50";
              return (
                <div key={n.id} className={`border-l-4 ${sev} p-3 rounded-r`}>
                  <div className="text-sm font-semibold text-slate-900">{n.title}</div>
                  <div className="text-xs text-slate-600 mt-1">{n.message}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
