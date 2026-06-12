import React, { useState, useEffect } from "react";
import api from "@/lib/apiClient";
import { CrudTable, PageHeader, Card, Badge, fmt, fmtCurrency } from "@/components/Shared";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const STATUSES = ["Enquiry", "Quotation", "Order", "Production Allocation", "Dispatched", "Invoiced"];

const Sales = () => {
  const [orders, setOrders] = useState([]);
  const [trends, setTrends] = useState([]);
  useEffect(() => { (async () => {
    const [o, t] = await Promise.all([api.get("/sales"), api.get("/dashboard/trends")]);
    setOrders(o.data || []); setTrends(t.data.series || []);
  })(); }, []);

  const totalRev = orders.reduce((s, o) => s + (o.total_value || 0), 0);
  const totalQty = orders.reduce((s, o) => s + (o.quantity_kg || 0), 0);
  const pipelineCount = orders.filter(o => ["Enquiry", "Quotation", "Order"].includes(o.status)).length;

  const stageCount = STATUSES.map(s => ({ stage: s, count: orders.filter(o => o.status === s).length }));

  const statusVariant = (s) =>
    s === "Invoiced" ? "success" :
    s === "Dispatched" ? "info" :
    s === "Enquiry" || s === "Quotation" ? "warning" : "neutral";

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{fmtCurrency(totalRev)}</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{orders.length}</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Volume Sold</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{fmt(totalQty)} kg</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">In Pipeline</div><div className="font-heading text-3xl font-black mt-2 text-amber-600 tabular-nums">{pipelineCount}</div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <h3 className="font-heading text-lg font-bold mb-4">Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trends}>
              <CartesianGrid stroke="#F1F5F9" />
              <XAxis dataKey="month" fontSize={12} stroke="#64748B" />
              <YAxis fontSize={12} stroke="#64748B" tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#22C55E" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-heading text-lg font-bold mb-4">Sales Pipeline</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stageCount}>
              <CartesianGrid stroke="#F1F5F9" />
              <XAxis dataKey="stage" fontSize={10} stroke="#64748B" angle={-20} textAnchor="end" height={70} />
              <YAxis fontSize={12} stroke="#64748B" />
              <Tooltip />
              <Bar dataKey="count" fill="#0F172A" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <CrudTable resource="sales"
        title="Sales Orders" subtitle="Enquiry → Invoice"
        testIdPrefix="sales"
        columns={[
          { key: "order_no", label: "Order #" },
          { key: "order_date", label: "Date" },
          { key: "customer_name", label: "Customer" },
          { key: "product_name", label: "Product" },
          { key: "quantity_kg", label: "Qty", align: "right", render: (r) => `${fmt(r.quantity_kg)} kg` },
          { key: "rate", label: "Rate", align: "right", render: (r) => `₹${r.rate}` },
          { key: "total_value", label: "Value", align: "right", render: (r) => fmtCurrency(r.total_value) },
          { key: "delivery_date", label: "Delivery" },
          { key: "status", label: "Status", render: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
        ]}
        formFields={[
          { key: "order_no", label: "Order No" },
          { key: "order_date", label: "Order Date", type: "date" },
          { key: "customer_name", label: "Customer" },
          { key: "product_name", label: "Product" },
          { key: "quantity_kg", label: "Quantity (kg)", type: "number" },
          { key: "rate", label: "Rate per kg", type: "number" },
          { key: "total_value", label: "Total Value", type: "number" },
          { key: "delivery_date", label: "Delivery Date", type: "date" },
          { key: "status", label: "Status", type: "select", options: STATUSES },
        ]} />
    </div>
  );
};

export default Sales;
