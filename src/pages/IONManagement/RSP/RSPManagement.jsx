import { useEffect, useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Plus, Eye, ArrowLeft, Trash2, Search } from "lucide-react";

export default function RSPManagement() {
  const {
    activePage,
    setActivePage,
    rspForm,
    updateRspForm,
    formatAmount,
    saveRsp,
    deleteRsp,
    fetchRsp,
    rspList,
    selectedRsp,
    setSelectedRsp,
    vendors,
    numberToWords,
    rspAmount,
    setRspAmount,
    rspAmountWords,
    setRspAmountWords,
    formatDateDisplay,
    downloadPdf,
    downloadWord,
    signatures,
    companies
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");

  // Local calculations
  const baseAmountVal = parseFloat(rspForm.base_amount) || 0;
  const gstPercentVal = parseFloat(rspForm.gst_percent) || 0;
  const gstAmountVal = (baseAmountVal * gstPercentVal) / 100;
  const computedTotal = baseAmountVal + gstAmountVal;
  const computedWords = computedTotal ? numberToWords(Math.round(computedTotal)) : "";

  // Fetch fresh list on mount
  useEffect(() => {
    fetchRsp();
  }, []);

  // Synchronize local calculations to global state so context saveRsp can submit it
  useEffect(() => {
    setRspAmount(computedTotal);
    setRspAmountWords(computedWords);
  }, [computedTotal, computedWords, setRspAmount, setRspAmountWords]);

  // --- Sub-View: View RSP List Table (Landing / Default View) ---
  if (activePage === "RSP" || activePage === "View RSP") {
    const filteredRsp = rspList.filter((rsp) => {
      const term = searchTerm.toLowerCase();
      return (
        String(rsp.rsp_id).toLowerCase().includes(term) ||
        (rsp.title_type && rsp.title_type.toLowerCase().includes(term)) ||
        (rsp.vendor_name && rsp.vendor_name.toLowerCase().includes(term)) ||
        (rsp.cheque_name && rsp.cheque_name.toLowerCase().includes(term)) ||
        (rsp.project_name && rsp.project_name.toLowerCase().includes(term))
      );
    });

    return (
      <div className="bpms-page stagger-item">
        <div className="bpms-page-header">
          <div>
            <h2 className="bpms-page-title">Request Slip for Payment (RSP)</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
              List of all vendor payment request slips from database
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button
              className="bpms-btn bpms-btn--primary"
              onClick={() => setActivePage("Add RSP")}
            >
              <Plus size={14} style={{ marginRight: "4px" }} /> Create RSP
            </button>
            <button
              className="bpms-btn bpms-btn--ghost"
              onClick={() => setActivePage("ION")}
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>

        {/* Search & Counters Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginTop: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "260px", maxWidth: "360px" }}>
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search by ID, Title, Vendor, Project..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bpms-input"
              style={{ paddingLeft: "36px", height: "38px", fontSize: "13px" }}
            />
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>
            Showing <b>{filteredRsp.length}</b> of <b>{rspList.length}</b> records
          </div>
        </div>

        <div className="bpms-table-card" style={{ marginTop: "8px" }}>
          <div className="bpms-table-scroll">
            <table className="bpms-table">
              <thead>
                <tr>
                  <th className="bpms-th" style={{ width: "100px" }}>ID</th>
                  <th className="bpms-th" style={{ width: "160px" }}>Title Type</th>
                  <th className="bpms-th" style={{ width: "120px" }}>RSP Date</th>
                  <th className="bpms-th">Vendor</th>
                  <th className="bpms-th">Cheque In Favour Of</th>
                  <th className="bpms-th">Project</th>
                  <th className="bpms-th" style={{ width: "140px" }}>Total Amount</th>
                  <th className="bpms-th" style={{ textAlign: "right", width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRsp.length > 0 ? (
                  filteredRsp.map((rsp) => (
                    <tr key={rsp.rsp_id} className="table-row-hover">
                      <td className="bpms-td">
                        <button
                          className="bpms-id-badge"
                          type="button"
                          onClick={() => {
                            setSelectedRsp(rsp);
                            setActivePage("RSP Details");
                          }}
                        >
                          RSP-{String(rsp.rsp_id).padStart(4, "0")}
                        </button>
                      </td>
                      <td className="bpms-td" style={{ fontWeight: "700" }}>{rsp.title_type || "ADVANCE REQUESTING"}</td>
                      <td className="bpms-td">{formatDateDisplay(rsp.rsp_date)}</td>
                      <td className="bpms-td" style={{ fontWeight: "700", color: "var(--text-primary)" }}>{rsp.vendor_name}</td>
                      <td className="bpms-td" style={{ color: "var(--text-secondary)" }}>{rsp.cheque_name}</td>
                      <td className="bpms-td">{rsp.project_name}</td>
                      <td className="bpms-td" style={{ fontWeight: "800", color: "var(--brand-dark)" }}>₹ {formatAmount(rsp.amount_payable)}</td>
                      <td className="bpms-td" style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button
                            className="bpms-btn"
                            style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            onClick={() => {
                              setSelectedRsp(rsp);
                              setActivePage("RSP Details");
                            }}
                          >
                            <Eye size={13} /> Details
                          </button>
                          <button
                            className="bpms-btn bpms-btn--danger"
                            style={{ padding: "6px 10px", fontSize: "12px" }}
                            onClick={() => deleteRsp(rsp.rsp_id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="bpms-td" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No matching RSP records found.
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

  // --- Sub-View: Add RSP Form (Split Pane Layout) ---
  if (activePage === "Add RSP") {
    return (
      <div className="bpms-page stagger-item" style={{ maxWidth: "100%", paddingBottom: "16px" }}>
        <div className="bpms-page-header" style={{ marginBottom: "12px" }}>
          <div>
            <h2 className="bpms-page-title">Create Payment Request Slip (RSP)</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Fill in RSP attributes on the left form to see a live document preview on the right.
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button className="bpms-btn bpms-btn--primary" onClick={saveRsp}>Save RSP Slip</button>
            <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("RSP")}>
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>

        <div className="bpms-split-container">
          {/* Left Column: Form Inputs */}
          <div className="bpms-form-column">
            
            {/* Section 1: Slip Header info */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Slip Details & Metadata</div>
              <div className="bpms-form-group">
                <label>Payment Request Title Type</label>
                <select
                  value={rspForm.title_type}
                  onChange={(e) => updateRspForm("title_type", e.target.value)}
                >
                  <option value="ADVANCE REQUESTING">ADVANCE REQUESTING</option>
                  <option value="PART PAYMENT">PART PAYMENT</option>
                  <option value="FINAL BILL REQUEST">FINAL BILL REQUEST</option>
                </select>
              </div>

              <div className="bpms-form-group">
                <label>Company Name</label>
                <select
                  value={rspForm.company_name}
                  onChange={(e) => updateRspForm("company_name", e.target.value)}
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c.company_id} value={c.company_name}>{c.company_name}</option>
                  ))}
                </select>
              </div>

              <div className="bpms-form-group">
                <label>Slip Date</label>
                <input
                  type="date"
                  value={rspForm.rsp_date}
                  onChange={(e) => updateRspForm("rsp_date", e.target.value)}
                />
              </div>
            </div>

            {/* Section 2: Vendor & Project */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Vendor & Project Information</div>
              <div className="bpms-form-group">
                <label>Vendor / Supplier Name</label>
                <select
                  value={rspForm.vendor_name}
                  onChange={(e) => updateRspForm("vendor_name", e.target.value)}
                >
                  <option value="">Select Vendor</option>
                  {(vendors || []).map((v) => (
                    <option key={v.vendor_id} value={v.vendor_name}>{v.vendor_name}</option>
                  ))}
                </select>
              </div>

              <div className="bpms-form-group">
                <label>Cheque in Favour Of</label>
                <input
                  type="text"
                  placeholder="Beneficiary Name"
                  value={rspForm.cheque_name}
                  onChange={(e) => updateRspForm("cheque_name", e.target.value)}
                />
              </div>

              <div className="bpms-form-group">
                <label>Name of the Project</label>
                <input
                  type="text"
                  placeholder="Enter project name..."
                  value={rspForm.project_name}
                  onChange={(e) => updateRspForm("project_name", e.target.value)}
                />
              </div>

              <div className="bpms-form-group">
                <label>Name of the Work / Scope</label>
                <input
                  type="text"
                  placeholder="Enter work details..."
                  value={rspForm.work_name}
                  onChange={(e) => updateRspForm("work_name", e.target.value)}
                />
              </div>
            </div>

            {/* Section 3: Invoicing Citation */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Invoicing Reference</div>
              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>Invoice Type</label>
                  <select
                    value={rspForm.invoice_type}
                    onChange={(e) => updateRspForm("invoice_type", e.target.value)}
                  >
                    <option value="Invoice No">Invoice No</option>
                    <option value="Proforma No">Proforma No</option>
                    <option value="Estimate No">Estimate No</option>
                  </select>
                </div>
                <div className="bpms-form-group">
                  <label>Ref Document No</label>
                  <input
                    type="text"
                    placeholder="Ref No"
                    value={rspForm.invoice_no}
                    onChange={(e) => updateRspForm("invoice_no", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>Ref Document Date</label>
                  <input
                    type="date"
                    value={rspForm.invoice_date}
                    onChange={(e) => updateRspForm("invoice_date", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Budget & Values */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Payment & GST Calculations</div>
              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>Base Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={rspForm.base_amount}
                    onChange={(e) => updateRspForm("base_amount", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>GST (%)</label>
                  <input
                    type="number"
                    placeholder="18"
                    value={rspForm.gst_percent}
                    onChange={(e) => updateRspForm("gst_percent", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Document Preview (100% Identical Original Layout, Read-Only) */}
          <div className="bpms-preview-column">
            <div 
              style={{ pointerEvents: "none" }} 
              tabIndex="-1"
            >
              <div id="rsp-print-area" className="rsp-paper" style={{ boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)", margin: "0 auto" }}>
                <div className="rsp-title" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px" }}>
                  <span>
                    <select
                      className="inline-doc-input"
                      style={{ fontSize: "18px", fontWeight: "bold", border: "none", background: "transparent", cursor: "pointer", color: "var(--brand-dark)", textAlign: "center" }}
                      value={rspForm.title_type}
                      onChange={(e) => updateRspForm("title_type", e.target.value)}
                      tabIndex="-1"
                    >
                      <option value="ADVANCE REQUESTING">ADVANCE REQUESTING</option>
                      <option value="PART PAYMENT">PART PAYMENT</option>
                      <option value="FINAL BILL REQUEST">FINAL BILL REQUEST</option>
                    </select>
                  </span>
                  <span style={{ background: "transparent", padding: 0, textDecoration: "underline" }}>SLIP FOR PAYMENT</span>
                </div>

                <div className="rsp-top">
                  <div>
                    M/S 
                    <select
                       className="inline-doc-input"
                       style={{ width: "200px", fontWeight: "bold", margin: "0 4px", appearance: "auto", cursor: "pointer", background: "transparent" }}
                       value={rspForm.company_name}
                       onChange={(e) => updateRspForm("company_name", e.target.value)}
                       tabIndex="-1"
                     >
                       <option value="" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>Select Company</option>
                       {companies.map((c) => (
                         <option key={c.company_id} value={c.company_name} style={{ background: "var(--surface)", color: "var(--text-primary)" }}>{c.company_name}</option>
                       ))}
                     </select>
                    PVT LTD
                  </div>
                  <div className="rsp-date-box">
                    <div>
                      DATED: 
                      <input
                        type="date"
                        className="inline-doc-input"
                        style={{ width: "135px", marginLeft: "4px" }}
                        value={rspForm.rsp_date}
                        onChange={(e) => updateRspForm("rsp_date", e.target.value)}
                        tabIndex="-1"
                        readOnly
                      />
                    </div>
                    <div style={{ marginTop: "4px" }}>Prepared By: Arshan M</div>
                    <div style={{ marginTop: "4px" }}>DEPARTMENT: Marketing</div>
                  </div>
                </div>

                <div className="rsp-body" style={{ width: "100%", marginTop: "24px" }}>
                  <div style={{ width: "100%" }}>
                    <div className="rsp-row">
                      <span>1.</span>
                      <b>NAME</b>
                      <span>:</span>
                      <select
                        className="inline-doc-input"
                        style={{ width: "100%", color: "var(--brand)", fontWeight: "bold" }}
                        value={rspForm.vendor_name}
                        onChange={(e) => updateRspForm("vendor_name", e.target.value)}
                        tabIndex="-1"
                      >
                        <option value="">Select Vendor</option>
                        {(vendors || []).map((v) => (
                          <option key={v.vendor_id} value={v.vendor_name}>{v.vendor_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="rsp-row">
                      <span>2.</span>
                      <b>Cheque in Favour of</b>
                      <span>:</span>
                      <input
                        type="text"
                        className="inline-doc-input"
                        style={{ width: "100%", fontWeight: "bold" }}
                        placeholder="beneficiary name"
                        value={rspForm.cheque_name}
                        onChange={(e) => updateRspForm("cheque_name", e.target.value)}
                        tabIndex="-1"
                        readOnly
                      />
                    </div>

                    <div className="rsp-row">
                      <span>3.</span>
                      <b>NAME OF THE PROJECT</b>
                      <span>:</span>
                      <input
                        type="text"
                        className="inline-doc-input"
                        style={{ width: "100%", fontWeight: "bold" }}
                        placeholder="Project name"
                        value={rspForm.project_name}
                        onChange={(e) => updateRspForm("project_name", e.target.value)}
                        tabIndex="-1"
                        readOnly
                      />
                    </div>

                    <div className="rsp-row">
                      <span>4.</span>
                      <b>NAME OF THE WORK</b>
                      <span>:</span>
                      <input
                        type="text"
                        className="inline-doc-input"
                        style={{ width: "100%", fontWeight: "bold" }}
                        placeholder="Work details"
                        value={rspForm.work_name}
                        onChange={(e) => updateRspForm("work_name", e.target.value)}
                        tabIndex="-1"
                        readOnly
                      />
                    </div>

                    <div className="rsp-row">
                      <span>5.</span>
                      <b style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <select
                          className="inline-doc-input"
                          style={{ fontWeight: "bold", borderBottom: "none", padding: 0 }}
                          value={rspForm.invoice_type}
                          onChange={(e) => updateRspForm("invoice_type", e.target.value)}
                          tabIndex="-1"
                        >
                          <option value="Invoice No">Invoice No</option>
                          <option value="Proforma No">Proforma No</option>
                          <option value="Estimate No">Estimate No</option>
                        </select>
                        & DATE
                      </b>
                      <span>:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="text"
                          className="inline-doc-input"
                          style={{ width: "140px", fontWeight: "bold" }}
                          placeholder="Number/Ref"
                          value={rspForm.invoice_no}
                          onChange={(e) => updateRspForm("invoice_no", e.target.value)}
                          tabIndex="-1"
                          readOnly
                        />
                        <b>&</b>
                        <input
                          type="date"
                          className="inline-doc-input"
                          style={{ width: "135px" }}
                          value={rspForm.invoice_date}
                          onChange={(e) => updateRspForm("invoice_date", e.target.value)}
                          tabIndex="-1"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="rsp-row">
                      <span>6.</span>
                      <b>AMOUNT PAYABLE</b>
                      <span>:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span>Base: ₹</span>
                          <input
                            type="number"
                            className="inline-doc-input"
                            style={{ width: "90px", fontWeight: "bold" }}
                            placeholder="0.00"
                            value={rspForm.base_amount}
                            onChange={(e) => updateRspForm("base_amount", e.target.value)}
                            tabIndex="-1"
                            readOnly
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span>GST @</span>
                          <input
                            type="number"
                            className="inline-doc-input"
                            style={{ width: "40px", textAlign: "center", fontWeight: "bold" }}
                            value={rspForm.gst_percent}
                            onChange={(e) => updateRspForm("gst_percent", e.target.value)}
                            tabIndex="-1"
                            readOnly
                          />
                          <span>%</span>
                        </div>
                        <b style={{ fontSize: "15px", color: "var(--brand)" }}>Total: ₹ {formatAmount(computedTotal)}</b>
                      </div>
                    </div>

                    <div className="rsp-row">
                      <span>7.</span>
                      <b>AMOUNT IN WORDS</b>
                      <span>:</span>
                      <b style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{computedWords || "zero rupees only"}</b>
                    </div>

                    <div className="rsp-row" style={{ borderBottom: "none" }}>
                      <span>8.</span>
                      <b>ENTERED IN M.BOOK. NO.</b>
                      <span>:</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <input
                          type="text"
                          className="inline-doc-input"
                          style={{ width: "120px" }}
                          placeholder="M.Book No"
                          tabIndex="-1"
                          readOnly
                        />
                        <b>P.No.</b>
                        <input
                          type="text"
                          className="inline-doc-input"
                          style={{ width: "80px" }}
                          placeholder="Page"
                          tabIndex="-1"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horizontal Signatures Section at the Bottom */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginTop: "48px", 
                  borderTop: "1px solid #eee", 
                  paddingTop: "16px" 
                }}>
                  <div style={{ textAlign: "center", width: "130px" }}>
                    <div style={{ minHeight: "40px" }}></div>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.agm_marketing.name}</div>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{signatures.agm_marketing.designation}</div>
                  </div>
                  <div style={{ textAlign: "center", width: "100px" }}>
                    <div style={{ minHeight: "40px" }}></div>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.vp_finance.name}</div>
                  </div>
                  <div style={{ textAlign: "center", width: "80px" }}>
                    <div style={{ minHeight: "40px" }}></div>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.ay_dir.name}</div>
                  </div>
                  <div style={{ textAlign: "center", width: "80px" }}>
                    <div style={{ minHeight: "40px" }}></div>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.by_dir.name}</div>
                  </div>
                  <div style={{ textAlign: "center", width: "80px" }}>
                    <div style={{ minHeight: "40px" }}></div>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.md.name}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Sub-View: Preview / Details ---
  if (activePage === "RSP Details" && selectedRsp) {
    return (
      <div className="bpms-page stagger-item">
        <div className="bpms-page-header">
          <div>
            <h2 className="bpms-page-title">RSP Document Details</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Print preview and file export controls for RSP-{String(selectedRsp.rsp_id).padStart(4, "0")}
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button className="bpms-btn bpms-btn--primary" onClick={downloadPdf}>
              Download PDF
            </button>
            <button className="bpms-btn bpms-btn--ghost" onClick={downloadWord}>
              Download Word
            </button>
            <button
              className="bpms-btn bpms-btn--ghost"
              onClick={() => {
                fetchRsp();
                setActivePage("RSP");
              }}
            >
              <ArrowLeft size={14} /> Back to List
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", background: "var(--bg-color)", padding: "24px", borderRadius: "var(--r-md)", border: "1px solid var(--border)", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <div id="rsp-print-area" className="rsp-paper" style={{ boxShadow: "none", border: "none" }}>
            <div className="rsp-title">
              <span>{selectedRsp.title_type || "ADVANCE REQUESTING"}</span>{" "}
              <span style={{ background: "transparent", padding: 0, textDecoration: "underline" }}>SLIP FOR PAYMENT</span>
            </div>

            <div className="rsp-top">
              <div>
                M/S <b>{selectedRsp.company_name}</b> PVT LTD
              </div>
              <div className="rsp-date-box">
                <div>DATED: <b>{formatDateDisplay(selectedRsp.rsp_date)}</b></div>
                <div>Prepared By: Arshan M</div>
                <div>DEPARTMENT: Marketing</div>
              </div>
            </div>

            <div className="rsp-body" style={{ width: "100%" }}>
              {/* Wrap grid items in full width to align perfectly */}
              <div style={{ width: "100%" }}>
                <div className="rsp-row">
                  <span>1.</span>
                  <b>NAME</b>
                  <span>:</span>
                  <b style={{ color: "var(--brand)" }}>{selectedRsp.vendor_name}</b>
                </div>

                <div className="rsp-row">
                  <span>2.</span>
                  <b>Cheque in Favour of</b>
                  <span>:</span>
                  <b>{selectedRsp.cheque_name}</b>
                </div>

                <div className="rsp-row">
                  <span>3.</span>
                  <b>NAME OF THE PROJECT</b>
                  <span>:</span>
                  <b>{selectedRsp.project_name}</b>
                </div>

                <div className="rsp-row">
                  <span>4.</span>
                  <b>NAME OF THE WORK</b>
                  <span>:</span>
                  <b>{selectedRsp.work_name}</b>
                </div>

                <div className="rsp-row">
                  <span>5.</span>
                  <b>{selectedRsp.invoice_type || "Invoice No"} & DATE</b>
                  <span>:</span>
                  <b>
                    {selectedRsp.invoice_no || "—"} {selectedRsp.invoice_date ? `& ${formatDateDisplay(selectedRsp.invoice_date)}` : ""}
                  </b>
                </div>

                <div className="rsp-row">
                  <span>6.</span>
                  <b>AMOUNT PAYABLE</b>
                  <span>:</span>
                  <b style={{ fontSize: "16px", color: "var(--brand)" }}>₹ {formatAmount(selectedRsp.amount_payable)}</b>
                </div>

                <div className="rsp-row">
                  <span>7.</span>
                  <b>AMOUNT IN WORDS</b>
                  <span>:</span>
                  <b style={{ fontSize: "13px" }}>{selectedRsp.amount_words}</b>
                </div>

                <div className="rsp-row" style={{ borderBottom: "none" }}>
                  <span>8.</span>
                  <b>ENTERED IN M.BOOK. NO.</b>
                  <span>:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ borderBottom: "1px dotted #888", display: "inline-block", width: "120px", minHeight: "18px" }}></span>
                    <b>P.No.</b>
                    <span style={{ borderBottom: "1px dotted #888", display: "inline-block", width: "80px", minHeight: "18px" }}></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Signatures Section at the Bottom */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "60px",
              borderTop: "1px solid #eee",
              paddingTop: "20px"
            }}>
              <div style={{ textAlign: "center", width: "130px" }}>
                <div style={{ minHeight: "45px" }}></div>
                <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.agm_marketing.name}</div>
                <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{signatures.agm_marketing.designation}</div>
              </div>
              <div style={{ textAlign: "center", width: "100px" }}>
                <div style={{ minHeight: "45px" }}></div>
                <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.vp_finance.name}</div>
              </div>
              <div style={{ textAlign: "center", width: "80px" }}>
                <div style={{ minHeight: "45px" }}></div>
                <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.ay_dir.name}</div>
              </div>
              <div style={{ textAlign: "center", width: "80px" }}>
                <div style={{ minHeight: "45px" }}></div>
                <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.by_dir.name}</div>
              </div>
              <div style={{ textAlign: "center", width: "80px" }}>
                <div style={{ minHeight: "45px" }}></div>
                <div style={{ fontSize: "13px", fontWeight: "700" }}>{signatures.md.name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
