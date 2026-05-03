import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ClientCandidateDetails.css";

export default function VendorCandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get(`/vendor/client/candidates/${id}`)
      .then((res) => {
        // 🔥 Normalize all fields
        setData({
          ...res,
          currentAddress: res.currentAddress || {},
          permanentAddress: res.permanentAddress || {},
          educations: res.educations || [],
          experiences: res.experiences || [],
          documents: res.documents || [],
        });
      })
      .catch(console.error);
  }, [id]);

  if (!data) return <p>Loading...</p>;

  const safe = (val) => val || "-";

  return (
    <div className="candidate-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>
        {safe(data.firstName)} {safe(data.lastName)}
      </h2>

      {/* 🔹 BASIC INFO */}
      <div className="card">
        <h3>Basic Details</h3>
        <p>
          <b>Email:</b> {safe(data.email)}
        </p>
        <p>
          <b>Phone:</b> {safe(data.phone)}
        </p>
        <p>
          <b>DOB:</b> {safe(data.dob)}
        </p>
        <p>
          <b>Status:</b> {safe(data.status)}
        </p>
        <p>
          <b>Created At:</b> {safe(data.createdAt)}
        </p>
        <p>
          <b>Department ID:</b> {data.department?.id || "-"}
        </p>
      </div>

      {/* 🔹 CURRENT ADDRESS */}
      <div className="card">
        <h3>Current Address</h3>
        <p>
          <b>Street:</b> {safe(data.currentAddress.street)}
        </p>
        <p>
          <b>City:</b> {safe(data.currentAddress.city)}
        </p>
        <p>
          <b>State:</b> {safe(data.currentAddress.state)}
        </p>
        <p>
          <b>Zip:</b> {safe(data.currentAddress.zipCode)}
        </p>
      </div>

      {/* 🔹 PERMANENT ADDRESS */}
      <div className="card">
        <h3>Permanent Address</h3>
        <p>
          <b>Street:</b> {safe(data.permanentAddress.street)}
        </p>
        <p>
          <b>City:</b> {safe(data.permanentAddress.city)}
        </p>
        <p>
          <b>State:</b> {safe(data.permanentAddress.state)}
        </p>
        <p>
          <b>Zip:</b> {safe(data.permanentAddress.zipCode)}
        </p>
      </div>

      {/* 🔹 EDUCATION */}
      <div className="card">
        <h3>Education</h3>
        {data.educations.length === 0 ? (
          <p>-</p>
        ) : (
          data.educations.map((e, i) => (
            <div key={i} className="sub-card">
              <p>
                <b>Degree:</b> {safe(e.degree)}
              </p>
              <p>
                <b>Institution:</b> {safe(e.institution)}
              </p>
              <p>
                <b>Year:</b> {safe(e.courseStartDate)}
              </p>
              <p>
                <b>Year:</b> {safe(e.courseEndDate)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 🔹 EXPERIENCE */}
      <div className="card">
        <h3>Experience</h3>
        {data.experiences.length === 0 ? (
          <p>-</p>
        ) : (
          data.experiences.map((e, i) => (
            <div key={i} className="sub-card">
              <p>
                <b>Company:</b> {safe(e.companyName)}
              </p>
              <p>
                <b>Role:</b> {safe(e.role)}
              </p>
              <p>
                <b>Start:</b> {safe(e.startDate)}
              </p>
              <p>
                <b>End:</b> {safe(e.endDate)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 🔹 DOCUMENTS */}
      <div className="card">
        <h3>Documents</h3>
        {data.documents.length === 0 ? (
          <p>-</p>
        ) : (
          data.documents.map((doc, i) => (
            <div key={i} className="sub-card">
              <p>
                <b>Type:</b> {safe(doc.type)}
              </p>
              <p>
                <b>URL:</b> {safe(doc.url)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
