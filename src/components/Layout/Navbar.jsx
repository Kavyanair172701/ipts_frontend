import { useApp } from "../../context/AppContext";
import { PanelLeft, PanelLeftClose, ChevronDown, LogOut } from "lucide-react";

export default function Navbar() {
  const {
    collapsed,
    setCollapsed,
    profileOpen,
    setProfileOpen,
    username,
    handleLogout,
    getBreadcrumbs
  } = useApp();

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="navbar">
      <button
        className="navbar__toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
      </button>

      <div className="navbar__breadcrumb">
        <span>IPTS</span>
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span className="navbar__breadcrumb-sep">/</span>
            <span className={idx === breadcrumbs.length - 1 ? "navbar__breadcrumb-current" : ""}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="navbar__right">
        <div className="navbar__divider" />

        <div className="navbar__profile-container">
          <div
            className="navbar__profile-trigger"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="navbar__avatar">
              {username ? username[0].toUpperCase() : "U"}
            </div>
            <div className="navbar__user-info">
              <span className="navbar__user-name">{username || "Administrator"}</span>
              <span className="navbar__user-role">Super User</span>
            </div>
            <ChevronDown
              size={13}
              className={`navbar__chevron ${profileOpen ? "navbar__chevron--open" : ""}`}
            />
          </div>

          {profileOpen && (
            <div className="navbar__dropdown">
              <div className="navbar__dropdown-header">
                <p className="navbar__dropdown-name">{username || "Administrator"}</p>
                <p className="navbar__dropdown-email">{username ? `${username}@gmail.com` : ""}</p>
              </div>
              <div className="navbar__dropdown-divider" />
              <button
                className="navbar__dropdown-item navbar__dropdown-item--danger"
                onClick={() => {
                  setProfileOpen(false);
                  handleLogout();
                }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
