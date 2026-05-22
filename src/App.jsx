
import { useState } from "react";
import "./App.css";

function App() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid Username or Password");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="main-layout">

        <div className="sidebar">

          <h2>IPTS</h2>

          <ul>
            <li>Dashboard</li>
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

            <button onClick={() => setIsLoggedIn(false)}>
              Logout
            </button>

          </div>

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

        </div>

      </div>
    );
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>IPTS</h1>

        <h3>ION Payment Tracking System</h3>

        <form onSubmit={handleLogin}>

          <label>Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default App;