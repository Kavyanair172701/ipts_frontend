import { useState } from "react";
import axios from "axios";
import "./App.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

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
  const [rspAmount, setRspAmount] = useState("");
  const [rspAmountWords, setRspAmountWords] = useState("");

  const [rspForm, setRspForm] = useState({
    title_type: "ADVANCE REQUESTING",
    company_name: "",
    rsp_date: "",
    vendor_name: "",
    cheque_name: "",
    project_name: "",
    work_name: "",
    invoice_type: "Invoice No",
    invoice_no: "",
    invoice_date: "",
  });

  const updateRspForm = (field, value) => {
    setRspForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/users/login", {
        username,
        password,
      });
      setIsLoggedIn(true);
    } catch {
      alert("Invalid Username or Password");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/");
      setUsers(response.data);
    } catch {
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
    } catch {
      alert("Error saving user");
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/vendors/");
      setVendors(response.data);
    } catch {
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
          { params: vendorForm }
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
      alert(error.message);
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

  const numberToWords = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
    "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  if (!num || num === 0) return "";

  const inWords = (n) => {
    if (n < 20) return a[n];

    if (n < 100)
      return (
        b[Math.floor(n / 10)] +
        (n % 10 ? " " + a[n % 10] : "")
      );

    return (
      a[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 ? " " + inWords(n % 100) : "")
    );
  };

  let words = "";

  if (Math.floor(num / 10000000) > 0) {
    words +=
      inWords(Math.floor(num / 10000000)) +
      " Crore ";
    num %= 10000000;
  }

  if (Math.floor(num / 100000) > 0) {
    words +=
      inWords(Math.floor(num / 100000)) +
      " Lakh ";
    num %= 100000;
  }

  if (Math.floor(num / 1000) > 0) {
    words +=
      inWords(Math.floor(num / 1000)) +
      " Thousand ";
    num %= 1000;
  }

  if (num > 0) {
    words += inWords(num);
  }

  return `Rupees ${words.trim()} Only`;
};

const previewRsp = () => {
  setActivePage("Preview RSP");
};

const downloadPdf = async () => {
  const input = document.getElementById("rsp-print-area");

  const canvas = await html2canvas(input, {
    scale: 2,
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();

  const pdfHeight =
    (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdfWidth,
    pdfHeight
  );

  pdf.save("RSP.pdf");
};

const downloadWord = async () => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "REQUESTING SLIP FOR PAYMENT",
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph(`Type: ${rspForm.title_type}`),
          new Paragraph(`Company Name: ${rspForm.company_name}`),
          new Paragraph(`Date: ${rspForm.rsp_date}`),
          new Paragraph(`Vendor Name: ${rspForm.vendor_name}`),
          new Paragraph(`Cheque Name: ${rspForm.cheque_name}`),
          new Paragraph(`Project Name: ${rspForm.project_name}`),
          new Paragraph(`Work Name: ${rspForm.work_name}`),
          new Paragraph(`Invoice Type: ${rspForm.invoice_type}`),
          new Paragraph(`Invoice No: ${rspForm.invoice_no}`),
          new Paragraph(`Invoice Date: ${rspForm.invoice_date}`),
          new Paragraph(`Amount Payable: ${rspAmount}`),
          new Paragraph(`Amount in Words: ${rspAmountWords}`),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  saveAs(blob, "RSP.docx");
};

const saveRsp = async () => {
  try {
    await axios.post("http://127.0.0.1:8000/rsp/create", null, {
      params: {
        ...rspForm,
        amount_payable: rspAmount,
        amount_words: rspAmountWords,
      },
    });

    alert("RSP Saved Successfully");
  } catch (error) {
    alert("Error saving RSP: " + error.message);
  }
};
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

          <li onClick={() => setActivePage("ION")}>ION</li>

          <li onClick={() => setActivePage("Reports")}>Reports</li>
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

        {activePage === "ION" && (
          <div className="page">
            <div className="page-header">
              <h2>ION Management</h2>
            </div>

            <div className="ion-menu-container">
              <div
                className="ion-menu-card"
                onClick={() => setActivePage("RSP")}
              >
                <h3>RSP</h3>
                <p>Request Slip For Payment</p>
              </div>

              <div className="ion-menu-card" onClick={() => setActivePage("PO")}>
                <h3>PO</h3>
                <p>Purchase Order</p>
              </div>

              <div
                className="ion-menu-card"
                onClick={() => setActivePage("ION NOTE")}
              >
                <h3>ION</h3>
                <p>Inter Office Note</p>
              </div>
            </div>
          </div>
        )}

        {activePage === "RSP" && (
          <div className="page">
            <div className="page-header">
              <h2>Request Slip For Payment</h2>

              <div className="header-buttons">
                <button className="add-btn" onClick={() => setActivePage("Add RSP")}>
                  + Add
                </button>

                <button className="view-btn" onClick={() => setActivePage("View RSP")}>
                  View
                </button>

                <button className="back-btn" onClick={() => setActivePage("ION")}>
                  Back
                </button>
              </div>
            </div>
          </div>
        )}

        {activePage === "Add RSP" && (
          <div className="page">
            <div className="page-header">
              <h2>Add Request Slip For Payment</h2>

              <button className="back-btn" onClick={() => setActivePage("RSP")}>
                Back
              </button>
            </div>

            <div className="rsp-paper">
              <div className="rsp-title">
  <select
    className="rsp-title-dropdown"
    value={rspForm.title_type}
    onChange={(e) => updateRspForm("title_type", e.target.value)}
  >
    <option value="ADVANCE REQUESTING">
      ADVANCE REQUESTING
    </option>

    <option value="REQUESTING">
      REQUESTING
    </option>
  </select>

  {" "}SLIP FOR PAYMENT
</div>
<div className="rsp-top">
  <div>
    M/S{" "}
    <input
      className="pink-input"
      type="text"
      placeholder="Company Name"
      value={rspForm.company_name}
      onChange={(e) => updateRspForm("company_name", e.target.value)}
    />{" "}
    PVT LTD
  </div>

  <div className="rsp-date-box">
    <div className="date-row">
      DATED:
      <input
        className="pink-input small"
        type="date"
        value={rspForm.rsp_date}
        onChange={(e) => updateRspForm("rsp_date", e.target.value)}
      />
    </div>

    <div>Prepared By: Arshan M</div>

    <div>DEPARTMENT: Marketing</div>
  </div>
</div>

              <div className="rsp-body">
                <div className="rsp-row">
                  <span>1.</span>
                  <b>NAME</b>
                  <span>:</span>
                  <input
                    className="pink-input"
                    type="text"
                    placeholder="Vendor Name"
                    value={rspForm.vendor_name}
                    onChange={(e) => updateRspForm("vendor_name", e.target.value)}
                  />


                </div>

                <div className="rsp-row">
                  <span>2.</span>
                  <b>Cheque in Favour of</b>
                  <span>:</span>
                  <input
                    className="pink-input"
                    type="text"
                    placeholder="Cheque Name"
                    value={rspForm.cheque_name}
                    onChange={(e) => updateRspForm("cheque_name", e.target.value)}
                  />
                </div>

                <div className="rsp-row">
                  <span>3.</span>
                  <b>NAME OF THE PROJECT</b>
                  <span>:</span>
                  <input
                    className="pink-input"
                    type="text"
                    placeholder="Project Name"
                    value={rspForm.project_name}
                    onChange={(e) => updateRspForm("project_name", e.target.value)}
                  />
                </div>

                <div className="rsp-row">
                  <span>4.</span>
                  <b>NAME OF THE WORK</b>
                  <span>:</span>
                  <input
                    className="pink-input"
                    type="text"
                    placeholder="Work Name"
                    value={rspForm.work_name}
                    onChange={(e) => updateRspForm("work_name", e.target.value)}
                  />
                </div>

    
    
                   <div className="rsp-row invoice-rsp-row">
  <span>5.</span>

  <b>
    <select
      className="invoice-type-dropdown"
      value={rspForm.invoice_type}
      onChange={(e) => updateRspForm("invoice_type", e.target.value)}
    >
      <option value="Invoice No"><center>INVOICE NO</center></option>
      <option value="Proforma Invoice No">PROFORMA INVOICE NO</option>
    </select>
    &nbsp;  &nbsp; & DATE
  </b>

  <span>:</span>

  <div className="invoice-input-group">
    <input
      className="pink-input invoice-no-input"
      type="text"
      placeholder="Enter No"
      value={rspForm.invoice_no}
      onChange={(e) => updateRspForm("invoice_no", e.target.value)}
    />
 &nbsp; &nbsp;
    <input
      className="pink-input invoice-date-input"
      type="date"
      value={rspForm.invoice_date}
      onChange={(e) => updateRspForm("invoice_date", e.target.value)}
    />
  </div>
</div>

                <div className="rsp-row">
                  <span>6.</span>
                  <b>AMOUNT PAYABLE</b>
                  <span>:</span>
<input
  className="pink-input"
  type="number"
  placeholder="Amount"
  value={rspAmount}
  onChange={(e) => {
    const value = e.target.value;

    setRspAmount(value);

    setRspAmountWords(
      numberToWords(Number(value))
    );
  }}
/>                </div>

                <div className="rsp-row">
                  <span>7.</span>
                  <b>AMOUNT IN WORDS</b>
                  <span>:</span>
                  <input
  className="pink-input wide"
  type="text"
  placeholder="Amount in Words"
  value={rspAmountWords}
  readOnly
/>
                </div>

                

                <div className="rsp-row static-row">
                  <span>8.</span>
                  <b>ENTERED IN M.BOOK. NO.</b>
                  <span></span>
                  <b>P.No.</b>
                  <b>MD</b>
                </div>
<div className="rsp-sign-container">
  <div className="rsp-sign-name">
    <b>Manu Jacob Sabu</b>
    <br />
    AGM - Marketing
  </div>

  <div className="rsp-sign-finance">VP(FINANCE)</div>
  <div className="rsp-sign-ay">AY(DIR)</div>
  <div className="rsp-sign-by">BY(DIR)</div>

</div>
             <div className="rsp-form-actions">
  <button
    type="button"
    onClick={saveRsp}
  >
    Save RSP
  </button>

  <button
    type="button"
    onClick={previewRsp}
  >
    Preview RSP
  </button>
</div>
      </div>
      </div>
      </div>
        )}

        

        {activePage === "Preview RSP" && (
          <div className="page">
            <div className="page-header">
              <h2>RSP Preview</h2>

              <div className="header-buttons">
                <button className="add-btn" onClick={downloadPdf}>
                  Download PDF
                </button>

                <button className="view-btn" onClick={downloadWord}>
                  Download Word
                </button>

                <button className="back-btn" onClick={() => setActivePage("Add RSP")}>
                  Back
                </button>
              </div>
            </div>

            <div id="rsp-print-area">
              <div className="rsp-paper">
                <div className="rsp-title">
                  <span>{rspForm.title_type}</span> SLIP FOR PAYMENT
                </div>

                <div className="rsp-top">
                  <div>
                    M/S <b>{rspForm.company_name}</b> PVT LTD
                  </div>

                  <div className="rsp-date-box">
                    <div className="date-row">DATED: <b>{rspForm.rsp_date}</b></div>
                    <div>Prepared By: Arshan M</div>
                    <div>DEPARTMENT: Marketing</div>
                  </div>
                </div>

                <div className="rsp-body">
                  <div className="rsp-row">
                    <span>1.</span>
                    <b>NAME</b>
                    <span>:</span>
                    <b>{rspForm.vendor_name}</b>
                  </div>

                  <div className="rsp-row">
                    <span>2.</span>
                    <b>Cheque in Favour of</b>
                    <span>:</span>
                    <b>{rspForm.cheque_name}</b>
                  </div>

                  <div className="rsp-row">
                    <span>3.</span>
                    <b>NAME OF THE PROJECT</b>
                    <span>:</span>
                    <b>{rspForm.project_name}</b>
                  </div>

                  <div className="rsp-row">
                    <span>4.</span>
                    <b>NAME OF THE WORK</b>
                    <span>:</span>
                    <b>{rspForm.work_name}</b>
                  </div>

                  <div className="rsp-row">
                    <span>5.</span>
                    <b>{rspForm.invoice_type} & DATE</b>
                    <span>:</span>
                    <b>{rspForm.invoice_no} & {rspForm.invoice_date}</b>
                  </div>

                  <div className="rsp-row">
                    <span>6.</span>
                    <b>AMOUNT PAYABLE</b>
                    <span>:</span>
                    <b>{rspAmount}</b>
                  </div>

                  <div className="rsp-row">
                    <span>7.</span>
                    <b>AMOUNT IN WORDS</b>
                    <span>:</span>
                    <b>{rspAmountWords}</b>
                  </div>

                  <div className="rsp-row static-row">
                    <span>8.</span>
                    <b>ENTERED IN M.BOOK. NO.</b>
                    <span></span>
                    <b>P.No.</b>
                    <b>MD</b>
                  </div>

                  <div className="rsp-sign-container">
                    <div className="rsp-sign-name">
                      <b>Manu Jacob Sabu</b>
                      <br />
                      AGM - Marketing
                    </div>

                    <div className="rsp-sign-finance">VP(FINANCE)</div>
                    <div className="rsp-sign-ay">AY(DIR)</div>
                    <div className="rsp-sign-by">BY(DIR)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePage === "View RSP" && (
          <div className="page">
            <div className="page-header">
              <h2>View Request Slip For Payment</h2>

              <button className="back-btn" onClick={() => setActivePage("RSP")}>
                Back
              </button>
            </div>

            <div className="table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>RSP No</th>
                    <th>Vendor</th>
                    <th>Project</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>RSP001</td>
                    <td>DBL Medias Pvt Ltd</td>
                    <td>Enchanted</td>
                    <td>5,90,000</td>
                    <td>PENDING</td>
                    <td>
                      <button className="edit-btn">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activePage === "PO" && (
          <div className="page">
            <div className="page-header">
              <h2>Purchase Order</h2>
              <button className="back-btn" onClick={() => setActivePage("ION")}>
                Back
              </button>
            </div>
          </div>
        )}

        {activePage === "ION NOTE" && (
          <div className="page">
            <div className="page-header">
              <h2>Inter Office Note</h2>
              <button className="back-btn" onClick={() => setActivePage("ION")}>
                Back
              </button>
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

              <button className="add-btn" onClick={openAddVendor}>
                + Add Vendor
              </button>
            </div>

            {vendorPage === "Add" && (
              <div className="form-card">
                <h2>{editVendorId ? "Edit Vendor" : "Add Vendor"}</h2>

                <form className="user-form" onSubmit={saveVendor}>
                  {Object.keys(emptyVendorForm).map((field) =>
                    field === "status" ? (
                      <select
                        key={field}
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
                    ) : (
                      <input
                        key={field}
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
                    )
                  )}

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

        {activePage === "Reports" && (
          <div className="page">
            <div className="page-header">
              <h2>Reports</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;