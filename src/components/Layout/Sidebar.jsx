import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard,
  Users,
  Database,
  Building,
  Boxes,
  FileSpreadsheet,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const {
    collapsed,
    setActivePage,
    fetchUsers,
    setVendorPage,
    fetchVendors,
    setCompanyPage,
    fetchCompanies,
    handleLogout,
    getSidebarActive
  } = useApp();

  const sidebarActive = getSidebarActive();

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__logo">
        <div className="sidebar__logo-top">
          <div className="sidebar__logo-mark">
            <Boxes size={18} strokeWidth={2.5} />
          </div>
          {!collapsed && <span className="sidebar__logo-title">IPTS</span>}
        </div>
        {!collapsed && (
          <span className="sidebar__logo-sub">ION Payment Tracking System</span>
        )}
      </div>

      <nav className="sidebar__nav">
        {!collapsed && <div className="sidebar__section-label">Main Menu</div>}

        <button
          onClick={() => setActivePage("Dashboard")}
          className={`sidebar__item ${sidebarActive === "Dashboard" ? "sidebar__item--active" : ""}`}
          title={collapsed ? "Dashboard" : undefined}
        >
          <LayoutDashboard size={17} className="sidebar__icon" />
          {!collapsed && <span className="sidebar__label">Dashboard</span>}
        </button>

        <button
          onClick={() => setActivePage("ION")}
          className={`sidebar__item ${sidebarActive === "ION" ? "sidebar__item--active" : ""}`}
          title={collapsed ? "ION Management" : undefined}
        >
          <Boxes size={17} className="sidebar__icon" />
          {!collapsed && <span className="sidebar__label">ION Management</span>}
        </button>

        <button
          onClick={() => {
            setActivePage("Vendor Management");
            setVendorPage("View");
            fetchVendors();
          }}
          className={`sidebar__item ${sidebarActive === "Vendor Management" ? "sidebar__item--active" : ""}`}
          title={collapsed ? "Vendor Management" : undefined}
        >
          <Database size={17} className="sidebar__icon" />
          {!collapsed && <span className="sidebar__label">Vendor Management</span>}
        </button>

        <button
          onClick={() => {
            setActivePage("Company Management");
            setCompanyPage("View");
            fetchCompanies();
          }}
          className={`sidebar__item ${sidebarActive === "Company Management" ? "sidebar__item--active" : ""}`}
          title={collapsed ? "Company Management" : undefined}
        >
          <Building size={17} className="sidebar__icon" />
          {!collapsed && <span className="sidebar__label">Company Management</span>}
        </button>

        <button
          onClick={() => setActivePage("Reports")}
          className={`sidebar__item ${sidebarActive === "Reports" ? "sidebar__item--active" : ""}`}
          title={collapsed ? "Reports" : undefined}
        >
          <FileSpreadsheet size={17} className="sidebar__icon" />
          {!collapsed && <span className="sidebar__label">Reports</span>}
        </button>

        <button
          onClick={() => {
            setActivePage("User Management");
            fetchUsers();
          }}
          className={`sidebar__item ${sidebarActive === "User Management" ? "sidebar__item--active" : ""}`}
          title={collapsed ? "User Management" : undefined}
        >
          <Users size={17} className="sidebar__icon" />
          {!collapsed && <span className="sidebar__label">User Management</span>}
        </button>
      </nav>

      <div className="sidebar__footer">
        <button
          onClick={handleLogout}
          className="sidebar__item"
          title={collapsed ? "Sign Out" : undefined}
          style={{ color: "var(--danger)" }}
        >
          <LogOut size={17} className="sidebar__icon" />
          {!collapsed && <span className="sidebar__label">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
