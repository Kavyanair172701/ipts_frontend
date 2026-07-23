import { useEffect } from "react";
import { useApp } from "../../../context/AppContext";
import { Plus, Eye, ArrowLeft, Trash2, Download } from "lucide-react";

export default function POManagement() {
  const {
    activePage,
    setActivePage,
    poSearch,
    setPoSearch,
    filteredPoList,
    formatDateDisplay,
    formatAmount,
    setSelectedPo,
    openAddPo,
    poForm,
    updatePoForm,
    savePo,
    deletePo,
    previewPo,
    downloadPoPdf,
    selectedPo,
    vendors,
    fetchPos,
    signatures,
    companies
  } = useApp();

  // Fetch fresh list on mount
  useEffect(() => {
    fetchPos();
  }, []);

  // Handle auto-populating fields when a vendor is selected
  const handleVendorSelect = (vendorName) => {
    const selected = vendors.find((v) => v.vendor_name === vendorName);
    if (selected) {
      updatePoForm("vendor_name", selected.vendor_name);
      updatePoForm("vendor_address", selected.address || "");
      updatePoForm("gstin", selected.gst_no || "");
      updatePoForm("cheque_favour", selected.vendor_name);
      updatePoForm("kind_attn", selected.contact_person || selected.vendor_name);
    } else {
      updatePoForm("vendor_name", vendorName);
    }
  };

  // --- Sub-View: View PO List Table (Now the Landing / Default View) ---
  if (activePage === "PO" || activePage === "View PO") {
    return (
      <div className="po-page stagger-item">
        <div className="po-dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 className="po-dashboard-title">Purchase Orders (PO)</h2>
            <div className="po-dashboard-breadcrumb">Home <span>›</span> Purchase Order</div>
          </div>
          <div className="po-dashboard-actions" style={{ display: "flex", gap: "10px" }}>
            <button className="po-primary-btn" onClick={openAddPo}>
              <Plus size={18} style={{ marginRight: "4px" }} /> Create PO
            </button>
            <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("ION")}>
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>

        <div className="po-list-card" style={{ marginTop: "20px" }}>
          <div className="po-toolbar" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input
              className="po-search-input"
              type="text"
              placeholder="Search by PO number, supplier or reference..."
              value={poSearch}
              onChange={(e) => setPoSearch(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>

          <div className="po-table-wrap">
            <table className="po-modern-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Supplier / Vendor</th>
                  <th>PO Date</th>
                  <th>Expected Date</th>
                  <th>Total Amount</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoList.length > 0 ? (
                  filteredPoList.map((po) => (
                    <tr key={po.po_id}>
                      <td>
                        <button
                          className="bpms-id-badge"
                          type="button"
                          onClick={() => {
                            setSelectedPo(po);
                            setActivePage("PO Details");
                          }}
                        >
                          {po.po_no}
                        </button>
                      </td>
                      <td style={{ fontWeight: "700" }}>{po.vendor_name}</td>
                      <td>{formatDateDisplay(po.po_date)}</td>
                      <td>{formatDateDisplay(po.duration_to)}</td>
                      <td style={{ fontWeight: "800", color: "var(--brand-dark)" }}>₹ {formatAmount(po.grand_total)}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <button
                            className="po-row-view"
                            onClick={() => {
                              setSelectedPo(po);
                              setActivePage("PO Details");
                            }}
                          >
                            <Eye size={12} /> Details
                          </button>
                          <button
                            className="bpms-btn bpms-btn--danger"
                            style={{ padding: "6px 10px" }}
                            onClick={() => deletePo(po.po_id)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: "26px" }}>
                      No Purchase Order records found in database
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

  // --- Sub-View: Add PO Form (Split Pane Layout) ---
  if (activePage === "Add PO") {
    return (
      <div className="bpms-page stagger-item" style={{ maxWidth: "100%", paddingBottom: "16px" }}>
        <div className="bpms-page-header" style={{ marginBottom: "12px" }}>
          <div>
            <h2 className="bpms-page-title">Add Purchase Order</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Fill in PO attributes on the left form to see a live document preview on the right.
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button className="bpms-btn bpms-btn--primary" onClick={savePo}>Save PO</button>
            <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("PO")}>
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>

        <div className="bpms-split-container">
          {/* Left Column: Form Inputs */}
          <div className="bpms-form-column">
            
            {/* Section 1: Header Details */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">PO Header & References</div>
              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>PO Date</label>
                  <input
                    type="date"
                    value={poForm.po_date}
                    onChange={(e) => updatePoForm("po_date", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>PO Number / Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. PO-2026-001"
                    value={poForm.po_no}
                    onChange={(e) => updatePoForm("po_no", e.target.value)}
                  />
                </div>
              </div>

              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>Our Ref / ION Reference</label>
                  <input
                    type="text"
                    placeholder="Our Ref / ION Reference"
                    value={poForm.ref_no}
                    onChange={(e) => updatePoForm("ref_no", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>Company GSTIN</label>
                  <input
                    type="text"
                    placeholder="GSTIN"
                    value={poForm.gstin}
                    onChange={(e) => updatePoForm("gstin", e.target.value)}
                  />
                </div>
              </div>

              <div className="bpms-form-group">
                <label>Company Name</label>
                <select
                  value={poForm.company_name}
                  onChange={(e) => updatePoForm("company_name", e.target.value)}
                >
                  <option value="">Select Company</option>
                  {companies.map((c) => (
                    <option key={c.company_id} value={c.company_name}>{c.company_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 2: Vendor Details */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Vendor Information</div>
              <div className="bpms-form-group">
                <label>Vendor / Supplier</label>
                <select
                  value={poForm.vendor_name}
                  onChange={(e) => handleVendorSelect(e.target.value)}
                >
                  <option value="">Select Vendor</option>
                  {(vendors || []).map((v) => (
                    <option key={v.vendor_id} value={v.vendor_name}>{v.vendor_name}</option>
                  ))}
                </select>
              </div>

              <div className="bpms-form-group">
                <label>Vendor Address</label>
                <textarea
                  style={{ height: "60px", resize: "vertical" }}
                  placeholder="Vendor Address"
                  value={poForm.vendor_address}
                  onChange={(e) => updatePoForm("vendor_address", e.target.value)}
                />
              </div>

              <div className="bpms-form-group">
                <label>Kind Attention</label>
                <input
                  type="text"
                  placeholder="Contact person"
                  value={poForm.kind_attn}
                  onChange={(e) => updatePoForm("kind_attn", e.target.value)}
                />
              </div>
            </div>

            {/* Section 3: Reference Citation & Work Scope */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Reference Citation & Scope</div>
              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>Ref Document Type</label>
                  <select
                    value={poForm.estimate_type}
                    onChange={(e) => updatePoForm("estimate_type", e.target.value)}
                  >
                    <option value="Estimate">Estimate</option>
                    <option value="Proforma Invoice">Proforma Invoice</option>
                    <option value="Quotation">Quotation</option>
                  </select>
                </div>
                <div className="bpms-form-group">
                  <label>Ref Document No</label>
                  <input
                    type="text"
                    placeholder="Reference Number"
                    value={poForm.invoice_no}
                    onChange={(e) => updatePoForm("invoice_no", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>Ref Document Date</label>
                  <input
                    type="date"
                    value={poForm.invoice_date}
                    onChange={(e) => updatePoForm("invoice_date", e.target.value)}
                  />
                </div>
              </div>

              <div className="bpms-form-group">
                <label>Description of Work/Supply</label>
                <textarea
                  style={{ height: "60px", resize: "vertical" }}
                  placeholder="Enter detailed description of work or supply terms..."
                  value={poForm.description}
                  onChange={(e) => updatePoForm("description", e.target.value)}
                />
              </div>

              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>Work Duration From</label>
                  <input
                    type="date"
                    value={poForm.duration_from}
                    onChange={(e) => updatePoForm("duration_from", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>Work Duration To</label>
                  <input
                    type="date"
                    value={poForm.duration_to}
                    onChange={(e) => updatePoForm("duration_to", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Budget & Terms */}
            <div className="bpms-form-section">
              <div className="bpms-form-section-title">Pricing, Terms & Payments</div>
              <div className="bpms-form-row">
                <div className="bpms-form-group">
                  <label>Base Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={poForm.base_amount}
                    onChange={(e) => updatePoForm("base_amount", e.target.value)}
                  />
                </div>
                <div className="bpms-form-group">
                  <label>GST (%)</label>
                  <input
                    type="number"
                    placeholder="18"
                    value={poForm.gst_percent}
                    onChange={(e) => updatePoForm("gst_percent", e.target.value)}
                  />
                </div>
              </div>

              <div className="bpms-form-group">
                <label>Payment Terms</label>
                <input
                  type="text"
                  placeholder="e.g. 100% on Completion"
                  value={poForm.payment_terms}
                  onChange={(e) => updatePoForm("payment_terms", e.target.value)}
                />
              </div>

              <div className="bpms-form-group">
                <label>Cheque in Favour Of</label>
                <input
                  type="text"
                  placeholder="Beneficiary Name"
                  value={poForm.cheque_favour}
                  onChange={(e) => updatePoForm("cheque_favour", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Document Preview (100% Identical Original Layout, Read-Only) */}
          <div className="bpms-preview-column">
            <div 
              style={{ pointerEvents: "none" }} 
              tabIndex="-1"
            >
              <div id="po-print-area" className="po-paper" style={{ boxShadow: "var(--shadow-lg)", border: "1px solid var(--border)", margin: "0 auto" }}>
                <div className="po-letter-head">
                  <div className="po-website">www.baashyamgroup.com</div>
                  <div className="po-logo-box">
                    <div className="po-logo">BAASHYAAM</div>
                    <div className="po-tagline">IMPROVING LIFESTYLES - ENHANCING LIVES</div>
                  </div>
                </div>

                <h2 className="po-print-title">PURCHASE ORDER</h2>

                <div className="po-top-row" style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div className="po-date-ref" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div>
                      Date : 
                      <input
                        type="date"
                        className="inline-doc-input"
                        style={{ width: "135px", marginLeft: "4px", fontWeight: "bold" }}
                        value={poForm.po_date}
                        onChange={(e) => updatePoForm("po_date", e.target.value)}
                        tabIndex="-1"
                        readOnly
                      />
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      Ref : 
                      <input
                        type="text"
                        className="inline-doc-input"
                        style={{ width: "140px", marginLeft: "4px", fontWeight: "bold" }}
                        placeholder="e.g. PO-2026-001"
                        value={poForm.po_no}
                        onChange={(e) => updatePoForm("po_no", e.target.value)}
                        tabIndex="-1"
                        readOnly
                      />
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      Our Ref : 
                      <input
                        type="text"
                        className="inline-doc-input"
                        style={{ width: "140px", marginLeft: "4px", fontWeight: "bold" }}
                        placeholder="Our Ref / ION Reference"
                        value={poForm.ref_no}
                        onChange={(e) => updatePoForm("ref_no", e.target.value)}
                        tabIndex="-1"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="po-gstin">
                    GSTIN: 
                    <input
                      type="text"
                      className="inline-doc-input"
                      style={{ width: "140px", marginLeft: "4px", fontWeight: "bold" }}
                      placeholder="GSTIN"
                      value={poForm.gstin}
                      onChange={(e) => updatePoForm("gstin", e.target.value)}
                      tabIndex="-1"
                      readOnly
                    />
                  </div>
                </div>

                <div className="po-vendor-row" style={{ marginTop: "16px" }}>
                  <div className="po-to-box" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <b>TO</b>
                      <select
                        className="inline-doc-input"
                        style={{ width: "250px", color: "var(--brand)", fontWeight: "bold" }}
                        value={poForm.vendor_name}
                        onChange={(e) => handleVendorSelect(e.target.value)}
                        tabIndex="-1"
                      >
                        <option value="">Select Vendor</option>
                        {(vendors || []).map((v) => (
                          <option key={v.vendor_id} value={v.vendor_name}>{v.vendor_name}</option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      className="inline-doc-input"
                      style={{ width: "100%", height: "60px", resize: "none", marginTop: "4px" }}
                      placeholder="Vendor Address"
                      value={poForm.vendor_address}
                      onChange={(e) => updatePoForm("vendor_address", e.target.value)}
                      tabIndex="-1"
                      readOnly
                    />
                  </div>
                </div>

                <div className="po-kind-row" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px" }}>
                  <b>Kind Attn :</b>
                  <input
                    type="text"
                    className="inline-doc-input"
                    style={{ width: "220px", fontWeight: "bold" }}
                    placeholder="contact person"
                    value={poForm.kind_attn}
                    onChange={(e) => updatePoForm("kind_attn", e.target.value)}
                    tabIndex="-1"
                    readOnly
                  />
                </div>

                <p className="po-reference-line" style={{ marginTop: "12px" }}>
                  With reference to your 
                  <select
                    className="inline-doc-input"
                    style={{ width: "120px", fontWeight: "bold", margin: "0 4px" }}
                    value={poForm.estimate_type}
                    onChange={(e) => updatePoForm("estimate_type", e.target.value)}
                    tabIndex="-1"
                  >
                    <option value="Estimate">Estimate</option>
                    <option value="Proforma Invoice">Proforma Invoice</option>
                    <option value="Quotation">Quotation</option>
                  </select>
                  <input
                    type="text"
                    className="inline-doc-input"
                    style={{ width: "120px", margin: "0 4px", fontWeight: "bold" }}
                    placeholder="No"
                    value={poForm.invoice_no}
                    onChange={(e) => updatePoForm("invoice_no", e.target.value)}
                    tabIndex="-1"
                    readOnly
                  />
                  dated
                  <input
                    type="date"
                    className="inline-doc-input"
                    style={{ width: "135px", margin: "0 4px", fontWeight: "bold" }}
                    value={poForm.invoice_date}
                    onChange={(e) => updatePoForm("invoice_date", e.target.value)}
                    tabIndex="-1"
                    readOnly
                  />
                  Cited above, we are pleased to place order:
                </p>

                <table className="po-format-table" style={{ marginTop: "20px" }}>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style={{ width: "150px" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <textarea
                          className="inline-doc-input"
                          style={{ width: "100%", height: "60px", resize: "none", fontWeight: "bold" }}
                          placeholder="Enter description of work/supply..."
                          value={poForm.description}
                          onChange={(e) => updatePoForm("description", e.target.value)}
                          tabIndex="-1"
                          readOnly
                        />
                        <div style={{ marginTop: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <b>Duration:</b> 
                          <input
                            type="date"
                            className="inline-doc-input"
                            style={{ width: "125px" }}
                            value={poForm.duration_from}
                            onChange={(e) => updatePoForm("duration_from", e.target.value)}
                            tabIndex="-1"
                            readOnly
                          />
                          to
                          <input
                            type="date"
                            className="inline-doc-input"
                            style={{ width: "125px" }}
                            value={poForm.duration_to}
                            onChange={(e) => updatePoForm("duration_to", e.target.value)}
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
                            value={poForm.base_amount}
                            onChange={(e) => updatePoForm("base_amount", e.target.value)}
                            tabIndex="-1"
                            readOnly
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><b>Sub Total</b></td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>₹ {formatAmount(poForm.base_amount)}</td>
                    </tr>
                    <tr>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <b>GST @</b>
                          <input
                            type="number"
                            className="inline-doc-input"
                            style={{ width: "50px", textAlign: "center", fontWeight: "bold" }}
                            value={poForm.gst_percent}
                            onChange={(e) => updatePoForm("gst_percent", e.target.value)}
                            tabIndex="-1"
                            readOnly
                          />
                          <b>%</b>
                        </div>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "bold" }}>₹ {formatAmount(poForm.gst_amount)}</td>
                    </tr>
                    <tr>
                      <td><b>Grand Total</b></td>
                      <td style={{ textAlign: "right", fontWeight: "bold", color: "var(--brand)", fontSize: "15px" }}>₹ {formatAmount(poForm.grand_total)}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="po-amount-words" style={{ marginTop: "16px" }}>
                  <b>{poForm.amount_words || "zero rupees only"}</b>
                </div>

                <div className="po-terms" style={{ marginTop: "24px" }}>
                  <h3>Terms and Conditions</h3>
                  <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    1) Payment - 
                    <input
                      type="text"
                      className="inline-doc-input"
                      style={{ width: "80%", fontWeight: "bold" }}
                      placeholder="terms details"
                      value={poForm.payment_terms}
                      onChange={(e) => updatePoForm("payment_terms", e.target.value)}
                      tabIndex="-1"
                      readOnly
                    />
                  </p>
                  <p style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
                    2) Cheque in favour of 
                    <input
                      type="text"
                      className="inline-doc-input"
                      style={{ width: "70%", fontWeight: "bold" }}
                      placeholder="beneficiary name"
                      value={poForm.cheque_favour}
                      onChange={(e) => updatePoForm("cheque_favour", e.target.value)}
                      tabIndex="-1"
                      readOnly
                    />
                  </p>
                </div>

                <div className="po-sign-row" style={{ marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
                  <div><b>ACCEPTED</b></div>
                  <div>
                    FOR 
                    <select
                      className="inline-doc-input"
                      style={{ width: "200px", fontWeight: "bold", margin: "0 4px", appearance: "auto", cursor: "pointer", background: "transparent" }}
                      value={poForm.company_name}
                      onChange={(e) => updatePoForm("company_name", e.target.value)}
                      tabIndex="-1"
                    >
                      <option value="" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>Select Company</option>
                      {companies.map((c) => (
                        <option key={c.company_id} value={c.company_name} style={{ background: "var(--surface)", color: "var(--text-primary)" }}>{c.company_name}</option>
                      ))}
                    </select>
                    PVT LTD
                  </div>
                </div>

                <div className="po-sign-row po-sign-bottom" style={{ marginTop: "48px", display: "flex", justifyContent: "space-between" }}>
                  <div><b>(PARTY'S SIGNATURE & DATE)</b></div>
                  <div><b>{signatures.md.name}</b></div>
                </div>

                <div className="po-footer-line" style={{ marginTop: "40px", paddingTop: "12px", borderTop: "1px solid #eee" }}>
                  <b>Baashyaam Ventures Pvt. Ltd.,</b> No. 87, 4th Floor, G.N. Chetty Road, T.Nagar, Chennai - 600 017.
                  <div>
                    <b>P:</b> +91 44 4290 2345 &nbsp;&nbsp; <b>E:</b> info@bashyamgroup.com &nbsp;&nbsp; <b>CIN:</b> U45201TN2020PTC138085
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Sub-View: Preview / PO Details ---
  if (activePage === "PO Details" && selectedPo) {
    return (
      <div className="bpms-page stagger-item">
        <div className="bpms-page-header">
          <div>
            <h2 className="bpms-page-title">Purchase Order Details</h2>
            <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
              Print preview and PDF export for Purchase Order {selectedPo.po_no}
            </div>
          </div>
          <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
            <button className="bpms-btn bpms-btn--primary" onClick={downloadPoPdf}>
              Download PDF
            </button>
            <button
              className="bpms-btn bpms-btn--ghost"
              onClick={() => {
                fetchPos();
                setActivePage("View PO");
              }}
            >
              <ArrowLeft size={14} /> Back to List
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", background: "var(--bg-color)", padding: "24px", borderRadius: "var(--r-md)", border: "1px solid var(--border)" }}>
          <div id="po-print-area" className="po-paper po-preview-paper" style={{ boxShadow: "none", border: "none" }}>
            <div className="po-letter-head">
              <div className="po-website">www.baashyamgroup.com</div>
              <div className="po-logo-box">
                <div className="po-logo">BAASHYAAM</div>
                <div className="po-tagline">IMPROVING LIFESTYLES - ENHANCING LIVES</div>
              </div>
            </div>

            <h2 className="po-print-title">PURCHASE ORDER</h2>

            <div className="po-top-row">
              <div className="po-date-ref">
                <div>Date : <b>{formatDateDisplay(selectedPo.po_date)}</b></div>
                <div>Ref : <b>{selectedPo.ref_no}</b></div>
              </div>
              <div className="po-gstin">GSTIN:<b>{selectedPo.gstin}</b></div>
            </div>

            <div className="po-vendor-row">
              <div className="po-to-box">
                <b>TO</b>
                <div className="po-address-preview">{selectedPo.vendor_address}</div>
              </div>
            </div>

            <div className="po-kind-row">
              <b>Kind Attn :</b>
              <b>{selectedPo.kind_attn}</b>
            </div>

            <p className="po-reference-line">
              With reference to your <b>{selectedPo.estimate_type}</b> <b>{selectedPo.invoice_no}</b> dated{" "}
              <b>{formatDateDisplay(selectedPo.invoice_date)}</b> Cited above, we are pleased to place order
            </p>

            <table className="po-format-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>{selectedPo.description}</b>
                    <div style={{ marginTop: "5px" }}>
                      <b>Duration:</b> {formatDateDisplay(selectedPo.duration_from)} to {formatDateDisplay(selectedPo.duration_to)}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}><b>{formatAmount(selectedPo.base_amount)}</b></td>
                </tr>
                <tr>
                  <td><b>Sub Total</b></td>
                  <td style={{ textAlign: "right" }}><b>{formatAmount(selectedPo.base_amount)}</b></td>
                </tr>
                <tr>
                  <td><b>GST @ {selectedPo.gst_percent}%</b></td>
                  <td style={{ textAlign: "right" }}><b>{formatAmount(selectedPo.gst_amount)}</b></td>
                </tr>
                <tr>
                  <td><b>Grand Total</b></td>
                  <td style={{ textAlign: "right" }}><b>{formatAmount(selectedPo.grand_total)}</b></td>
                </tr>
              </tbody>
            </table>

            <div className="po-amount-words"><b>{selectedPo.amount_words}</b></div>

            <div className="po-terms">
              <h3>Terms and Conditions</h3>
              <p>1) Payment - <b>{selectedPo.payment_terms}</b></p>
              <p>2) Cheque in favour of <b>"{selectedPo.cheque_favour}"</b></p>
            </div>

            <div className="po-sign-row">
              <div><b>ACCEPTED</b></div>
              <div><b>FOR {selectedPo.company_name} PVT LTD</b></div>
            </div>

            <div className="po-sign-row po-sign-bottom">
              <div><b>(PARTY'S SIGNATURE & DATE)</b></div>
              <div><b>{signatures.md.name}</b></div>
            </div>

            <div className="po-footer-line">
              <b>Baashyaam Ventures Pvt. Ltd.,</b> No. 87, 4th Floor, G.N. Chetty Road, T.Nagar, Chennai - 600 017.
              <div>
                <b>P:</b> +91 44 4290 2345 &nbsp;&nbsp; <b>E:</b> info@bashyamgroup.com &nbsp;&nbsp; <b>CIN:</b> U45201TN2020PTC138085
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
