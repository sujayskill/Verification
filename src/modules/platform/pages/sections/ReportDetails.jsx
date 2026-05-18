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
      console.log(res);
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
    <div className="report-page">

      {/* =========================
       STICKY HEADER
    ========================= */}
      <div className="report-sticky-header">

        <div className="report-header-left">

          <div>
            <h2>Verification Report</h2>

            <p>
              Candidate verification report and audit summary
            </p>
          </div>

        </div>

        <div className="report-header-right">

          <div className="candidate-chip">
            {data.candidateName}
          </div>

          <span
            className={`status-badge ${data.status?.toLowerCase()}`}
          >
            {data.status}
          </span>

          <button
            className="download-btn"
            onClick={downloadPDF}
          >
            ⬇ Download PDF
          </button>

        </div>
      </div>

      {/* =========================
       REPORT CONTENT
    ========================= */}

      <div className="report-content">

        <div
          ref={reportRef}
          className="report-glass-card"
        >

          {/* TOP SUMMARY */}
          <div className="report-top-section">

            <div>

              <h1>{data.candidateName}</h1>

              <p className="subtitle">
                Background Verification Report
              </p>

            </div>

            <div
              className={`risk-badge ${data.riskLevel?.toLowerCase()}`}
            >
              {data.riskLevel || "LOW"} RISK
            </div>

          </div>

          {/* =========================
           SUMMARY
        ========================= */}

          <div className="report-section">

            <div className="section-header">
              <h3>Verification Summary</h3>
            </div>

            <div className="summary-grid">

              <div className="summary-card">
                <label>Status</label>

                <p>{data.status}</p>
              </div>

              <div className="summary-card">
                <label>Risk Level</label>

                <p>{data.riskLevel}</p>
              </div>

              <div className="summary-card">
                <label>Organization</label>

                <p>
                  {data.organizationName}
                </p>
              </div>

              <div className="summary-card">
                <label>Candidate</label>

                <p>{data.candidateName}</p>
              </div>

            </div>
          </div>

          {/* =========================
           CHECKS
        ========================= */}

          <div className="report-section">

            <div className="section-header">
              <h3>Verification Checks</h3>
            </div>

            <div className="checks-grid">

              <div className="check-card">
                <div className="check-top">

                  <h4>Basic Check</h4>

                  <span
                    className={`mini-status ${(report.basicCheck || "").toLowerCase()}`}
                  >
                    {report.basicCheck || "N/A"}
                  </span>

                </div>

                <p>
                  Identity and profile verification status.
                </p>
              </div>

              <div className="check-card">

                <div className="check-top">

                  <h4>Address Check</h4>

                  <span
                    className={`mini-status ${(report.addressCheck || "").toLowerCase()}`}
                  >
                    {report.addressCheck || "N/A"}
                  </span>

                </div>

                <p>
                  Address and location verification review.
                </p>
              </div>

            </div>
          </div>

          {/* =========================
           EDUCATION
        ========================= */}

          <div className="report-section">

            <div className="section-header">
              <h3>Education Verification</h3>
            </div>

            <div className="stack-layout">

              {report.educationChecks?.length > 0 ? (

                report.educationChecks.map((e, i) => (

                  <div
                    key={i}
                    className="verification-item-card"
                  >

                    <div className="item-header">

                      <div>
                        <h4>{e.name}</h4>

                        <p>
                          Education credential verification
                        </p>
                      </div>

                      <span
                        className={`mini-status ${(e.status || "").toLowerCase()}`}
                      >
                        {e.status}
                      </span>

                    </div>

                    <div className="remarks-box">
                      {e.remarks || "No remarks added"}
                    </div>

                  </div>
                ))

              ) : (

                <div className="empty-card">
                  No education verification data found.
                </div>
              )}

            </div>
          </div>

          {/* =========================
           EXPERIENCE
        ========================= */}

          <div className="report-section">

            <div className="section-header">
              <h3>Experience Verification</h3>
            </div>

            <div className="stack-layout">

              {report.experienceChecks?.length > 0 ? (

                report.experienceChecks.map((e, i) => (

                  <div
                    key={i}
                    className="verification-item-card"
                  >

                    <div className="item-header">

                      <div>

                        <h4>{e.name}</h4>

                        <p>
                          Employment verification status
                        </p>

                      </div>

                      <span
                        className={`mini-status ${(e.status || "").toLowerCase()}`}
                      >
                        {e.status}
                      </span>

                    </div>

                    <div className="remarks-box">
                      {e.remarks || "No remarks added"}
                    </div>

                  </div>
                ))

              ) : (

                <div className="empty-card">
                  No experience verification data found.
                </div>
              )}

            </div>
          </div>

          {/* =========================
           FINAL REMARKS
        ========================= */}

          <div className="report-section">

            <div className="section-header">
              <h3>Final Remarks</h3>
            </div>

            <div className="final-remarks-card">

              <p>
                {data.finalRemarks ||
                  "No final remarks added."}
              </p>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
