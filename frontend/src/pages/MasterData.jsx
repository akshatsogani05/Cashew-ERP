import React, { useState } from "react";
import { CrudTable } from "@/components/Shared";

const TABS = [
  { key: "customers", label: "Customers", subtitle: "Master · Customers",
    columns: [
      { key: "name", label: "Name" },
      { key: "country", label: "Country" },
      { key: "contact_person", label: "Contact" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "credit_limit", label: "Credit Limit", align: "right",
        render: (r) => r.credit_limit ? `₹${new Intl.NumberFormat('en-IN').format(r.credit_limit)}` : '-' },
    ],
    fields: [
      { key: "name", label: "Name" }, { key: "country", label: "Country" },
      { key: "contact_person", label: "Contact Person" }, { key: "phone", label: "Phone" },
      { key: "email", label: "Email" }, { key: "credit_limit", label: "Credit Limit", type: "number" },
    ]
  },
  { key: "suppliers", label: "Suppliers", subtitle: "Master · Suppliers",
    columns: [
      { key: "name", label: "Name" }, { key: "country", label: "Country" },
      { key: "contact_person", label: "Contact" }, { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
    ],
    fields: [
      { key: "name", label: "Name" }, { key: "country", label: "Country" },
      { key: "contact_person", label: "Contact Person" }, { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
    ]
  },
  { key: "products", label: "Products", subtitle: "Master · Products",
    columns: [
      { key: "sku", label: "SKU" }, { key: "name", label: "Name" },
      { key: "category", label: "Category" }, { key: "unit", label: "Unit" },
      { key: "rate_per_kg", label: "Rate/kg", align: "right",
        render: (r) => r.rate_per_kg ? `₹${r.rate_per_kg}` : '-' },
    ],
    fields: [
      { key: "sku", label: "SKU" }, { key: "name", label: "Name" },
      { key: "category", label: "Category" }, { key: "unit", label: "Unit" },
      { key: "rate_per_kg", label: "Rate/kg", type: "number" },
    ]
  },
  { key: "categories", label: "Categories", subtitle: "Master · Categories",
    columns: [{ key: "name", label: "Name" }],
    fields: [{ key: "name", label: "Name" }]
  },
  { key: "employees", label: "Employees", subtitle: "Master · Employees",
    columns: [
      { key: "name", label: "Name" }, { key: "role", label: "Role" },
      { key: "phone", label: "Phone" }, { key: "salary", label: "Salary", align: "right",
        render: (r) => r.salary ? `₹${new Intl.NumberFormat('en-IN').format(r.salary)}` : '-' },
      { key: "join_date", label: "Joined" },
    ],
    fields: [
      { key: "name", label: "Name" }, { key: "role", label: "Role" },
      { key: "phone", label: "Phone" }, { key: "salary", label: "Salary", type: "number" },
      { key: "join_date", label: "Join Date", type: "date" },
    ]
  },
  { key: "warehouses", label: "Warehouses", subtitle: "Master · Warehouses",
    columns: [
      { key: "name", label: "Name" }, { key: "location", label: "Location" },
      { key: "capacity_kg", label: "Capacity (kg)", align: "right",
        render: (r) => r.capacity_kg ? new Intl.NumberFormat('en-IN').format(r.capacity_kg) : '-' },
    ],
    fields: [
      { key: "name", label: "Name" }, { key: "location", label: "Location" },
      { key: "capacity_kg", label: "Capacity (kg)", type: "number" },
    ]
  },
];

const MasterData = () => {
  const [tab, setTab] = useState("customers");
  const active = TABS.find(t => t.key === tab);
  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            data-testid={`tab-${t.key}`}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === t.key ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <CrudTable key={tab} resource={tab} columns={active.columns} formFields={active.fields}
        title={active.label} subtitle={active.subtitle} testIdPrefix={`md-${tab}`} />
    </div>
  );
};

export default MasterData;
