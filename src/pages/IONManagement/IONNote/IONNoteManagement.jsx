import { useEffect, useState } from "react";
import { useApp } from "../../../context/AppContext";
import { Plus, Eye, ArrowLeft, Trash2, FileText, Search, Printer, FileDown } from "lucide-react";

export default function IONNoteManagement() {
  const {
    activePage,
    setActivePage,
    ionForm,
    updateIonForm,
    formatAmount,
    saveIon,
    deleteIon,
    previewIon,
    fetchIonNotes,
    ionNotes,
    setSelectedIon,
    selectedIon,
    vendors,
    formatDateDisplay,
    downloadIonPdf,
    signatures,
    companies
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch fresh list on mount
  useEffect(() => {
    fetchIonNotes();
  }, []);

  // --- Sub-View: View ION List Table (Now the Landing / Default View) ---
  if (activePage === "ION NOTE" || activePage === "View ION") {
    const filteredNotes = ionNotes.filter((ion) => {
      const term = searchTerm.toLowerCase();
      return (
        String(ion.ion_note_id).toLowerCase().includes(term) ||
        (ion.ion_ref_no && ion.ion_ref_no.toLowerCase().includes(term)) ||
        (ion.subject && ion.subject.toLowerCase().includes(term)) ||
        (ion.vendor_name && ion.vendor_name.toLowerCase().includes(term)) ||
        (ion.project_name && ion.project_name.toLowerCase().includes(term))
      );
    });

    return (
      <div className="bpms-page stagger-item">
        <div className="bpms-page-header">
          <div>
            <h2 className="bpms-page-title">Inter Office Note (ION)</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
              List of all internal office notes and financial approvals from database
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button
              className="bpms-btn bpms-btn--primary"
              onClick={() => setActivePage("Add ION")}
            >
              <Plus size={14} style={{ marginRight: "4px" }} /> Create ION
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
              placeholder="Search by ID, Ref, Vendor, Subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bpms-input"
              style={{ paddingLeft: "36px", height: "38px", fontSize: "13px" }}
            />
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: "500" }}>
            Showing <b>{filteredNotes.length}</b> of <b>{ionNotes.length}</b> records
          </div>
        </div>

        <div className="bpms-table-card" style={{ marginTop: "8px" }}>
          <div className="bpms-table-scroll">
            <table className="bpms-table">
              <thead>
                <tr>
                  <th className="bpms-th" style={{ width: "100px" }}>ID</th>
                  <th className="bpms-th" style={{ width: "140px" }}>ION Ref</th>
                  <th className="bpms-th" style={{ width: "120px" }}>Date</th>
                  <th className="bpms-th">Subject</th>
                  <th className="bpms-th">Vendor</th>
                  <th className="bpms-th">Project</th>
                  <th className="bpms-th" style={{ width: "140px" }}>Grand Total</th>
                  <th className="bpms-th" style={{ textAlign: "right", width: "160px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((ion) => (
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
                      <td className="bpms-td" style={{ color: "var(--text-secondary)" }}>{ion.subject}</td>
                      <td className="bpms-td" style={{ fontWeight: "700", color: "var(--text-primary)" }}>{ion.vendor_name}</td>
                      <td className="bpms-td">{ion.project_name}</td>
                      <td className="bpms-td" style={{ fontWeight: "800", color: "var(--brand-dark)" }}>₹ {formatAmount(ion.grand_total)}</td>
                      <td className="bpms-td" style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button
                            className="bpms-btn"
                            style={{ padding: "6px 12px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            onClick={() => {
                              setSelectedIon(ion);
                              setActivePage("ION Details");
                            }}
                          >
                            <Eye size={13} /> Details
                          </button>
                          <button
                            className="bpms-btn bpms-btn--danger"
                            style={{ padding: "6px 10px", fontSize: "12px" }}
                            onClick={() => deleteIon(ion.ion_note_id)}
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
                      No matching ION records found.
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

  // --- Sub-View: Add ION Note Form (Split Pane Layout) ---
  if (activePage === "Add ION") {
    return (
      <div className="bpms-page stagger-item" style={{ maxWidth: "100%", paddingBottom: "16px" }}>
        <div className="bpms-page-header" style={{ marginBottom: "12px" }}>
          <div>
            <h2 className="bpms-page-title">Create Inter Office Note</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Fill in the details on the left form to see a live document preview on the right.
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button className="bpms-btn bpms-btn--primary" onClick={saveIon}>Save ION</button>
            <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("ION NOTE")}>
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>

        <div className="bpms-split-container">
          {/* Left Column: Form Inputs */}
          <div className="bpms-form-column">
            
            {/* Section 1: Header Details */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Document Header</div>
              <div className="bpms-form-group">
                <label>Company Name</label>
                <select
                  value={ionForm.company_name}
                  onChange={(e) => updateIonForm("company_name", e.target.value)}
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c.company_id} value={c.company_name}>{c.company_name}</option>
                  ))}
                </select>
              </div>

              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>ION Date</label>
                  <input
                    type="date"
                    value={ionForm.ion_date}
                    onChange={(e) => updateIonForm("ion_date", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>ION Ref No (Prefix: ION/)</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={ionForm.ion_ref_no}
                    onChange={(e) => updateIonForm("ion_ref_no", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Subject & Vendor */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Subject & Vendor Scope</div>
              <div className="bpms-form-group">
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="Enter memo subject..."
                  value={ionForm.subject}
                  onChange={(e) => updateIonForm("subject", e.target.value)}
                />
              </div>

              <div className="bpms-form-group">
                <label>Vendor</label>
                <select
                  value={ionForm.vendor_name}
                  onChange={(e) => updateIonForm("vendor_name", e.target.value)}
                >
                  <option value="">Select Vendor</option>
                  {(vendors || []).map((v) => (
                    <option key={v.vendor_id} value={v.vendor_name}>{v.vendor_name}</option>
                  ))}
                </select>
              </div>

              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>Work Name / Scope</label>
                  <input
                    type="text"
                    placeholder="e.g. electrical work"
                    value={ionForm.work_name}
                    onChange={(e) => updateIonForm("work_name", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Baashyaam Crown"
                    value={ionForm.project_name}
                    onChange={(e) => updateIonForm("project_name", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Duration & Amount */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Schedule & Budget</div>
              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>Duration From</label>
                  <input
                    type="date"
                    value={ionForm.duration_from}
                    onChange={(e) => updateIonForm("duration_from", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>Duration To</label>
                  <input
                    type="date"
                    value={ionForm.duration_to}
                    onChange={(e) => updateIonForm("duration_to", e.target.value)}
                  />
                </div>
              </div>

              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>Base Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={ionForm.base_amount}
                    onChange={(e) => updateIonForm("base_amount", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>GST (%)</label>
                  <input
                    type="number"
                    placeholder="18"
                    value={ionForm.gst_percent}
                    onChange={(e) => updateIonForm("gst_percent", e.target.value)}
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
              <div id="ion-print-area" className="ion-note-paper" style={{ boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)", margin: "0 auto" }}>
                <div className="ion-company-title" style={{ display: "flex", justifyContent: "center" }}>
                  <select
                    className="inline-doc-input"
                    style={{ textAlign: "center", fontSize: "20px", fontWeight: "800", width: "80%", textTransform: "uppercase", borderBottom: "none", appearance: "auto", cursor: "pointer", background: "transparent" }}
                    value={ionForm.company_name}
                    onChange={(e) => updateIonForm("company_name", e.target.value)}
                    tabIndex="-1"
                  >
                    <option value="" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>Select Company</option>
                    {companies.map((c) => (
                      <option key={c.company_id} value={c.company_name} style={{ background: "var(--surface)", color: "var(--text-primary)" }}>{c.company_name}</option>
                    ))}
                  </select>
                  <span style={{ fontSize: "20px", fontWeight: "800", marginLeft: "4px" }}>PVT LTD</span>
                </div>
                <div className="ion-note-title">INTER OFFICE NOTE</div>
                <div className="ion-note-line" />

                <div className="ion-note-top">
                  <div>
                    From:<br />
                    <b>Mr.Manu Jacob Sabu</b>
                    <div style={{ marginTop: "4px" }}>
                      <b>Date:</b>
                      <input
                        type="date"
                        className="inline-doc-input"
                        style={{ width: "135px", marginLeft: "4px" }}
                        value={ionForm.ion_date}
                        onChange={(e) => updateIonForm("ion_date", e.target.value)}
                        tabIndex="-1"
                        readOnly
                      />
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      <b>Ref :</b> ION/
                      <input
                        type="text"
                        className="inline-doc-input"
                        style={{ width: "120px", marginLeft: "4px" }}
                        placeholder="Auto generated"
                        value={ionForm.ion_ref_no}
                        onChange={(e) => updateIonForm("ion_ref_no", e.target.value)}
                        tabIndex="-1"
                        readOnly
                      />
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    To:<br />
                    <b>MD & DIRECTOR</b>
                  </div>
                </div>

                <div className="ion-note-line" />
                <div className="ion-subject" style={{ display: "flex", alignItems: "center" }}>
                  <b style={{ marginRight: "6px" }}>Sub:</b>
                  <input
                    type="text"
                    className="inline-doc-input"
                    style={{ flex: 1, fontWeight: "bold" }}
                    placeholder="Click here to type subject..."
                    value={ionForm.subject}
                    onChange={(e) => updateIonForm("subject", e.target.value)}
                    tabIndex="-1"
                    readOnly
                  />
                </div>

                <div className="ion-para" style={{ textAlign: "left" }}>
                  <p><b>Dear Sir,</b></p>
                  <p style={{ textIndent: "40px", lineHeight: "1.7", margin: "10px 0" }}>
                    With reference to the comprehensive invoice given by
                    <select
                      className="inline-doc-input"
                      style={{ width: "200px", color: "var(--brand)", fontWeight: "bold", margin: "0 4px" }}
                      value={ionForm.vendor_name}
                      onChange={(e) => updateIonForm("vendor_name", e.target.value)}
                      tabIndex="-1"
                    >
                      <option value="">Select Vendor</option>
                      {(vendors || []).map((v) => (
                        <option key={v.vendor_id} value={v.vendor_name}>{v.vendor_name}</option>
                      ))}
                    </select>
                    regarding
                    <input
                      type="text"
                      className="inline-doc-input"
                      style={{ width: "180px", margin: "0 4px" }}
                      placeholder="scope of work"
                      value={ionForm.work_name}
                      onChange={(e) => updateIonForm("work_name", e.target.value)}
                      tabIndex="-1"
                      readOnly
                    />
                    for the
                    <input
                      type="text"
                      className="inline-doc-input"
                      style={{ width: "150px", margin: "0 4px" }}
                      placeholder="Project name"
                      value={ionForm.project_name}
                      onChange={(e) => updateIonForm("project_name", e.target.value)}
                      tabIndex="-1"
                      readOnly
                    />
                    project, details are given below.
                  </p>

                  <table className="ion-amount-table" style={{ marginTop: "24px" }}>
                    <thead>
                      <tr><th>Description</th><th style={{ width: "150px" }}>Amount</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <div style={{ fontWeight: "700" }}>{ionForm.work_name || "(Work details)"}</div>
                          <div style={{ fontSize: "13px", marginTop: "4px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                            Duration: 
                            <input
                              type="date"
                              className="inline-doc-input"
                              style={{ width: "125px" }}
                              value={ionForm.duration_from}
                              onChange={(e) => updateIonForm("duration_from", e.target.value)}
                              tabIndex="-1"
                              readOnly
                            />
                            to
                            <input
                              type="date"
                              className="inline-doc-input"
                              style={{ width: "125px" }}
                              value={ionForm.duration_to}
                              onChange={(e) => updateIonForm("duration_to", e.target.value)}
                              tabIndex="-1"
                              readOnly
                            />
                          </div>
                        </td>
                        <td style={{ textAlign: "right", verticalAlign: "middle" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "2px", fontWeight: "bold" }}>
                            ₹ 
                            <input
                              type="number"
                              className="inline-doc-input"
                              style={{ width: "110px", textAlign: "right", fontWeight: "bold" }}
                              placeholder="0.00"
                              value={ionForm.base_amount}
                              onChange={(e) => updateIonForm("base_amount", e.target.value)}
                              tabIndex="-1"
                              readOnly
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><b>Sub Total</b></td>
                        <td style={{ textAlign: "right", fontWeight: "bold" }}>₹ {formatAmount(ionForm.base_amount)}</td>
                      </tr>
                      <tr>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <b>GST @</b>
                            <input
                              type="number"
                              className="inline-doc-input"
                              style={{ width: "50px", textAlign: "center", fontWeight: "bold" }}
                              value={ionForm.gst_percent}
                              onChange={(e) => updateIonForm("gst_percent", e.target.value)}
                              tabIndex="-1"
                              readOnly
                            />
                            <b>%</b>
                          </div>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: "bold" }}>₹ {formatAmount(ionForm.gst_amount)}</td>
                      </tr>
                      <tr>
                        <td><b>Grand Total</b></td>
                        <td style={{ textAlign: "right", fontWeight: "bold", color: "var(--brand)", fontSize: "15px" }}>₹ {formatAmount(ionForm.grand_total)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="ion-request" style={{ marginTop: "24px" }}>Request to accord your approval.</p>
                  
                  <div className="ion-sign-main" style={{ marginTop: "32px" }}>
                    <b>{signatures.agm_marketing.name}</b>
                    <br />
                    <span style={{ fontWeight: "normal", fontSize: "13px" }}>{signatures.agm_marketing.designation}</span>
                  </div>
                  
                  <div className="ion-sign-bottom" style={{ marginTop: "40px" }}>
                    <b>{signatures.vp_finance.name}</b>
                    <b>{signatures.ay_dir.name}</b>
                    <b>{signatures.by_dir.name}</b>
                    <b>{signatures.md.name}</b>
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
  if (activePage === "ION Details" && selectedIon) {
    return (
      <div className="bpms-page stagger-item">
        <div className="bpms-page-header">
          <div>
            <h2 className="bpms-page-title">Inter Office Note Details</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
              Print preview and approvals list for ION/{selectedIon.ion_ref_no}
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button
              className="bpms-btn bpms-btn--primary"
              onClick={() => downloadIonPdf(selectedIon.ion_ref_no)}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <FileDown size={14} /> Download PDF
            </button>
            <button
              className="bpms-btn"
              onClick={() => window.print()}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <Printer size={14} /> Print
            </button>
            <button
              className="bpms-btn bpms-btn--ghost"
              onClick={() => {
                fetchIonNotes();
                setActivePage("View ION");
              }}
            >
              <ArrowLeft size={14} /> Back to List
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", background: "var(--bg-subtle)", padding: "32px 24px", borderRadius: "var(--r-md)", border: "1px solid var(--border)", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
          <div id="ion-print-area" className="ion-note-paper" style={{ boxShadow: "var(--shadow-md)", border: "1px solid var(--border)", margin: "0 auto" }}>
            <div className="ion-company-title">
              <span className="preview-text">{selectedIon.company_name || "BAASHYAAM VENTURES"}</span> PVT LTD
            </div>
            <div className="ion-note-title">INTER OFFICE NOTE</div>
            <div className="ion-note-line" />

            <div className="ion-note-top">
              <div>
                From:<br />
                <b>Mr.Manu Jacob Sabu</b>
                <div><b>Date:</b> <span className="preview-text">{formatDateDisplay(selectedIon.ion_date)}</span></div>
                <div><b>Ref :</b> ION/<span className="preview-text">{selectedIon.ion_ref_no}</span></div>
              </div>
              <div style={{ textAlign: "right" }}>
                To:<br />
                <b>MD & DIRECTOR</b>
              </div>
            </div>

            <div className="ion-note-line" />
            <div className="ion-subject"><b>Sub:</b> <span className="preview-text">{selectedIon.subject}</span></div>

            <div className="ion-para" style={{ textAlign: "left" }}>
              <p><b>Dear Sir,</b></p>
              <p style={{ textIndent: "40px", lineHeight: "1.7", margin: "10px 0" }}>
                With reference to the comprehensive invoice given by <span className="preview-text" style={{ fontWeight: "bold" }}>{selectedIon.vendor_name}</span> regarding <span className="preview-text">{selectedIon.work_name}</span> for the <span className="preview-text">{selectedIon.project_name}</span> project, details are given below.
              </p>

              <table className="ion-amount-table">
                <thead>
                  <tr><th>Description</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "left" }}>
                      <span className="preview-text">{selectedIon.work_name}</span><br />
                      Duration: <span className="preview-text">{formatDateDisplay(selectedIon.duration_from)}</span> to <span className="preview-text">{formatDateDisplay(selectedIon.duration_to)}</span>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: "bold" }}><span className="preview-text">₹ {formatAmount(selectedIon.base_amount)}</span></td>
                  </tr>
                  <tr><td><b>Sub Total</b></td><td style={{ textAlign: "right", fontWeight: "bold" }}>₹ {formatAmount(selectedIon.base_amount)}</td></tr>
                  <tr><td><b>GST @ <span className="preview-text">{selectedIon.gst_percent}</span>%</b></td><td style={{ textAlign: "right", fontWeight: "bold" }}>₹ {formatAmount(selectedIon.gst_amount)}</td></tr>
                  <tr><td><b>Grand Total</b></td><td style={{ textAlign: "right", fontWeight: "bold", color: "var(--brand)" }}>₹ {formatAmount(selectedIon.grand_total)}</td></tr>
                </tbody>
              </table>

              <p className="ion-request">Request to accord your approval.</p>
              <div className="ion-sign-main"><b>{signatures.agm_marketing.name}</b><br /><span style={{ fontWeight: "normal", fontSize: "13px" }}>{signatures.agm_marketing.designation}</span></div>
              <div className="ion-sign-bottom"><b>{signatures.vp_finance.name}</b><b>{signatures.ay_dir.name}</b><b>{signatures.by_dir.name}</b><b>{signatures.md.name}</b></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
