import { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { FileText, CreditCard, ClipboardList, ArrowRight, Wallet, CheckSquare } from "lucide-react";

export default function IONCategoryMenu() {
  const { 
    setActivePage, 
    fetchPayments, 
    rspList, 
    poList, 
    ionNotes, 
    paymentList,
    fetchRsp,
    fetchIonNotes,
    fetchPos,
    formatAmount
  } = useApp();

  // Calculate dynamic dashboard financial metrics
  const totalRspAmount = rspList.reduce((sum, item) => sum + parseFloat(item.amount_payable || 0), 0);
  const totalPoAmount = poList.reduce((sum, item) => sum + parseFloat(item.grand_total || item.amount || 0), 0);
  const totalIonAmount = ionNotes.reduce((sum, item) => sum + parseFloat(item.grand_total || item.total_amount || 0), 0);
  const totalOutstanding = paymentList.reduce((sum, item) => {
    const tot = parseFloat(item.grand_total || item.amount || 0);
    const paid = parseFloat(item.paid_amount || item.total_paid || 0);
    return sum + Math.max(tot - paid, 0);
  }, 0);

  // Fetch fresh lists on mount to ensure real-time card stats
  useEffect(() => {
    fetchRsp();
    fetchIonNotes();
    fetchPos();
    fetchPayments();
  }, []);

  return (
    <div className="bpms-page stagger-item">
      
      {/* Premium Workflow Banner */}
      <div style={{ 
        background: "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)", 
        color: "white", 
        padding: "30px 40px", 
        borderRadius: "var(--r-lg)", 
        marginBottom: "32px",
        boxShadow: "var(--shadow-md)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>
            ION Management & Tracking
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", marginTop: "6px", maxWidth: "600px", lineHeight: "1.5" }}>
            Manage the full procurement and vendor payment lifecycle. Draft internal approval memos, place official purchase orders, generate payment request slips, and track installment ledgers.
          </p>

          {/* Step-by-Step Flow Indicators */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            marginTop: "24px", 
            flexWrap: "wrap",
            fontSize: "12px",
            fontWeight: "700",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "12px 20px",
            borderRadius: "var(--r-md)",
            backdropFilter: "blur(5px)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", background: "white", color: "var(--brand)", width: "20px", height: "20px", borderRadius: "50%", textAlign: "center", lineHeight: "20px" }}>1</span>
              <span>RSP Slip Generation</span>
            </div>
            <ArrowRight size={12} color="rgba(255,255,255,0.5)" />
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", background: "white", color: "var(--brand)", width: "20px", height: "20px", borderRadius: "50%", textAlign: "center", lineHeight: "20px" }}>2</span>
              <span>Purchase Order (PO)</span>
            </div>
            <ArrowRight size={12} color="rgba(255,255,255,0.5)" />
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", background: "white", color: "var(--brand)", width: "20px", height: "20px", borderRadius: "50%", textAlign: "center", lineHeight: "20px" }}>3</span>
              <span>ION Note Approval</span>
            </div>
            <ArrowRight size={12} color="rgba(255,255,255,0.5)" />
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", background: "white", color: "var(--brand)", width: "20px", height: "20px", borderRadius: "50%", textAlign: "center", lineHeight: "20px" }}>4</span>
              <span>Payment Ledger</span>
            </div>
          </div>
        </div>

        {/* Abstract Background Accent shapes */}
        <div style={{ 
          position: "absolute", 
          right: "-50px", 
          bottom: "-50px", 
          width: "250px", 
          height: "250px", 
          background: "rgba(255,255,255,0.06)", 
          borderRadius: "50%", 
          zIndex: 1 
        }} />
      </div>

      {/* Grid Menu Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", 
        gap: "24px" 
      }}>
        
        {/* Card 1: RSP */}
        <div 
          className="ion-menu-card" 
          onClick={() => {
            fetchRsp();
            setActivePage("RSP");
          }}
          style={{ 
            background: "white",
            border: "1px solid var(--border)",
            borderTop: "4px solid var(--warning)",
            borderRadius: "var(--r-lg)",
            padding: "24px",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "240px",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            e.currentTarget.style.borderColor = "var(--warning)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ background: "rgba(245, 158, 11, 0.1)", padding: "10px", borderRadius: "12px", display: "inline-flex" }}>
                <FileText size={22} color="var(--warning)" />
              </div>
              <span className="bpms-count-pill" style={{ background: "var(--warning-faint)", color: "var(--warning)", fontSize: "11px", fontWeight: "700" }}>
                PAYMENT SLIP
              </span>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 6px 0" }}>Request Slip for Payment</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px 0", lineHeight: "1.4" }}>
              Generate structured authorization slips for advance payments, partial payments, or final bills.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
                Total Payout Volume
              </span>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--warning)" }}>
                ₹ {formatAmount(totalRspAmount)}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "14px", marginTop: "16px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
              {rspList.length} Slips Generated
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "700", color: "var(--brand)" }}>
              Manage <ArrowRight size={13} />
            </span>
          </div>
        </div>

        {/* Card 2: Purchase Order */}
        <div 
          className="ion-menu-card" 
          onClick={() => {
            fetchPos();
            setActivePage("PO");
          }}
          style={{ 
            background: "white",
            border: "1px solid var(--border)",
            borderTop: "4px solid var(--success)",
            borderRadius: "var(--r-lg)",
            padding: "24px",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "240px",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            e.currentTarget.style.borderColor = "var(--success)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "10px", borderRadius: "12px", display: "inline-flex" }}>
                <CheckSquare size={22} color="var(--success)" />
              </div>
              <span className="bpms-count-pill" style={{ background: "var(--success-faint)", color: "var(--success)", fontSize: "11px", fontWeight: "700" }}>
                SUPPLIER PO
              </span>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 6px 0" }}>Purchase Order</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px 0", lineHeight: "1.4" }}>
              Place orders with third-party vendors referencing specific projects, quotes, and timeline terms.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
                Total PO Volume
              </span>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--success)" }}>
                ₹ {formatAmount(totalPoAmount)}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "14px", marginTop: "16px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
              {poList.length} Orders Placed
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "700", color: "var(--brand)" }}>
              Manage <ArrowRight size={13} />
            </span>
          </div>
        </div>

        {/* Card 3: ION Note */}
        <div 
          className="ion-menu-card" 
          onClick={() => {
            fetchIonNotes();
            setActivePage("ION NOTE");
          }}
          style={{ 
            background: "white",
            border: "1px solid var(--border)",
            borderTop: "4px solid var(--brand)",
            borderRadius: "var(--r-lg)",
            padding: "24px",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "240px",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            e.currentTarget.style.borderColor = "var(--brand)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ background: "rgba(79, 70, 229, 0.1)", padding: "10px", borderRadius: "12px", display: "inline-flex" }}>
                <ClipboardList size={22} color="var(--brand)" />
              </div>
              <span className="bpms-count-pill" style={{ background: "var(--brand-faint)", color: "var(--brand)", fontSize: "11px", fontWeight: "700" }}>
                INTERNAL APPROVAL
              </span>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 6px 0" }}>Inter Office Note</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px 0", lineHeight: "1.4" }}>
              Draft internal financial request sheets, obtain director authorization, and record scope values.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
                Total Allocated Budget
              </span>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--brand)" }}>
                ₹ {formatAmount(totalIonAmount)}
              </span>
            </div>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "14px", marginTop: "16px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
              {ionNotes.length} Saved Memos
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "700", color: "var(--brand)" }}>
              Manage <ArrowRight size={13} />
            </span>
          </div>
        </div>

        {/* Card 4: Payment Tracker */}
        <div 
          className="ion-menu-card" 
          onClick={() => {
            fetchPayments();
            setActivePage("Payment");
          }}
          style={{ 
            background: "white",
            border: "1px solid var(--border)",
            borderTop: "4px solid var(--info)",
            borderRadius: "var(--r-lg)",
            padding: "24px",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "240px",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            e.currentTarget.style.borderColor = "var(--info)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "var(--shadow-sm)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ background: "rgba(59, 130, 246, 0.1)", padding: "10px", borderRadius: "12px", display: "inline-flex" }}>
                <Wallet size={22} color="var(--info)" />
              </div>
              <span className="bpms-count-pill" style={{ background: "var(--info-faint)", color: "var(--info)", fontSize: "11px", fontWeight: "700" }}>
                LEDGER ACCOUNT
              </span>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)", margin: "0 0 6px 0" }}>Payment Ledger & Tracking</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px 0", lineHeight: "1.4" }}>
              Track installment dates, wire references, cumulative amounts paid, and outstanding balances.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.5px" }}>
                Total Outstanding Balance
              </span>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--info)" }}>
                ₹ {formatAmount(totalOutstanding)}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "14px", marginTop: "16px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>
              {paymentList.length} Active Accounts
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "700", color: "var(--brand)" }}>
              Manage <ArrowRight size={13} />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
