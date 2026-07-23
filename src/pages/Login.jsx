import { useApp } from "../context/AppContext";
import { User, Lock, Boxes, ArrowRight } from "lucide-react";

export default function Login() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    handleLogin
  } = useApp();

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="overlay">
          <div className="login-brand-header">
            <div className="login-logo-mark">
              <Boxes size={32} color="white" strokeWidth={2.5} />
            </div>
            <h1>IPTS</h1>
          </div>
          <div className="overlay-subtitle">
            ION Payment Tracking System
          </div>
          
          <div className="info-card">
            <h2>Workspace Overview</h2>
            <div className="login-feature-list">
              <div className="login-feature-item">
                <div className="login-feature-dot" />
                <span>Real-Time Payment Ledgers</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-dot" />
                <span>Inter Office Note (ION) Approvals</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-dot" />
                <span>Purchase Order (PO) Tracking</span>
              </div>
              <div className="login-feature-item">
                <div className="login-feature-dot" />
                <span>Dynamic Finance & Export Reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p>Sign in to access your IPTS workspace</p>

          <form onSubmit={handleLogin}>
            <div className="login-input-wrapper">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User size={18} className="login-input-icon" />
            </div>

            <div className="login-input-wrapper">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} className="login-input-icon" />
            </div>

            <div className="login-form-options">
              <label className="login-remember-me">
                <input type="checkbox" defaultChecked />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button type="submit">
              Sign In <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
