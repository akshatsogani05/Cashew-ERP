import React, { useState } from "react";
import { Card, PageHeader, Button, Input } from "@/components/Shared";
import { FileSpreadsheet, FileText } from "lucide-react";
import { API } from "@/lib/apiClient";

const REPORTS = [
  { key: "production", label: "Daily Production Report", desc: "Batch-wise output, recovery and yield" },
  { key: "sales", label: "Daily Sales Report", desc: "Order book, customers, values" },
  { key: "inventory", label: "Inventory Report", desc: "Current stock levels, reserved and available" },
  { key: "profit", label: "Monthly Profit Report", desc: "Revenue and profitability summary" },
  { key: "customers", label: "Customer Report", desc: "Customer master with credit limits" },
  { key: "suppliers", label: "Supplier Report", desc: "Supplier master" },
  { key: "procurement", label: "Procurement Report", desc: "Purchase records with landing cost" },
];

const Reports = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const download = (key, fmt) => {
    const token = localStorage.getItem("cashew_token") || "";
    const q = new URLSearchParams({ fmt });
    if (from) q.set("date_from", from);
    if (to) q.set("date_to", to);
    const url = `${API}/reports/${key}?${q.toString()}`;
    fetch(url, { credentials: "include", headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r => r.blob())
      .then(blob => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${key}_report.${fmt === "pdf" ? "pdf" : "xlsx"}`;
        a.click();
      });
  };

  return (
    <div>
      <PageHeader title="Reports" subtitle="Exports & analytics" />
      <Card className="p-5 mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Date Range Filter</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">From</label>
            <Input data-testid="report-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">To</label>
            <Input data-testid="report-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((r) => (
          <Card key={r.key} className="p-5">
            <div className="font-heading text-lg font-bold text-slate-900">{r.label}</div>
            <div className="text-sm text-slate-600 mt-1 mb-4">{r.desc}</div>
            <div className="flex gap-2">
              <Button data-testid={`download-${r.key}-excel`} variant="primary" onClick={() => download(r.key, "excel")}>
                <FileSpreadsheet size={16} /> Excel
              </Button>
              <Button data-testid={`download-${r.key}-pdf`} variant="secondary" onClick={() => download(r.key, "pdf")}>
                <FileText size={16} /> PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
