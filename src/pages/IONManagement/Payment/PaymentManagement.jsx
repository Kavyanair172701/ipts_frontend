import { useEffect } from "react";
import { useApp } from "../../../context/AppContext";
import { Eye, ArrowLeft, RefreshCw, Plus, Calendar, DollarSign } from "lucide-react";

export default function PaymentManagement() {
  const {
    activePage,
    setActivePage,
    fetchPayments,
    paymentSearch,
    setPaymentSearch,
    filteredPaymentList,
    getIonNo,
    getIonAmount,
    applyPaymentCalculation,
    getPaymentStatusStyleFromText,
    openPaymentDetails,
    getStatusStyle,
    formatAmount,
    paymentForm,
    selectedPayment,
    setPaymentSection,
    previewPayment,
    paymentSection,
    savePayment,
    updatePaymentForm,
    paymentHistory,
    toPaymentNumber,
    formatDateDisplay,
    changePaymentStatus
  } = useApp();

  // Fetch fresh list on mount
  useEffect(() => {
    fetchPayments();
  }, []);

  // --- Sub-View: View Payment Table (Now the Landing / Default View) ---
  if (["Payment", "View Payment"].includes(activePage)) {
    return (
      <div className="bpms-page stagger-item">
        <div className="bpms-page-header">
          <div>
            <h2 className="bpms-page-title">Payment Tracking & Ledger</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
              Track payment records, outstanding balances, and transactions against approved ION Notes
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button className="bpms-btn bpms-btn--success" onClick={fetchPayments}>
              <RefreshCw size={14} style={{ marginRight: "4px" }} /> Refresh List
            </button>
            <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("ION")}>
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>

        <div className="bpms-table-card" style={{ marginTop: "12px" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
            <input
              className="bpms-input"
              placeholder="Search by ION number, vendor, project, description or invoice number..."
              value={paymentSearch}
              onChange={(e) => setPaymentSearch(e.target.value)}
            />
          </div>
          
          <div className="bpms-table-scroll">
            <table className="bpms-table">
              <thead>
                <tr>
                  <th className="bpms-th">ION Ref</th>
                  <th className="bpms-th">ION Date</th>
                  <th className="bpms-th">Description</th>
                  <th className="bpms-th">Total Amount</th>
                  <th className="bpms-th">Total Paid</th>
                  <th className="bpms-th">Outstanding Balance</th>
                  <th className="bpms-th">Received %</th>
                  <th className="bpms-th">Status</th>
                  <th className="bpms-th" style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaymentList.length > 0 ? (
                  filteredPaymentList.map((pay) => {
                    const ionNo = getIonNo(pay);
                    const calculatedPay = applyPaymentCalculation({ ...pay, amount: getIonAmount(pay) });
                    const statusText = calculatedPay.payment_status || pay.payment_status || pay.status || "PAYMENT PENDING";
                    const statusColour = calculatedPay.status_colour || getPaymentStatusStyleFromText(statusText);
                    const vendor = pay.vendor_name || "";
                    const work = pay.work_name || pay.subject || "";
                    const project = pay.project_name || "";
                    const desc = `"${vendor}" regarding "${work}" for "${project}" Project`;
                    
                    return (
                      <tr key={pay.ion_note_id || index} className="table-row-hover">
                        <td className="bpms-td">
                          <button className="bpms-id-badge" type="button" onClick={() => openPaymentDetails(pay)}>
                            ION/{ionNo}
                          </button>
                        </td>
                        <td className="bpms-td">{formatDateDisplay(pay.ion_date)}</td>
                        <td className="bpms-td" style={{ minWidth: "250px", fontSize: "13px" }}>{desc}</td>
                        <td className="bpms-td" style={{ fontWeight: "800", color: "var(--brand-dark)" }}>₹ {formatAmount(getIonAmount(pay))}</td>
                        <td className="bpms-td" style={{ color: "var(--success)", fontWeight: "600" }}>
                          ₹ {formatAmount(calculatedPay.total_paid || calculatedPay.paid_amount || 0)}
                        </td>
                        <td className="bpms-td" style={{ color: "var(--danger)", fontWeight: "600" }}>
                          ₹ {formatAmount(calculatedPay.balance_amount)}
                        </td>
                        <td className="bpms-td">{calculatedPay.received_percentage || "0.00"}%</td>
                        <td className="bpms-td">
                          <select
                            value={statusText}
                            onChange={(e) => changePaymentStatus(pay.ion_ref_no || pay.ion_no, e.target.value)}
                            className="bpms-count-pill"
                            style={{
                              ...getStatusStyle(statusColour),
                              border: "none",
                              fontWeight: "700",
                              fontSize: "12px",
                              cursor: "pointer",
                              padding: "4px 8px",
                              outline: "none",
                              appearance: "auto",
                              borderRadius: "4px"
                            }}
                          >
                            <option value="Prepared & Sent for Signing" style={{ background: "#ffffff", color: "#334155" }}>Prepared & Sent for Signing</option>
                            <option value="Signed & Payment Pending" style={{ background: "#fee2e2", color: "#ef4444" }}>Signed & Payment Pending</option>
                            <option value="Part Payment" style={{ background: "#fef3c7", color: "#d97706" }}>Part Payment</option>
                            <option value="Payment Cleared" style={{ background: "#d1fae5", color: "#10b981" }}>Payment Cleared</option>
                          </select>
                        </td>
                        <td className="bpms-td" style={{ textAlign: "right" }}>
                          <button 
                            className="bpms-btn bpms-btn--primary" 
                            onClick={() => openPaymentDetails(pay)} 
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                          >
                            <Plus size={12} style={{ marginRight: "4px" }} /> Ledger / Pay
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="bpms-td" style={{ textAlign: "center", padding: "30px" }}>
                      No ION records found for payment tracking.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- Sub-View: Payment Details / Preview Ledger ---
  if (["Preview Payment", "Payment Details"].includes(activePage) && selectedPayment) {
    return (
      <div className="bpms-page stagger-item" style={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}>
        <div className="bpms-page-header">
          <div>
            <h2 className="bpms-page-title">Ledger Account: ION/{paymentForm.ion_no}</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
              Project: <b>{paymentForm.project_name}</b> | Supplier: <b>{paymentForm.vendor_name}</b>
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button 
              className={`bpms-btn ${paymentSection === "summary" ? "bpms-btn--primary" : "bpms-btn--ghost"}`} 
              onClick={() => setPaymentSection("summary")}
            >
              Summary
            </button>
            <button 
              className={`bpms-btn ${paymentSection === "add" ? "bpms-btn--primary" : "bpms-btn--ghost"}`} 
              onClick={() => setPaymentSection("add")}
            >
              <Plus size={14} style={{ marginRight: "4px" }} /> Add Transaction
            </button>
            <button 
              className={`bpms-btn ${paymentSection === "history" ? "bpms-btn--primary" : "bpms-btn--ghost"}`} 
              onClick={() => setPaymentSection("history")}
            >
              History ({paymentHistory.length})
            </button>
            <button
              className="bpms-btn bpms-btn--ghost"
              onClick={() => {
                fetchPayments();
                setActivePage("View Payment");
              }}
            >
              <ArrowLeft size={14} /> Back to List
            </button>
          </div>
        </div>

        {/* Ledger Top Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px", marginTop: "16px" }}>
          <div className="bpms-table-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: "700" }}>TOTAL BUDGET (ION)</span>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--text-primary)" }}>₹ {formatAmount(paymentForm.amount)}</span>
          </div>
          <div className="bpms-table-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--success)", fontSize: "12px", fontWeight: "700" }}>TOTAL AMOUNT PAID</span>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--success)" }}>
              ₹ {formatAmount(paymentForm.paid_amount || paymentForm.total_paid)}
            </span>
          </div>
          <div className="bpms-table-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--danger)", fontSize: "12px", fontWeight: "700" }}>OUTSTANDING BALANCE</span>
            <span style={{ fontSize: "20px", fontWeight: "800", color: "var(--danger)" }}>₹ {formatAmount(paymentForm.balance_amount)}</span>
          </div>
          <div className="bpms-table-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ color: "var(--brand)", fontSize: "12px", fontWeight: "700" }}>STATUS</span>
            <div style={{ marginTop: "4px" }}>
              <select
                value={paymentForm.payment_status}
                onChange={(e) => changePaymentStatus(paymentForm.ion_no, e.target.value)}
                className="bpms-count-pill"
                style={{
                  ...getStatusStyle(paymentForm.status_colour),
                  border: "none",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer",
                  padding: "4px 8px",
                  outline: "none",
                  appearance: "auto",
                  borderRadius: "4px"
                }}
              >
                <option value="Prepared & Sent for Signing" style={{ background: "#ffffff", color: "#334155" }}>Prepared & Sent for Signing</option>
                <option value="Signed & Payment Pending" style={{ background: "#fee2e2", color: "#ef4444" }}>Signed & Payment Pending</option>
                <option value="Part Payment" style={{ background: "#fef3c7", color: "#d97706" }}>Part Payment</option>
                <option value="Payment Cleared" style={{ background: "#d1fae5", color: "#10b981" }}>Payment Cleared</option>
              </select>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "8px", fontWeight: "bold" }}>
                ({paymentForm.received_percentage || "0.00"}%)
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <div className="bpms-table-card" style={{ padding: "20px 24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", width: "90%", margin: "0 auto" }}>
            {/* Background Line */}
            <div style={{
              position: "absolute",
              top: "22px",
              left: "5%",
              width: "90%",
              height: "4px",
              background: "#e2e8f0",
              zIndex: 1
            }}>
              <div style={{
                width: paymentForm.payment_status === "PAYMENT COMPLETED" ? "100%" : paymentForm.payment_status === "PART PAYMENT" ? "50%" : "0%",
                height: "100%",
                background: "var(--brand)",
                transition: "width 0.4s ease"
              }} />
            </div>
            
            {/* Step 1 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, position: "relative" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "var(--brand)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                border: "4px solid #fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>1</div>
              <span style={{ fontSize: "12px", fontWeight: "700", marginTop: "8px", color: "var(--brand)" }}>PENDING</span>
            </div>

            {/* Step 2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, position: "relative" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: ["PART PAYMENT", "PAYMENT COMPLETED"].includes(paymentForm.payment_status) ? "var(--brand)" : "#e2e8f0",
                color: ["PART PAYMENT", "PAYMENT COMPLETED"].includes(paymentForm.payment_status) ? "#fff" : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                border: "4px solid #fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}>2</div>
              <span style={{
                fontSize: "12px",
                fontWeight: "700",
                marginTop: "8px",
                color: ["PART PAYMENT", "PAYMENT COMPLETED"].includes(paymentForm.payment_status) ? "var(--brand)" : "var(--text-muted)"
              }}>PART PAYMENT</span>
            </div>

            {/* Step 3 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, position: "relative" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: paymentForm.payment_status === "PAYMENT COMPLETED" ? "var(--brand)" : "#e2e8f0",
                color: paymentForm.payment_status === "PAYMENT COMPLETED" ? "#fff" : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                border: "4px solid #fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}>3</div>
              <span style={{
                fontSize: "12px",
                fontWeight: "700",
                marginTop: "8px",
                color: paymentForm.payment_status === "PAYMENT COMPLETED" ? "var(--brand)" : "var(--text-muted)"
              }}>SETTLED</span>
            </div>
          </div>
        </div>

        {/* Ledger Section Content */}
        {paymentSection === "summary" && (
          <div className="bpms-table-card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-primary)", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "16px" }}>
              Ledger Account Information
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>ION Reference</span>
                  <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>ION/{paymentForm.ion_no}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>ION Date</span>
                  <span style={{ fontWeight: "700" }}>{paymentForm.ion_date}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Vendor Name</span>
                  <span style={{ fontWeight: "700" }}>{paymentForm.vendor_name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Project Name</span>
                  <span style={{ fontWeight: "700" }}>{paymentForm.project_name}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Work Description</span>
                  <span style={{ fontWeight: "700" }}>{paymentForm.work_name || paymentForm.description}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Total Amount</span>
                  <span style={{ fontWeight: "700", color: "var(--brand)" }}>₹ {formatAmount(paymentForm.amount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-light)", paddingBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Paid to Date</span>
                  <span style={{ fontWeight: "700", color: "var(--success)" }}>₹ {formatAmount(paymentForm.paid_amount || paymentForm.total_paid)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px" }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>Remaining Balance</span>
                  <span style={{ fontWeight: "700", color: "var(--danger)" }}>₹ {formatAmount(paymentForm.balance_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentSection === "add" && (
          <div className="bpms-table-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-primary)" }}>ADD PAYMENT TRANSACTION</h3>
              <button className="bpms-btn bpms-btn--success" onClick={savePayment}>
                <DollarSign size={14} style={{ marginRight: "4px" }} /> Record Payment
              </button>
            </div>
            
            <div className="bpms-form">
              <div className="form-row-3">
                <div className="form-group">
                  <label>Amount Received (₹)</label>
                  <input
                    className="bpms-input"
                    type="number"
                    value={paymentForm.amount_received ?? ""}
                    onChange={(e) => updatePaymentForm("amount_received", e.target.value)}
                    placeholder="e.g. 150000"
                    min="0"
                    step="0.01"
                  />
                  {toPaymentNumber(paymentForm.amount_received) > (toPaymentNumber(paymentForm.amount) - toPaymentNumber(paymentForm.paid_amount)) && (
                    <span style={{ color: "var(--danger)", fontSize: "11px", marginTop: "4px", display: "block" }}>
                      Warning: Amount exceeds outstanding balance of ₹ {formatAmount(toPaymentNumber(paymentForm.amount) - toPaymentNumber(paymentForm.paid_amount))}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Mode of Payment</label>
                  <select
                    className="bpms-input"
                    value={paymentForm.mode_of_payment}
                    onChange={(e) => updatePaymentForm("mode_of_payment", e.target.value)}
                  >
                    <option value="NEFT">NEFT</option>
                    <option value="RTGS">RTGS</option>
                    <option value="IMPS">IMPS</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Cheque / UTR / Txn No</label>
                  <input
                    className="bpms-input"
                    value={paymentForm.cheque_transaction_no}
                    onChange={(e) => updatePaymentForm("cheque_transaction_no", e.target.value)}
                    placeholder="Enter transaction ref"
                  />
                </div>
              </div>

              <div className="form-row-3" style={{ marginTop: "16px" }}>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input
                    className="bpms-input"
                    value={paymentForm.bank_name}
                    onChange={(e) => updatePaymentForm("bank_name", e.target.value)}
                    placeholder="e.g. HDFC Bank"
                  />
                </div>

                <div className="form-group">
                  <label>Branch Name</label>
                  <input
                    className="bpms-input"
                    value={paymentForm.branch_name}
                    onChange={(e) => updatePaymentForm("branch_name", e.target.value)}
                    placeholder="e.g. T.Nagar"
                  />
                </div>

                <div className="form-group">
                  <label>Cheque / Wire Date</label>
                  <input
                    className="bpms-input"
                    type="date"
                    value={paymentForm.cheque_wire_date || ""}
                    onChange={(e) => updatePaymentForm("cheque_wire_date", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "16px" }}>
                <label>Remarks</label>
                <textarea
                  className="bpms-input"
                  rows={2}
                  value={paymentForm.remarks}
                  onChange={(e) => updatePaymentForm("remarks", e.target.value)}
                  placeholder="Enter any reference, wire remarks or notes..."
                />
              </div>
            </div>
          </div>
        )}

        {paymentSection === "history" && (
          <div className="bpms-table-card">
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "800", color: "var(--text-primary)" }}>TRANSACTION HISTORY LEDGER</h3>
            </div>
            
            <div className="bpms-table-scroll">
              <table className="bpms-table">
                <thead>
                  <tr>
                    <th className="bpms-th">No.</th>
                    <th className="bpms-th">Payment Date</th>
                    <th className="bpms-th">Method</th>
                    <th className="bpms-th">Reference No.</th>
                    <th className="bpms-th">Bank Details</th>
                    <th className="bpms-th">Amount Received</th>
                    <th className="bpms-th">Cumulative Paid</th>
                    <th className="bpms-th">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.length > 0 ? (
                    paymentHistory.map((item, index) => (
                      <tr key={item.history_id || index} className="table-row-hover">
                        <td className="bpms-td">{index + 1}</td>
                        <td className="bpms-td">
                          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Calendar size={13} color="var(--text-muted)" />
                            {item.payment_date || item.cheque_wire_date || "N/A"}
                          </span>
                        </td>
                        <td className="bpms-td">
                          <span className="bpms-count-pill" style={{ background: "var(--bg-hover)", color: "var(--text-primary)", border: "none" }}>
                            {item.mode_of_payment || "NEFT"}
                          </span>
                        </td>
                        <td className="bpms-td" style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                          {item.cheque_transaction_no || "N/A"}
                        </td>
                        <td className="bpms-td">
                          {item.bank_name ? `${item.bank_name} (${item.branch_name || "N/A"})` : "N/A"}
                        </td>
                        <td className="bpms-td" style={{ color: "var(--success)", fontWeight: "700" }}>
                          ₹ {formatAmount(item.amount_received)}
                        </td>
                        <td className="bpms-td" style={{ fontWeight: "700" }}>
                          ₹ {formatAmount(item.running_total || item.running_paid || item.amount_received)}
                        </td>
                        <td className="bpms-td" style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {item.remarks || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="bpms-td" style={{ textAlign: "center", padding: "20px" }}>
                        No transactions have been recorded against this ledger yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
