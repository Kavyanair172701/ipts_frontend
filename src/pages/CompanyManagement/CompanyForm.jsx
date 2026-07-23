import { useApp } from "../../context/AppContext";

export default function CompanyForm() {
  const {
    companyForm,
    setCompanyForm,
    saveCompany,
    setCompanyPage
  } = useApp();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bpms-table-card" style={{ padding: "24px" }}>
      <form onSubmit={saveCompany} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Company Name *</label>
            <input
              type="text"
              name="company_name"
              required
              className="bpms-input"
              value={companyForm.company_name}
              onChange={(e) => {
                setCompanyForm((prev) => ({
                  ...prev,
                  company_name: e.target.value.toUpperCase()
                }));
              }}
              placeholder="e.g. BAASHYAAM VENTURES"
              style={{ textTransform: "uppercase" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</label>
            <select
              name="status"
              className="bpms-input"
              value={companyForm.status}
              onChange={handleChange}
              style={{ appearance: "auto", cursor: "pointer", background: "var(--surface)" }}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px", borderTop: "1px solid var(--border-light)", paddingTop: "20px" }}>
          <button
            type="button"
            className="bpms-btn bpms-btn--ghost"
            onClick={() => setCompanyPage("View")}
          >
            Cancel
          </button>
          <button type="submit" className="bpms-btn bpms-btn--primary">
            Save Company
          </button>
        </div>
      </form>
    </div>
  );
}
