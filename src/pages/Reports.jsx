import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import XLSX from "xlsx-js-style";
import { 
  FileText, 
  ShoppingBag, 
  CreditCard, 
  DollarSign, 
  Download, 
  Printer, 
  Filter, 
  FileDown, 
  Calendar, 
  Search, 
  RefreshCw, 
  X 
} from "lucide-react";

export default function Reports() {
  const {
    ionNotes,
    poList,
    paymentList,
    rspList,
    vendors,
    formatAmount,
    formatDateDisplay,
    fetchIonNotes,
    fetchPos,
    fetchPayments,
    fetchRsp,
    fetchVendors,
    changePaymentStatus,
    getStatusStyle,
    getPaymentStatusStyleFromText
  } = useApp();

  const [activeTab, setActiveTab] = useState("ION"); // ION, PO, PAYMENT, RSP
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch fresh datasets on mount to populate filters and table
  useEffect(() => {
    fetchIonNotes();
    fetchPos();
    fetchPayments();
    fetchRsp();
    fetchVendors();
  }, []);

  // Extract unique companies dynamically from all datasets
  const getUniqueCompanies = () => {
    const companies = new Set();
    (ionNotes || []).forEach((item) => {
      if (item.company_name) companies.add(item.company_name.toUpperCase().trim());
    });
    (poList || []).forEach((item) => {
      if (item.company_name) companies.add(item.company_name.toUpperCase().trim());
    });
    (rspList || []).forEach((item) => {
      if (item.company_name) companies.add(item.company_name.toUpperCase().trim());
    });
    return Array.from(companies).sort();
  };

  const uniqueCompanies = getUniqueCompanies();

  // Helper to parse dates into timestamp comparison
  const parseDateToTimestamp = (dateStr) => {
    if (!dateStr) return 0;
    const str = String(dateStr).trim();
    // Check if format is DD.MM.YYYY
    if (str.includes(".")) {
      const [day, month, year] = str.split(".");
      if (year && month && day) {
        return new Date(`${year}-${month}-${day}`).getTime() || 0;
      }
    }
    // Check if format is DD-MM-YYYY
    if (str.includes("-") && str.split("-")[0].length < 4) {
      const [day, month, year] = str.split("-");
      if (year && month && day) {
        return new Date(`${year}-${month}-${day}`).getTime() || 0;
      }
    }
    return new Date(str).getTime() || 0;
  };

  // Helper to filter items based on date, vendor, company, and search query
  const filterDataset = (list, dateField) => {
    return (list || []).filter((item) => {
      // 1. Date range filter
      if (startDate && item[dateField]) {
        const itemTime = parseDateToTimestamp(item[dateField]);
        const startTime = new Date(startDate).getTime();
        if (itemTime < startTime) return false;
      }
      if (endDate && item[dateField]) {
        const itemTime = parseDateToTimestamp(item[dateField]);
        const endTime = new Date(endDate).getTime();
        if (itemTime > endTime) return false;
      }
      // 2. Vendor filter
      if (selectedVendor && item.vendor_name !== selectedVendor) {
        return false;
      }
      // 3. Company filter
      if (selectedCompany && String(item.company_name || "").toUpperCase().trim() !== selectedCompany.toUpperCase().trim()) {
        return false;
      }
      // 4. Search query keyword filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const ref = String(item.ion_ref_no || item.po_ref_no || item.rsp_id || "").toLowerCase();
        const vendor = String(item.vendor_name || "").toLowerCase();
        const company = String(item.company_name || "").toLowerCase();
        const desc = String(item.work_name || item.subject || item.description || "").toLowerCase();
        const proj = String(item.project_name || "").toLowerCase();

        return (
          ref.includes(query) ||
          vendor.includes(query) ||
          company.includes(query) ||
          desc.includes(query) ||
          proj.includes(query)
        );
      }
      return true;
    });
  };

  // Get active filtered data
  const getFilteredData = () => {
    switch (activeTab) {
      case "ION":
        return filterDataset(ionNotes, "ion_date");
      case "PO":
        return filterDataset(poList, "po_date");
      case "PAYMENT":
        return filterDataset(paymentList, "ion_date");
      case "RSP":
        return filterDataset(rspList, "rsp_date");
      default:
        return [];
    }
  };

  const filteredData = getFilteredData();

  // Set date filter presets
  const applyDatePreset = (preset) => {
    const today = new Date();
    let start = null;
    let end = today;

    switch (preset) {
      case "THIS_MONTH":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "LAST_30_DAYS":
        start = new Date();
        start.setDate(today.getDate() - 30);
        break;
      case "THIS_QUARTER":
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case "THIS_FINANCIAL_YEAR":
        const m = today.getMonth();
        const fyStart = m >= 3 ? today.getFullYear() : today.getFullYear() - 1;
        start = new Date(fyStart, 3, 1); // April 1st
        break;
      case "ALL_TIME":
      default:
        start = null;
        end = null;
        break;
    }

    setStartDate(start ? start.toISOString().split("T")[0] : "");
    setEndDate(end ? end.toISOString().split("T")[0] : "");
  };

  // Reset all search filters
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedVendor("");
    setSelectedCompany("");
    setSearchTerm("");
  };

  // Dynamic summary figures for active tab
  const getReportSummary = () => {
    const count = filteredData.length;
    if (activeTab === "ION") {
      const base = filteredData.reduce((s, i) => s + parseFloat(i.base_amount || 0), 0);
      const gst = filteredData.reduce((s, i) => s + parseFloat(i.gst_amount || 0), 0);
      const grand = filteredData.reduce((s, i) => s + parseFloat(i.grand_total || 0), 0);
      return { count, base, gst, grand };
    }
    if (activeTab === "PO") {
      const base = filteredData.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
      const gst = filteredData.reduce((s, i) => s + parseFloat(i.gst_amount || 0), 0);
      const grand = filteredData.reduce((s, i) => s + parseFloat(i.grand_total || 0), 0);
      return { count, base, gst, grand };
    }
    if (activeTab === "PAYMENT") {
      const budget = filteredData.reduce((s, i) => s + parseFloat(i.grand_total || i.amount || 0), 0);
      const paid = filteredData.reduce((s, i) => s + parseFloat(i.paid_amount || i.total_paid || 0), 0);
      const outstanding = Math.max(budget - paid, 0);
      const pct = budget ? (paid / budget) * 100 : 0;
      return { count, budget, paid, outstanding, pct };
    }
    if (activeTab === "RSP") {
      const payable = filteredData.reduce((s, i) => s + parseFloat(i.amount_payable || 0), 0);
      return { count, payable };
    }
    return { count };
  };

  const summary = getReportSummary();

  // Excel Exporter using xlsx (SheetJS)
  const exportToExcel = () => {
    let dataForSheet = [];
    const filename = `${activeTab}_Report_${new Date().toISOString().slice(0, 10)}.xlsx`;

    if (activeTab === "ION") {
      dataForSheet = filteredData.map((item) => ({
        "ION Ref No": item.ion_ref_no || "",
        "ION Date": formatDateDisplay(item.ion_date),
        "Company": item.company_name || "",
        "Vendor": item.vendor_name || "",
        "Work/Subject": item.work_name || item.subject || "",
        "Base Amount (INR)": parseFloat(item.base_amount || 0),
        "GST Amount (INR)": parseFloat(item.gst_amount || 0),
        "Grand Total (INR)": parseFloat(item.grand_total || 0),
      }));
      
      const totalBase = dataForSheet.reduce((sum, item) => sum + item["Base Amount (INR)"], 0);
      const totalGst = dataForSheet.reduce((sum, item) => sum + item["GST Amount (INR)"], 0);
      const totalGrand = dataForSheet.reduce((sum, item) => sum + item["Grand Total (INR)"], 0);
      
      dataForSheet.push({
        "ION Ref No": "TOTALS",
        "ION Date": "",
        "Company": "",
        "Vendor": "",
        "Work/Subject": `Total of ${filteredData.length} records`,
        "Base Amount (INR)": totalBase,
        "GST Amount (INR)": totalGst,
        "Grand Total (INR)": totalGrand,
      });
    } else if (activeTab === "PO") {
      dataForSheet = filteredData.map((item) => ({
        "PO Ref No": item.po_ref_no || "",
        "PO Date": formatDateDisplay(item.po_date),
        "Company": item.company_name || "",
        "Vendor": item.vendor_name || "",
        "Work Scope": item.description || "",
        "Base Amount (INR)": parseFloat(item.amount || 0),
        "GST Amount (INR)": parseFloat(item.gst_amount || 0),
        "Grand Total (INR)": parseFloat(item.grand_total || 0),
      }));
      
      const totalBase = dataForSheet.reduce((sum, item) => sum + item["Base Amount (INR)"], 0);
      const totalGst = dataForSheet.reduce((sum, item) => sum + item["GST Amount (INR)"], 0);
      const totalGrand = dataForSheet.reduce((sum, item) => sum + item["Grand Total (INR)"], 0);
      
      dataForSheet.push({
        "PO Ref No": "TOTALS",
        "PO Date": "",
        "Company": "",
        "Vendor": "",
        "Work Scope": `Total of ${filteredData.length} records`,
        "Base Amount (INR)": totalBase,
        "GST Amount (INR)": totalGst,
        "Grand Total (INR)": totalGrand,
      });
    } else if (activeTab === "PAYMENT") {
      dataForSheet = filteredData.map((item) => {
        const total = parseFloat(item.grand_total || item.amount || 0);
        const paid = parseFloat(item.paid_amount || item.total_paid || 0);
        const outstanding = Math.max(total - paid, 0);
        return {
          "ION Ref No": item.ion_ref_no || "",
          "ION Date": formatDateDisplay(item.ion_date),
          "Company": item.company_name || "",
          "Vendor": item.vendor_name || "",
          "Total Amount (INR)": total,
          "Paid Amount (INR)": paid,
          "Outstanding (INR)": outstanding,
          "Status": item.payment_status || "Prepared & Sent for Signing",
        };
      });

      const totalBudget = dataForSheet.reduce((sum, item) => sum + item["Total Amount (INR)"], 0);
      const totalPaid = dataForSheet.reduce((sum, item) => sum + item["Paid Amount (INR)"], 0);
      const totalOutstanding = dataForSheet.reduce((sum, item) => sum + item["Outstanding (INR)"], 0);

      dataForSheet.push({
        "ION Ref No": "TOTALS",
        "ION Date": "",
        "Company": "",
        "Vendor": `Total of ${filteredData.length} records`,
        "Total Amount (INR)": totalBudget,
        "Paid Amount (INR)": totalPaid,
        "Outstanding (INR)": totalOutstanding,
        "Status": "",
      });
    } else if (activeTab === "RSP") {
      dataForSheet = filteredData.map((item) => ({
        "RSP ID": `RSP/${item.rsp_id}`,
        "Slip Date": formatDateDisplay(item.rsp_date),
        "Company": item.company_name || "",
        "Vendor": item.vendor_name || "",
        "Cheque In Favour Of": item.cheque_name || "",
        "Project": item.project_name || "",
        "Invoice Ref": item.invoice_no || "",
        "Amount Payable (INR)": parseFloat(item.amount_payable || 0),
      }));

      const totalPayable = dataForSheet.reduce((sum, item) => sum + item["Amount Payable (INR)"], 0);
      
      dataForSheet.push({
        "RSP ID": "TOTALS",
        "Slip Date": "",
        "Company": "",
        "Vendor": "",
        "Cheque In Favour Of": "",
        "Project": `Total of ${filteredData.length} records`,
        "Invoice Ref": "",
        "Amount Payable (INR)": totalPayable,
      });
    }

    // Create empty worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([
      [`ION PAYMENT TRACKING SYSTEM - ${activeTab} OPERATIONAL LEDGER`],
      []
    ]);
    
    // Merge title cells across all columns
    const numCols = Object.keys(dataForSheet[0] || {}).length;
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: Math.max(numCols - 1, 4) } }
    ];

    // Add metadata block at A3
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    
    XLSX.utils.sheet_add_aoa(worksheet, [
      [`Report Context: ${activeTab} LEDGER`, "", "", "", `Generated On: ${formattedDate}`],
      [`Scope Count: ${dataForSheet.length - 1} records`, "", "", "", "Authorized User: Niya"]
    ], { origin: "A3" });

    // Add the table data starting at row 6 (A6)
    XLSX.utils.sheet_add_json(worksheet, dataForSheet, { origin: "A6" });
    
    // Auto-fit column widths
    const maxKeys = Object.keys(dataForSheet[0] || {});
    const colWidths = maxKeys.map(key => {
      let maxLen = key.length;
      dataForSheet.forEach(row => {
        const cellVal = String(row[key] || "");
        if (cellVal.length > maxLen) maxLen = cellVal.length;
      });
      return { wch: Math.max(maxLen + 3, 12) };
    });
    worksheet["!cols"] = colWidths;

    // Helper to convert column letters (e.g., A, B, AA) to 0-based column index
    const colLetterToIndex = (letter) => {
      let index = 0;
      for (let i = 0; i < letter.length; i++) {
        index = index * 26 + (letter.charCodeAt(i) - 64);
      }
      return index - 1;
    };

    // Apply colors and styling to cells
    Object.keys(worksheet).forEach((key) => {
      if (key.startsWith("!")) return;
      const match = key.match(/^([A-Z]+)(\d+)$/);
      if (!match) return;
      
      const colLetter = match[1];
      const row = parseInt(match[2], 10);
      const cell = worksheet[key];
      if (!cell) return;
      
      const colIndex = colLetterToIndex(colLetter);
      const colHeaders = dataForSheet[0] ? Object.keys(dataForSheet[0]) : [];
      const colHeader = colHeaders[colIndex] || "";
      
      // Determine default cell alignment
      let horizontalAlign = "left";
      if (typeof cell.v === "number") {
        horizontalAlign = "right";
      } else if (
        colHeader.toLowerCase().includes("date") ||
        colHeader.toLowerCase().includes("ref") ||
        colHeader.toLowerCase().includes("id") ||
        colHeader.toLowerCase().includes("status") ||
        colHeader.toLowerCase().includes("no")
      ) {
        horizontalAlign = "center";
      }
      
      const thinBorderColor = "D1D5DB"; // Gray-300
      const defaultBorder = {
        top: { style: "thin", color: { rgb: thinBorderColor } },
        bottom: { style: "thin", color: { rgb: thinBorderColor } },
        left: { style: "thin", color: { rgb: thinBorderColor } },
        right: { style: "thin", color: { rgb: thinBorderColor } }
      };

      if (row === 1 || row === 2) {
        // Navy merged title block
        cell.s = {
          fill: { patternType: "solid", fgColor: { rgb: "1E293B" } }
        };
        if (key === "A1") {
          cell.s.font = { name: "Calibri", sz: 14, bold: true, color: { rgb: "FFFFFF" } };
          cell.s.alignment = { horizontal: "center", vertical: "center" };
        }
      } else if (row === 3 || row === 4) {
        // Metadata text styling
        cell.s = {
          font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "475569" } },
          alignment: { horizontal: "left", vertical: "center" }
        };
      } else if (row === 5) {
        // Spacing row
        return;
      } else if (row === 6) {
        // Header styling (Slate-800, white text, bold, centered)
        cell.s = {
          fill: { patternType: "solid", fgColor: { rgb: "1E293B" } },
          font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: defaultBorder
        };
      } else {
        const dataIndex = row - 7;
        if (dataIndex >= 0 && dataIndex < dataForSheet.length) {
          const rowData = dataForSheet[dataIndex];
          const isTotalRow = Object.values(rowData).includes("TOTALS") || 
                             rowData["ION Ref No"] === "TOTALS" || 
                             rowData["PO Ref No"] === "TOTALS" || 
                             rowData["RSP ID"] === "TOTALS";
          
          if (isTotalRow) {
            // Totals Row Styling (Slate-200 background, bold text, double bottom border)
            cell.s = {
              fill: { patternType: "solid", fgColor: { rgb: "E2E8F0" } },
              font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "1E293B" } },
              alignment: { horizontal: horizontalAlign, vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "94A3B8" } }, // Slate-400
                bottom: { style: "double", color: { rgb: "1E293B" } }, // Slate-800 double bottom border
                left: { style: "thin", color: { rgb: "E2E8F0" } },
                right: { style: "thin", color: { rgb: "E2E8F0" } }
              }
            };
            if (typeof cell.v === "number") {
              cell.s.numFmt = "#,##0.00";
            }
          } else {
            // Data Row Styling
            let bgColor = "FFFFFF";
            
            if (activeTab === "PAYMENT") {
              const statusText = rowData["Status"] || "";
              const colorType = getPaymentStatusStyleFromText(statusText);
              
              if (colorType === "Green") bgColor = "D1FAE5"; // Emerald-100
              else if (colorType === "Yellow") bgColor = "FEF3C7"; // Amber-100
              else if (colorType === "Red") bgColor = "FEE2E2"; // Red-100
            } else {
              // Alternating zebra striping
              if (dataIndex % 2 === 1) {
                bgColor = "F9FAFB";
              }
            }
            
            cell.s = {
              fill: { patternType: "solid", fgColor: { rgb: bgColor } },
              font: { name: "Calibri", sz: 11, color: { rgb: "1E293B" } },
              alignment: { horizontal: horizontalAlign, vertical: "center" },
              border: defaultBorder
            };
            
            if (typeof cell.v === "number") {
              cell.s.numFmt = "#,##0.00";
            }
          }
        }
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${activeTab} Report`);
    XLSX.writeFile(workbook, filename);
  };

  // PDF Downloader using jspdf and jspdf-autotable
  const downloadReportPdf = () => {
    try {
      const doc = new jsPDF("l", "mm", "a4");
      
      // Clean separator border line
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.line(15, 34, 282, 34);
      
      // Top Left Header (Corporate Brand & document title)
      doc.setTextColor(79, 70, 229); // Brand Indigo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("ION PAYMENT TRACKING SYSTEM (IPTS)", 15, 12);
      
      doc.setTextColor(30, 41, 59); // Slate-800
      doc.setFontSize(15);
      doc.text(`${activeTab} OPERATIONAL LEDGER REPORT`, 15, 20);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139); // Slate-500
      const filterDetails = `Active Parameters: Vendor: ${selectedVendor || "All Vendors"} | Company: ${selectedCompany || "All Companies"}`;
      doc.text(filterDetails, 15, 28);
      
      // Top Right Header (Report Metadata Block)
      const printedDate = `Generated: ${new Date().toLocaleDateString("en-IN")} ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
      doc.text(printedDate, 210, 12);
      
      const dateRangeStr = `Reporting Dates: ${startDate || "ALL"} to ${endDate || "ALL"}`;
      doc.text(dateRangeStr, 210, 18);
      
      const recordsCountStr = `Dataset Size: ${filteredData.length} active records`;
      doc.text(recordsCountStr, 210, 24);
      
      const generatedByStr = "Authorized User: Niya";
      doc.text(generatedByStr, 210, 30);

      let tableHeaders = [];
      let tableRows = [];
      let columnStyles = {};

      if (activeTab === "ION") {
        tableHeaders = [["ION Ref", "ION Date", "Company", "Vendor", "Work Description", "Base Amt", "GST Amt", "Grand Total"]];
        tableRows = filteredData.map(item => [
          item.ion_ref_no || "",
          formatDateDisplay(item.ion_date),
          item.company_name || "",
          item.vendor_name || "",
          item.work_name || item.subject || "",
          `INR ${formatAmount(item.base_amount)}`,
          `INR ${formatAmount(item.gst_amount)}`,
          `INR ${formatAmount(item.grand_total)}`
        ]);
        
        const totalBase = filteredData.reduce((s, i) => s + parseFloat(i.base_amount || 0), 0);
        const totalGst = filteredData.reduce((s, i) => s + parseFloat(i.gst_amount || 0), 0);
        const totalGrand = filteredData.reduce((s, i) => s + parseFloat(i.grand_total || 0), 0);
        
        tableRows.push([
          "TOTALS",
          "",
          "",
          "",
          `Total of ${filteredData.length} records`,
          `INR ${formatAmount(totalBase)}`,
          `INR ${formatAmount(totalGst)}`,
          `INR ${formatAmount(totalGrand)}`
        ]);

        columnStyles = {
          0: { cellWidth: 25 },
          1: { cellWidth: 22, halign: "center" },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
          4: { cellWidth: 65 },
          5: { cellWidth: 25, halign: "right" },
          6: { cellWidth: 25, halign: "right" },
          7: { cellWidth: 28, halign: "right", fontStyle: "bold" }
        };
      } else if (activeTab === "PO") {
        tableHeaders = [["PO Ref", "PO Date", "Company", "Vendor", "Work Scope", "Base Amt", "GST Amt", "Grand Total"]];
        tableRows = filteredData.map(item => [
          item.po_ref_no || "",
          formatDateDisplay(item.po_date),
          item.company_name || "",
          item.vendor_name || "",
          item.description || "",
          `INR ${formatAmount(item.amount)}`,
          `INR ${formatAmount(item.gst_amount)}`,
          `INR ${formatAmount(item.grand_total)}`
        ]);

        const totalBase = filteredData.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
        const totalGst = filteredData.reduce((s, i) => s + parseFloat(i.gst_amount || 0), 0);
        const totalGrand = filteredData.reduce((s, i) => s + parseFloat(i.grand_total || 0), 0);
        
        tableRows.push([
          "TOTALS",
          "",
          "",
          "",
          `Total of ${filteredData.length} records`,
          `INR ${formatAmount(totalBase)}`,
          `INR ${formatAmount(totalGst)}`,
          `INR ${formatAmount(totalGrand)}`
        ]);

        columnStyles = {
          0: { cellWidth: 25 },
          1: { cellWidth: 22, halign: "center" },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
          4: { cellWidth: 65 },
          5: { cellWidth: 25, halign: "right" },
          6: { cellWidth: 25, halign: "right" },
          7: { cellWidth: 28, halign: "right", fontStyle: "bold" }
        };
      } else if (activeTab === "PAYMENT") {
        tableHeaders = [["ION Ref", "ION Date", "Company", "Vendor", "Total Budget", "Cleared Paid", "Outstanding", "Status"]];
        tableRows = filteredData.map(item => {
          const tot = parseFloat(item.grand_total || item.amount || 0);
          const paid = parseFloat(item.paid_amount || item.total_paid || 0);
          const out = Math.max(tot - paid, 0);
          return [
            item.ion_ref_no || "",
            formatDateDisplay(item.ion_date),
            item.company_name || "",
            item.vendor_name || "",
            `INR ${formatAmount(tot)}`,
            `INR ${formatAmount(paid)}`,
            `INR ${formatAmount(out)}`,
            item.payment_status || "Prepared & Sent for Signing"
          ];
        });

        const totalB = filteredData.reduce((s, i) => s + parseFloat(i.grand_total || i.amount || 0), 0);
        const totalP = filteredData.reduce((s, i) => s + parseFloat(i.paid_amount || i.total_paid || 0), 0);
        const totalO = filteredData.reduce((s, i) => s + Math.max((i.grand_total || i.amount || 0) - (i.paid_amount || i.total_paid || 0), 0), 0);

        tableRows.push([
          "TOTALS",
          "",
          "",
          `Total of ${filteredData.length} records`,
          `INR ${formatAmount(totalB)}`,
          `INR ${formatAmount(totalP)}`,
          `INR ${formatAmount(totalO)}`,
          ""
        ]);

        columnStyles = {
          0: { cellWidth: 25 },
          1: { cellWidth: 22, halign: "center" },
          2: { cellWidth: 42 },
          3: { cellWidth: 42 },
          4: { cellWidth: 28, halign: "right" },
          5: { cellWidth: 28, halign: "right" },
          6: { cellWidth: 28, halign: "right" },
          7: { cellWidth: 55, halign: "center" }
        };
      } else if (activeTab === "RSP") {
        tableHeaders = [["RSP ID", "Slip Date", "Company", "Vendor", "Cheque In Favour Of", "Project", "Invoice Ref", "Amt Payable"]];
        tableRows = filteredData.map(item => [
          `RSP/${item.rsp_id}`,
          formatDateDisplay(item.rsp_date),
          item.company_name || "",
          item.vendor_name || "",
          item.cheque_name || "",
          item.project_name || "",
          item.invoice_no || "",
          `INR ${formatAmount(item.amount_payable)}`
        ]);

        const totalP = filteredData.reduce((s, i) => s + parseFloat(i.amount_payable || 0), 0);
        
        tableRows.push([
          "TOTALS",
          "",
          "",
          "",
          "",
          `Total of ${filteredData.length} records`,
          "",
          `INR ${formatAmount(totalP)}`
        ]);

        columnStyles = {
          0: { cellWidth: 20 },
          1: { cellWidth: 22, halign: "center" },
          2: { cellWidth: 38 },
          3: { cellWidth: 38 },
          4: { cellWidth: 42 },
          5: { cellWidth: 42 },
          6: { cellWidth: 30 },
          7: { cellWidth: 38, halign: "right", fontStyle: "bold" }
        };
      }

      autoTable(doc, {
        startY: 40,
        head: tableHeaders,
        body: tableRows,
        theme: "striped",
        headStyles: {
          fillColor: [30, 41, 59], // Slate-800 (Navy slate)
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: "bold"
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [51, 65, 85], // Slate-700
          lineColor: [226, 232, 240] // Slate-200
        },
        columnStyles: columnStyles,
        didParseCell: (data) => {
          if (data.section === "body") {
            const firstCellVal = String(data.row.raw[0] || "");
            if (firstCellVal.includes("TOTALS")) {
              data.cell.styles.fillColor = [226, 232, 240]; // Slate-200
              data.cell.styles.fontStyle = "bold";
              data.cell.styles.textColor = [30, 41, 59];
              return;
            }

            if (activeTab === "PAYMENT") {
              const statusText = data.row.raw[7] || "Prepared & Sent for Signing";
              const colorType = getPaymentStatusStyleFromText(statusText);
              
              if (colorType === "Green") {
                data.cell.styles.fillColor = [209, 250, 229]; // Emerald-100
              } else if (colorType === "Yellow") {
                data.cell.styles.fillColor = [254, 243, 199]; // Amber-100
              } else if (colorType === "Red") {
                data.cell.styles.fillColor = [254, 226, 226]; // Red-100
              }
            }
          }
        },
        didDrawPage: (data) => {
          // Page Footers
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184); // Slate-400
          const footText = `Page ${data.pageNumber}`;
          doc.text(footText, 297 - 15 - doc.getTextWidth(footText), 210 - 10);
          doc.text("Generated by IPTS Internal Tracking Platform", 15, 210 - 10);
        },
        margin: { left: 15, right: 15 },
        styles: { overflow: "linebreak" }
      });

      doc.save(`${activeTab}_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      alert("Failed to export PDF: " + err.message);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bpms-page stagger-item" style={{ paddingBottom: "24px" }}>
      
      {/* Scope Style Injections */}
      <style>{`
        .reports-summary-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 8px;
        }
        .summary-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-sm);
          padding: 16px;
          box-shadow: var(--shadow-xs);
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.2s ease;
        }
        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
          border-color: var(--brand-light);
        }
        .summary-card__val {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }
        .summary-card__label {
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .preset-btn {
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .preset-btn:hover {
          background: var(--bg-color);
          border-color: var(--text-muted);
          color: var(--text-primary);
        }
        .tab-btn {
          padding: 12px 6px;
          font-size: 13.5px;
          font-weight: 700;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          position: relative;
        }
        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: var(--brand);
          transform: scaleX(0);
          transition: transform 0.2s ease;
        }
        .tab-btn--active {
          color: var(--brand) !important;
        }
        .tab-btn--active::after {
          transform: scaleX(1);
        }
        .tab-btn-icon {
          opacity: 0.7;
          transition: transform 0.2s;
        }
        .tab-btn:hover .tab-btn-icon {
          transform: translateY(-1px);
        }
        .tab-btn--active .tab-btn-icon {
          color: var(--brand);
          opacity: 1;
        }
        .filters-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          padding: 20px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 8px;
        }
      `}</style>

      {/* Header */}
      <div className="bpms-page-header" style={{ marginBottom: "8px" }}>
        <div>
          <h2 className="bpms-page-title">Operational Reports</h2>
          <div style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>
            Generate, filter, and export system ledgers, RSP slips, purchase orders, and office note records.
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="bpms-btn bpms-btn--ghost" onClick={handlePrint} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Printer size={14} /> Print Report
          </button>
          <button className="bpms-btn bpms-btn--ghost" onClick={downloadReportPdf} disabled={filteredData.length === 0} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FileDown size={14} /> Download PDF
          </button>
          <button className="bpms-btn bpms-btn--primary" onClick={exportToExcel} disabled={filteredData.length === 0} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Download size={14} /> Export Excel
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div style={{ display: "flex", borderBottom: "2px solid var(--border)", marginBottom: "16px", gap: "24px" }}>
        <button
          onClick={() => setActiveTab("ION")}
          className={`tab-btn ${activeTab === "ION" ? "tab-btn--active" : ""}`}
          style={{ color: "var(--text-muted)" }}
        >
          <FileText size={16} className="tab-btn-icon" /> All ION Notes
        </button>
        <button
          onClick={() => setActiveTab("PO")}
          className={`tab-btn ${activeTab === "PO" ? "tab-btn--active" : ""}`}
          style={{ color: "var(--text-muted)" }}
        >
          <ShoppingBag size={16} className="tab-btn-icon" /> Purchase Orders
        </button>
        <button
          onClick={() => setActiveTab("PAYMENT")}
          className={`tab-btn ${activeTab === "PAYMENT" ? "tab-btn--active" : ""}`}
          style={{ color: "var(--text-muted)" }}
        >
          <DollarSign size={16} className="tab-btn-icon" /> Payments & Ledgers
        </button>
        <button
          onClick={() => setActiveTab("RSP")}
          className={`tab-btn ${activeTab === "RSP" ? "tab-btn--active" : ""}`}
          style={{ color: "var(--text-muted)" }}
        >
          <CreditCard size={16} className="tab-btn-icon" /> RSP Slips
        </button>
      </div>

      {/* Unified Filters Block */}
      <div className="filters-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <h3 style={{ 
            fontSize: "12px", 
            fontWeight: "800", 
            color: "var(--text-muted)", 
            textTransform: "uppercase", 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            letterSpacing: "0.05em",
            margin: 0
          }}>
            <Filter size={14} style={{ color: "var(--brand)" }} /> Dynamic Filter Options
          </h3>
          
          {/* Filter Date Presets */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button className="preset-btn" onClick={() => applyDatePreset("THIS_MONTH")}>This Month</button>
            <button className="preset-btn" onClick={() => applyDatePreset("LAST_30_DAYS")}>Last 30 Days</button>
            <button className="preset-btn" onClick={() => applyDatePreset("THIS_QUARTER")}>This Quarter</button>
            <button className="preset-btn" onClick={() => applyDatePreset("THIS_FINANCIAL_YEAR")}>Financial Year</button>
            <button className="preset-btn" onClick={() => applyDatePreset("ALL_TIME")}>All Time</button>
          </div>
        </div>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", 
          gap: "16px",
          alignItems: "flex-end" 
        }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>From Date</label>
            <div style={{ position: "relative" }}>
              <Calendar size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="date"
                className="bpms-input"
                style={{ height: "38px", fontSize: "13px", paddingRight: "36px" }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>To Date</label>
            <div style={{ position: "relative" }}>
              <Calendar size={14} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="date"
                className="bpms-input"
                style={{ height: "38px", fontSize: "13px", paddingRight: "36px" }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Vendor Mapping</label>
            <select
              className="bpms-input"
              style={{ height: "38px", fontSize: "13px", appearance: "auto", cursor: "pointer", background: "var(--surface)" }}
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
            >
              <option value="">All Vendors</option>
              {(vendors || []).map((vendor) => (
                <option key={vendor.vendor_id} value={vendor.vendor_name}>{vendor.vendor_name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "11px", fontWeight: "800", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Company Entity</label>
            <select
              className="bpms-input"
              style={{ height: "38px", fontSize: "13px", appearance: "auto", cursor: "pointer", background: "var(--surface)" }}
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">All Companies</option>
              {uniqueCompanies.map((company, index) => (
                <option key={index} value={company}>{company}</option>
              ))}
            </select>
          </div>

          {/* Keyword search and reset */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Keyword search..."
                className="bpms-input"
                style={{ height: "38px", fontSize: "13px", paddingLeft: "34px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="bpms-btn" 
              style={{ height: "38px", padding: "0 14px", background: "var(--surface)" }} 
              onClick={resetFilters}
              title="Reset Filters"
            >
              <RefreshCw size={14} />
            </button>
          </div>

        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="reports-summary-bar">
        {activeTab === "ION" && (
          <>
            <div className="summary-card">
              <span className="summary-card__label">Filtered IONs</span>
              <span className="summary-card__val">{summary.count}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Base Value Sum</span>
              <span className="summary-card__val">₹ {formatAmount(summary.base)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">GST Taxes</span>
              <span className="summary-card__val">₹ {formatAmount(summary.gst)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Total Budget</span>
              <span className="summary-card__val" style={{ color: "var(--brand-dark)" }}>₹ {formatAmount(summary.grand)}</span>
            </div>
          </>
        )}

        {activeTab === "PO" && (
          <>
            <div className="summary-card">
              <span className="summary-card__label">Filtered POs</span>
              <span className="summary-card__val">{summary.count}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Base Cost Sum</span>
              <span className="summary-card__val">₹ {formatAmount(summary.base)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">GST Taxes</span>
              <span className="summary-card__val">₹ {formatAmount(summary.gst)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Grand PO Value</span>
              <span className="summary-card__val" style={{ color: "var(--brand-dark)" }}>₹ {formatAmount(summary.grand)}</span>
            </div>
          </>
        )}

        {activeTab === "PAYMENT" && (
          <>
            <div className="summary-card">
              <span className="summary-card__label">Filtered Payments</span>
              <span className="summary-card__val">{summary.count}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Overall Budget</span>
              <span className="summary-card__val">₹ {formatAmount(summary.budget)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Total Cleared</span>
              <span className="summary-card__val" style={{ color: "var(--success)" }}>₹ {formatAmount(summary.paid)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Outstanding Balance</span>
              <span className="summary-card__val" style={{ color: "var(--danger)" }}>₹ {formatAmount(summary.outstanding)}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Clearance Ratio</span>
              <span className="summary-card__val" style={{ color: "var(--brand)" }}>{summary.pct.toFixed(1)}%</span>
            </div>
          </>
        )}

        {activeTab === "RSP" && (
          <>
            <div className="summary-card">
              <span className="summary-card__label">Filtered RSP Slips</span>
              <span className="summary-card__val">{summary.count}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card__label">Total Amount Payable</span>
              <span className="summary-card__val" style={{ color: "var(--brand-dark)" }}>₹ {formatAmount(summary.payable)}</span>
            </div>
          </>
        )}
      </div>

      {/* Report Records Table Card */}
      <div className="bpms-table-card" id="report-table-area" style={{ flex: "none" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-secondary)" }}>
            Found <b>{filteredData.length}</b> records matching search filters
          </span>
        </div>

        <div className="bpms-table-scroll">
          <table className="bpms-table">
            
            {activeTab === "ION" && (
              <>
                <thead>
                  <tr>
                    <th className="bpms-th">ION Ref</th>
                    <th className="bpms-th">ION Date</th>
                    <th className="bpms-th">Company</th>
                    <th className="bpms-th">Vendor</th>
                    <th className="bpms-th">Work Description</th>
                    <th className="bpms-th" style={{ textAlign: "right" }}>Base Amount</th>
                    <th className="bpms-th" style={{ textAlign: "right" }}>GST Amount</th>
                    <th className="bpms-th" style={{ textAlign: "right" }}>Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.ion_note_id} className="table-row-hover">
                        <td className="bpms-td" style={{ fontWeight: "700" }}>ION/{item.ion_ref_no}</td>
                        <td className="bpms-td">{formatDateDisplay(item.ion_date)}</td>
                        <td className="bpms-td">{item.company_name}</td>
                        <td className="bpms-td" style={{ fontWeight: "600" }}>{item.vendor_name}</td>
                        <td className="bpms-td" style={{ color: "var(--text-secondary)" }}>{item.work_name || item.subject}</td>
                        <td className="bpms-td" style={{ textAlign: "right" }}>₹ {formatAmount(item.base_amount)}</td>
                        <td className="bpms-td" style={{ textAlign: "right" }}>₹ {formatAmount(item.gst_amount)}</td>
                        <td className="bpms-td" style={{ fontWeight: "800", color: "var(--text-primary)", textAlign: "right" }}>₹ {formatAmount(item.grand_total)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="bpms-td" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No matching ION records found.</td></tr>
                  )}
                </tbody>
              </>
            )}

            {activeTab === "PO" && (
              <>
                <thead>
                  <tr>
                    <th className="bpms-th">PO Ref</th>
                    <th className="bpms-th">PO Date</th>
                    <th className="bpms-th">Company</th>
                    <th className="bpms-th">Vendor</th>
                    <th className="bpms-th">Work Scope</th>
                    <th className="bpms-th" style={{ textAlign: "right" }}>Base Amount</th>
                    <th className="bpms-th" style={{ textAlign: "right" }}>GST Amount</th>
                    <th className="bpms-th" style={{ textAlign: "right" }}>Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.po_id} className="table-row-hover">
                        <td className="bpms-td" style={{ fontWeight: "700" }}>PO/{item.po_ref_no}</td>
                        <td className="bpms-td">{formatDateDisplay(item.po_date)}</td>
                        <td className="bpms-td">{item.company_name}</td>
                        <td className="bpms-td" style={{ fontWeight: "600" }}>{item.vendor_name}</td>
                        <td className="bpms-td" style={{ color: "var(--text-secondary)" }}>{item.description}</td>
                        <td className="bpms-td" style={{ textAlign: "right" }}>₹ {formatAmount(item.amount)}</td>
                        <td className="bpms-td" style={{ textAlign: "right" }}>₹ {formatAmount(item.gst_amount)}</td>
                        <td className="bpms-td" style={{ fontWeight: "800", color: "var(--text-primary)", textAlign: "right" }}>₹ {formatAmount(item.grand_total)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="bpms-td" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No matching PO records found.</td></tr>
                  )}
                </tbody>
              </>
            )}

            {activeTab === "PAYMENT" && (
              <>
                <thead>
                  <tr>
                    <th className="bpms-th">ION Ref</th>
                    <th className="bpms-th">ION Date</th>
                    <th className="bpms-th">Company</th>
                    <th className="bpms-th">Vendor</th>
                    <th className="bpms-th" style={{ textAlign: "right" }}>Total Amount</th>
                    <th className="bpms-th" style={{ textAlign: "right", color: "var(--success)" }}>Cleared Amount</th>
                    <th className="bpms-th" style={{ textAlign: "right", color: "var(--danger)" }}>Outstanding</th>
                    <th className="bpms-th" style={{ textAlign: "right" }}>Status Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => {
                      const totalVal = item.grand_total || item.amount || 0;
                      const paidVal = item.paid_amount || item.total_paid || 0;
                      const outstanding = Math.max(totalVal - paidVal, 0);
                      return (
                        <tr key={item.ion_note_id} className="table-row-hover">
                          <td className="bpms-td" style={{ fontWeight: "700" }}>ION/{item.ion_ref_no}</td>
                          <td className="bpms-td">{formatDateDisplay(item.ion_date)}</td>
                          <td className="bpms-td">{item.company_name}</td>
                          <td className="bpms-td" style={{ fontWeight: "600" }}>{item.vendor_name}</td>
                          <td className="bpms-td" style={{ textAlign: "right", fontWeight: "700" }}>₹ {formatAmount(totalVal)}</td>
                          <td className="bpms-td" style={{ color: "var(--success)", textAlign: "right", fontWeight: "700" }}>₹ {formatAmount(paidVal)}</td>
                          <td className="bpms-td" style={{ color: "var(--danger)", textAlign: "right", fontWeight: "800" }}>₹ {formatAmount(outstanding)}</td>
                          <td className="bpms-td" style={{ textAlign: "right" }}>
                            <select
                              value={item.payment_status || "Prepared & Sent for Signing"}
                              onChange={(e) => changePaymentStatus(item.ion_ref_no || item.ion_no, e.target.value)}
                              className="bpms-count-pill"
                              style={{
                                ...getStatusStyle(getPaymentStatusStyleFromText(item.payment_status)),
                                border: "none",
                                fontWeight: "700",
                                fontSize: "11.5px",
                                cursor: "pointer",
                                padding: "6px 12px",
                                outline: "none",
                                appearance: "auto",
                                borderRadius: "20px",
                                boxShadow: "var(--shadow-xs)"
                              }}
                            >
                              <option value="Prepared & Sent for Signing" style={{ background: "#ffffff", color: "#334155" }}>Prepared & Sent for Signing</option>
                              <option value="Signed & Payment Pending" style={{ background: "var(--danger-faint)", color: "var(--danger)" }}>Signed & Payment Pending</option>
                              <option value="Part Payment" style={{ background: "var(--warning-faint)", color: "var(--warning)" }}>Part Payment</option>
                              <option value="Payment Cleared" style={{ background: "var(--success-faint)", color: "var(--success)" }}>Payment Cleared</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan="8" className="bpms-td" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No matching payment records found.</td></tr>
                  )}
                </tbody>
              </>
            )}

            {activeTab === "RSP" && (
              <>
                <thead>
                  <tr>
                    <th className="bpms-th">RSP ID</th>
                    <th className="bpms-th">Slip Date</th>
                    <th className="bpms-th">Company</th>
                    <th className="bpms-th">Vendor</th>
                    <th className="bpms-th">Cheque In Favour</th>
                    <th className="bpms-th">Project Name</th>
                    <th className="bpms-th">Invoice / Ref No</th>
                    <th className="bpms-th" style={{ textAlign: "right" }}>Amount Payable</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.rsp_id} className="table-row-hover">
                        <td className="bpms-td" style={{ fontWeight: "700" }}>RSP/{item.rsp_id}</td>
                        <td className="bpms-td">{formatDateDisplay(item.rsp_date)}</td>
                        <td className="bpms-td">{item.company_name}</td>
                        <td className="bpms-td" style={{ fontWeight: "600" }}>{item.vendor_name}</td>
                        <td className="bpms-td">{item.cheque_name}</td>
                        <td className="bpms-td">{item.project_name}</td>
                        <td className="bpms-td" style={{ color: "var(--text-secondary)" }}>{item.invoice_no}</td>
                        <td className="bpms-td" style={{ fontWeight: "800", color: "var(--text-primary)", textAlign: "right" }}>₹ {formatAmount(item.amount_payable)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="bpms-td" style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>No matching RSP records found.</td></tr>
                  )}
                </tbody>
              </>
            )}
          </table>
        </div>

        {/* Footer Statistics Summary */}
        <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", borderTop: "1px solid var(--border-light)", fontSize: "12px", color: "var(--text-secondary)" }}>
          <div>Showing <b>{filteredData.length}</b> records</div>
          {activeTab === "ION" && (
            <div>Total Allocated Budget: <b style={{ color: "var(--text-primary)", fontSize: "13px" }}>₹ {formatAmount(summary.grand)}</b></div>
          )}
          {activeTab === "PO" && (
            <div>Total Purchase Orders Sum: <b style={{ color: "var(--text-primary)", fontSize: "13px" }}>₹ {formatAmount(summary.grand)}</b></div>
          )}
          {activeTab === "PAYMENT" && (
            <div style={{ display: "flex", gap: "16px" }}>
              <span>Total Budget: <b>₹ {formatAmount(summary.budget)}</b></span>
              <span>Total Outstanding: <b style={{ color: "var(--danger)" }}>₹ {formatAmount(summary.outstanding)}</b></span>
            </div>
          )}
          {activeTab === "RSP" && (
            <div>Total RSP Amount: <b style={{ color: "var(--text-primary)", fontSize: "13px" }}>₹ {formatAmount(summary.payable)}</b></div>
          )}
        </div>

      </div>
    </div>
  );
}
