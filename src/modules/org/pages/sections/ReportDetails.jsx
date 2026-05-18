import { useEffect, useState, useRef } from "react";
import { api } from "../../../../services/api/Api";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { getBasePath } from "../../../../utils/PathHelper";
import { useNavigate } from "react-router-dom";
import "../../styles/ReportDetails.css";

export default function OrgReportDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [verification, setVerification] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const base = getBasePath();

  const reportRef = useRef();

  useEffect(() => {
    api.get(`/org/verifications/${id}`).then((res) => {
      setVerification(res.verification);
      setCandidate(res.candidate);
    });
  }, [id]);

  if (!verification || !candidate) return <p>Loading...</p>;

  // 🔥 SAFE PARSE
  const report = verification.reportData
    ? JSON.parse(verification.reportData)
    : {};

  const downloadPDF = () => {
    html2pdf().from(reportRef.current).save();
  };

  return (
    <div className="report-container">
      {/* <button onClick={() =>  navigate(`${base}/reports/${d.id}`)}>
        ← Back to Candidates
      </button> */}

      <button className="back-btn" onClick={() => navigate(`${base}/reports`)}>
        ← Back
      </button>

      {/* DOWNLOAD */}
      <div className="report-header">
        <button className="download-btn" onClick={downloadPDF}>
          ⬇ Download PDF
        </button>
      </div>

      {/* REPORT */}
      <div ref={reportRef} className="report-card">
        <h2>
          {candidate.firstName} {candidate.lastName}
        </h2>

        {/* 🔹 SUMMARY */}
        <div className="section">
          <h3>Verification Summary</h3>
          <p>
            Status: <b>{verification.status}</b>
          </p>
          <p>
            Risk Level: <b>{verification.riskLevel || "N/A"}</b>
          </p>
        </div>

        {/* 🔹 BASIC CHECKS */}
        <div className="section">
          <h3>Check Results</h3>
          <p>Basic: {report.basicCheck || "N/A"}</p>
          <p>Address: {report.addressCheck || "N/A"}</p>
        </div>

        {/* 🔹 EDUCATION */}
        <div className="section">
          <h3>Education Verification</h3>

          {report.educationChecks?.length > 0 ? (
            report.educationChecks.map((e, i) => (
              <div key={i} className="sub-card">
                <p>
                  <b>{e.name}</b>
                </p>
                <p>Status: {e.status}</p>
                <p>{e.remarks}</p>
              </div>
            ))
          ) : (
            <p>No education verification</p>
          )}
        </div>

        {/* 🔹 FINAL */}
        <div className="section">
          <h3>Final Remarks</h3>
          <p>{verification.finalRemarks || "No remarks"}</p>
        </div>
      </div>
    </div>
  );
}
