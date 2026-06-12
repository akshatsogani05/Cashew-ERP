import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { Card, PageHeader, fmtCurrency, fmt } from "@/components/Shared";

const StatCard = ({ label, value, color = "text-slate-900" }) => (
  <Card className="p-5">
    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
    <div className={`font-heading text-2xl font-black mt-2 tabular-nums ${color}`}>{value}</div>
  </Card>
);

const RankingList = ({ title, items, valueKey, formatter }) => (
  <Card className="p-5">
    <h3 className="font-heading text-lg font-bold mb-4">{title}</h3>
    <div className="space-y-2">
      {items.slice(0, 8).map((it, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold tabular-nums">{i + 1}</div>
            <div className="font-medium text-slate-900">{it._id}</div>
          </div>
          <div className="font-heading font-bold tabular-nums text-slate-900">{formatter(it[valueKey])}</div>
        </div>
      ))}
    </div>
  </Card>
);

const Analytics = () => {
  const [kpis, setKpis] = useState(null);
  const [rankings, setRankings] = useState(null);
  useEffect(() => { (async () => {
    const [k, r] = await Promise.all([api.get("/analytics/kpis"), api.get("/analytics/rankings")]);
    setKpis(k.data); setRankings(r.data);
  })(); }, []);

  if (!kpis || !rankings) return <div className="p-10 text-slate-500">Loading...</div>;

  return (
    <div>
      <PageHeader title="Business Analytics" subtitle="KPIs & Rankings" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg Recovery" value={`${kpis.avg_recovery_pct}%`} color="text-green-600" />
        <StatCard label="Avg Yield" value={`${kpis.avg_yield_pct}%`} />
        <StatCard label="Avg Loss" value={`${kpis.avg_loss_pct}%`} color="text-amber-600" />
        <StatCard label="Capacity Util." value={`${kpis.capacity_utilization_pct}%`} />
        <StatCard label="Avg Selling Price" value={`₹${kpis.average_selling_price}/kg`} />
        <StatCard label="Customer Retention" value={`${kpis.customer_retention_pct}%`} color="text-green-600" />
        <StatCard label="Inventory Turnover" value={`${kpis.inventory_turnover}x`} />
        <StatCard label="Repeat Customers" value={`${kpis.repeat_customers}/${kpis.total_customers}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RankingList title="Top Customers (by revenue)" items={rankings.top_customers} valueKey="revenue" formatter={(v) => fmtCurrency(v)} />
        <RankingList title="Top Products (by revenue)" items={rankings.top_products} valueKey="revenue" formatter={(v) => fmtCurrency(v)} />
        <RankingList title="Top Suppliers (by value)" items={rankings.top_suppliers} valueKey="value" formatter={(v) => fmtCurrency(v)} />
      </div>
    </div>
  );
};

export default Analytics;
