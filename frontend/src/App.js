import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";

import { AuthProvider, useAuth } from "@/context/AuthContext";

import Layout from "@/components/Layout";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import MasterData from "@/pages/MasterData";
import Procurement from "@/pages/Procurement";
import Inventory from "@/pages/Inventory";
import Production from "@/pages/Production";
import Sales from "@/pages/Sales";
import Dispatch from "@/pages/Dispatch";
import Accounts from "@/pages/Accounts";
import Analytics from "@/pages/Analytics";
import HealthScore from "@/pages/HealthScore";
import Reports from "@/pages/Reports";
import Notifications from "@/pages/Notifications";

const Protected = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<Protected />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/master-data" element={<MasterData />} />
            <Route path="/procurement" element={<Procurement />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/production" element={<Production />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/dispatch" element={<Dispatch />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/health-score" element={<HealthScore />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;