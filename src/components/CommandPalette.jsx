import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Search, FileText, User, ShoppingBag, CreditCard, X } from "lucide-react";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  
  const {
    vendors,
    ionNotes,
    poList,
    rspList,
    setActivePage,
    setSelectedIon,
    setSelectedPo,
    setSelectedRsp,
    openPaymentDetails,
  } = useApp();

  // Listen to Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter items
  const cleanQuery = query.toLowerCase().trim();

  const filteredVendors = cleanQuery
    ? (vendors || []).filter(
        (v) =>
          v.vendor_name?.toLowerCase().includes(cleanQuery) ||
          v.contact_person?.toLowerCase().includes(cleanQuery) ||
          v.gst_no?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredIons = cleanQuery
    ? (ionNotes || []).filter(
        (ion) =>
          ion.ion_ref_no?.toLowerCase().includes(cleanQuery) ||
          ion.subject?.toLowerCase().includes(cleanQuery) ||
          ion.project_name?.toLowerCase().includes(cleanQuery) ||
          ion.vendor_name?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredPos = cleanQuery
    ? (poList || []).filter(
        (po) =>
          po.po_ref_no?.toLowerCase().includes(cleanQuery) ||
          po.vendor_name?.toLowerCase().includes(cleanQuery) ||
          po.project_name?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredRsps = cleanQuery
    ? (rspList || []).filter(
        (rsp) =>
          rsp.rsp_id?.toString().includes(cleanQuery) ||
          rsp.vendor_name?.toLowerCase().includes(cleanQuery) ||
          rsp.project_name?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalResults =
    filteredVendors.length +
    filteredIons.length +
    filteredPos.length +
    filteredRsps.length;

  const handleSelect = (type, item) => {
    setIsOpen(false);
    if (type === "vendor") {
      setActivePage("Vendor Management");
    } else if (type === "ion") {
      setSelectedIon(item);
      setActivePage("Preview ION");
    } else if (type === "po") {
      setSelectedPo(item);
      setActivePage("Preview PO");
    } else if (type === "rsp") {
      setSelectedRsp(item);
      setActivePage("Preview RSP");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "12vh",
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid var(--border)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "65vh",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "16px", borderBottom: "1px solid var(--border)" }}>
          <Search size={20} color="var(--text-muted)" style={{ marginRight: "12px" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search anything globally... (Vendors, IONs, POs, RSPs)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              fontWeight: "500",
              color: "var(--text-primary)",
              background: "transparent",
            }}
          />
          <button
            onClick={() => setIsOpen(false)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-subtle)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <X size={18} color="var(--text-muted)" />
          </button>
        </div>

        {/* Results Container */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {cleanQuery === "" ? (
            <div style={{ textAlign: "center", padding: "32px var(--text-muted)", color: "var(--text-muted)", fontSize: "14px" }}>
              Type to start searching...
              <div style={{ fontSize: "12px", marginTop: "8px" }}>
                Tip: Press <kbd style={{ background: "var(--bg-subtle)", padding: "2px 6px", borderRadius: "4px", border: "1px solid var(--border)", fontStyle: "normal" }}>Esc</kbd> to close.
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div style={{ textAlign: "center", padding: "32px var(--text-muted)", color: "var(--text-muted)", fontSize: "14px" }}>
              No results found for "{query}"
            </div>
          ) : (
            <div>
              {/* Category: ION Notes */}
              {filteredIons.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", padding: "4px 8px", letterSpacing: "0.05em" }}>
                    Inter Office Notes
                  </div>
                  {filteredIons.map((ion) => (
                    <div
                      key={ion.ion_note_id}
                      onClick={() => handleSelect("ion", ion)}
                      className="search-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <FileText size={18} color="var(--brand)" style={{ marginRight: "12px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>ION/{ion.ion_ref_no}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{ion.subject} | {ion.vendor_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Category: Purchase Orders */}
              {filteredPos.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", padding: "4px 8px", letterSpacing: "0.05em" }}>
                    Purchase Orders
                  </div>
                  {filteredPos.map((po) => (
                    <div
                      key={po.po_id}
                      onClick={() => handleSelect("po", po)}
                      className="search-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <ShoppingBag size={18} color="var(--brand-dark)" style={{ marginRight: "12px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>{po.po_ref_no}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{po.vendor_name} | {po.project_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Category: RSP Slips */}
              {filteredRsps.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", padding: "4px 8px", letterSpacing: "0.05em" }}>
                    RSP Payment Slips
                  </div>
                  {filteredRsps.map((rsp) => (
                    <div
                      key={rsp.rsp_id}
                      onClick={() => handleSelect("rsp", rsp)}
                      className="search-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <CreditCard size={18} color="var(--success)" style={{ marginRight: "12px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>RSP Slip #{rsp.rsp_id}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{rsp.vendor_name} | {rsp.company_name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Category: Vendors */}
              {filteredVendors.length > 0 && (
                <div style={{ marginBottom: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", padding: "4px 8px", letterSpacing: "0.05em" }}>
                    Suppliers & Vendors
                  </div>
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.vendor_id}
                      onClick={() => handleSelect("vendor", vendor)}
                      className="search-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <User size={18} color="var(--amber)" style={{ marginRight: "12px" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>{vendor.vendor_name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>GST: {vendor.gst_no || "N/A"} | contact: {vendor.contact_person}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
