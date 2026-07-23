import { useApp } from "../../context/AppContext";

export default function VendorForm() {
  const {
    editVendorId,
    emptyVendorForm,
    vendorForm,
    setVendorForm,
    saveVendor,
    setVendorPage,
    setEditVendorId
  } = useApp();

  return (
    <div className="bpms-table-card" style={{ padding: "24px" }}>
      <h3 className="bpms-page-title" style={{ marginBottom: "20px" }}>
        {editVendorId ? "Edit Vendor Details" : "Add Vendor Record"}
      </h3>

      <form className="bpms-form" onSubmit={saveVendor}>
        <div className="form-row-3">
          {Object.keys(emptyVendorForm).map((field) => {
            if (field === "status") {
              return (
                <div className="form-group" key={field}>
                  <label>Status</label>
                  <select
                    className="bpms-input"
                    value={vendorForm.status}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              );
            }
            return (
              <div className="form-group" key={field}>
                <label>{field.replaceAll("_", " ")}</label>
                <input
                  className="bpms-input"
                  type={field.includes("email") ? "email" : "text"}
                  placeholder={field.replaceAll("_", " ").toUpperCase()}
                  value={vendorForm[field]}
                  onChange={(e) =>
                    setVendorForm({
                      ...vendorForm,
                      [field]: e.target.value,
                    })
                  }
                  required={field === "vendor_name"}
                />
              </div>
            );
          })}
        </div>

        <div className="form-actions" style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button type="submit" className="bpms-btn bpms-btn--primary">
            {editVendorId ? "Update Vendor" : "Save Vendor"}
          </button>

          <button
            type="button"
            className="bpms-btn"
            onClick={() => {
              setVendorPage("View");
              setEditVendorId(null);
              setVendorForm(emptyVendorForm);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
