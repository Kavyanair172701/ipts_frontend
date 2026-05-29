import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const emptyUserForm = {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    mobile_no: "",
    email: "",
    is_superuser: 0,
    is_staff: 0,
    is_active: 1,
  };

  const [newUser, setNewUser] = useState(emptyUserForm);

  const [vendors, setVendors] = useState([]);
  const [vendorPage, setVendorPage] = useState("View");
  const [editVendorId, setEditVendorId] = useState(null);

  const emptyVendorForm = {
    vendor_name: "",
    vendor_code: "",
    vendor_type: "",
    contact_person: "",
    mobile_no: "",
    alternate_no: "",
    email_id: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    pan_number: "",
    gst_no: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    account_type: "",
    status: "ACTIVE",
    remarks: "",
  };

  const [vendorForm, setVendorForm] = useState(emptyVendorForm);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/users/login", {
        username,
        password,
      });

      setIsLoggedIn(true);
    } catch (error) {
      alert("Invalid Username or Password");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/");
      setUsers(response.data);
    } catch (error) {
      alert("Error loading users");
    }
  };

  const openAddUserModal = () => {
    setEditUserId(null);
    setNewUser(emptyUserForm);
    setShowUserForm(true);
  };

  const openEditUserModal = (user) => {
    setEditUserId(user.id);

    setNewUser({
      username: user.username || "",
      password: "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      mobile_no: user.mobile_no || "",
      email: user.email || "",
      is_superuser: user.is_superuser || 0,
      is_staff: user.is_staff || 0,
      is_active: user.is_active ?? 1,
    });

    setShowUserForm(true);
  };

  const closeAddUserModal = () => {
    setShowUserForm(false);
    setEditUserId(null);
    setNewUser(emptyUserForm);
  };

  const saveUser = async (e) => {
    e.preventDefault();

    try {
      if (editUserId) {
        await axios.put(
          `http://127.0.0.1:8000/users/update/${editUserId}`,
          newUser
        );

        alert("User Updated Successfully");
      } else {
        await axios.post("http://127.0.0.1:8000/users/create", newUser);

        alert("User Created Successfully");
      }

      setShowUserForm(false);
      setEditUserId(null);
      setNewUser(emptyUserForm);
      fetchUsers();
    } catch (error) {
      alert("Error saving user");
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/vendors/");
      setVendors(response.data);
    } catch (error) {
      alert("Error loading vendors");
    }
  };

  const openAddVendor = () => {
    setEditVendorId(null);
    setVendorForm(emptyVendorForm);
    setVendorPage("Add");
  };

  const openEditVendor = (vendor) => {
    setEditVendorId(vendor.vendor_id);

    setVendorForm({
      vendor_name: vendor.vendor_name || "",
      vendor_code: vendor.vendor_code || "",
      vendor_type: vendor.vendor_type || "",
      contact_person: vendor.contact_person || "",
      mobile_no: vendor.mobile_no || "",
      alternate_no: vendor.alternate_no || "",
      email_id: vendor.email_id || "",
      address: vendor.address || "",
      city: vendor.city || "",
      state: vendor.state || "",
      pincode: vendor.pincode || "",
      pan_number: vendor.pan_number || "",
      gst_no: vendor.gst_no || "",
      bank_name: vendor.bank_name || "",
      account_number: vendor.account_number || "",
      ifsc_code: vendor.ifsc_code || "",
      account_type: vendor.account_type || "",
      status: vendor.status || "ACTIVE",
      remarks: vendor.remarks || "",
    });

    setVendorPage("Add");
  };

  const saveVendor = async (e) => {
    e.preventDefault();

    try {
      if (editVendorId) {
        await axios.put(
          `http://127.0.0.1:8000/vendors/update/${editVendorId}`,
          null,
          {
            params: vendorForm,
          }
        );

        alert("Vendor Updated Successfully");
      } else {
        await axios.post("http://127.0.0.1:8000/vendors/create", null, {
          params: vendorForm,
        });

        alert("Vendor Created Successfully");
      }

      setEditVendorId(null);
      setVendorForm(emptyVendorForm);
      setVendorPage("View");
      fetchVendors();
    } catch (error) {
      console.log("FULL ERROR:", error);

      const message = error.response?.data?.detail
        ? JSON.stringify(error.response.data.detail)
        : error.response?.data
        ? JSON.stringify(error.response.data)
        : error.message;

      alert(message);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="left-panel">
          <div className="overlay">
            <h1>IPTS</h1>
            <p>ION Payment Tracking System</p>

            <div className="info-card">
              <h2>Track Payments Efficiently</h2>
              <p>
                Manage ION approvals, vendor payments, part payments, finance
                tracking and reports in one system.
              </p>
            </div>
          </div>
        </div>

        <div className="right-panel">
          <div className="login-box">
            <h2>Sign In</h2>
            <p>Please login to continue</p>

            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <div className="sidebar">
        <h2>IPTS</h2>

        <ul>
          <li onClick={() => setActivePage("Dashboard")}>Dashboard</li>

          <li
            onClick={() => {
              setActivePage("User Management");
              fetchUsers();
            }}
          >
            User Management
          </li>

          <li
            onClick={() => {
              setActivePage("Vendor Management");
              setVendorPage("View");
              fetchVendors();
            }}
          >
            Vendor Management
          </li>

          <li>Department Master</li>
          <li>Create ION</li>
          <li>ION List</li>
          <li>Reports</li>
        </ul>
      </div>

      <div className="content-area">
        <div className="header">
          <h2>ION Payment Tracking System</h2>
          <button onClick={() => setIsLoggedIn(false)}>Logout</button>
        </div>

        {activePage === "Dashboard" && (
          <div className="dashboard">
            <div className="card">
              <h3>Total IONs</h3>
              <h1>25</h1>
            </div>

            <div className="card">
              <h3>Pending Payments</h3>
              <h1>10</h1>
            </div>

            <div className="card">
              <h3>Part Payments</h3>
              <h1>5</h1>
            </div>

            <div className="card">
              <h3>Completed</h3>
              <h1>10</h1>
            </div>
          </div>
        )}

        {activePage === "User Management" && (
          <div className="page">
            <div className="page-header">
              <h2>User Management</h2>

              <button className="add-btn" onClick={openAddUserModal}>
                + Add User
              </button>
            </div>

            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Staff</th>
                    <th>Superuser</th>
                    <th>Active</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>
                        {user.first_name} {user.last_name}
                      </td>
                      <td>{user.mobile_no}</td>
                      <td>{user.email}</td>
                      <td>{user.is_staff === 1 ? "Yes" : "No"}</td>
                      <td>{user.is_superuser === 1 ? "Yes" : "No"}</td>
                      <td>{user.is_active === 1 ? "Active" : "Inactive"}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => openEditUserModal(user)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {showUserForm && (
              <div className="modal-overlay">
                <div className="modal-box">
                  <div className="modal-header">
                    <h2>{editUserId ? "Edit User" : "Add User"}</h2>

                    <button className="close-btn" onClick={closeAddUserModal}>
                      ✕
                    </button>
                  </div>

                  <form className="user-form" onSubmit={saveUser}>
                    <input
                      type="text"
                      placeholder="Username"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                      required
                    />

                    <input
                      type="password"
                      placeholder={
                        editUserId
                          ? "Leave blank if no password change"
                          : "Password"
                      }
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      required={!editUserId}
                    />

                    <input
                      type="text"
                      placeholder="First Name"
                      value={newUser.first_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, first_name: e.target.value })
                      }
                    />

                    <input
                      type="text"
                      placeholder="Last Name"
                      value={newUser.last_name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, last_name: e.target.value })
                      }
                    />

                    <input
                      type="text"
                      placeholder="Mobile Number"
                      value={newUser.mobile_no}
                      onChange={(e) =>
                        setNewUser({ ...newUser, mobile_no: e.target.value })
                      }
                    />

                    <input
                      type="email"
                      placeholder="Email ID"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />

                    <select
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

                    <select
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

                    <div className="form-actions">
                      <button type="submit">
                        {editUserId ? "Update User" : "Save User"}
                      </button>

                      <button type="button" onClick={closeAddUserModal}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activePage === "Vendor Management" && (
          <div className="page">
            <div className="page-header">
              <h2>Vendor Management</h2>

              <div>
                <button className="add-btn" onClick={openAddVendor}>
                  + Add Vendor
                </button>


              </div>
            </div>

            {vendorPage === "Add" && (
              <div className="form-card">
                <h2>{editVendorId ? "Edit Vendor" : "Add Vendor"}</h2>

                <form className="user-form" onSubmit={saveVendor}>
                  <input
                    type="text"
                    placeholder="Vendor Name"
                    value={vendorForm.vendor_name}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        vendor_name: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="text"
                    placeholder="Vendor Code"
                    value={vendorForm.vendor_code}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        vendor_code: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Vendor Type"
                    value={vendorForm.vendor_type}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        vendor_type: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Contact Person"
                    value={vendorForm.contact_person}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        contact_person: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Mobile No"
                    value={vendorForm.mobile_no}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        mobile_no: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Alternate No"
                    value={vendorForm.alternate_no}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        alternate_no: e.target.value,
                      })
                    }
                  />

                  <input
                    type="email"
                    placeholder="Email ID"
                    value={vendorForm.email_id}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        email_id: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Address"
                    value={vendorForm.address}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        address: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="City"
                    value={vendorForm.city}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        city: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="State"
                    value={vendorForm.state}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        state: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Pincode"
                    value={vendorForm.pincode}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        pincode: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="PAN Number"
                    value={vendorForm.pan_number}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        pan_number: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="GST No"
                    value={vendorForm.gst_no}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        gst_no: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Bank Name"
                    value={vendorForm.bank_name}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        bank_name: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Account Number"
                    value={vendorForm.account_number}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        account_number: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="IFSC Code"
                    value={vendorForm.ifsc_code}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        ifsc_code: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Account Type"
                    value={vendorForm.account_type}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        account_type: e.target.value,
                      })
                    }
                  />

                  <select
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

                  <input
                    type="text"
                    placeholder="Remarks"
                    value={vendorForm.remarks}
                    onChange={(e) =>
                      setVendorForm({
                        ...vendorForm,
                        remarks: e.target.value,
                      })
                    }
                  />

                  <div className="form-actions">
                    <button type="submit">
                      {editVendorId ? "Update Vendor" : "Save Vendor"}
                    </button>

                    <button
                      type="button"
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
            )}

            {vendorPage === "View" && (
              <div className="table-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vendor Name</th>
                      <th>Code</th>
                      <th>Type</th>
                      <th>Contact</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>City</th>
                      <th>State</th>
                      <th>PAN</th>
                      <th>GST</th>
                      <th>Bank</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {vendors.map((vendor) => (
                      <tr key={vendor.vendor_id}>
                        <td>{vendor.vendor_id}</td>
                        <td>{vendor.vendor_name}</td>
                        <td>{vendor.vendor_code}</td>
                        <td>{vendor.vendor_type}</td>
                        <td>{vendor.contact_person}</td>
                        <td>{vendor.mobile_no}</td>
                        <td>{vendor.email_id}</td>
                        <td>{vendor.city}</td>
                        <td>{vendor.state}</td>
                        <td>{vendor.pan_number}</td>
                        <td>{vendor.gst_no}</td>
                        <td>{vendor.bank_name}</td>
                        <td>{vendor.status}</td>
                        <td>
                          <button
                            className="edit-btn"
                            onClick={() => openEditVendor(vendor)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;