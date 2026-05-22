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

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    is_superuser: 0,
    is_staff: 0,
    is_active: 1,
  });

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

  const saveUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/users/create", newUser);

      alert("User Created Successfully");

      setNewUser({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        is_superuser: 0,
        is_staff: 0,
        is_active: 1,
      });

      setShowUserForm(false);
      fetchUsers();
    } catch (error) {
      alert("Error creating user");
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

          <li>Vendor Master</li>
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

              <button onClick={() => setShowUserForm(true)}>+ Add User</button>
            </div>

            {showUserForm && (
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
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
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
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />

                <select
                  value={newUser.is_staff}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      is_staff: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>Normal User</option>
                  <option value={1}>Staff</option>
                </select>

                <select
                  value={newUser.is_superuser}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      is_superuser: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>User</option>
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
                  <button type="submit">Save User</button>
                  <button type="button" onClick={() => setShowUserForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Staff</th>
                    <th>Superuser</th>
                    <th>Active</th>
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
                      <td>{user.email}</td>
                      <td>{user.is_staff === 1 ? "Yes" : "No"}</td>
                      <td>{user.is_superuser === 1 ? "Yes" : "No"}</td>
                      <td>{user.is_active === 1 ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;