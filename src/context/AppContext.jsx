import { createContext, useContext, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

const AppContext = createContext(null);
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const AppProvider = ({ children }) => {
  // Authentication & Layout States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [activePage, setActivePage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // User Management States
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

  // Vendor Management States
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

  // Company Management States
  const [companies, setCompanies] = useState([]);
  const [companyPage, setCompanyPage] = useState("View");
  const [editCompanyId, setEditCompanyId] = useState(null);
  const emptyCompanyForm = {
    company_name: "",
    status: "ACTIVE",
  };
  const [companyForm, setCompanyForm] = useState(emptyCompanyForm);

  // RSP (Request Slip For Payment) States
  const [rspAmount, setRspAmount] = useState("");
  const [rspAmountWords, setRspAmountWords] = useState("");
  const [rspList, setRspList] = useState([]);
  const [selectedRsp, setSelectedRsp] = useState(null);
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

  // ION Note States
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

  // PO States
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
  const [poList, setPoList] = useState([]);
  const [selectedPo, setSelectedPo] = useState(null);
  const [poSearch, setPoSearch] = useState("");

  // Payment Tracking States
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
    paid_amount: "0.00",
    total_paid: "0.00",
    payment_history: [],
  };
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);
  const [paymentList, setPaymentList] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentSection, setPaymentSection] = useState("summary");
  const [paymentSearch, setPaymentSearch] = useState("");

  const [signatures, setSignatures] = useState({
    agm_marketing: { name: "Manu Jacob Sabu", designation: "AGM - Marketing" },
    vp_finance: { name: "VP(FINANCE)", designation: "VP (Finance)" },
    ay_dir: { name: "AY(DIR)", designation: "AY (Dir)" },
    by_dir: { name: "BY(DIR)", designation: "BY (Dir)" },
    md: { name: "MD", designation: "Managing Director" },
  });

  const fetchSignatures = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/signatures/`);
      const sigData = response.data || [];
      const updated = { ...signatures };
      sigData.forEach((sig) => {
        if (sig.role_key) {
          updated[sig.role_key] = {
            name: sig.name || "",
            designation: sig.designation || "",
          };
        }
      });
      setSignatures(updated);
    } catch (error) {
      console.error("Error fetching signatures:", error);
    }
  };

  const updateSignatureInDb = async (roleKey, name, designation) => {
    try {
      await axios.put(`${BASE_URL}/signatures/${roleKey}`, null, {
        params: { name, designation }
      });
      await fetchSignatures();
    } catch (error) {
      alert("Error updating signature: " + error.message);
      throw error;
    }
  };

  // --- Handlers & API Calls ---

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        username,
        password,
      });
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      setCurrentUser(response.data);
      setIsLoggedIn(true);
      fetchSignatures();
    } catch {
      alert("Invalid Username or Password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  // User management
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/`);
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
          `${BASE_URL}/users/update/${editUserId}`,
          newUser
        );
        alert("User Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/users/create`, newUser);
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

  // Vendor management
  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/vendors/`);
      setVendors(response.data);
    } catch {
      alert("Error loading vendors");
    }
  };

  const openAddVendor = () => {
    setEditVendorId(null);
    setVendorForm(emptyVendorForm);
    setVendorPage("Add");
    setActivePage("Vendor Management");
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
    setActivePage("Vendor Management");
  };

  const saveVendor = async (e) => {
    e.preventDefault();
    try {
      if (editVendorId) {
        await axios.put(
          `${BASE_URL}/vendors/update/${editVendorId}`,
          null,
          { params: vendorForm }
        );
        alert("Vendor Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/vendors/create`, null, {
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

  // Company management
  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/companies/`);
      setCompanies(response.data);
    } catch {
      alert("Error loading companies");
    }
  };

  const openAddCompany = () => {
    setEditCompanyId(null);
    setCompanyForm(emptyCompanyForm);
    setCompanyPage("Add");
    setActivePage("Company Management");
  };

  const openEditCompany = (company) => {
    setEditCompanyId(company.company_id);
    setCompanyForm({
      company_name: company.company_name || "",
      status: company.status || "ACTIVE",
    });
    setCompanyPage("Add");
    setActivePage("Company Management");
  };

  const saveCompany = async (e) => {
    e.preventDefault();
    try {
      if (editCompanyId) {
        await axios.put(
          `${BASE_URL}/companies/update/${editCompanyId}`,
          null,
          { params: companyForm }
        );
        alert("Company Updated Successfully");
      } else {
        await axios.post(`${BASE_URL}/companies/create`, null, {
          params: companyForm,
        });
        alert("Company Created Successfully");
      }
      setEditCompanyId(null);
      setCompanyForm(emptyCompanyForm);
      setCompanyPage("View");
      fetchCompanies();
    } catch (error) {
      alert(error.response?.data?.detail || error.message);
    }
  };

  const deleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await axios.delete(`${BASE_URL}/companies/delete/${companyId}`);
      alert("Company Deleted Successfully");
      fetchCompanies();
    } catch (error) {
      alert(error.response?.data?.detail || error.message);
    }
  };

  // Utility to convert numbers to words
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
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + inWords(n % 100) : "");
    };

    let words = "";
    if (Math.floor(num / 10000000) > 0) {
      words += inWords(Math.floor(num / 10000000)) + " Crore ";
      num %= 10000000;
    }
    if (Math.floor(num / 100000) > 0) {
      words += inWords(Math.floor(num / 100000)) + " Lakh ";
      num %= 100000;
    }
    if (Math.floor(num / 1000) > 0) {
      words += inWords(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }
    if (num > 0) {
      words += inWords(num);
    }
    return `Rupees ${words.trim()} Only`;
  };

  // RSP Handlers
  const updateRspForm = (field, value) => {
    setRspForm((prev) => ({ ...prev, [field]: value }));
  };

  const previewRsp = () => {
    setActivePage("Preview RSP");
  };

  const downloadPdf = async () => {
    const input = document.getElementById("rsp-print-area");
    if (!input) return;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
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
      const response = await axios.get(`${BASE_URL}/rsp/`);
      setRspList(response.data);
    } catch (error) {
      alert("Error loading RSP: " + error.message);
    }
  };

  const saveRsp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const cleanedAmount = parseFloat(String(rspAmount).replace(/,/g, "")) || 0;
      await axios.post(`${BASE_URL}/rsp/create`, null, {
        params: {
          ...rspForm,
          amount_payable: cleanedAmount,
          amount_words: rspAmountWords,
        },
      });
      alert("RSP Saved Successfully");
      setRspAmount("");
      setRspAmountWords("");
      setRspForm({
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
      fetchRsp();
      setActivePage("View RSP");
    } catch (error) {
      alert("Error saving RSP: " + error.message);
    }
  };

  const deleteRsp = async (rspId) => {
    if (!window.confirm("Are you sure you want to delete this RSP?")) return;
    try {
      await axios.delete(`${BASE_URL}/rsp/${rspId}`);
      alert("RSP Deleted Successfully");
      fetchRsp();
    } catch (error) {
      alert("Error deleting RSP: " + error.message);
    }
  };

  const formatAmount = (value) => {
    if (value === null || value === undefined || value === "") return "0";
    const num = Number(String(value).replace(/,/g, ""));
    if (Number.isNaN(num)) return "0";
    return num.toLocaleString("en-IN");
  };

  // ION Note Handlers
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

  const saveIon = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      const payload = {
        ...ionForm,
        base_amount: parseFloat(String(ionForm.base_amount).replace(/,/g, "")) || 0,
        gst_percent: parseFloat(String(ionForm.gst_percent)) || 18,
        gst_amount: parseFloat(String(ionForm.gst_amount).replace(/,/g, "")) || 0,
        grand_total: parseFloat(String(ionForm.grand_total).replace(/,/g, "")) || 0,
      };
      await axios.post(`${BASE_URL}/ion-note/create`, null, {
        params: payload,
      });
      alert("ION Note Saved Successfully");
      setIonForm({
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
      fetchIonNotes();
      setActivePage("View ION");
    } catch (error) {
      alert("Error saving ION Note: " + error.message);
    }
  };

  const deleteIon = async (ionNoteId) => {
    if (!window.confirm("Are you sure you want to delete this ION Note?")) return;
    try {
      await axios.delete(`${BASE_URL}/ion-note/${ionNoteId}`);
      alert("ION Note Deleted Successfully");
      fetchIonNotes();
    } catch (error) {
      alert("Error deleting ION Note: " + error.message);
    }
  };

  const fetchIonNotes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ion-note/`);
      setIonNotes(response.data);
    } catch (error) {
      alert("Error loading ION Notes: " + error.message);
    }
  };

  const previewIon = () => {
    setSelectedIon({ ...ionForm });
    setActivePage("Preview ION");
  };

  const downloadIonPdf = async (ionRefNo) => {
    const input = document.getElementById("ion-print-area");
    if (!input) return;
    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ION_${ionRefNo || "Preview"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // PO Handlers
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

  const fetchPos = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/purchase-order/`);
      const mapped = (response.data || []).map((po) => ({
        ...po,
        po_no: po.po_ref_no || "",
        kind_attn: po.kind_attention || "",
        invoice_no: po.proforma_invoice_no || "",
        base_amount: po.amount || 0,
      }));
      setPoList(mapped);
    } catch (error) {
      alert("Error loading Purchase Orders: " + error.message);
    }
  };

  const savePo = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!poForm.po_no || !poForm.vendor_name) {
      alert("Please enter PO No and Vendor Name");
      return;
    }
    try {
      const payload = {
        company_name: poForm.company_name,
        po_date: poForm.po_date,
        po_ref_no: poForm.po_no,
        vendor_name: poForm.vendor_name,
        vendor_address: poForm.vendor_address,
        gstin: poForm.gstin,
        kind_attention: poForm.kind_attn,
        proforma_invoice_no: poForm.invoice_no,
        project_name: poForm.project_name,
        duration_from: poForm.duration_from,
        duration_to: poForm.duration_to,
        amount: parseFloat(String(poForm.base_amount).replace(/,/g, "")) || 0,
        gst_percent: parseFloat(String(poForm.gst_percent)) || 18,
        gst_amount: parseFloat(String(poForm.gst_amount).replace(/,/g, "")) || 0,
        grand_total: parseFloat(String(poForm.grand_total).replace(/,/g, "")) || 0,
        amount_words: poForm.amount_words,
        payment_terms: poForm.payment_terms,
        cheque_favour: poForm.cheque_favour,
      };

      const response = await axios.post(`${BASE_URL}/purchase-order/create`, null, {
        params: payload,
      });
      const saved = response.data?.data || response.data || {};
      const mappedSaved = {
        ...saved,
        po_no: saved.po_ref_no || "",
        kind_attn: saved.kind_attention || "",
        invoice_no: saved.proforma_invoice_no || "",
        base_amount: saved.amount || 0,
      };
      alert("Purchase Order Saved Successfully");
      resetPoForm();
      fetchPos();
      setSelectedPo(mappedSaved);
      setActivePage("Preview PO");
    } catch (error) {
      alert("Error saving Purchase Order: " + error.message);
    }
  };

  const deletePo = async (poId) => {
    if (!window.confirm("Are you sure you want to delete this Purchase Order?")) return;
    try {
      await axios.delete(`${BASE_URL}/purchase-order/${poId}`);
      alert("Purchase Order Deleted Successfully");
      fetchPos();
    } catch (error) {
      alert("Error deleting Purchase Order: " + error.message);
    }
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

  // Payment Tracking Handlers
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
    return pay.grand_total || pay.amount || pay.total_amount || pay.base_amount || "";
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
    if (status.includes("completed") || status.includes("cleared") || (status.includes("paid") && !status.includes("part") && !status.includes("pending"))) return "Green";
    if (status.includes("part") || status.includes("partial")) return "Yellow";
    if (status.includes("pending") || status.includes("signed")) return "Red";
    if (status.includes("prepared") || status.includes("signing") || status.includes("white")) return "White";
    return "White";
  };

  const cleanAmountInput = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const strValue = String(value);
    if (!strValue.includes(".")) return strValue;
    return strValue.replace(/\.00$/, "").replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  };

  const applyPaymentCalculation = (data) => {
    const amount = toPaymentNumber(data.amount || data.total_amount || data.grand_total || data.base_amount);
    const alreadyPaid = toPaymentNumber(data.paid_amount || data.total_paid);
    const currentPayment = toPaymentNumber(data.amount_received || data.current_payment);
    const totalPaidAfterEntry = alreadyPaid + currentPayment;
    const balance = Math.max(amount - totalPaidAfterEntry, 0);
    const receivedPercentage = amount ? ((totalPaidAfterEntry / amount) * 100).toFixed(2) : "0.00";
    
    let statusText = data.payment_status || data.status;
    if (!statusText || statusText === "PAYMENT PENDING") {
      statusText = "Prepared & Sent for Signing";
    }
    const statusColour = getPaymentStatusStyleFromText(statusText);

    return {
      ...data,
      amount: amount ? amount.toFixed(2) : data.amount || "",
      amount_received: data.amount_received === "" ? "" : cleanAmountInput(data.amount_received),
      paid_amount: alreadyPaid ? alreadyPaid.toFixed(2) : data.paid_amount || "0.00",
      total_paid: alreadyPaid ? alreadyPaid.toFixed(2) : data.total_paid || "0.00",
      balance_amount: amount ? balance.toFixed(2) : "",
      received_percentage: receivedPercentage,
      payment_status: statusText,
      status_colour: statusColour,
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
    setPaymentHistory([]);
    setPaymentSection("summary");
  };

  const openAddPayment = () => {
    resetPaymentForm();
    setActivePage("Payment");
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ion-note/`);
      setPaymentList(response.data || []);
    } catch (error) {
      alert("Error loading payment records: " + error.message);
    }
  };

  const changePaymentStatus = async (ionNo, status) => {
    try {
      await axios.put(`${BASE_URL}/payment-details/status/${ionNo}`, null, {
        params: { status }
      });
      await fetchPayments();
      setPaymentForm((prev) => {
        if (prev.ion_no === ionNo) {
          return {
            ...prev,
            payment_status: status,
            status_colour: getPaymentStatusStyleFromText(status)
          };
        }
        return prev;
      });
    } catch (error) {
      alert("Error updating payment status: " + error.message);
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
      const response = await axios.get(`${BASE_URL}/payment-details/${encodeURIComponent(ionNo)}`);
      const details = response.data || {};
      const merged = applyPaymentCalculation({
        ...baseForm,
        ...details,
        amount: details.amount || baseForm.amount,
        description: details.description || baseForm.description,
        amount_received: "",
        cheque_transaction_no: "",
        bank_name: "",
        branch_name: "",
        cheque_wire_date: "",
        remarks: "",
      });
      setPaymentForm(merged);
      setSelectedPayment(merged);
      setPaymentHistory(details.payment_history || []);
    } catch {
      const calculatedBaseForm = applyPaymentCalculation(baseForm);
      setPaymentForm(calculatedBaseForm);
      setSelectedPayment(calculatedBaseForm);
      setPaymentHistory([]);
    }
    setPaymentSection("summary");
    setActivePage("Payment Details");
  };

  const savePayment = async () => {
    if (!paymentForm.ion_no) {
      alert("ION No missing");
      return;
    }
    if (!paymentForm.amount_received || toPaymentNumber(paymentForm.amount_received) <= 0) {
      alert("Please enter payment amount greater than 0");
      return;
    }
    try {
      const response = await axios.put(
        `${BASE_URL}/payment-details/${encodeURIComponent(paymentForm.ion_no)}`,
        null,
        {
          params: {
            mode_of_payment: paymentForm.mode_of_payment || "NEFT",
            cheque_transaction_no: paymentForm.cheque_transaction_no || "",
            bank_name: paymentForm.bank_name || "",
            branch_name: paymentForm.branch_name || "",
            amount_received: paymentForm.amount_received || 0,
            cheque_wire_date: paymentForm.cheque_wire_date || null,
            remarks: paymentForm.remarks || "",
          },
        }
      );
      const details = response.data?.data || response.data || {};
      const merged = applyPaymentCalculation({
        ...paymentForm,
        ...details,
        amount_received: "",
        current_payment: "",
        cheque_transaction_no: "",
        bank_name: "",
        branch_name: "",
        cheque_wire_date: "",
        remarks: "",
      });
      setPaymentForm(merged);
      setSelectedPayment(merged);
      setPaymentHistory(details.payment_history || []);
      alert("Payment transaction added successfully");
      setPaymentSection("history");
      fetchPayments();
    } catch (error) {
      alert("Error saving payment: " + (error.response?.data?.detail || error.message));
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
    if (c === "green") return { background: "var(--success-faint)", color: "var(--success)" };
    if (c === "yellow") return { background: "var(--warning-faint)", color: "var(--warning)" };
    if (c === "red") return { background: "var(--danger-faint)", color: "var(--danger)" };
    return { background: "var(--bg-hover)", color: "var(--text-secondary)" };
  };

  const getSidebarActive = () => {
    if (["Dashboard", "User Management", "Vendor Management", "Company Management", "Reports"].includes(activePage)) {
      return activePage;
    }
    if (["ION", "RSP", "Add RSP", "View RSP", "Preview RSP", "RSP Details", "PO", "Add PO", "View PO", "Preview PO", "PO Details", "ION NOTE", "Add ION", "View ION", "Preview ION", "ION Details", "Payment", "Add Payment", "View Payment", "Preview Payment", "Payment Details"].includes(activePage)) {
      return "ION";
    }
    return "";
  };

  const getBreadcrumbs = () => {
    switch (activePage) {
      case "Dashboard":
        return ["Dashboard"];
      case "User Management":
        return ["User Management"];
      case "Vendor Management":
        return ["Vendor Management"];
      case "Company Management":
        return ["Company Management"];
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

  const value = {
    username, setUsername,
    password, setPassword,
    isLoggedIn, setIsLoggedIn,
    currentUser, setCurrentUser,
    handleLogout,
    activePage, setActivePage,
    collapsed, setCollapsed,
    profileOpen, setProfileOpen,
    users, setUsers,
    showUserForm, setShowUserForm,
    editUserId, setEditUserId,
    emptyUserForm,
    newUser, setNewUser,
    vendors, setVendors,
    vendorPage, setVendorPage,
    editVendorId, setEditVendorId,
    emptyVendorForm,
    vendorForm, setVendorForm,
    rspAmount, setRspAmount,
    rspAmountWords, setRspAmountWords,
    rspList, setRspList,
    selectedRsp, setSelectedRsp,
    rspForm, setRspForm,
    ionNotes, setIonNotes,
    selectedIon, setSelectedIon,
    ionForm, setIonForm,
    poForm, setPoForm,
    poList, setPoList,
    selectedPo, setSelectedPo,
    poSearch, setPoSearch,
    paymentForm, setPaymentForm,
    paymentList, setPaymentList,
    selectedPayment, setSelectedPayment,
    paymentHistory, setPaymentHistory,
    paymentSection, setPaymentSection,
    paymentSearch, setPaymentSearch,
    handleLogin,
    fetchUsers,
    openAddUserModal,
    openEditUserModal,
    closeAddUserModal,
    saveUser,
    fetchVendors,
    openAddVendor,
    openEditVendor,
    saveVendor,
    companies, setCompanies,
    companyPage, setCompanyPage,
    companyForm, setCompanyForm,
    fetchCompanies,
    openAddCompany,
    openEditCompany,
    saveCompany,
    deleteCompany,
    numberToWords,
    updateRspForm,
    previewRsp,
    downloadPdf,
    downloadWord,
    fetchRsp,
    saveRsp,
    deleteRsp,
    formatAmount,
    updateIonForm,
    saveIon,
    deleteIon,
    fetchIonNotes,
    previewIon,
    downloadIonPdf,
    updatePoForm,
    resetPoForm,
    openAddPo,
    savePo,
    deletePo,
    fetchPos,
    previewPo,
    filteredPoList,
    formatDateDisplay,
    downloadPoPdf,
    buildPaymentDescription,
    getIonNo,
    getIonAmount,
    toPaymentNumber,
    getPaymentStatus,
    getPaymentStatusStyleFromText,
    cleanAmountInput,
    applyPaymentCalculation,
    updatePaymentForm,
    resetPaymentForm,
    openAddPayment,
    fetchPayments,
    changePaymentStatus,
    openPaymentDetails,
    savePayment,
    previewPayment,
    filteredPaymentList,
    getStatusStyle,
    getSidebarActive,
    getBreadcrumbs,
    signatures,
    fetchSignatures,
    updateSignatureInDb
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
