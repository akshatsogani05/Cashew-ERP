import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { CrudTable, PageHeader, Card, Badge, fmt, fmtCurrency } from "@/components/Shared";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Production = () => {
  const [batches, setBatches] = useState([]);
  const [trends, setTrends] = useState([]);
  useEffect(() => { (async () => {
    const [b, t] = await Promise.all([api.get("/production"), api.get("/dashboard/trends")]);
    setBatches(b.data || []); setTrends(t.data.series || []);
  })(); }, []);

  const totalInput = batches.reduce((s, b) => s + (b.input_kg || 0), 0);
  const totalOutput = batches.reduce((s, b) => s + (b.output_kg || 0), 0);
  const avgRecovery = batches.length ? (batches.reduce((s, b) => s + (b.recovery_pct || 0), 0) / batches.length) : 0;
  const avgLoss = batches.length ? (batches.reduce((s, b) => s + (b.loss_pct || 0), 0) / batches.length) : 0;

  // grade output total
  const gradeTotals = {};
  batches.forEach(b => {
    if (b.grade_output) Object.entries(b.grade_output).forEach(([g, v]) => { gradeTotals[g] = (gradeTotals[g] || 0) + Number(v || 0); });
  });
  const gradeData = Object.entries(gradeTotals).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Input</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{fmt(totalInput)} kg</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Output</div><div className="font-heading text-3xl font-black mt-2 tabular-nums">{fmt(totalOutput)} kg</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Recovery</div><div className="font-heading text-3xl font-black mt-2 text-green-600 tabular-nums">{avgRecovery.toFixed(1)}%</div></Card>
        <Card className="p-5"><div className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Loss</div><div className="font-heading text-3xl font-black mt-2 text-amber-600 tabular-nums">{avgLoss.toFixed(1)}%</div></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <h3 className="font-heading text-lg font-bold mb-4">Monthly Production Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trends}>
              <CartesianGrid stroke="#F1F5F9" />
              <XAxis dataKey="month" fontSize={12} stroke="#64748B" />
              <YAxis fontSize={12} stroke="#64748B" />
              <Tooltip />
              <Line type="monotone" dataKey="production" stroke="#0F172A" strokeWidth={2} name="Output (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-heading text-lg font-bold mb-4">Output by Grade</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gradeData}>
              <CartesianGrid stroke="#F1F5F9" />
              <XAxis dataKey="name" fontSize={11} stroke="#64748B" angle={-25} textAnchor="end" height={60} />
              <YAxis fontSize={12} stroke="#64748B" />
              <Tooltip />
              <Bar dataKey="value" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <CrudTable resource="production"
        title="Production Batches" subtitle="Batch records"
        testIdPrefix="production"
        columns={[
          { key: "batch_no", label: "Batch #" },
          { key: "start_date", label: "Start" },
          { key: "end_date", label: "End" },
          { key: "input_kg", label: "Input (kg)", align: "right", render: (r) => fmt(r.input_kg) },
          { key: "output_kg", label: "Output (kg)", align: "right", render: (r) => fmt(r.output_kg) },
          { key: "recovery_pct", label: "Recovery", align: "right", render: (r) => `${r.recovery_pct}%` },
          { key: "yield_pct", label: "Yield", align: "right", render: (r) => `${r.yield_pct}%` },
          { key: "loss_pct", label: "Loss", align: "right", render: (r) => `${r.loss_pct}%` },
          { key: "status", label: "Status", render: (r) => <Badge variant="success">{r.status}</Badge> },
        ]}
        formFields={[
          { key: "batch_no", label: "Batch No" },
          { key: "start_date", label: "Start Date", type: "date" },
          { key: "end_date", label: "End Date", type: "date" },
          { key: "input_kg", label: "Input (kg)", type: "number" },
          { key: "output_kg", label: "Output (kg)", type: "number" },
          { key: "recovery_pct", label: "Recovery %", type: "number" },
          { key: "yield_pct", label: "Yield %", type: "number" },
          { key: "loss_pct", label: "Loss %", type: "number" },
          { key: "status", label: "Status", type: "select", options: ["Planned", "In Progress", "Completed"] },
        ]} />
    </div>
  );
};

export default Production;
