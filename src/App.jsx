import { useState } from "react";
import axios from "axios";
import "./App.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import {
  LayoutDashboard,
  Users,
  Database,
  Boxes,
  FileSpreadsheet,
  Menu,
  ChevronDown,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeft,
  CreditCard,
  ClipboardList,
  Package,
  Plus,
  ArrowLeft,
  Eye,
  FileText,
  Lock
} from "lucide-react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [rspList, setRspList] = useState([]);
  const [selectedRsp, setSelectedRsp] = useState(null);
  const [ionNotes, setIonNotes] = useState([]);
const [selectedIon, setSelectedIon] = useState(null);

const [ionForm, setIonForm] = useState({
  company_name: "",
  ion_date: "",
  ion_ref_no: "",
  subject: "",
  vendor_name: "",
  work_name: "",
  project_name: "",
  duration_from: "",
  duration_to: "",
  base_amount: "",
  gst_percent: 18,
  gst_amount: "",
  grand_total: "",
});


const emptyPoForm = {
  po_no: "",
  po_date: "",
  ref_no: "",
  company_name: "BAASHYAAM VENTURES",
  gstin: "33AAJCD3976G1Z1",
  vendor_name: "",
  vendor_address: "",
  kind_attn: "",
  estimate_type: "ESTIMATE Proforma Invoice No",
  invoice_no: "",
  invoice_date: "",
  description: "",
  project_name: "",
  duration_from: "",
  duration_to: "",
  base_amount: "",
  gst_percent: 18,
  gst_amount: "",
  grand_total: "",
  amount_words: "",
  payment_terms: "100% on Completion",
  cheque_favour: "",
  status: "Draft",
};

const [poForm, setPoForm] = useState(emptyPoForm);
const [poList, setPoList] = useState([
  {
    po_id: 1,
    po_no: "PO-2026-001",
    po_date: "2026-05-20",
    ref_no: "083/2026",
    company_name: "BAASHYAAM VENTURES",
    gstin: "33AAJCD3976G1Z1",
    vendor_name: "M/s DBL Medias Private Limited",
    vendor_address: "Rashmi Towers, Level 5, No 1 Valluvar Kottam High Road, Nungambakkam, Chennai - 600 034.",
    kind_attn: "DBL Medias Pvt Ltd",
    estimate_type: "ESTIMATE Proforma Invoice No",
    invoice_no: "DBL/PRO/012/26-27",
    invoice_date: "2026-05-20",
    description: "Outdoor Hoarding - Enchanted",
    project_name: "Enchanted",
    duration_from: "2026-05-26",
    duration_to: "2026-06-25",
    base_amount: "500000",
    gst_percent: 18,
    gst_amount: "90000.00",
    grand_total: "590000.00",
    amount_words: "Rupees Five Lakh Ninety Thousand Only",
    payment_terms: "100% on Completion",
    cheque_favour: "DBL Medias Private Limited",
    status: "Draft",
  },
]);
const [selectedPo, setSelectedPo] = useState(null);
const [poSearch, setPoSearch] = useState("");


const emptyPaymentForm = {
  ion_no: "",
  ion_date: "",
  description: "",
  amount: "",
  proforma_no: "",
  proforma_date: "",
  invoice_no: "",
  invoice_date: "",
  vendor_name: "",
  project_name: "",
  work_name: "",
  mode_of_payment: "NEFT",
  cheque_transaction_no: "",
  bank_name: "",
  branch_name: "",
  amount_received: "",
  balance_amount: "",
  received_percentage: "0.00",
  cheque_wire_date: "",
  payment_status: "PAYMENT PENDING",
  remarks: "",
  status_colour: "Red",
};

const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);
const [paymentList, setPaymentList] = useState([]);
const [selectedPayment, setSelectedPayment] = useState(null);
const [paymentSearch, setPaymentSearch] = useState("");

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
    const data = selectedRsp || {
      ...rspForm,
      amount_payable: rspAmount,
      amount_words: rspAmountWords,
    };

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${data.title_type || "REQUESTING"} SLIP FOR PAYMENT`,
                  bold: true,
                  size: 28,
                }),
              ],
            }),
            new Paragraph(`Company Name: ${data.company_name || ""}`),
            new Paragraph(`Date: ${data.rsp_date || ""}`),
            new Paragraph(`Vendor Name: ${data.vendor_name || ""}`),
            new Paragraph(`Cheque Name: ${data.cheque_name || ""}`),
            new Paragraph(`Project Name: ${data.project_name || ""}`),
            new Paragraph(`Work Name: ${data.work_name || ""}`),
            new Paragraph(`Invoice Type: ${data.invoice_type || ""}`),
            new Paragraph(`Invoice No: ${data.invoice_no || ""}`),
            new Paragraph(`Invoice Date: ${data.invoice_date || ""}`),
            new Paragraph(`Amount Payable: ${data.amount_payable || ""}`),
            new Paragraph(`Amount in Words: ${data.amount_words || ""}`),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);

    saveAs(blob, `RSP_${data.rsp_id || "Preview"}.docx`);
  };

  const fetchRsp = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/rsp/");
      setRspList(response.data);
    } catch (error) {
      alert("Error loading RSP: " + error.message);
    }
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

  const formatAmount = (value) => {
    const num = Number(value || 0);
    return num ? num.toLocaleString("en-IN") : "";
  };

  const updateIonForm = (field, value) => {
    setIonForm((prev) => {
      const updated = { ...prev, [field]: value };

      const base = Number(updated.base_amount || 0);
      const gstPercent = Number(updated.gst_percent || 0);
      const gst = (base * gstPercent) / 100;

      updated.gst_amount = gst ? gst.toFixed(2) : "";
      updated.grand_total = base ? (base + gst).toFixed(2) : "";

      return updated;
    });
  };

  const saveIon = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/ion-note/create", null, {
        params: ionForm,
      });

      alert("ION Saved Successfully");
      fetchIonNotes();
    } catch (error) {
      alert("Error saving ION: " + error.message);
    }
  };

  const fetchIonNotes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/ion-note/");
      setIonNotes(response.data);
    } catch (error) {
      alert("Error loading ION Notes: " + error.message);
    }
  };

  const previewIon = () => {
    setSelectedIon({ ...ionForm });
    setActivePage("Preview ION");
  };


  const updatePoForm = (field, value) => {
    setPoForm((prev) => {
      const updated = { ...prev, [field]: value };

      const base = Number(updated.base_amount || 0);
      const gstPercent = Number(updated.gst_percent || 0);
      const gst = (base * gstPercent) / 100;
      const grandTotal = base + gst;

      updated.gst_amount = base ? gst.toFixed(2) : "";
      updated.grand_total = base ? grandTotal.toFixed(2) : "";
      updated.amount_words = base ? numberToWords(Math.round(grandTotal)) : "";

      return updated;
    });
  };

  const resetPoForm = () => {
    setPoForm(emptyPoForm);
    setSelectedPo(null);
  };

  const openAddPo = () => {
    resetPoForm();
    setActivePage("Add PO");
  };

  const savePo = () => {
    if (!poForm.po_no || !poForm.vendor_name) {
      alert("Please enter PO No and Vendor Name");
      return;
    }

    const newPo = {
      ...poForm,
      po_id: Date.now(),
      status: poForm.status || "Draft",
    };

    setPoList((prev) => [newPo, ...prev]);
    setSelectedPo(newPo);
    alert("Purchase Order Saved Successfully");
    setActivePage("Preview PO");
  };

  const previewPo = () => {
    setSelectedPo({ ...poForm, po_id: "Preview" });
    setActivePage("Preview PO");
  };

  const filteredPoList = poList.filter((po) => {
    const search = poSearch.toLowerCase();
    return (
      String(po.po_no || "").toLowerCase().includes(search) ||
      String(po.vendor_name || "").toLowerCase().includes(search) ||
      String(po.ref_no || "").toLowerCase().includes(search) ||
      String(po.invoice_no || "").toLowerCase().includes(search)
    );
  });

  const formatDateDisplay = (value) => {
    if (!value) return "";
    const [year, month, day] = value.split("-");
    if (!year || !month || !day) return value;
    return `${day}.${month}.${year}`;
  };

  const downloadPoPdf = async () => {
    const input = document.getElementById("po-print-area");
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Purchase_Order_${selectedPo?.po_no || "Preview"}.pdf`);
  };


  const buildPaymentDescription = (pay) => {
    const vendor = pay.vendor_name || "";
    const work = pay.work_name || pay.subject || "";
    const project = pay.project_name || "";
    return `"${vendor}" regarding "${work}" for "${project}" Project`;
  };

  const getIonNo = (pay) => {
    return pay.ion_no || pay.ion_ref_no || pay.ion_note_id || "";
  };

  const getIonAmount = (pay) => {
    return pay.amount || pay.grand_total || pay.total_amount || pay.base_amount || "";
  };

const toPaymentNumber = (value) => {
  if (value === null || value === undefined || value === "") return 0;
  return Number(String(value).replace(/,/g, "")) || 0;
};

const getPaymentStatus = (totalAmount, paidAmount) => {
  const total = toPaymentNumber(totalAmount);
  const paid = toPaymentNumber(paidAmount);

  if (!total || paid <= 0) {
    return { status: "PAYMENT PENDING", status_colour: "Red" };
  }

  if (paid >= total) {
    return { status: "PAYMENT COMPLETED", status_colour: "Green" };
  }

  return { status: "PART PAYMENT", status_colour: "Yellow" };
};

const getPaymentStatusStyleFromText = (statusText) => {
  const status = String(statusText || "").toLowerCase();
  if (status.includes("completed") || status.includes("paid") && !status.includes("part")) return "Green";
  if (status.includes("part") || status.includes("partial")) return "Yellow";
  return "Red";
};

const cleanAmountInput = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const strValue = String(value);
  if (!strValue.includes(".")) return strValue;
  return strValue.replace(/\.00$/, "").replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
};

const applyPaymentCalculation = (data) => {
  const amount = toPaymentNumber(data.amount || data.total_amount || data.grand_total || data.base_amount);
  const received = toPaymentNumber(data.amount_received || data.paid_amount || data.current_payment);
  const balance = Math.max(amount - received, 0);
  const receivedPercentage = amount ? ((received / amount) * 100).toFixed(2) : "0.00";
  const statusInfo = getPaymentStatus(amount, received);

  return {
    ...data,
    amount: amount ? amount.toFixed(2) : data.amount || "",
    // Keep Amount Received as user typed it. Do not force 1 to become 1.00 while entering.
    amount_received: data.amount_received === "" ? "" : cleanAmountInput(data.amount_received),
    balance_amount: amount ? balance.toFixed(2) : "",
    received_percentage: receivedPercentage,
    payment_status: statusInfo.status,
    status_colour: statusInfo.status_colour,
  };
};

const updatePaymentForm = (field, value) => {
  setPaymentForm((prev) => {
    const updated = { ...prev, [field]: value };
    return applyPaymentCalculation(updated);
  });
};

  const resetPaymentForm = () => {
    setPaymentForm(emptyPaymentForm);
    setSelectedPayment(null);
  };

  const openAddPayment = () => {
    resetPaymentForm();
    setActivePage("Add Payment");
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/ion-note/");
      setPaymentList(response.data || []);
    } catch (error) {
      alert("Error loading payment records: " + error.message);
    }
  };

  const openPaymentDetails = async (ion) => {
    const ionNo = getIonNo(ion);

    const baseForm = {
      ...emptyPaymentForm,
      ion_no: ionNo,
      ion_date: ion.ion_date || "",
      description: buildPaymentDescription(ion),
      amount: getIonAmount(ion),
      proforma_no: ion.proforma_no || ion.estimate_no || "",
      proforma_date: ion.proforma_date || ion.estimate_date || "",
      invoice_no: ion.invoice_no || "",
      invoice_date: ion.invoice_date || "",
      vendor_name: ion.vendor_name || "",
      project_name: ion.project_name || "",
      work_name: ion.work_name || ion.subject || "",
      payment_status: ion.payment_status || ion.status || "PAYMENT PENDING",
      status_colour: getPaymentStatusStyleFromText(ion.payment_status || ion.status),
    };

    try {
      const response = await axios.get(`http://127.0.0.1:8000/payment-details/${encodeURIComponent(ionNo)}`);
      const details = response.data || {};
      const merged = applyPaymentCalculation({
        ...baseForm,
        ...details,
        amount: details.amount || baseForm.amount,
        description: details.description || baseForm.description,
      });
      setPaymentForm(merged);
      setSelectedPayment(merged);
    } catch {
      const calculatedBaseForm = applyPaymentCalculation(baseForm);
      setPaymentForm(calculatedBaseForm);
      setSelectedPayment(calculatedBaseForm);
    }

    setActivePage("Payment Details");
  };

  const savePayment = async () => {
    if (!paymentForm.ion_no) {
      alert("ION No missing");
      return;
    }

    try {
      await axios.put(
  `http://127.0.0.1:8000/payment-details/${encodeURIComponent(paymentForm.ion_no)}`,
  null,
  {
    params: {
      mode_of_payment: paymentForm.mode_of_payment || "",
      cheque_transaction_no: paymentForm.cheque_transaction_no || "",
      bank_name: paymentForm.bank_name || "",
      branch_name: paymentForm.branch_name || "",
      amount_received: paymentForm.amount_received || 0,
      cheque_wire_date: paymentForm.cheque_wire_date || null,
      payment_status: paymentForm.payment_status || "PAYMENT PENDING",
      remarks: paymentForm.remarks || "",
    },
  }
);
      alert("Payment details updated successfully");
      // Reload the payment details for the current ION
await loadPaymentDetails(selectedPayment.ion_no);

// Reload the payment list
await loadPayments();
      fetchPayments();
      setActivePage("View Payment");
    } catch (error) {
      alert("Error updating payment details: " + (error.response?.data?.detail || error.message));
    }
  };

  const previewPayment = () => {
    setSelectedPayment({ ...paymentForm });
    setActivePage("Preview Payment");
  };

  const filteredPaymentList = paymentList.filter((pay) => {
    const search = paymentSearch.toLowerCase();
    const description = buildPaymentDescription(pay).toLowerCase();
    return (
      String(getIonNo(pay)).toLowerCase().includes(search) ||
      String(pay.ion_date || "").toLowerCase().includes(search) ||
      description.includes(search) ||
      String(pay.vendor_name || "").toLowerCase().includes(search) ||
      String(pay.project_name || "").toLowerCase().includes(search) ||
      String(pay.invoice_no || "").toLowerCase().includes(search)
    );
  });

  const getStatusStyle = (colour) => {
    const c = String(colour || "").toLowerCase();
    if (c === "green") return { background: "#dcfce7", color: "#166534" };
    if (c === "yellow") return { background: "#fef9c3", color: "#854d0e" };
    if (c === "red") return { background: "#fee2e2", color: "#991b1b" };
    return { background: "#f8fafc", color: "#334155" };
  };

  // Login View Render
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

  // Sidebar item active logic
  const getSidebarActive = () => {
    if (["Dashboard", "User Management", "Vendor Management", "Reports"].includes(activePage)) {
      return activePage;
    }
    if (["ION", "RSP", "Add RSP", "View RSP", "Preview RSP", "RSP Details", "PO", "Add PO", "View PO", "Preview PO", "PO Details", "ION NOTE", "Add ION", "View ION", "Preview ION", "ION Details", "Payment", "Add Payment", "View Payment", "Preview Payment", "Payment Details"].includes(activePage)) {
      return "ION";
    }
    return "";
  };

  // Breadcrumbs logic
  const getBreadcrumbs = () => {
    switch (activePage) {
      case "Dashboard":
        return ["Dashboard"];
      case "User Management":
        return ["User Management"];
      case "Vendor Management":
        return ["Vendor Management"];
      case "Reports":
        return ["Reports"];
      case "ION":
        return ["ION Management"];
      case "RSP":
        return ["ION Management", "RSP"];
      case "Add RSP":
        return ["ION Management", "RSP", "Add RSP"];
      case "View RSP":
        return ["ION Management", "RSP", "View RSP"];
      case "Preview RSP":
        return ["ION Management", "RSP", "Preview RSP"];
      case "RSP Details":
        return ["ION Management", "RSP", "RSP Details"];
      case "PO":
        return ["ION Management", "Purchase Order"];
      case "Add PO":
        return ["ION Management", "Purchase Order", "Add PO"];
      case "View PO":
        return ["ION Management", "Purchase Order", "View PO"];
      case "Preview PO":
        return ["ION Management", "Purchase Order", "Preview PO"];
      case "PO Details":
        return ["ION Management", "Purchase Order", "PO Details"];
      case "ION NOTE":
        return ["ION Management", "Inter Office Note"];
        case "Add ION":
  return ["ION Management", "ION NOTE", "Add ION"];
    
  
case "View ION":
  return ["ION Management", "ION NOTE", "View ION"];
case "Preview ION":
  return ["ION Management", "ION NOTE", "Preview ION"];
case "ION Details":
  return ["ION Management", "ION NOTE", "ION Details"];
case "Payment":
  return ["ION Management", "Payment"];
case "Add Payment":
  return ["ION Management", "Payment", "Add Payment"];
case "View Payment":
  return ["ION Management", "Payment", "View Payment"];
case "Preview Payment":
  return ["ION Management", "Payment", "Preview Payment"];
case "Payment Details":
  return ["ION Management", "Payment", "Payment Details"];
      default:
        return [activePage];
    }
  };

  const breadcrumbs = getBreadcrumbs();
  const sidebarActive = getSidebarActive();

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
        <div className="sidebar__logo">
          <div className="sidebar__logo-top">
            <div className="sidebar__logo-mark">I</div>
            {!collapsed && <span className="sidebar__logo-title">IPTS</span>}
          </div>
          {!collapsed && (
            <span className="sidebar__logo-sub">ION Payment Tracking System</span>
          )}
        </div>

        <nav className="sidebar__nav">
          {!collapsed && <div className="sidebar__section-label">Main Menu</div>}

          <button
            onClick={() => setActivePage("Dashboard")}
            className={`sidebar__item ${sidebarActive === "Dashboard" ? "sidebar__item--active" : ""}`}
            title={collapsed ? "Dashboard" : undefined}
          >
            <LayoutDashboard size={17} className="sidebar__icon" />
            {!collapsed && <span className="sidebar__label">Dashboard</span>}
          </button>

          <button
            onClick={() => {
              setActivePage("User Management");
              fetchUsers();
            }}
            className={`sidebar__item ${sidebarActive === "User Management" ? "sidebar__item--active" : ""}`}
            title={collapsed ? "User Management" : undefined}
          >
            <Users size={17} className="sidebar__icon" />
            {!collapsed && <span className="sidebar__label">User Management</span>}
          </button>

          <button
            onClick={() => {
              setActivePage("Vendor Management");
              setVendorPage("View");
              fetchVendors();
            }}
            className={`sidebar__item ${sidebarActive === "Vendor Management" ? "sidebar__item--active" : ""}`}
            title={collapsed ? "Vendor Management" : undefined}
          >
            <Database size={17} className="sidebar__icon" />
            {!collapsed && <span className="sidebar__label">Vendor Management</span>}
          </button>

          <button
            onClick={() => setActivePage("ION")}
            className={`sidebar__item ${sidebarActive === "ION" ? "sidebar__item--active" : ""}`}
            title={collapsed ? "ION Management" : undefined}
          >
            <Boxes size={17} className="sidebar__icon" />
            {!collapsed && <span className="sidebar__label">ION Management</span>}
          </button>

          <button
            onClick={() => setActivePage("Reports")}
            className={`sidebar__item ${sidebarActive === "Reports" ? "sidebar__item--active" : ""}`}
            title={collapsed ? "Reports" : undefined}
          >
            <FileSpreadsheet size={17} className="sidebar__icon" />
            {!collapsed && <span className="sidebar__label">Reports</span>}
          </button>
        </nav>

        <div className="sidebar__footer">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="sidebar__item"
            title={collapsed ? "Sign Out" : undefined}
            style={{ color: "var(--danger)" }}
          >
            <LogOut size={17} className="sidebar__icon" />
            {!collapsed && <span className="sidebar__label">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Body ── */}
      <div className="app-layout__body">
        {/* ── Navbar ── */}
        <header className="navbar">
          <button
            className="navbar__toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <div className="navbar__breadcrumb">
            <span>IPTS</span>
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <span className="navbar__breadcrumb-sep">/</span>
                <span className={idx === breadcrumbs.length - 1 ? "navbar__breadcrumb-current" : ""}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>

          <div className="navbar__right">
            <div className="navbar__divider" />

            <div className="navbar__profile-container">
              <div
                className="navbar__profile-trigger"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="navbar__avatar">
                  {username ? username[0].toUpperCase() : "U"}
                </div>
                <div className="navbar__user-info">
                  <span className="navbar__user-name">{username || "Administrator"}</span>
                  <span className="navbar__user-role">Super User</span>
                </div>
                <ChevronDown
                  size={13}
                  className={`navbar__chevron ${profileOpen ? "navbar__chevron--open" : ""}`}
                />
              </div>

              {profileOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{username || "Administrator"}</p>
                    <p className="navbar__dropdown-email">{username ? `${username}@gmail.com` : ""}</p>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  <button
                    className="navbar__dropdown-item navbar__dropdown-item--danger"
                    onClick={() => {
                      setProfileOpen(false);
                      setIsLoggedIn(false);
                    }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Content Main Area ── */}
        <main className="app-layout__main">
          {activePage === "Dashboard" && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">Performance Dashboard</h2>
              </div>

              <div className="db-layout">
                <div className="db-kpi-grid db-kpi-grid--4">
                  <div className="db-kpi-card">
                    <div className="db-kpi-card__header">
                      <div className="db-kpi-card__icon db-icon--blue">
                        <Boxes size={17} />
                      </div>
                    </div>
                    <div className="db-kpi-card__value">25</div>
                    <div className="db-kpi-card__label">Total IONs</div>
                    <div className="db-kpi-card__sub">Tracked and managed</div>
                  </div>

                  <div className="db-kpi-card">
                    <div className="db-kpi-card__header">
                      <div className="db-kpi-card__icon db-icon--amber">
                        <CreditCard size={17} />
                      </div>
                    </div>
                    <div className="db-kpi-card__value">10</div>
                    <div className="db-kpi-card__label">Pending Payments</div>
                    <div className="db-kpi-card__sub">Awaiting verification</div>
                  </div>

                  <div className="db-kpi-card">
                    <div className="db-kpi-card__header">
                      <div className="db-kpi-card__icon db-icon--violet">
                        <ClipboardList size={17} />
                      </div>
                    </div>
                    <div className="db-kpi-card__value">5</div>
                    <div className="db-kpi-card__label">Part Payments</div>
                    <div className="db-kpi-card__sub">In-progress installments</div>
                  </div>

                  <div className="db-kpi-card">
                    <div className="db-kpi-card__header">
                      <div className="db-kpi-card__icon db-icon--emerald">
                        <Package size={17} />
                      </div>
                    </div>
                    <div className="db-kpi-card__value">10</div>
                    <div className="db-kpi-card__label">Completed</div>
                    <div className="db-kpi-card__sub">Fully processed and paid</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === "ION" && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">ION Document Categories</h2>
              </div>

              <div className="ion-menu-container">
                <div
                  className="ion-menu-card"
                  onClick={() => setActivePage("RSP")}
                >
                  <FileText size={22} color="var(--brand)" />
                  <h3>RSP</h3>
                  <p>Request Slip For Payment</p>
                </div>

                <div className="ion-menu-card" onClick={() => setActivePage("PO")}>
                  <CreditCard size={22} color="var(--brand)" />
                  <h3>PO</h3>
                  <p>Purchase Order</p>
                </div>

                <div
                  className="ion-menu-card"
                  onClick={() => setActivePage("ION NOTE")}
                >
                  <ClipboardList size={22} color="var(--brand)" />
                  <h3>ION</h3>
                  <p>Inter Office Note</p>
                </div>

                <div className="ion-menu-card" onClick={() => setActivePage("Payment")}>
                  <CreditCard size={22} color="var(--brand)" />
                  <h3>Payment</h3>
                  <p>Payment Entry and Tracking</p>
                </div>
              </div>
            </div>
          )}

          {activePage === "RSP" && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">Request Slip For Payment</h2>
                <div className="header-buttons">
                  <button className="bpms-btn bpms-btn--primary" onClick={() => setActivePage("Add RSP")}>
                    <Plus size={14} /> Add
                  </button>
                  <button
                    className="bpms-btn bpms-btn--success"
                    onClick={() => {
                      fetchRsp();
                      setActivePage("View RSP");
                    }}
                  >
                    <Eye size={14} /> View
                  </button>
                  <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("ION")}>
                    <ArrowLeft size={14} /> Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePage === "Add RSP" && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">Add Request Slip For Payment</h2>
                <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("RSP")}>
                  <ArrowLeft size={14} /> Back
                </button>
              </div>

              <div className="rsp-paper">
                <div className="rsp-title">
                  <select
                    className="rsp-title-dropdown"
                    value={rspForm.title_type}
                    onChange={(e) => updateRspForm("title_type", e.target.value)}
                  >
                    <option value="ADVANCE REQUESTING">ADVANCE REQUESTING</option>
                    <option value="REQUESTING">REQUESTING</option>
                  </select>{" "}
                  SLIP FOR PAYMENT
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
                        <option value="Invoice No">INVOICE NO</option>
                        <option value="Proforma Invoice No">PROFORMA INVOICE NO</option>
                      </select>
                      &nbsp;&nbsp;& DATE
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
                      &nbsp;&nbsp;
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
                        setRspAmountWords(numberToWords(Number(value)));
                      }}
                    />
                  </div>

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
                    <button type="button" onClick={saveRsp}>
                      Save RSP
                    </button>
                    <button type="button" onClick={previewRsp}>
                      Preview RSP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === "Preview RSP" && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">RSP Preview</h2>
                <div className="header-buttons">
                  <button className="bpms-btn bpms-btn--primary" onClick={downloadPdf}>
                    Download PDF
                  </button>
                  <button className="bpms-btn bpms-btn--success" onClick={downloadWord}>
                    Download Word
                  </button>
                  <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("Add RSP")}>
                    <ArrowLeft size={14} /> Back
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
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">View Request Slip For Payment</h2>
                <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("RSP")}>
                  <ArrowLeft size={14} /> Back
                </button>
              </div>

              <div className="bpms-table-card">
                <div className="bpms-table-scroll">
                  <table className="bpms-table">
                    <thead>
                      <tr>
                        <th className="bpms-th">RSP No</th>
                        <th className="bpms-th">Date</th>
                        <th className="bpms-th">Vendor</th>
                        <th className="bpms-th">Project</th>
                        <th className="bpms-th">Work</th>
                        <th className="bpms-th">Invoice Type</th>
                        <th className="bpms-th">Invoice No</th>
                        <th className="bpms-th">Invoice Date</th>
                        <th className="bpms-th">Amount</th>
                        <th className="bpms-th">Amount Words</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rspList.length > 0 ? (
                        rspList.map((rsp) => (
                          <tr key={rsp.rsp_id} className="table-row-hover">
                            <td className="bpms-td">
                              <button
                                className="link-btn"
                                type="button"
                                onClick={() => {
                                  setSelectedRsp(rsp);
                                  setActivePage("RSP Details");
                                }}
                              >
                                {rsp.rsp_id}
                              </button>
                            </td>
                            <td className="bpms-td">{rsp.rsp_date}</td>
                            <td className="bpms-td">{rsp.vendor_name}</td>
                            <td className="bpms-td">{rsp.project_name}</td>
                            <td className="bpms-td">{rsp.work_name}</td>
                            <td className="bpms-td">{rsp.invoice_type}</td>
                            <td className="bpms-td">{rsp.invoice_no}</td>
                            <td className="bpms-td">{rsp.invoice_date}</td>
                            <td className="bpms-td">{rsp.amount_payable}</td>
                            <td className="bpms-td">{rsp.amount_words}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10" className="bpms-td" style={{ textAlign: "center" }}>
                            No RSP records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activePage === "RSP Details" && selectedRsp && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">RSP Document - {selectedRsp.rsp_id}</h2>
                <div className="header-buttons">
                  <button className="bpms-btn bpms-btn--primary" onClick={downloadPdf}>
                    Download PDF
                  </button>
                  <button className="bpms-btn bpms-btn--success" onClick={downloadWord}>
                    Download Word
                  </button>
                  <button
                    className="bpms-btn bpms-btn--ghost"
                    onClick={() => {
                      fetchRsp();
                      setActivePage("View RSP");
                    }}
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                </div>
              </div>

              <div id="rsp-print-area">
                <div className="rsp-paper">
                  <div className="rsp-title">
                    <span>{selectedRsp.title_type}</span> SLIP FOR PAYMENT
                  </div>

                  <div className="rsp-top">
                    <div>
                      M/S <b>{selectedRsp.company_name}</b> PVT LTD
                    </div>

                    <div className="rsp-date-box">
                      <div className="date-row">DATED: <b>{selectedRsp.rsp_date}</b></div>
                      <div>Prepared By: Arshan M</div>
                      <div>DEPARTMENT: Marketing</div>
                    </div>
                  </div>


                  <div className="rsp-body">
                    <div className="rsp-row">
                      <span>1.</span>
                      <b>NAME</b>
                      <span>:</span>
                      <b>{selectedRsp.vendor_name}</b>
                    </div>

                    <div className="rsp-row">
                      <span>2.</span>
                      <b>Cheque in Favour of</b>
                      <span>:</span>
                      <b>{selectedRsp.cheque_name}</b>
                    </div>

                    <div className="rsp-row">
                      <span>3.</span>
                      <b>NAME OF THE PROJECT</b>
                      <span>:</span>
                      <b>{selectedRsp.project_name}</b>
                    </div>

                    <div className="rsp-row">
                      <span>4.</span>
                      <b>NAME OF THE WORK</b>
                      <span>:</span>
                      <b>{selectedRsp.work_name}</b>
                    </div>

                    <div className="rsp-row">
                      <span>5.</span>
                      <b>{selectedRsp.invoice_type} & DATE</b>
                      <span>:</span>
                      <b>
                        {selectedRsp.invoice_no} & {selectedRsp.invoice_date}
                      </b>
                    </div>

                    <div className="rsp-row">
                      <span>6.</span>
                      <b>AMOUNT PAYABLE</b>
                      <span>:</span>
                      <b>{selectedRsp.amount_payable}</b>
                    </div>

                    <div className="rsp-row">
                      <span>7.</span>
                      <b>AMOUNT IN WORDS</b>
                      <span>:</span>
                      <b>{selectedRsp.amount_words}</b>
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

          {activePage === "PO" && (
            <div className="po-page stagger-item">
              <div className="po-dashboard-header">
                <div>
                  <h2 className="po-dashboard-title">Purchase Order</h2>
                  <div className="po-dashboard-breadcrumb">Home <span>›</span> Purchase Order</div>
                </div>

                <div className="po-dashboard-actions">
                  <button className="po-primary-btn" onClick={openAddPo}>
                    <Plus size={18} /> Add Purchase Order
                  </button>
                  <button
                    className="po-outline-btn"
                    onClick={() => setActivePage("View PO")}
                  >
                    <Eye size={18} /> View Purchase Orders
                  </button>
                  <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("ION")}>
                    <ArrowLeft size={14} /> Back
                  </button>
                </div>
              </div>

              <div className="po-list-card">
                <div className="po-toolbar">
                  <input
                    className="po-search-input"
                    type="text"
                    placeholder="Search by PO number, supplier or reference..."
                    value={poSearch}
                    onChange={(e) => setPoSearch(e.target.value)}
                  />
                  <button className="po-filter-btn">Filter</button>
                </div>

                <div className="po-table-wrap">
                  <table className="po-modern-table">
                    <thead>
                      <tr>
                        <th>PO Number</th>
                        <th>Supplier</th>
                        <th>PO Date</th>
                        <th>Expected Date</th>
                        <th>Status</th>
                        <th>Total Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPoList.length > 0 ? (
                        filteredPoList.map((po) => (
                          <tr key={po.po_id}>
                            <td>{po.po_no}</td>
                            <td>{po.vendor_name}</td>
                            <td>{formatDateDisplay(po.po_date)}</td>
                            <td>{formatDateDisplay(po.duration_to)}</td>
                            <td><span className={`po-status ${String(po.status || "draft").toLowerCase()}`}>{po.status || "Draft"}</span></td>
                            <td>₹ {formatAmount(po.grand_total)}</td>
                            <td>
                              <button
                                className="po-row-view"
                                onClick={() => {
                                  setSelectedPo(po);
                                  setActivePage("PO Details");
                                }}
                              >
                                <Eye size={14} /> View
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" style={{ textAlign: "center", padding: "26px" }}>
                            No Purchase Order records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activePage === "Add PO" && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">Add Purchase Order</h2>
                <div className="header-buttons">
                  <button className="bpms-btn bpms-btn--primary" onClick={savePo}>Save PO</button>
                  <button className="bpms-btn bpms-btn--success" onClick={previewPo}>Preview PO</button>
                  <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("PO")}>
                    <ArrowLeft size={14} /> Back
                  </button>
                </div>
              </div>

              <div className="po-paper">
                <div className="po-letter-head">
                </div>

                <h2 className="po-print-title">PURCHASE ORDER</h2>

                <div className="po-top-row">
                  <div className="po-date-ref">
                    <div>Date : <input className="po-edit po-date" type="date" value={poForm.po_date} onChange={(e) => updatePoForm("po_date", e.target.value)} /></div>
                    <div>Ref : <input className="po-edit po-ref" type="text" value={poForm.ref_no} onChange={(e) => updatePoForm("ref_no", e.target.value)} placeholder="083/2026" /></div>
                  </div>
                  <div className="po-gstin">GSTIN:<input className="po-edit po-gstin-input" type="text" value={poForm.gstin} onChange={(e) => updatePoForm("gstin", e.target.value)} /></div>
                </div>

                <div className="po-vendor-row">
                  <div className="po-to-box">
                    <b>TO</b>
                    <textarea className="po-edit po-vendor-address" value={poForm.vendor_address} onChange={(e) => updatePoForm("vendor_address", e.target.value)} placeholder={'M/s DBL Medias Private Limited,\nRashmi Towers, Level 5,\nNo 1 Valluvar Kottam High Road,\nNungambakkam, Chennai - 600 034.'} />
                  </div>
                </div>

                <div className="po-kind-row">
                  <b>Kind Attn :</b>
                  <input className="po-edit po-kind-input" type="text" value={poForm.kind_attn} onChange={(e) => updatePoForm("kind_attn", e.target.value)} placeholder="DBL Medias Pvt Ltd" />
                </div>

                <p className="po-reference-line">
                  With reference to your ESTIMATE <input className="po-edit po-estimate-input" value={poForm.estimate_type} onChange={(e) => updatePoForm("estimate_type", e.target.value)} />
                  <input className="po-edit po-invoice-input" value={poForm.invoice_no} onChange={(e) => updatePoForm("invoice_no", e.target.value)} placeholder="DBL/PRO/012/26-27" />
                  dated <input className="po-edit po-date" type="date" value={poForm.invoice_date} onChange={(e) => updatePoForm("invoice_date", e.target.value)} /> Cited above,we are pleased to place order
                </p>

                <table className="po-format-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input className="po-edit po-desc-input" value={poForm.description} onChange={(e) => updatePoForm("description", e.target.value)} placeholder="Outdoor Hoarding - Enchanted" />
                        <div>
                          <b>Duration:</b>
                          <input className="po-edit po-date" type="date" value={poForm.duration_from} onChange={(e) => updatePoForm("duration_from", e.target.value)} />
                          to
                          <input className="po-edit po-date" type="date" value={poForm.duration_to} onChange={(e) => updatePoForm("duration_to", e.target.value)} />
                        </div>
                      </td>
                      <td><input className="po-edit po-amount-input" type="number" value={poForm.base_amount} onChange={(e) => updatePoForm("base_amount", e.target.value)} placeholder="500000" /></td>
                    </tr>
                    <tr><td><b>Sub Total</b></td><td><b>{formatAmount(poForm.base_amount)}</b></td></tr>
                    <tr>
                      <td><b>GST @ <input className="po-edit po-gst-percent" type="number" value={poForm.gst_percent} onChange={(e) => updatePoForm("gst_percent", e.target.value)} />%</b></td>
                      <td><b>{formatAmount(poForm.gst_amount)}</b></td>
                    </tr>
                    <tr><td><b>Grand Total</b></td><td><b>{formatAmount(poForm.grand_total)}</b></td></tr>
                  </tbody>
                </table>

                <div className="po-amount-words">
                  <input className="po-edit po-words-input" value={poForm.amount_words} readOnly placeholder="Rupees Five Lakh Ninety Thousand Only" />
                </div>

                <div className="po-terms">
                  <h3>Terms and Conditions</h3>
                  <p>1) Payment - <input className="po-edit po-terms-input" value={poForm.payment_terms} onChange={(e) => updatePoForm("payment_terms", e.target.value)} /></p>
                  <p>2) Cheque in favour of <input className="po-edit po-cheque-input" value={poForm.cheque_favour} onChange={(e) => updatePoForm("cheque_favour", e.target.value)} placeholder="DBL Medias Private Limited" /></p>
                </div>

                <div className="po-sign-row">
                  <div><b>ACCEPTED</b></div>
                  <div><b>FOR <input className="po-edit po-company-input" value={poForm.company_name} onChange={(e) => updatePoForm("company_name", e.target.value)} /> PVT LTD</b></div>
                </div>

                <div className="po-sign-row po-sign-bottom">
                  <div><b>(PARTY'S SIGNATURE & DATE)</b></div>
                  <div><b>MANAGING DIRECTOR</b></div>
                </div>

               
              </div>
            </div>
          )}

          {activePage === "View PO" && (
            <div className="po-page stagger-item">
              <div className="po-dashboard-header">
                <div>
                  <h2 className="po-dashboard-title">View Purchase Orders</h2>
                  <div className="po-dashboard-breadcrumb">Home <span>›</span> Purchase Order <span>›</span> View</div>
                </div>
                <div className="po-dashboard-actions">
                  <button className="po-primary-btn" onClick={openAddPo}><Plus size={18} /> Add Purchase Order</button>
                  <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("PO")}><ArrowLeft size={14} /> Back</button>
                </div>
              </div>

              <div className="po-list-card">
                <div className="po-toolbar">
                  <input className="po-search-input" type="text" placeholder="Search by PO number, supplier or reference..." value={poSearch} onChange={(e) => setPoSearch(e.target.value)} />
                  <button className="po-filter-btn">Filter</button>
                </div>
                <div className="po-table-wrap">
                  <table className="po-modern-table">
                    <thead><tr><th>PO Number</th><th>Supplier</th><th>PO Date</th><th>Expected Date</th><th>Status</th><th>Total Amount</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredPoList.map((po) => (
                        <tr key={po.po_id}>
                          <td>{po.po_no}</td><td>{po.vendor_name}</td><td>{formatDateDisplay(po.po_date)}</td><td>{formatDateDisplay(po.duration_to)}</td>
                          <td><span className={`po-status ${String(po.status || "draft").toLowerCase()}`}>{po.status || "Draft"}</span></td>
                          <td>₹ {formatAmount(po.grand_total)}</td>
                          <td><button className="po-row-view" onClick={() => { setSelectedPo(po); setActivePage("PO Details"); }}><Eye size={14} /> View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {["Preview PO", "PO Details"].includes(activePage) && selectedPo && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">Purchase Order Preview</h2>
                <div className="header-buttons">
                  <button className="bpms-btn bpms-btn--primary" onClick={downloadPoPdf}>Download PDF</button>
                  <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage(activePage === "PO Details" ? "View PO" : "Add PO")}><ArrowLeft size={14} /> Back</button>
                </div>
              </div>

              <div id="po-print-area" className="po-paper po-preview-paper">
                <div className="po-letter-head"><div className="po-website">www.baashyamgroup.com</div><div className="po-logo-box"><div className="po-logo">BAASHYAAM</div><div className="po-tagline">IMPROVING LIFESTYLES - ENHANCING LIVES</div></div></div>
                <h2 className="po-print-title">PURCHASE ORDER</h2>
                <div className="po-top-row"><div className="po-date-ref"><div>Date : <b>{formatDateDisplay(selectedPo.po_date)}</b></div><div>Ref : <b>{selectedPo.ref_no}</b></div></div><div className="po-gstin">GSTIN:<b>{selectedPo.gstin}</b></div></div>
                <div className="po-vendor-row"><div className="po-to-box"><b>TO</b><div className="po-address-preview">{selectedPo.vendor_address}</div></div></div>
                <div className="po-kind-row"><b>Kind Attn :</b><b>{selectedPo.kind_attn}</b></div>
                <p className="po-reference-line">With reference to your <b>{selectedPo.estimate_type}</b> <b>{selectedPo.invoice_no}</b> dated <b>{formatDateDisplay(selectedPo.invoice_date)}</b> Cited above,we are pleased to place order</p>
                <table className="po-format-table"><thead><tr><th>Description</th><th>Amount</th></tr></thead><tbody><tr><td><b>{selectedPo.description}</b><div><b>Duration:</b> {formatDateDisplay(selectedPo.duration_from)} to {formatDateDisplay(selectedPo.duration_to)}</div></td><td><b>{formatAmount(selectedPo.base_amount)}</b></td></tr><tr><td><b>Sub Total</b></td><td><b>{formatAmount(selectedPo.base_amount)}</b></td></tr><tr><td><b>GST @ {selectedPo.gst_percent}%</b></td><td><b>{formatAmount(selectedPo.gst_amount)}</b></td></tr><tr><td><b>Grand Total</b></td><td><b>{formatAmount(selectedPo.grand_total)}</b></td></tr></tbody></table>
                <div className="po-amount-words"><b>{selectedPo.amount_words}</b></div>
                <div className="po-terms"><h3>Terms and Conditions</h3><p>1) Payment - <b>{selectedPo.payment_terms}</b></p><p>2) Cheque in favour of <b>"{selectedPo.cheque_favour}"</b></p></div>
                <div className="po-sign-row"><div><b>ACCEPTED</b></div><div><b>FOR {selectedPo.company_name} PVT LTD</b></div></div>
                <div className="po-sign-row po-sign-bottom"><div><b>(PARTY'S SIGNATURE & DATE)</b></div><div><b>MANAGING DIRECTOR</b></div></div>
                <div className="po-footer-line"><b>Baashyaam Ventures Pvt. Ltd.,</b> No. 87, 4th Floor, G.N. Chetty Road, T.Nagar, Chennai - 600 017.<div><b>P:</b> +91 44 4290 2345 &nbsp;&nbsp; <b>E:</b> info@bashyamgroup.com &nbsp;&nbsp; <b>CIN:</b> U45201TN2020PTC138085</div></div>
              </div>
            </div>
          )}

         {activePage === "ION NOTE" && (
  <div className="bpms-page stagger-item">
    <div className="bpms-page-header">
      <h2 className="bpms-page-title">Inter Office Note</h2>

      <div className="header-buttons">
        <button
          className="bpms-btn bpms-btn--primary"
          onClick={() => setActivePage("Add ION")}
        >
          <Plus size={14} /> Add
        </button>

        <button
          className="bpms-btn bpms-btn--success"
          onClick={() => {
            fetchIonNotes();
            setActivePage("View ION");
          }}
        >
          <Eye size={14} /> View
        </button>

        <button
          className="bpms-btn bpms-btn--ghost"
          onClick={() => setActivePage("ION")}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    </div>
  </div>
)}

{activePage === "Add ION" && (
  <div className="bpms-page stagger-item">
    <div className="bpms-page-header">
      <h2 className="bpms-page-title">Add Inter Office Note</h2>
      <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("ION NOTE")}>
        <ArrowLeft size={14} /> Back
      </button>
    </div>

    <div className="ion-paper ion-note-paper">
      <div className="ion-company-line">
        <input
          className="pink-input ion-company-input"
          type="text"
          placeholder="BAASHYAAM VENTURES"
          value={ionForm.company_name}
          onChange={(e) => updateIonForm("company_name", e.target.value)}
        />{" "}
        PVT LTD
      </div>

      <div className="ion-note-title">INTER OFFICE NOTE</div>
      <div className="ion-horizontal-line" />

      <div className="ion-note-top">
        <div className="ion-note-from">
          <div>From:</div>
          <b>Mr.Manu Jacob Sabu</b>
          <div>
            <b>Date:</b>{" "}
            <input
              className="pink-input ion-small-input"
              type="date"
              value={ionForm.ion_date}
              onChange={(e) => updateIonForm("ion_date", e.target.value)}
            />
          </div>
          <div>
            <b>Ref :</b> ION/
            <input
              className="pink-input ion-ref-input"
              type="text"
              placeholder="083/2026"
              value={ionForm.ion_ref_no}
              onChange={(e) => updateIonForm("ion_ref_no", e.target.value)}
            />
          </div>
        </div>

        <div className="ion-note-to">
          <div>To:</div>
          <b>MD & DIRECTOR</b>
        </div>
      </div>

      <div className="ion-horizontal-line" />

      <div className="ion-subject-line">
        <b>Sub:</b>{" "}
        <input
          className="pink-input ion-subject-input"
          type="text"
          placeholder="DBL Medias Pvt Ltd - Outdoor Hoarding"
          value={ionForm.subject}
          onChange={(e) => updateIonForm("subject", e.target.value)}
        />
      </div>

      <div className="ion-note-body">
        <p><b>Dear Sir,</b></p>

        <p className="ion-paragraph">
          With reference to the comprehensive invoice given by{" "}
          <input
            className="pink-input ion-inline-input"
            type="text"
            placeholder="DBL Medias"
            value={ionForm.vendor_name}
            onChange={(e) => updateIonForm("vendor_name", e.target.value)}
          />{" "}
          regarding{" "}
          <input
            className="pink-input ion-inline-input"
            type="text"
            placeholder="Outdoor Hoarding"
            value={ionForm.work_name}
            onChange={(e) => updateIonForm("work_name", e.target.value)}
          />{" "}
          for the{" "}
          <input
            className="pink-input ion-inline-input"
            type="text"
            placeholder="Enchanted"
            value={ionForm.project_name}
            onChange={(e) => updateIonForm("project_name", e.target.value)}
          />{" "}
          project, details are given below.
        </p>

        <table className="ion-note-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  className="pink-input ion-desc-input"
                  type="text"
                  placeholder="1 Outdoor Hoarding"
                  value={ionForm.work_name}
                  onChange={(e) => updateIonForm("work_name", e.target.value)}
                />
                <br />
                Duration:{" "}
                <input
                  className="pink-input ion-date-input"
                  type="date"
                  value={ionForm.duration_from}
                  onChange={(e) => updateIonForm("duration_from", e.target.value)}
                />{" "}
                to{" "}
                <input
                  className="pink-input ion-date-input"
                  type="date"
                  value={ionForm.duration_to}
                  onChange={(e) => updateIonForm("duration_to", e.target.value)}
                />
              </td>
              <td>
                <input
                  className="pink-input ion-amount-input"
                  type="number"
                  placeholder="500000"
                  value={ionForm.base_amount}
                  onChange={(e) => updateIonForm("base_amount", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td><b>Sub Total</b></td>
              <td><b>{formatAmount(ionForm.base_amount)}</b></td>
            </tr>
            <tr>
              <td>
                <b>GST @</b>{" "}
                <input
                  className="pink-input ion-gst-input"
                  type="number"
                  value={ionForm.gst_percent}
                  onChange={(e) => updateIonForm("gst_percent", e.target.value)}
                />%
              </td>
              <td><b>{formatAmount(ionForm.gst_amount)}</b></td>
            </tr>
            <tr>
              <td><b>Grand Total</b></td>
              <td><b>{formatAmount(ionForm.grand_total)}</b></td>
            </tr>
          </tbody>
        </table>

        <p className="ion-approval-text">Request to accord your approval.</p>

        <div className="ion-agm-sign">
          <b>Manu Jacob Sabu</b>
          <br />
          <b>AGM - Marketing</b>
        </div>

        <div className="ion-signatures">
          <b>VP-Finance</b>
          <b>AY(DIR)</b>
          <b>BY(DIR)</b>
          <b>MD</b>
        </div>
      </div>

      <div className="rsp-form-actions">
        <button type="button" onClick={saveIon}>Save ION</button>
        <button type="button" onClick={previewIon}>Preview ION</button>
      </div>
    </div>
  </div>
)}

{activePage === "View ION" && (
  <div className="bpms-page stagger-item">
    <div className="bpms-page-header">
      <h2 className="bpms-page-title">View Inter Office Notes</h2>
      <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("ION NOTE")}>
        <ArrowLeft size={14} /> Back
      </button>
    </div>

    <div className="bpms-table-card">
      <div className="bpms-table-scroll">
        <table className="bpms-table">
          <thead>
            <tr>
              <th className="bpms-th">ID</th>
              <th className="bpms-th">ION Ref</th>
              <th className="bpms-th">Date</th>
              <th className="bpms-th">Subject</th>
              <th className="bpms-th">Vendor</th>
              <th className="bpms-th">Project</th>
              <th className="bpms-th">Grand Total</th>
            </tr>
          </thead>
          <tbody>
            {ionNotes.length > 0 ? (
              ionNotes.map((ion) => (
                <tr key={ion.ion_note_id} className="table-row-hover">
                  <td className="bpms-td">
                    <button
                      className="link-btn"
                      type="button"
                      onClick={() => {
                        setSelectedIon(ion);
                        setActivePage("ION Details");
                      }}
                    >
                      {ion.ion_note_id}
                    </button>
                  </td>
                  <td className="bpms-td">{ion.ion_ref_no}</td>
                  <td className="bpms-td">{ion.ion_date}</td>
                  <td className="bpms-td">{ion.subject}</td>
                  <td className="bpms-td">{ion.vendor_name}</td>
                  <td className="bpms-td">{ion.project_name}</td>
                  <td className="bpms-td">{formatAmount(ion.grand_total)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="bpms-td" style={{ textAlign: "center" }}>
                  No ION records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{["Preview ION", "ION Details"].includes(activePage) && selectedIon && (
  <div className="bpms-page stagger-item">
    <div className="bpms-page-header">
      <h2 className="bpms-page-title">Inter Office Note Preview</h2>
      <button
        className="bpms-btn bpms-btn--ghost"
        onClick={() => setActivePage(activePage === "ION Details" ? "View ION" : "Add ION")}
      >
        <ArrowLeft size={14} /> Back
      </button>
    </div>

    <div className="ion-paper ion-note-paper">
      <div className="ion-company-line">
        <span className="preview-text">{selectedIon.company_name || "BAASHYAAM VENTURES"}</span> PVT LTD
      </div>
      <div className="ion-note-title">INTER OFFICE NOTE</div>
      <div className="ion-horizontal-line" />

      <div className="ion-note-top">
        <div className="ion-note-from">
          <div>From:</div>
          <b>Mr.Manu Jacob Sabu</b>
          <div><b>Date:</b> <span className="preview-text">{selectedIon.ion_date}</span></div>
          <div><b>Ref :</b> ION/<span className="preview-text">{selectedIon.ion_ref_no}</span></div>
        </div>
        <div className="ion-note-to">
          <div>To:</div>
          <b>MD & DIRECTOR</b>
        </div>
      </div>

      <div className="ion-horizontal-line" />
      <div className="ion-subject-line"><b>Sub:</b> <span className="preview-text">{selectedIon.subject}</span></div>

      <div className="ion-note-body">
        <p><b>Dear Sir,</b></p>
        <p className="ion-paragraph">
          With reference to the comprehensive invoice given by <span className="preview-text">{selectedIon.vendor_name}</span> regarding <span className="preview-text">{selectedIon.work_name}</span> for the <span className="preview-text">{selectedIon.project_name}</span> project, details are given below.
        </p>

        <table className="ion-note-table">
          <thead>
            <tr><th>Description</th><th>Amount</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="preview-text"> {selectedIon.work_name}</span><br />
                Duration: <span className="preview-text">{selectedIon.duration_from}</span> to <span className="preview-text">{selectedIon.duration_to}</span>
              </td>
              <td><span className="preview-text">{formatAmount(selectedIon.base_amount)}</span></td>
            </tr>
            <tr><td><b>Sub Total</b></td><td><b>{formatAmount(selectedIon.base_amount)}</b></td></tr>
            <tr><td><b>GST @ <span className="preview-text">{selectedIon.gst_percent}</span>%</b></td><td><b>{formatAmount(selectedIon.gst_amount)}</b></td></tr>
            <tr><td><b>Grand Total</b></td><td><b>{formatAmount(selectedIon.grand_total)}</b></td></tr>
          </tbody>
        </table>

        <p className="ion-approval-text">Request to accord your approval.</p>
        <div className="ion-agm-sign"><b>Manu Jacob Sabu</b><br /><b>AGM - Marketing</b></div>
        <div className="ion-signatures"><b>VP-Finance</b><b>AY(DIR)</b><b>BY(DIR)</b><b>MD</b></div>
      </div>
    </div>
  </div>
)}


{activePage === "Payment" && (
  <div className="bpms-page stagger-item">
    <div className="bpms-page-header">
      <h2 className="bpms-page-title">Payment Management</h2>
      <div className="header-buttons">
        <button
          className="bpms-btn bpms-btn--success"
          onClick={() => {
            fetchPayments();
            setActivePage("View Payment");
          }}
        >
          <Eye size={14} /> View Payment
        </button>
        <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("ION")}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    </div>

    <div className="ion-menu-container">
      <div
        className="ion-menu-card"
        onClick={() => {
          fetchPayments();
          setActivePage("View Payment");
        }}
      >
        <Eye size={22} color="var(--brand)" />
        <h3>View Payment</h3>
        <p>View ION records and update payment status</p>
      </div>
    </div>
  </div>
)}

{activePage === "Add Payment" && (
  <div className="bpms-page stagger-item">
    <div className="bpms-page-header">
      <h2 className="bpms-page-title">Add Payment</h2>
      <div className="header-buttons">
        <button className="bpms-btn bpms-btn--primary" onClick={savePayment}>Save Payment</button>
        <button className="bpms-btn bpms-btn--success" onClick={previewPayment}>Preview</button>
        <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("Payment")}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    </div>

    <div className="bpms-table-card" style={{ padding: "24px" }}>
      <div className="bpms-form">
        <div className="form-row-3">
          <div className="form-group"><label>ION No</label><input className="bpms-input" value={paymentForm.ion_no} onChange={(e) => updatePaymentForm("ion_no", e.target.value)} placeholder="ION No" /></div>
          <div className="form-group"><label>ION Date</label><input className="bpms-input" type="date" value={paymentForm.ion_date} onChange={(e) => updatePaymentForm("ion_date", e.target.value)} /></div>
          <div className="form-group"><label>Description</label><input className="bpms-input" value={paymentForm.description} onChange={(e) => updatePaymentForm("description", e.target.value)} placeholder="Description" /></div>
          <div className="form-group"><label>Amount</label><input className="bpms-input" type="number" value={paymentForm.amount} onChange={(e) => updatePaymentForm("amount", e.target.value)} placeholder="0.00" /></div>
          <div className="form-group"><label>Proforma No</label><input className="bpms-input" value={paymentForm.proforma_no} onChange={(e) => updatePaymentForm("proforma_no", e.target.value)} placeholder="Proforma No" /></div>
          <div className="form-group"><label>Proforma Date</label><input className="bpms-input" type="date" value={paymentForm.proforma_date} onChange={(e) => updatePaymentForm("proforma_date", e.target.value)} /></div>
          <div className="form-group"><label>Invoice No</label><input className="bpms-input" value={paymentForm.invoice_no} onChange={(e) => updatePaymentForm("invoice_no", e.target.value)} placeholder="Invoice No" /></div>
          <div className="form-group"><label>Invoice Date</label><input className="bpms-input" type="date" value={paymentForm.invoice_date} onChange={(e) => updatePaymentForm("invoice_date", e.target.value)} /></div>
          <div className="form-group"><label>Amount Received</label><input className="bpms-input" type="number" value={paymentForm.amount_received ?? ""} onChange={(e) => updatePaymentForm("amount_received", e.target.value)} placeholder="Enter Amount Received" min="0" step="0.01" /></div>
          <div className="form-group"><label>Payment Date</label><input className="bpms-input" type="date" value={paymentForm.cheque_wire_date} onChange={(e) => updatePaymentForm("cheque_wire_date", e.target.value)} /></div>
          <div className="form-group"><label>Mode of Payment</label><select className="bpms-input" value={paymentForm.mode_of_payment} onChange={(e) => updatePaymentForm("mode_of_payment", e.target.value)}><option value="NEFT">NEFT</option><option value="RTGS">RTGS</option><option value="Cheque">Cheque</option><option value="Cash">Cash</option><option value="UPI">UPI</option><option value="Wire">Wire</option></select></div>
          <div className="form-group"><label>Cheque / Transaction No</label><input className="bpms-input" value={paymentForm.cheque_transaction_no} onChange={(e) => updatePaymentForm("cheque_transaction_no", e.target.value)} placeholder="Cheque / Transaction No" /></div>
          <div className="form-group"><label>Bank Name</label><input className="bpms-input" value={paymentForm.bank_name} onChange={(e) => updatePaymentForm("bank_name", e.target.value)} placeholder="Bank Name" /></div>
          <div className="form-group"><label>Branch Name</label><input className="bpms-input" value={paymentForm.branch_name} onChange={(e) => updatePaymentForm("branch_name", e.target.value)} placeholder="Branch Name" /></div>
          <div className="form-group"><label>Status</label><input className="bpms-input" value={paymentForm.payment_status} readOnly /></div>
          <div className="form-group"><label>Balance Amount</label><input className="bpms-input" value={paymentForm.balance_amount || "0.00"} readOnly /></div>
          <div className="form-group"><label>Received %</label><input className="bpms-input" value={`${paymentForm.received_percentage || "0.00"}%`} readOnly /></div>
        </div>
        <div className="form-group" style={{ marginTop: "16px" }}><label>Remarks</label><textarea className="bpms-input" rows="3" value={paymentForm.remarks} onChange={(e) => updatePaymentForm("remarks", e.target.value)} placeholder="Remarks" /></div>
      </div>
    </div>
  </div>
)}

{activePage === "View Payment" && (
  <div className="bpms-page stagger-item">
    <div className="bpms-page-header">
      <h2 className="bpms-page-title">View Payment Records</h2>
      <div className="header-buttons">
        <button className="bpms-btn bpms-btn--success" onClick={fetchPayments}>Refresh</button>
        <button className="bpms-btn bpms-btn--ghost" onClick={() => setActivePage("Payment")}><ArrowLeft size={14} /> Back</button>
      </div>
    </div>

    <div className="bpms-table-card">
      <div style={{ padding: "16px" }}>
        <input className="bpms-input" placeholder="Search by ION no, vendor, project, description or invoice no..." value={paymentSearch} onChange={(e) => setPaymentSearch(e.target.value)} />
      </div>
      <div className="bpms-table-scroll">
        <table className="bpms-table">
          <thead>
            <tr>
              <th className="bpms-th">ION NO</th>
              <th className="bpms-th">ION DATE</th>
              <th className="bpms-th">DESCRIPTION</th>
              <th className="bpms-th">AMOUNT</th>
              <th className="bpms-th">PROFORMA NO</th>
              <th className="bpms-th">PROFORMA DATE</th>
              <th className="bpms-th">INVOICE NO</th>
              <th className="bpms-th">INVOICE DATE</th>
              <th className="bpms-th">BALANCE</th>
              <th className="bpms-th">RECEIVED %</th>
              <th className="bpms-th">STATUS</th>
              <th className="bpms-th">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaymentList.length > 0 ? (
              filteredPaymentList.map((pay) => {
                const ionNo = getIonNo(pay);
                const calculatedPay = applyPaymentCalculation({ ...pay, amount: getIonAmount(pay) });
                const statusText = calculatedPay.payment_status || pay.payment_status || pay.status || "PAYMENT PENDING";
                const statusColour = calculatedPay.status_colour || getPaymentStatusStyleFromText(statusText);
                return (
                  <tr key={pay.ion_note_id || ionNo} className="table-row-hover">
                    <td className="bpms-td">
                      <button className="link-btn" type="button" onClick={() => openPaymentDetails(pay)}>
                        {ionNo}
                      </button>
                    </td>
                    <td className="bpms-td">{pay.ion_date}</td>
                    <td className="bpms-td" style={{ minWidth: "280px" }}>{buildPaymentDescription(pay)}</td>
                    <td className="bpms-td">₹ {formatAmount(getIonAmount(pay))}</td>
                    <td className="bpms-td">{pay.proforma_no || pay.estimate_no || ""}</td>
                    <td className="bpms-td">{pay.proforma_date || pay.estimate_date || ""}</td>
                    <td className="bpms-td">{pay.invoice_no || ""}</td>
                    <td className="bpms-td">{pay.invoice_date || ""}</td>
                    <td className="bpms-td">₹ {formatAmount(calculatedPay.balance_amount)}</td>
                    <td className="bpms-td">{calculatedPay.received_percentage || "0.00"}%</td>
                    <td className="bpms-td"><span className="bpms-count-pill" style={{ ...getStatusStyle(statusColour), border: "none" }}>{statusText}</span></td>
                    <td className="bpms-td"><button className="bpms-btn bpms-btn--ghost" onClick={() => openPaymentDetails(pay)} style={{ padding: "4px 8px", fontSize: "12px" }}><Eye size={13} /> Add / Update</button></td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="12" className="bpms-td" style={{ textAlign: "center" }}>No ION payment records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{["Preview Payment", "Payment Details"].includes(activePage) && selectedPayment && (
  <div className="bpms-page stagger-item">
    <div className="bpms-page-header">
      <h2 className="bpms-page-title">Payment Details - ION {paymentForm.ion_no}</h2>
      <div className="header-buttons">
        <button className="bpms-btn bpms-btn--primary" onClick={savePayment}>Update Payment</button>
        <button className="bpms-btn bpms-btn--success" onClick={previewPayment}>Preview</button>
        <button className="bpms-btn bpms-btn--ghost" onClick={() => { fetchPayments(); setActivePage("View Payment"); }}><ArrowLeft size={14} /> Back</button>
      </div>
    </div>

    <div className="bpms-table-card" style={{ padding: "20px" }}>
      <div className="bpms-table-scroll">
        <table className="bpms-table">
          <thead>
            <tr>
              <th className="bpms-th">ION NO</th>
              <th className="bpms-th">ION DATE</th>
              <th className="bpms-th">DESCRIPTION</th>
              <th className="bpms-th">AMOUNT</th>
              <th className="bpms-th">PROFORMA NO</th>
              <th className="bpms-th">PROFORMA DATE</th>
              <th className="bpms-th">INVOICE NO</th>
              <th className="bpms-th">INVOICE DATE</th>
              <th className="bpms-th">BALANCE</th>
              <th className="bpms-th">RECEIVED %</th>
              <th className="bpms-th">STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bpms-td">{paymentForm.ion_no}</td>
              <td className="bpms-td">{paymentForm.ion_date}</td>
              <td className="bpms-td" style={{ minWidth: "280px" }}>{paymentForm.description}</td>
              <td className="bpms-td">₹ {formatAmount(paymentForm.amount)}</td>
              <td className="bpms-td">{paymentForm.proforma_no}</td>
              <td className="bpms-td">{paymentForm.proforma_date}</td>
              <td className="bpms-td">{paymentForm.invoice_no}</td>
              <td className="bpms-td">{paymentForm.invoice_date}</td>
              <td className="bpms-td">₹ {formatAmount(paymentForm.balance_amount)}</td>
              <td className="bpms-td">{paymentForm.received_percentage || "0.00"}%</td>
              <td className="bpms-td"><span className="bpms-count-pill" style={{ ...getStatusStyle(paymentForm.status_colour), border: "none" }}>{paymentForm.payment_status}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="bpms-table-card" style={{ padding: "24px", marginTop: "18px" }}>
      <div className="rsp-title">ADD / UPDATE PAYMENT</div>
      <div className="bpms-form" style={{ marginTop: "20px" }}>
        <div className="form-row-3">
          <div className="form-group"><label>Amount Received</label><input className="bpms-input" type="number" value={paymentForm.amount_received ?? ""} onChange={(e) => updatePaymentForm("amount_received", e.target.value)} placeholder="Enter Amount Received" min="0" step="0.01" /></div>
          <div className="form-group"><label>Cheque / Wire Date</label><input className="bpms-input" type="date" value={paymentForm.cheque_wire_date || ""} onChange={(e) => updatePaymentForm("cheque_wire_date", e.target.value)} /></div>
          <div className="form-group"><label>Mode of Payment</label><select className="bpms-input" value={paymentForm.mode_of_payment || "NEFT"} onChange={(e) => updatePaymentForm("mode_of_payment", e.target.value)}><option value="NEFT">NEFT</option><option value="RTGS">RTGS</option><option value="Cheque">Cheque</option><option value="Cash">Cash</option><option value="UPI">UPI</option><option value="Wire">Wire</option></select></div>
          <div className="form-group"><label>Cheque / Transaction No</label><input className="bpms-input" value={paymentForm.cheque_transaction_no || ""} onChange={(e) => updatePaymentForm("cheque_transaction_no", e.target.value)} placeholder="Cheque / Transaction No" /></div>
          <div className="form-group"><label>Bank Name</label><input className="bpms-input" value={paymentForm.bank_name || ""} onChange={(e) => updatePaymentForm("bank_name", e.target.value)} placeholder="Bank Name" /></div>
          <div className="form-group"><label>Branch Name</label><input className="bpms-input" value={paymentForm.branch_name || ""} onChange={(e) => updatePaymentForm("branch_name", e.target.value)} placeholder="Branch Name" /></div>
          <div className="form-group"><label>Status</label><input className="bpms-input" value={paymentForm.payment_status} readOnly /></div>
          <div className="form-group"><label>Balance Amount</label><input className="bpms-input" value={paymentForm.balance_amount || "0.00"} readOnly /></div>
          <div className="form-group"><label>Received %</label><input className="bpms-input" value={`${paymentForm.received_percentage || "0.00"}%`} readOnly /></div>
        </div>
        <div className="form-group" style={{ marginTop: "16px" }}><label>Remarks</label><textarea className="bpms-input" rows="3" value={paymentForm.remarks || ""} onChange={(e) => updatePaymentForm("remarks", e.target.value)} placeholder="Remarks" /></div>
      </div>
    </div>
  </div>
)}

{activePage === "User Management" && (
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
                            <span className={`bpms-count-pill`} style={{ color: user.is_active === 1 ? "var(--success)" : "var(--danger)", background: user.is_active === 1 ? "var(--success-faint)" : "var(--danger-faint)", border: "none" }}>
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

              {showUserForm && (
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
              )}
            </div>
          )}

          {activePage === "Vendor Management" && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">Vendor Database Management</h2>

                <button className="bpms-btn bpms-btn--primary" onClick={openAddVendor}>
                  <Plus size={14} /> Add Vendor
                </button>
              </div>

              {vendorPage === "Add" && (
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

                    <div className="form-actions">
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
                      >Preview ION
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {vendorPage === "View" && (
                <div className="bpms-table-card">
                  <div className="bpms-table-scroll">
                    <table className="bpms-table">
                      <thead>
                        <tr>
                          <th className="bpms-th">ID</th>
                          <th className="bpms-th">Vendor Name</th>
                          <th className="bpms-th">Code</th>
                          <th className="bpms-th">Type</th>
                          <th className="bpms-th">Contact</th>
                          <th className="bpms-th">Mobile</th>
                          <th className="bpms-th">Email</th>
                          <th className="bpms-th">City</th>
                          <th className="bpms-th">State</th>
                          <th className="bpms-th">PAN</th>
                          <th className="bpms-th">GST</th>
                          <th className="bpms-th">Bank</th>
                          <th className="bpms-th">Status</th>
                          <th className="bpms-th">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {vendors.map((vendor) => (
                          <tr key={vendor.vendor_id} className="table-row-hover">
                            <td className="bpms-td">{vendor.vendor_id}</td>
                            <td className="bpms-td" style={{ fontWeight: 600 }}>{vendor.vendor_name}</td>
                            <td className="bpms-td">{vendor.vendor_code}</td>
                            <td className="bpms-td">{vendor.vendor_type}</td>
                            <td className="bpms-td">{vendor.contact_person}</td>
                            <td className="bpms-td">{vendor.mobile_no}</td>
                            <td className="bpms-td">{vendor.email_id}</td>
                            <td className="bpms-td">{vendor.city}</td>
                            <td className="bpms-td">{vendor.state}</td>
                            <td className="bpms-td">{vendor.pan_number}</td>
                            <td className="bpms-td">{vendor.gst_no}</td>
                            <td className="bpms-td">{vendor.bank_name}</td>
                            <td className="bpms-td">
                              <span
                                className="bpms-count-pill"
                                style={{
                                  color: vendor.status === "ACTIVE" ? "var(--success)" : "var(--danger)",
                                  background: vendor.status === "ACTIVE" ? "var(--success-faint)" : "var(--danger-faint)",
                                  border: "none"
                                }}
                              >
                                {vendor.status}
                              </span>
                            </td>
                            <td className="bpms-td">
                              <button
                                className="bpms-btn bpms-btn--ghost"
                                onClick={() => openEditVendor(vendor)}
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
              )}
            </div>
          )}

          {activePage === "Reports" && (
            <div className="bpms-page stagger-item">
              <div className="bpms-page-header">
                <h2 className="bpms-page-title">Operational Reports</h2>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;