<div className="ion-preview">
  <h2>ION Note Preview</h2>

  <button
    className="back-btn"
    onClick={() => setShowIONPreview(false)}
  >
    Back
  </button>

  <div className="ion-document">
    <h2>BAASHYAAM VENTURES PVT LTD</h2>
    <h3>INTER OFFICE NOTE</h3>

    <div className="ion-header">
      <div>
        <strong>From:</strong><br />
        Mr. Manu Jacob Sabu
      </div>

      <div>
        <strong>Date:</strong>{" "}
        {previewData?.ion_date || ""}
      </div>
    </div>

    <div className="ion-header">
      <div>
        <strong>Ref:</strong>{" "}
        ION/{previewData?.ion_ref_no || ""}
      </div>

      <div>
        <strong>To:</strong> MD & DIRECTOR
      </div>
    </div>

    <div className="ion-header">
      <div>
        <strong>Sub:</strong>{" "}
        {previewData?.subject || ""}
      </div>
    </div>

    <br />

    <p>
      Dear Sir,
    </p>

    <p>
      With reference to the comprehensive invoice given by{" "}
      <b>{previewData?.vendor_name || ""}</b>
      {" "}regarding{" "}
      <b>{previewData?.work_name || ""}</b>
      {" "}for the project{" "}
      <b>{previewData?.project_name || ""}</b>,
      details are given below.
    </p>

    <table className="preview-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            {previewData?.work_name || ""}
          </td>
          <td>
            ₹ {previewData?.base_amount || 0}
          </td>
        </tr>

        <tr>
          <td><b>Sub Total</b></td>
          <td>
            ₹ {previewData?.base_amount || 0}
          </td>
        </tr>

        <tr>
          <td><b>GST @ 18%</b></td>
          <td>
            ₹ {previewData?.gst_amount || 0}
          </td>
        </tr>

        <tr>
          <td><b>Grand Total</b></td>
          <td>
            ₹ {previewData?.grand_total || 0}
          </td>
        </tr>
      </tbody>
    </table>

    <br />

    <p>
      Request to accord your approval.
    </p>

    <br /><br />

    <div className="approval-section">
      <div>Manu Jacob Sabu</div>
      <div>AGM - Marketing</div>
      <div>VP-Finance</div>
      <div>AY(DIR)</div>
      <div>BY(DIR)</div>
      <div>MD</div>
    </div>

    <br />

    <pre style={{ display: "none" }}>
      {JSON.stringify(previewData, null, 2)}
    </pre>
  </div>
</div>