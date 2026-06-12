import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { Card, PageHeader } from "@/components/Shared";
import { Bell, AlertTriangle, AlertCircle, Info } from "lucide-react";

const sevColor = {
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
};
const sevIcon = (s) => s === "danger" ? <AlertCircle size={20} /> : s === "warning" ? <AlertTriangle size={20} /> : <Info size={20} />;

const Notifications = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { (async () => { const { data } = await api.get("/notifications"); setItems(data || []); })(); }, []);

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Alerts & reminders" />
      {items.length === 0 ? (
        <Card className="p-10 text-center text-slate-500">
          <Bell size={28} className="mx-auto mb-3 text-slate-400" />
          No notifications at the moment.
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className={`border-l-4 ${sevColor[n.severity] || sevColor.info} border rounded-md p-4 flex gap-3`}>
              <div className="pt-1">{sevIcon(n.severity)}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{n.title}</div>
                <div className="text-sm text-slate-700 mt-1">{n.message}</div>
                <div className="text-xs text-slate-500 mt-2">{new Date(n.date).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
