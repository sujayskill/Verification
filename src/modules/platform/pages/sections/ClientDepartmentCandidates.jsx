import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/VerificationRequests.css";

export default function ClientDepartmentCandidates() {
  const { orgId, deptId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAdmin = role === "VENDOR_ADMIN";

  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await api.get(
      `/vendor/platform/candidates/by-department?orgId=${orgId}&deptId=${deptId}&q=${search}`,
    );
    setData(Array.isArray(res) ? res : []);
    console.log(res);
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;

    try {
      await api.delete(`/vendor/client/candidates/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, deptId]);

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="vr-page">
      <button
        onClick={() => navigate(`/platform/clients/${orgId}/departments`)}
      >
        ← Back
      </button>

      <h2>Candidates</h2>

      <input
        placeholder="Search candidate..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="vr-list">
        <div className="vr-list">
          {data.map((c) => (
            <div key={c.id} className="candidate-card row">
              <div
                className="info"
                onClick={() =>
                  navigate(`/platform/clients/candidateDetails/${c.id}`)
                }
              >
                <h4
                  dangerouslySetInnerHTML={{
                    __html: highlight(`${c.firstName} ${c.lastName}`),
                  }}
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: highlight(c.email),
                  }}
                />
                <span className={`status ${c.status?.toLowerCase()}`}>
                  {c.status}
                </span>
              </div>

              {/* ✅ ONLY ADMIN */}
              {isAdmin && (
                <div className="actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/platform/clients/editCandidateDetails/${c.id}`,
                      );
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCandidate(c.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
