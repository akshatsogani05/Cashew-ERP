import React from "react";
import { CrudTable, Badge, fmt } from "@/components/Shared";

const Dispatch = () => {
  const statusVariant = (s) =>
    s === "Delivered" ? "success" :
    s === "In Transit" ? "info" :
    s === "Delayed" ? "danger" : "neutral";
  return (
    <CrudTable resource="dispatches"
      title="Dispatch" subtitle="Shipments & Logistics"
      testIdPrefix="dispatch"
      columns={[
        { key: "dispatch_no", label: "Dispatch #" },
        { key: "dispatch_date", label: "Date" },
        { key: "order_no", label: "Order #" },
        { key: "vehicle_no", label: "Vehicle" },
        { key: "lr_number", label: "LR #" },
        { key: "transporter", label: "Transporter" },
        { key: "destination", label: "Destination" },
        { key: "product_name", label: "Product" },
        { key: "quantity_kg", label: "Qty (kg)", align: "right", render: (r) => fmt(r.quantity_kg) },
        { key: "status", label: "Status", render: (r) => <Badge variant={statusVariant(r.status)}>{r.status}</Badge> },
      ]}
      formFields={[
        { key: "dispatch_no", label: "Dispatch No" },
        { key: "dispatch_date", label: "Dispatch Date", type: "date" },
        { key: "order_no", label: "Order No" },
        { key: "vehicle_no", label: "Vehicle No" },
        { key: "lr_number", label: "LR Number" },
        { key: "transporter", label: "Transporter" },
        { key: "destination", label: "Destination" },
        { key: "product_name", label: "Product" },
        { key: "quantity_kg", label: "Quantity (kg)", type: "number" },
        { key: "status", label: "Status", type: "select", options: ["Scheduled", "In Transit", "Delivered", "Delayed"] },
      ]} />
  );
};

export default Dispatch;
