import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { CrudTable, PageHeader, Card, fmt, fmtCurrency } from "@/components/Shared";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Procurement = () => {
  const [trends, setTrends] = useState([]);
  const [procs, setProcs] = useState([]);

  useEffect(() => {
    (async () => {
      const [t, p] = await Promise.all([api.get("/dashboard/trends"), api.get("/procurements")]);
      setTrends(t.data.series || []);
      setProcs(p.data || []);
    })();
  }, []);

  const totalSpend = procs.reduce((s, p) => s + (p.landing_cost || 0), 0);
  const totalQty = procs.reduce((s, p) => s + (p.quantity_kg || 0), 0);
  const avgRate = totalQty ? totalSpend / totalQty : 0;

  // supplier-wise
  const bySupplier = {};
  procs.forEach(p => {
    bySupplier[p.supplier_name] = (bySupplier[p.supplier_name] || 0) + (p.total_cost || 0);
  });
  const supplierData = Object.entries(bySupplier).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);

  return (
    <div>
      <PageHeader title="Procurement" subtitle="Raw Material" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Spend (YTD)</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{fmtCurrency(totalSpend)}</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Quantity</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{fmt(totalQty)} kg</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Landing Rate</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">₹{avgRate.toFixed(1)}/kg</div></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <h3 className="font-heading text-lg font-bold mb-4">Monthly Procurement</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trends}>
              <CartesianGrid stroke="#F1F5F9" />
              <XAxis dataKey="month" fontSize={12} stroke="#64748B" />
              <YAxis fontSize={12} stroke="#64748B" tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip />
              <Line type="monotone" dataKey="procurement" stroke="#F59E0B" strokeWidth={2} name="Procurement" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-heading text-lg font-bold mb-4">Top Suppliers</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={supplierData} layout="vertical">
              <CartesianGrid stroke="#F1F5F9" />
              <XAxis type="number" fontSize={11} stroke="#64748B" tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <YAxis dataKey="name" type="category" fontSize={11} stroke="#64748B" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#0F172A" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <CrudTable resource="procurements"
        title="Purchase Records" subtitle="All purchases"
        testIdPrefix="procurement"
        columns={[
          { key: "purchase_date", label: "Date" },
          { key: "supplier_name", label: "Supplier" },
          { key: "quantity_kg", label: "Qty (kg)", align: "right", render: (r) => fmt(r.quantity_kg) },
          { key: "rate", label: "Rate", align: "right", render: (r) => `₹${r.rate}` },
          { key: "total_cost", label: "Cost", align: "right", render: (r) => fmtCurrency(r.total_cost) },
          { key: "moisture_pct", label: "Moisture %", align: "right" },
          { key: "origin", label: "Origin" },
        ]}
        formFields={[
          { key: "purchase_date", label: "Purchase Date", type: "date" },
          { key: "supplier_name", label: "Supplier" },
          { key: "quantity_kg", label: "Quantity (kg)", type: "number" },
          { key: "rate", label: "Rate per kg", type: "number" },
          { key: "total_cost", label: "Total Cost", type: "number" },
          { key: "freight_cost", label: "Freight Cost", type: "number" },
          { key: "landing_cost", label: "Landing Cost", type: "number" },
          { key: "moisture_pct", label: "Moisture %", type: "number" },
          { key: "origin", label: "Origin" },
          { key: "quality_notes", label: "Quality Notes", full: true },
        ]} />
    </div>
  );
};

export default Procurement;
