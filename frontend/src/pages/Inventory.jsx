import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { CrudTable, PageHeader, Card, Badge, fmt, fmtCurrency } from "@/components/Shared";

const Inventory = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { (async () => { const { data } = await api.get("/inventory"); setItems(data || []); })(); }, []);

  const totalValue = items.reduce((s, i) => s + (i.current_stock || 0) * (i.unit_value || 0), 0);
  const lowStock = items.filter(i => (i.available_stock || 0) < (i.low_stock_threshold || 200));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total SKUs</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{items.length}</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Stock Value</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{fmtCurrency(totalValue)}</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Low Stock Items</div><div className="font-heading text-3xl font-black mt-2 text-amber-600 tabular-nums">{lowStock.length}</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Categories</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{new Set(items.map(i => i.category)).size}</div></Card>
      </div>

      <CrudTable resource="inventory"
        title="Inventory" subtitle="Stock on hand"
        testIdPrefix="inventory"
        columns={[
          { key: "sku", label: "SKU" },
          { key: "name", label: "Item" },
          { key: "category", label: "Category", render: (r) => <Badge>{r.category}</Badge> },
          { key: "current_stock", label: "Stock", align: "right", render: (r) => fmt(r.current_stock) },
          { key: "reserved_stock", label: "Reserved", align: "right", render: (r) => fmt(r.reserved_stock) },
          { key: "available_stock", label: "Available", align: "right",
            render: (r) => <span className={(r.available_stock || 0) < (r.low_stock_threshold || 200) ? "text-red-600 font-bold" : "text-green-700 font-semibold"}>{fmt(r.available_stock)}</span> },
          { key: "warehouse", label: "Warehouse" },
          { key: "batch_no", label: "Batch" },
        ]}
        formFields={[
          { key: "sku", label: "SKU" }, { key: "name", label: "Item Name" },
          { key: "category", label: "Category" },
          { key: "current_stock", label: "Current Stock", type: "number" },
          { key: "reserved_stock", label: "Reserved Stock", type: "number" },
          { key: "available_stock", label: "Available Stock", type: "number" },
          { key: "unit_value", label: "Unit Value", type: "number" },
          { key: "warehouse", label: "Warehouse" }, { key: "batch_no", label: "Batch No" },
          { key: "low_stock_threshold", label: "Low Stock Threshold", type: "number" },
        ]} />
    </div>
  );
};

export default Inventory;
