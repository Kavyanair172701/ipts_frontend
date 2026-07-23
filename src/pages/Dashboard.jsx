import { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Boxes, 
  CreditCard, 
  ClipboardList, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Plus,
  Users,
  Search,
  ChevronRight,
  Building,
  Briefcase,
  Activity,
  FileText,
  TrendingDown
} from "lucide-react";

export default function Dashboard() {
  const { 
    ionNotes, 
    setActivePage, 
    setSelectedIon, 
    openPaymentDetails,
    openAddPayment,
    openAddVendor,
    formatAmount,
    formatDateDisplay
  } = useApp();

  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Calculate dynamic KPI counts
  const totalIons = ionNotes?.length || 0;

  const pendingPayments = (ionNotes || []).filter((ion) => {
    const status = String(ion.payment_status || ion.status || "").toUpperCase();
    return status === "PAYMENT PENDING" || status === "CREATED" || status === "";
  }).length;

  const partPayments = (ionNotes || []).filter((ion) => {
    const status = String(ion.payment_status || ion.status || "").toUpperCase();
    return status === "PART PAYMENT";
  }).length;

  const completedPayments = (ionNotes || []).filter((ion) => {
    const status = String(ion.payment_status || ion.status || "").toUpperCase();
    return status === "PAYMENT COMPLETED";
  }).length;

  // 2. Calculate financial summary metrics
  const totalBudget = (ionNotes || []).reduce((acc, ion) => acc + (ion.grand_total || 0), 0);
  const totalPaid = (ionNotes || []).reduce((acc, ion) => acc + (ion.paid_amount || 0), 0);
  const totalOutstanding = Math.max(totalBudget - totalPaid, 0);
  
  const overallPaidPct = totalBudget ? (totalPaid / totalBudget) * 100 : 0;
  const overallPaidPctText = overallPaidPct.toFixed(1);

  // SVG Circle Calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPaidPct / 100) * circumference;

  // Top Projects analytics (top 3)
  const projectMap = {};
  const vendorMap = {};
  (ionNotes || []).forEach(ion => {
    const pName = ion.project_name || "General / Unassigned";
    const vName = ion.vendor_name || "Unknown Vendor";
    const amt = ion.grand_total || 0;
    projectMap[pName] = (projectMap[pName] || 0) + amt;
    vendorMap[vName] = (vendorMap[vName] || 0) + amt;
  });

  const topProjects = Object.entries(projectMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  const topVendors = Object.entries(vendorMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);

  // Find max value to calibrate bars
  const maxProjectBudget = topProjects.length > 0 ? Math.max(...topProjects.map(p => p.value)) : 1;
  const maxVendorBudget = topVendors.length > 0 ? Math.max(...topVendors.map(v => v.value)) : 1;

  // Filter ledgers for display table
  const filteredLedgers = (ionNotes || []).filter(ion => {
    const status = String(ion.payment_status || ion.status || "").toUpperCase();
    
    // Status filter
    if (filterStatus === "PENDING" && !(status === "PAYMENT PENDING" || status === "CREATED" || status === "")) return false;
    if (filterStatus === "PARTIAL" && status !== "PART PAYMENT") return false;
    if (filterStatus === "COMPLETED" && status !== "PAYMENT COMPLETED") return false;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const ionId = `ion-${String(ion.ion_note_id).padStart(4, "0")}`;
      const ref = String(ion.ion_ref_no || "").toLowerCase();
      const subject = String(ion.subject || "").toLowerCase();
      const vendor = String(ion.vendor_name || "").toLowerCase();
      const project = String(ion.project_name || "").toLowerCase();
      return (
        ionId.includes(term) ||
        ref.includes(term) ||
        subject.includes(term) ||
        vendor.includes(term) ||
        project.includes(term)
      );
    }
    return true;
  });

  // Initials badge helper
  const getInitials = (name) => {
    if (!name) return "V";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="bpms-page stagger-item" style={{ overflowY: "auto", maxHeight: "calc(100vh - 80px)", paddingBottom: "32px" }}>
      
      {/* Dynamic Style Injection */}
      <style>{`
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .dashboard-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 20px 20px 24px 20px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px -1px rgba(142, 162, 184, 0.05), 0 2px 4px -1px rgba(142, 162, 184, 0.02);
        }
        .dashboard-card:hover {
          transform: translateY(-2px);
          border-color: var(--brand-mid);
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.05), 0 4px 6px -2px rgba(99, 102, 241, 0.02);
        }
        .dashboard-card--active {
          border-color: var(--card-accent, var(--brand)) !important;
          background: linear-gradient(135deg, var(--surface) 0%, var(--card-accent-faint, var(--brand-faint)) 85%, rgba(99, 102, 241, 0.02) 100%) !important;
          box-shadow: 0 8px 20px -6px rgba(99, 102, 241, 0.08) !important;
        }
        .dashboard-card--active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20%;
          right: 20%;
          height: 3.5px;
          border-radius: 4px 4px 0 0;
          background: var(--card-accent, var(--brand));
        }
        .db-share-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .db-share-badge--all {
          color: var(--brand-dark);
          background: var(--brand-light);
        }
        .db-share-badge--pending {
          color: var(--warning);
          background: var(--warning-faint);
          border: 1px solid rgba(245, 158, 11, 0.1);
        }
        .db-share-badge--partial {
          color: #8b5cf6;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.1);
        }
        .db-share-badge--completed {
          color: var(--success);
          background: var(--success-faint);
          border: 1px solid rgba(16, 185, 129, 0.1);
        }
        .quick-actions-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }
        .quick-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-sm);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 13.5px;
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          box-shadow: var(--shadow-xs);
        }
        .quick-btn:hover {
          background: var(--surface);
          border-color: var(--brand-mid);
          color: var(--text-primary);
          transform: translateY(-1.5px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.04);
        }
        .quick-btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--border-light);
          color: var(--text-secondary);
          transition: all 0.2s ease;
        }
        .quick-btn:hover .quick-btn-icon {
          background: var(--brand-light);
          color: var(--brand-dark);
          transform: translateY(-1px);
        }
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        .avatar-initial {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--brand-faint);
          color: var(--brand-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          margin-right: 10px;
          border: 1px solid var(--brand-light);
        }
        .progress-line-bg {
          width: 100%;
          height: 6px;
          background: var(--border-light);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 4px;
        }
        .progress-line-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .db-status-pill {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
          display: inline-block;
        }
        .badge-pending {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fef3c7;
        }
        .badge-part {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #dbeafe;
        }
        .badge-completed {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #dcfce7;
        }
        .card-inner-progress {
          margin-top: 12px;
          font-size: 11px;
          color: var(--text-muted);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>

      {/* Page Header */}
      <div className="bpms-page-header" style={{ marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 className="bpms-page-title">Performance & Budget Intelligence</h2>
            <div className="bpms-count-pill">Live</div>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
            Real-time tracking of Inter Office Notes (ION) and payment settlements
          </div>
        </div>
        <div style={{ fontSize: "12px", color: "var(--text-secondary)", background: "var(--bg-color)", padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border)", fontWeight: "500" }}>
          Active Database Allocations
        </div>
      </div>

      {/* Dynamic Filter KPI Cards */}
      <div className="dashboard-grid">
        
        {/* Total IONs Card */}
        <div 
          className={`dashboard-card ${filterStatus === "ALL" ? "dashboard-card--active" : ""}`}
          onClick={() => setFilterStatus("ALL")}
          style={{ "--card-accent": "var(--brand)", "--card-accent-faint": "var(--brand-faint)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ background: "rgba(99, 102, 241, 0.08)", padding: "8px", borderRadius: "8px", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Boxes size={18} />
            </div>
            <span className="db-share-badge db-share-badge--all">100% Share</span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)" }}>{totalIons}</div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-secondary)", marginTop: "4px" }}>Total IONs</div>
          <div className="card-inner-progress">
            <span>Overall Notes</span>
            <span style={{ fontWeight: "700" }}>{totalIons} total</span>
          </div>
        </div>

        {/* Pending Payments Card */}
        <div 
          className={`dashboard-card ${filterStatus === "PENDING" ? "dashboard-card--active" : ""}`}
          onClick={() => setFilterStatus("PENDING")}
          style={{ "--card-accent": "var(--warning)", "--card-accent-faint": "var(--warning-faint)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ background: "rgba(245, 158, 11, 0.08)", padding: "8px", borderRadius: "8px", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={18} />
            </div>
            <span className="db-share-badge db-share-badge--pending">
              {totalIons ? ((pendingPayments / totalIons) * 100).toFixed(0) : 0}% Share
            </span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)" }}>{pendingPayments}</div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-secondary)", marginTop: "4px" }}>Pending Payments</div>
          <div className="card-inner-progress">
            <span>Awaiting Settlements</span>
            <div style={{ width: "60px", height: "4px", background: "var(--border-light)", borderRadius: "2px" }}>
              <div style={{ width: `${totalIons ? (pendingPayments / totalIons) * 100 : 0}%`, height: "100%", background: "var(--warning)", borderRadius: "2px" }} />
            </div>
          </div>
        </div>

        {/* Part Payments Card */}
        <div 
          className={`dashboard-card ${filterStatus === "PARTIAL" ? "dashboard-card--active" : ""}`}
          onClick={() => setFilterStatus("PARTIAL")}
          style={{ "--card-accent": "#8b5cf6", "--card-accent-faint": "rgba(139, 92, 246, 0.05)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ background: "rgba(139, 92, 246, 0.08)", padding: "8px", borderRadius: "8px", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ClipboardList size={18} />
            </div>
            <span className="db-share-badge db-share-badge--partial">
              {totalIons ? ((partPayments / totalIons) * 100).toFixed(0) : 0}% Share
            </span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)" }}>{partPayments}</div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-secondary)", marginTop: "4px" }}>Part Payments</div>
          <div className="card-inner-progress">
            <span>Installment Pipeline</span>
            <div style={{ width: "60px", height: "4px", background: "var(--border-light)", borderRadius: "2px" }}>
              <div style={{ width: `${totalIons ? (partPayments / totalIons) * 100 : 0}%`, height: "100%", background: "#8b5cf6", borderRadius: "2px" }} />
            </div>
          </div>
        </div>

        {/* Completed Card */}
        <div 
          className={`dashboard-card ${filterStatus === "COMPLETED" ? "dashboard-card--active" : ""}`}
          onClick={() => setFilterStatus("COMPLETED")}
          style={{ "--card-accent": "var(--success)", "--card-accent-faint": "var(--success-faint)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ background: "rgba(16, 185, 129, 0.08)", padding: "8px", borderRadius: "8px", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={18} />
            </div>
            <span className="db-share-badge db-share-badge--completed">
              {totalIons ? ((completedPayments / totalIons) * 100).toFixed(0) : 0}% Share
            </span>
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)" }}>{completedPayments}</div>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-secondary)", marginTop: "4px" }}>Completed Settlements</div>
          <div className="card-inner-progress">
            <span>Fully Cleared</span>
            <div style={{ width: "60px", height: "4px", background: "var(--border-light)", borderRadius: "2px" }}>
              <div style={{ width: `${totalIons ? (completedPayments / totalIons) * 100 : 0}%`, height: "100%", background: "var(--success)", borderRadius: "2px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action shortcuts */}
      <div className="quick-actions-bar">
        <button className="quick-btn" onClick={() => setActivePage("Add ION")}>
          <div className="quick-btn-icon"><Plus size={16} /></div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>Create ION</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Internal Approval</span>
          </div>
        </button>
        <button className="quick-btn" onClick={openAddPayment}>
          <div className="quick-btn-icon"><CreditCard size={16} /></div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>Record Payment</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Register Transaction</span>
          </div>
        </button>
        <button className="quick-btn" onClick={openAddVendor}>
          <div className="quick-btn-icon"><Building size={16} /></div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>Add Vendor</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>New vendor register</span>
          </div>
        </button>
        <button className="quick-btn" onClick={() => setActivePage("Reports")}>
          <div className="quick-btn-icon"><FileText size={16} /></div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>Analytics Reports</span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500" }}>Generate summaries</span>
          </div>
        </button>
      </div>

      {/* Analytics, Radial, and Dynamic Gauges Split */}
      <div className="analytics-grid">
        
        {/* Left Column: Radial Progress Budget Clearance card */}
        <div className="bpms-table-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", margin: "0" }}>Budget Ledger Clearance</h3>
            <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
              <TrendingUp size={14} /> Clear Ratio
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" }}>
            {/* SVG Circle */}
            <div style={{ position: "relative", width: "130px", height: "130px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="var(--border)"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="var(--brand)"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
                />
              </svg>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "130px",
                height: "130px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <span style={{ fontSize: "22px", fontWeight: "850", color: "var(--text-primary)" }}>{overallPaidPctText}%</span>
                <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Settled</span>
              </div>
            </div>

            {/* Financial values list */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", minWidth: "180px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--brand)" }} />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>Total Budget Allocation</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)" }}>₹ {formatAmount(totalBudget)}</div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)" }} />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>Cleared Amount (Paid)</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--success)" }}>₹ {formatAmount(totalPaid)}</div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--danger)" }} />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600" }}>Outstanding Balance</span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: "var(--danger)" }}>₹ {formatAmount(totalOutstanding)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Project & Vendor allocations */}
        <div className="bpms-table-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", margin: "0", display: "flex", alignItems: "center", gap: "6px" }}>
            <Activity size={18} color="var(--brand)" /> Budget Allocations Analytics
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
            
            {/* Top Projects */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                Top Projects by Value
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {topProjects.length > 0 ? (
                  topProjects.map((p, idx) => {
                    const widthPct = maxProjectBudget ? (p.value / maxProjectBudget) * 100 : 0;
                    return (
                      <div key={idx}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                          <span style={{ fontWeight: "700", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{p.name}</span>
                          <span style={{ fontWeight: "800", color: "var(--text-primary)" }}>₹ {formatAmount(p.value)}</span>
                        </div>
                        <div className="progress-line-bg">
                          <div 
                            className="progress-line-fill" 
                            style={{ 
                              width: `${widthPct}%`, 
                              background: "linear-gradient(90deg, var(--brand-mid), var(--brand))"
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>No project data loaded</div>
                )}
              </div>
            </div>

            {/* Top Vendors */}
            <div>
              <div style={{ fontSize: "12px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", borderTop: "1px solid var(--border-light)", paddingTop: "12px" }}>
                Top Vendors by Value
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {topVendors.length > 0 ? (
                  topVendors.map((v, idx) => {
                    const widthPct = maxVendorBudget ? (v.value / maxVendorBudget) * 100 : 0;
                    return (
                      <div key={idx}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
                          <span style={{ fontWeight: "700", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{v.name}</span>
                          <span style={{ fontWeight: "800", color: "var(--text-primary)" }}>₹ {formatAmount(v.value)}</span>
                        </div>
                        <div className="progress-line-bg">
                          <div 
                            className="progress-line-fill" 
                            style={{ 
                              width: `${widthPct}%`, 
                              background: "linear-gradient(90deg, #10b981, #059669)"
                            }} 
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>No vendor data loaded</div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Searchable Ledger Section */}
      <div className="bpms-table-card" style={{ marginTop: "8px" }}>
        
        {/* Table Filter Controls */}
        <div style={{ 
          padding: "16px 20px", 
          borderBottom: "1px solid var(--border)", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: "16px", 
          flexWrap: "wrap",
          background: "var(--bg-hover)"
        }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: "850", color: "var(--text-primary)" }}>Ledger Overview</span>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "var(--brand-dark)", background: "var(--brand-light)", padding: "2px 8px", borderRadius: "10px" }}>
              Filter: {filterStatus}
            </span>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
            
            {/* Search Box */}
            <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
              <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search ION Ref, vendor, project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bpms-input"
                style={{ paddingLeft: "32px", height: "34px", fontSize: "12.5px" }}
              />
            </div>

            {/* Clear Filter Button */}
            {filterStatus !== "ALL" && (
              <button 
                onClick={() => setFilterStatus("ALL")}
                className="bpms-btn" 
                style={{ padding: "6px 12px", height: "34px", fontSize: "12px" }}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bpms-table-scroll">
          <table className="bpms-table">
            <thead>
              <tr>
                <th className="bpms-th" style={{ width: "90px" }}>ID</th>
                <th className="bpms-th" style={{ width: "130px" }}>ION Ref</th>
                <th className="bpms-th" style={{ width: "110px" }}>Date</th>
                <th className="bpms-th" style={{ minWidth: "160px" }}>Vendor</th>
                <th className="bpms-th" style={{ minWidth: "160px" }}>Project Name</th>
                <th className="bpms-th" style={{ width: "140px" }}>Clearance Ratio</th>
                <th className="bpms-th" style={{ width: "110px" }}>Grand Total</th>
                <th className="bpms-th" style={{ width: "110px" }}>Outstanding</th>
                <th className="bpms-th" style={{ width: "110px" }}>Status</th>
                <th className="bpms-th" style={{ width: "90px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedgers.length > 0 ? (
                filteredLedgers.map((ion) => {
                  const status = String(ion.payment_status || ion.status || "").toUpperCase();
                  const total = ion.grand_total || 0;
                  const paid = ion.paid_amount || 0;
                  const outAmt = Math.max(total - paid, 0);
                  const payPct = total ? Math.min((paid / total) * 100, 100) : 0;
                  
                  let badgeClass = "badge-pending";
                  let badgeText = "Pending";
                  if (status === "PART PAYMENT") {
                    badgeClass = "badge-part";
                    badgeText = "Partial";
                  } else if (status === "PAYMENT COMPLETED") {
                    badgeClass = "badge-completed";
                    badgeText = "Settled";
                  }

                  return (
                    <tr key={ion.ion_note_id} className="table-row-hover">
                      <td className="bpms-td">
                        <button
                          className="bpms-id-badge"
                          type="button"
                          onClick={() => {
                            setSelectedIon(ion);
                            setActivePage("ION Details");
                          }}
                        >
                          ION-{String(ion.ion_note_id).padStart(4, "0")}
                        </button>
                      </td>
                      
                      <td className="bpms-td" style={{ fontWeight: "700" }}>ION/{ion.ion_ref_no}</td>
                      <td className="bpms-td">{formatDateDisplay(ion.ion_date)}</td>
                      
                      {/* Vendor with Avatar initials */}
                      <td className="bpms-td" style={{ fontWeight: "700", color: "var(--text-primary)" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div className="avatar-initial">{getInitials(ion.vendor_name)}</div>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "150px" }}>
                            {ion.vendor_name || "Unknown Vendor"}
                          </span>
                        </div>
                      </td>

                      <td className="bpms-td" style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                        {ion.project_name}
                      </td>

                      {/* Clearance progress bar */}
                      <td className="bpms-td">
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "700" }}>
                            <span>{payPct.toFixed(0)}% Clear</span>
                          </div>
                          <div style={{ width: "100%", height: "5px", background: "var(--border-light)", borderRadius: "3px" }}>
                            <div 
                              style={{ 
                                width: `${payPct}%`, 
                                height: "100%", 
                                background: payPct === 100 ? "var(--success)" : payPct > 0 ? "#8b5cf6" : "var(--border)", 
                                borderRadius: "3px" 
                              }} 
                            />
                          </div>
                        </div>
                      </td>

                      <td className="bpms-td" style={{ fontWeight: "800", color: "var(--text-primary)" }}>₹ {formatAmount(total)}</td>
                      <td className="bpms-td" style={{ fontWeight: "800", color: outAmt > 0 ? "var(--danger)" : "var(--success)" }}>₹ {formatAmount(outAmt)}</td>
                      
                      <td className="bpms-td">
                        <span className={`db-status-pill ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </td>

                      <td className="bpms-td" style={{ textAlign: "right" }}>
                        <button
                          className="bpms-btn"
                          style={{ padding: "6px 12px", fontSize: "11.5px" }}
                          onClick={() => {
                            openPaymentDetails(ion);
                          }}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="bpms-td" style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                      <AlertCircle size={28} style={{ color: "var(--text-muted)" }} />
                      <span style={{ fontWeight: "600", color: "var(--text-secondary)" }}>No matching records found</span>
                      <span style={{ fontSize: "12px" }}>Try adjusting your status filter or search parameters</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Statistics summary */}
        <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", borderTop: "1px solid var(--border-light)", fontSize: "12px", color: "var(--text-secondary)" }}>
          <div>Showing <b>{filteredLedgers.length}</b> records</div>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>Total Value: <b>₹ {formatAmount(filteredLedgers.reduce((acc, ion) => acc + (ion.grand_total || 0), 0))}</b></span>
            <span>Total Outstanding: <b>₹ {formatAmount(filteredLedgers.reduce((acc, ion) => acc + Math.max((ion.grand_total || 0) - (ion.paid_amount || 0), 0), 0))}</b></span>
          </div>
        </div>

      </div>

    </div>
  );
}
