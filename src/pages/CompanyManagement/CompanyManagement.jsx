import { useApp } from "../../context/AppContext";
import { Plus, ArrowLeft } from "lucide-react";
import CompanyForm from "./CompanyForm";

export default function CompanyManagement() {
  const {
    companyPage,
    setCompanyPage,
    companies,
    openAddCompany,
    openEditCompany,
    deleteCompany
  } = useApp();

  return (
    <div className="bpms-page stagger-item">
      <div className="bpms-page-header">
        <div>
          <h2 className="bpms-page-title">Company Entity Management</h2>
          {companyPage === "View" ? (
            <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>
              Configure master corporate entities, businesses, and billing organizations.
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "4px" }}>
              Enter the corporate registration details for the business entity mapping.
            </div>
          )}
        </div>

        {companyPage === "View" ? (
          <button className="bpms-btn bpms-btn--primary" onClick={openAddCompany}>
            <Plus size={14} style={{ marginRight: "4px" }} /> Add Company
          </button>
        ) : (
          <button
            className="bpms-btn bpms-btn--ghost"
            onClick={() => {
              setCompanyPage("View");
            }}
          >
            <ArrowLeft size={14} style={{ marginRight: "4px" }} /> Back
          </button>
        )}
      </div>

      {companyPage === "Add" && <CompanyForm />}

      {companyPage === "View" && (
        <div className="bpms-table-card">
          <div className="bpms-table-scroll">
            <table className="bpms-table">
              <thead>
                <tr>
                  <th className="bpms-th" style={{ width: "80px" }}>ID</th>
                  <th className="bpms-th">Company Name</th>
                  <th className="bpms-th" style={{ width: "120px" }}>Status</th>
                  <th className="bpms-th" style={{ width: "180px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <tr key={company.company_id} className="table-row-hover">
                      <td className="bpms-td">{company.company_id}</td>
                      <td className="bpms-td" style={{ fontWeight: 600 }}>{company.company_name}</td>
                      <td className="bpms-td">
                        <span
                          className="bpms-count-pill"
                          style={{
                            color: company.status === "ACTIVE" ? "var(--success)" : "var(--danger)",
                            background: company.status === "ACTIVE" ? "var(--success-faint)" : "var(--danger-faint)",
                            border: "none"
                          }}
                        >
                          {company.status}
                        </span>
                      </td>
                      <td className="bpms-td" style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            className="bpms-btn bpms-btn--ghost"
                            onClick={() => openEditCompany(company)}
                            style={{ padding: "4px 8px", fontSize: "12px", height: "30px" }}
                          >
                            Edit
                          </button>
                          <button
                            className="bpms-btn"
                            onClick={() => deleteCompany(company.company_id)}
                            style={{ padding: "4px 8px", fontSize: "12px", height: "30px", background: "var(--danger-faint)", color: "var(--danger)", border: "none" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="bpms-td" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      No companies found. Click "Add Company" to register your first corporate entity.
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
