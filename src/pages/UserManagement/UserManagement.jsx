import { useApp } from "../../context/AppContext";
import { Plus } from "lucide-react";
import UserModal from "./UserModal";

export default function UserManagement() {
  const {
    users,
    openAddUserModal,
    openEditUserModal
  } = useApp();

  return (
    <div className="bpms-page stagger-item">
      <div className="bpms-page-header">
        <h2 className="bpms-page-title">User Accounts Control</h2>
        <button className="bpms-btn bpms-btn--primary" onClick={openAddUserModal}>
          <Plus size={14} /> Add User
        </button>
      </div>

      <div className="bpms-table-card">
        <div className="bpms-table-scroll">
          <table className="bpms-table">
            <thead>
              <tr>
                <th className="bpms-th">ID</th>
                <th className="bpms-th">Username</th>
                <th className="bpms-th">Name</th>
                <th className="bpms-th">Mobile</th>
                <th className="bpms-th">Email</th>
                <th className="bpms-th">Staff</th>
                <th className="bpms-th">Superuser</th>
                <th className="bpms-th">Active</th>
                <th className="bpms-th">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="table-row-hover">
                  <td className="bpms-td">{user.id}</td>
                  <td className="bpms-td" style={{ fontWeight: 600 }}>{user.username}</td>
                  <td className="bpms-td">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="bpms-td">{user.mobile_no}</td>
                  <td className="bpms-td">{user.email}</td>
                  <td className="bpms-td">{user.is_staff === 1 ? "Yes" : "No"}</td>
                  <td className="bpms-td">{user.is_superuser === 1 ? "Yes" : "No"}</td>
                  <td className="bpms-td">
                    <span
                      className="bpms-count-pill"
                      style={{
                        color: user.is_active === 1 ? "var(--success)" : "var(--danger)",
                        background: user.is_active === 1 ? "var(--success-faint)" : "var(--danger-faint)",
                        border: "none"
                      }}
                    >
                      {user.is_active === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="bpms-td">
                    <button
                      className="bpms-btn bpms-btn--ghost"
                      onClick={() => openEditUserModal(user)}
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

      <UserModal />
    </div>
  );
}
