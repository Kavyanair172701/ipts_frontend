import { useApp } from "../../context/AppContext";
import { Plus, ArrowLeft } from "lucide-react";
import VendorForm from "./VendorForm";

export default function VendorManagement() {
  const {
    vendorPage,
    setVendorPage,
    vendors,
    openAddVendor,
    openEditVendor
  } = useApp();

  return (
    <div className="bpms-page stagger-item">
      <div className="bpms-page-header">
        <div>
          <h2 className="bpms-page-title">Vendor Database Management</h2>
          {vendorPage !== "View" && (
            <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>
              Configure master supplier details, bank transaction parameters, and tax GSTIN references
            </div>
          )}
        </div>

        {vendorPage === "View" ? (
          <button className="bpms-btn bpms-btn--primary" onClick={openAddVendor}>
            <Plus size={14} style={{ marginRight: "4px" }} /> Add Vendor
          </button>
        ) : (
          <button
            className="bpms-btn bpms-btn--ghost"
            onClick={() => {
              setVendorPage("View");
            }}
          >
            <ArrowLeft size={14} style={{ marginRight: "4px" }} /> Back
          </button>
        )}
      </div>

      {vendorPage === "Add" && <VendorForm />}

      {vendorPage === "View" && (
        <div className="bpms-table-card">
          <div className="bpms-table-scroll">
            <table className="bpms-table">
              <thead>
                <tr>
                  <th className="bpms-th">ID</th>
                  <th className="bpms-th">Vendor Name</th>
                  <th className="bpms-th">Code</th>
                  <th className="bpms-th">Type</th>
                  <th className="bpms-th">Contact</th>
                  <th className="bpms-th">Mobile</th>
                  <th className="bpms-th">Email</th>
                  <th className="bpms-th">City</th>
                  <th className="bpms-th">State</th>
                  <th className="bpms-th">PAN</th>
                  <th className="bpms-th">GST</th>
                  <th className="bpms-th">Bank</th>
                  <th className="bpms-th">Status</th>
                  <th className="bpms-th">Action</th>
                </tr>
              </thead>

              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.vendor_id} className="table-row-hover">
                    <td className="bpms-td">{vendor.vendor_id}</td>
                    <td className="bpms-td" style={{ fontWeight: 600 }}>{vendor.vendor_name}</td>
                    <td className="bpms-td">{vendor.vendor_code}</td>
                    <td className="bpms-td">{vendor.vendor_type}</td>
                    <td className="bpms-td">{vendor.contact_person}</td>
                    <td className="bpms-td">{vendor.mobile_no}</td>
                    <td className="bpms-td">{vendor.email_id}</td>
                    <td className="bpms-td">{vendor.city}</td>
                    <td className="bpms-td">{vendor.state}</td>
                    <td className="bpms-td">{vendor.pan_number}</td>
                    <td className="bpms-td">{vendor.gst_no}</td>
                    <td className="bpms-td">{vendor.bank_name}</td>
                    <td className="bpms-td">
                      <span
                        className="bpms-count-pill"
                        style={{
                          color: vendor.status === "ACTIVE" ? "var(--success)" : "var(--danger)",
                          background: vendor.status === "ACTIVE" ? "var(--success-faint)" : "var(--danger-faint)",
                          border: "none"
                        }}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td className="bpms-td">
                      <button
                        className="bpms-btn bpms-btn--ghost"
                        onClick={() => openEditVendor(vendor)}
                        style={{ padding: "4px 8px", fontSize: "12px" }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
