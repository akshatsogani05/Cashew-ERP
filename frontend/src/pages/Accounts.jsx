import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { Card, PageHeader, fmtCurrency } from "@/components/Shared";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#0F172A", "#F59E0B", "#22C55E", "#EF4444", "#475569", "#3B82F6"];

const Accounts = () => {
  const [txns, setTxns] = useState([]);
  useEffect(() => { (async () => { const { data } = await api.get("/accounts"); setTxns(data || []); })(); }, []);

  const revenue = txns.filter(t => t.type === "Revenue").reduce((s, t) => s + (t.amount || 0), 0);
  const costs = txns.filter(t => t.type === "Cost").reduce((s, t) => s + Math.abs(t.amount || 0), 0);
  const profit = revenue - costs;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  // by category
  const costByCat = {};
  txns.filter(t => t.type === "Cost").forEach(t => {
    costByCat[t.category] = (costByCat[t.category] || 0) + Math.abs(t.amount || 0);
  });
  const costData = Object.entries(costByCat).map(([name, value]) => ({ name, value: Math.round(value) }));

  return (
    <div>
      <PageHeader title="Accounts & Profitability" subtitle="Financials" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Revenue</div><div className="font-heading text-3xl font-black mt-2 text-green-600 tabular-nums">{fmtCurrency(revenue)}</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Costs</div><div className="font-heading text-3xl font-black mt-2 text-red-600 tabular-nums">{fmtCurrency(costs)}</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Profit</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{fmtCurrency(profit)}</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Gross Margin %</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{margin.toFixed(1)}%</div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <h3 className="font-heading text-lg font-bold mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={costData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(d) => d.name}>
                {costData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => fmtCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-heading text-lg font-bold mb-4">Cost Categories</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costData} layout="vertical">
              <CartesianGrid stroke="#F1F5F9" />
              <XAxis type="number" fontSize={11} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} stroke="#64748B" />
              <YAxis dataKey="name" type="category" fontSize={12} stroke="#64748B" width={100} />
              <Tooltip formatter={(v) => fmtCurrency(v)} />
              <Bar dataKey="value" fill="#0F172A" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="font-heading text-lg font-bold">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Description</th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
              </tr>
            </thead>
            <tbody>
              {txns.slice(0, 50).map(t => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-2.5">{t.date}</td>
                  <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.type === "Revenue" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>{t.type}</span></td>
                  <td className="px-4 py-2.5">{t.category}</td>
                  <td className="px-4 py-2.5 text-slate-600">{t.description}</td>
                  <td className={`px-4 py-2.5 text-right tabular-nums font-semibold ${t.amount >= 0 ? "text-green-700" : "text-red-700"}`}>{fmtCurrency(Math.abs(t.amount))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Accounts;
