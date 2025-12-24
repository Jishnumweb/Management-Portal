"use client";

export default function InvoicePrint({ data }) {
  return (
    <div
      id="invoice-pdf"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm",
        background: "#ffffff",
        color: "#000000",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", margin: 0, fontWeight: "bold" }}>
            {data?.invoiceNumber ? "INVOICE" : "QUOTE"}
          </h1>
          <p style={{ fontSize: "14px", marginTop: "6px" }}>
            #{data?.invoiceNumber || data?.quoteNumber}
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>
            Vydurya
          </h3>
          <p style={{ fontSize: "14px", margin: 0 }}>www.vydurya.pro</p>
          <p style={{ fontSize: "14px", margin: 0 }}>+91 9745 84 9090</p>
          <p style={{ fontSize: "14px", margin: 0 }}>info@vydurya.pro</p>
        </div>
      </div>

      {/* BILLING SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
            Invoiced To
          </h4>
          <p style={{ fontSize: "14px", margin: 0 }}>{data?.client}</p>
          <p style={{ fontSize: "14px", margin: 0 }}>Client Address</p>
        </div>

        <div style={{ textAlign: "right" }}>
          <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
            {data?.dueDate ? "Due Date" : "Expiry Date"}
          </h4>
          <p style={{ fontSize: "14px", margin: 0 }}>
            {data?.dueDate || data?.expiryDate}
          </p>

          <h4
            style={{ margin: "10px 0 0 0", fontSize: "16px", fontWeight: 600 }}
          >
            Status
          </h4>
          <p style={{ fontSize: "14px", margin: 0 }}>
            {data?.status?.toUpperCase()}
          </p>
        </div>
      </div>

      {/* ITEMS */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                textAlign: "left",
              }}
            >
              Description
            </th>
            <th style={{ border: "1px solid #ddd", padding: "10px" }}>
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
              {data?.description}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "10px" }}>
              ₹ {data?.amount?.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>

      {/* TOTAL SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <div style={{ width: "250px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <b>Total</b>
            <b>₹ {data?.amount?.toLocaleString()}</b>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div>
        <h4 style={{ fontSize: "16px", fontWeight: "600" }}>Payment Details</h4>
        <p style={{ fontSize: "14px", margin: 0 }}>Bank: HDFC Bank</p>
        <p style={{ fontSize: "14px", margin: 0 }}>A/C No: 123456789</p>
        <p style={{ fontSize: "14px", margin: 0 }}>IFSC: HDFC0001234</p>
      </div>

      <p style={{ textAlign: "center", marginTop: "30px", fontSize: "14px" }}>
        Thank you for your business!
      </p>
    </div>
  );
}
