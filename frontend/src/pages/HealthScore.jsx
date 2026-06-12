import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { Card, PageHeader } from "@/components/Shared";
import { CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";

const dot = (status) => status === "green" ? "bg-green-500" : status === "yellow" ? "bg-amber-500" : "bg-red-500";
const icon = (status) => status === "green" ? <CheckCircle2 className="text-green-600" size={20} /> :
  status === "yellow" ? <AlertTriangle className="text-amber-600" size={20} /> :
  <AlertCircle className="text-red-600" size={20} />;
const bg = (status) => status === "green" ? "bg-green-50 border-green-200" :
  status === "yellow" ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

const HealthScore = () => {
  const [data, setData] = useState(null);
  useEffect(() => { (async () => { const { data } = await api.get("/health-score"); setData(data); })(); }, []);
  if (!data) return <div className="p-10 text-slate-500">Loading...</div>;

  const overallBg = bg(data.overall_status);
  const overallText = data.overall_status === "green" ? "text-green-700" : data.overall_status === "yellow" ? "text-amber-700" : "text-red-700";

  return (
    <div>
      <PageHeader title="Factory Health Score" subtitle="Operational diagnostics" />
      <div className={`${overallBg} border rounded-lg p-8 mb-6`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 mb-2">Overall Score</div>
            <div className="flex items-baseline gap-3">
              <div className={`font-heading text-7xl font-black tabular-nums ${overallText}`}>{data.overall_score}</div>
              <div className="text-2xl font-bold text-slate-500">/100</div>
            </div>
            <div className={`mt-2 text-lg font-bold uppercase tracking-wider ${overallText}`}>Status: {data.overall_status}</div>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-md">
            <div className={`w-3 h-3 rounded-full ${dot(data.overall_status)}`} />
            <div className="text-sm font-semibold text-slate-700">Live diagnostic · {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {data.checks.map((c) => (
          <div key={c.key} className={`border rounded-lg p-5 ${bg(c.status)}`}>
            <div className="flex items-start gap-3">
              {icon(c.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-heading font-bold text-slate-900">{c.label}</div>
                  {c.value !== null && c.value !== undefined && (
                    <div className="font-heading font-black tabular-nums text-slate-900">{c.value}{c.key.endsWith("_pct") || c.key === "recovery" || c.key === "loss" || c.key === "capacity" || c.key === "concentration" ? "" : ""}</div>
                  )}
                </div>
                <div className="text-sm text-slate-700 mt-1">{c.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-heading text-lg font-bold mb-4">Management Recommendations</h3>
        {data.recommendations.length === 0 ? (
          <div className="text-sm text-slate-500">All systems running smoothly. No urgent actions required.</div>
        ) : (
          <ul className="space-y-3">
            {data.recommendations.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700"><span className="text-amber-500 font-bold">→</span>{r}</li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default HealthScore;
