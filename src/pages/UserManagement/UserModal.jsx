import { useApp } from "../../context/AppContext";

export default function UserModal() {
  const {
    showUserForm,
    editUserId,
    closeAddUserModal,
    newUser,
    setNewUser,
    saveUser
  } = useApp();

  if (!showUserForm) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2>{editUserId ? "Edit User Account" : "Add User Account"}</h2>
          <button className="modal-close" onClick={closeAddUserModal}>
            ✕
          </button>
        </div>

        <form onSubmit={saveUser} className="bpms-form">
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  className="bpms-input"
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  autoComplete="new-username"
                  required
                />
              </div>

              <div className="form-group">
                <label>{editUserId ? "Password (optional)" : "Password"}</label>
                <input
                  className="bpms-input"
                  type="password"
                  placeholder={
                    editUserId
                      ? "Leave blank if no change"
                      : "Password"
                  }
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  autoComplete="new-password"
                  required={!editUserId}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  className="bpms-input"
                  type="text"
                  placeholder="First Name"
                  value={newUser.first_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, first_name: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  className="bpms-input"
                  type="text"
                  placeholder="Last Name"
                  value={newUser.last_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  className="bpms-input"
                  type="text"
                  placeholder="Mobile Number"
                  value={newUser.mobile_no}
                  onChange={(e) =>
                    setNewUser({ ...newUser, mobile_no: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email ID</label>
                <input
                  className="bpms-input"
                  type="email"
                  placeholder="Email ID"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role Privilege</label>
                <select
                  className="bpms-input"
                  value={newUser.is_superuser}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      is_superuser: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>Normal User</option>
                  <option value={1}>Super User</option>
                </select>
              </div>

              <div className="form-group">
                <label>Account Status</label>
                <select
                  className="bpms-input"
                  value={newUser.is_active}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      is_active: Number(e.target.value),
                    })
                  }
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="bpms-btn bpms-btn--primary">
              {editUserId ? "Update User" : "Save User"}
            </button>
            <button type="button" className="bpms-btn" onClick={closeAddUserModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
