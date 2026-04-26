import { useEffect, useState, useRef } from "react";
import { api } from "../../../../services/api/Api";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "../../styles/ReportDetails.css";

export default function ReportDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const reportRef = useRef(); // 🔥 important

  useEffect(() => {
    api.get(`/platform/verifications/${id}`).then((res) => {
      setData(res.verification);
    });
  }, [id]);

  if (!data) return <p>Loading...</p>;

  const report = JSON.parse(data.reportData || "{}");

  // 🔥 DOWNLOAD FUNCTION
  const downloadPDF = () => {
    const element = reportRef.current;

    html2pdf()
      .set({
        margin: 10,
        filename: `${data.candidateName}_BGV_Report.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4" },
      })
      .from(element)
      .save();
  };

  return (
    <div className="report-container">
      {/* 🔥 DOWNLOAD BUTTON */}
      <div className="report-header">
        <button className="download-btn" onClick={downloadPDF}>
          ⬇ Download PDF
        </button>
      </div>

      {/* 🔥 REPORT CONTENT */}
      <div ref={reportRef} className="report-card">
        <h2>{data.candidateName}</h2>

        {/* 🔹 SUMMARY */}
        <div className="section">
          <h3>Verification Summary</h3>
          <p>
            Status: <b>{data.status}</b>
          </p>
          <p>
            Risk Level: <b>{data.riskLevel}</b>
          </p>
        </div>

        {/* 🔹 CHECKS */}
        <div className="section">
          <h3>Checks</h3>
          <p>Basic: {report.basicCheck}</p>
          <p>Address: {report.addressCheck}</p>
        </div>

        {/* 🔹 EDUCATION */}
        <div className="section">
          <h3>Education</h3>
          {report.educationChecks?.map((e, i) => (
            <div key={i} className="sub-card">
              <p>
                <b>{e.name}</b>
              </p>
              <p>Status: {e.status}</p>
              <p>{e.remarks}</p>
            </div>
          ))}
        </div>

        {/* 🔹 FINAL */}
        <div className="section">
          <h3>Final Remarks</h3>
          <p>{data.finalRemarks}</p>
        </div>
      </div>
    </div>
  );
}
