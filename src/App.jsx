import { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Layout/Sidebar";
import Navbar from "./components/Layout/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement/UserManagement";
import VendorManagement from "./pages/VendorManagement/VendorManagement";
import CompanyManagement from "./pages/CompanyManagement/CompanyManagement";
import IONCategoryMenu from "./pages/IONManagement/IONCategoryMenu";
import RSPManagement from "./pages/IONManagement/RSP/RSPManagement";
import POManagement from "./pages/IONManagement/PO/POManagement";
import IONNoteManagement from "./pages/IONManagement/IONNote/IONNoteManagement";
import PaymentManagement from "./pages/IONManagement/Payment/PaymentManagement";
import Reports from "./pages/Reports";
import CommandPalette from "./components/CommandPalette";
import "./App.css";

function AppContent() {
  const {
    isLoggedIn,
    activePage,
    fetchVendors,
    fetchUsers,
    fetchRsp,
    fetchIonNotes,
    fetchPos,
    fetchPayments,
    fetchSignatures,
    fetchCompanies,
  } = useApp();

  useEffect(() => {
    if (isLoggedIn) {
      fetchVendors();
      fetchUsers();
      fetchRsp();
      fetchIonNotes();
      fetchPos();
      fetchPayments();
      fetchSignatures();
      fetchCompanies();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Login />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Body Area */}
      <div className="app-layout__body">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Page Views */}
        <main className="app-layout__main">
          {activePage === "Dashboard" && <Dashboard />}
          {activePage === "User Management" && <UserManagement />}
          {activePage === "Vendor Management" && <VendorManagement />}
          {activePage === "Company Management" && <CompanyManagement />}
          {activePage === "ION" && <IONCategoryMenu />}
          {["RSP", "Add RSP", "View RSP", "Preview RSP", "RSP Details"].includes(activePage) && (
            <RSPManagement />
          )}
          {["PO", "Add PO", "View PO", "Preview PO", "PO Details"].includes(activePage) && (
            <POManagement />
          )}
          {["ION NOTE", "Add ION", "View ION", "Preview ION", "ION Details"].includes(activePage) && (
            <IONNoteManagement />
          )}
          {["Payment", "Add Payment", "View Payment", "Preview Payment", "Payment Details"].includes(activePage) && (
            <PaymentManagement />
          )}
          {activePage === "Reports" && <Reports />}
        </main>
        <CommandPalette />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}