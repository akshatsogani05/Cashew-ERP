import React, { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { Plus, Trash2, Pencil, X } from "lucide-react";

export const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n || 0));
export const fmtCurrency = (n) => `₹${new Intl.NumberFormat('en-IN').format(Math.round(n || 0))}`;

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{subtitle}</div>
      <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{title}</h1>
    </div>
    {action}
  </div>
);

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-slate-200 rounded-lg ${className}`}>{children}</div>
);

export const Badge = ({ children, variant = "neutral" }) => {
  const v = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  }[variant];
  return <span className={`px-2.5 py-0.5 border rounded-full text-xs font-semibold ${v}`}>{children}</span>;
};

export const Button = ({ children, variant = "primary", ...props }) => {
  const v = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white",
    secondary: "bg-white border border-slate-300 hover:bg-slate-50 text-slate-700",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  }[variant];
  return <button className={`${v} font-medium px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2`} {...props}>{children}</button>;
};

export const Input = (props) => (
  <input {...props} className={`w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 ${props.className || ''}`} />
);

export const Select = ({ children, ...props }) => (
  <select {...props} className={`w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 ${props.className || ''}`}>{children}</select>
);

export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="font-heading text-xl font-bold text-slate-900">{title}</h2>
          <button data-testid="modal-close" onClick={onClose} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Generic CRUD table
export const CrudTable = ({ resource, columns, formFields, title, subtitle, testIdPrefix }) => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get(`/${resource}`);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({}); setOpen(true); };
  const openEdit = (it) => { setEditing(it); setForm({ ...it }); setOpen(true); };

  const save = async () => {
    const body = { ...form };
    formFields.forEach(f => {
      if (f.type === "number" && body[f.key] !== undefined && body[f.key] !== "") {
        body[f.key] = Number(body[f.key]);
      }
    });
    if (editing) {
      await api.put(`/${resource}/${editing.id}`, body);
    } else {
      await api.post(`/${resource}`, body);
    }
    setOpen(false);
    await load();
  };

  const remove = async (it) => {
    if (!window.confirm("Delete this entry?")) return;
    await api.delete(`/${resource}/${it.id}`);
    await load();
  };

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={<Button data-testid={`${testIdPrefix}-add`} onClick={openNew}><Plus size={16} /> Add New</Button>}
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 ${c.align === 'right' ? 'text-right' : 'text-left'}`}>{c.label}</th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-400">Loading...</td></tr>}
              {!loading && items.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-400">No data. Add one to get started.</td></tr>}
              {items.map((it) => (
                <tr key={it.id} data-testid={`${testIdPrefix}-row`} className="border-b border-slate-100 hover:bg-slate-50">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 ${c.align === 'right' ? 'text-right tabular-nums' : ''}`}>
                      {c.render ? c.render(it) : (it[c.key] ?? '-')}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button data-testid={`${testIdPrefix}-edit`} onClick={() => openEdit(it)} className="text-slate-500 hover:text-slate-900 mr-3"><Pencil size={14} /></button>
                    <button data-testid={`${testIdPrefix}-delete`} onClick={() => remove(it)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit" : "Add New"}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formFields.map((f) => (
            <div key={f.key} className={f.full ? "md:col-span-2" : ""}>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">{f.label}</label>
              {f.type === "select" ? (
                <Select data-testid={`form-${f.key}`} value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                  <option value="">Select...</option>
                  {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                </Select>
              ) : (
                <Input data-testid={`form-${f.key}`} type={f.type || "text"} value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button data-testid="form-save" onClick={save}>Save</Button>
        </div>
      </Modal>
    </>
  );
};
