import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ClientCandidates.css";

export default function ClientDepartmentCandidates() {
  const { orgId, deptId } = useParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const isAdmin = role === "VENDOR_ADMIN";
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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
    const handleClickOutside = () => {
      setMenuOpen(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [search, deptId]);

  const highlight = (text) => {
    if (!search) return text;
    return text.replace(new RegExp(`(${search})`, "gi"), "<mark>$1</mark>");
  };

  return (
    <div className="Client-Candidates-page">
      {/* HEADER */}
      <div className="candidate-header">
        {/* LEFT */}
        <div className="header-left">
          <button
            className="back-btn"
            onClick={() => navigate(`/platform/clients/${orgId}/departments`)}
          >
            ← Back
          </button>

          <h2>Candidates</h2>

          <p>{data.length} candidates</p>
        </div>

        {/* RIGHT */}
        <div className="candidate-actions">
          <input
            placeholder="Search candidate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="vr-list">
        {data.map((c) => (
          <div
            key={c.id}
            className="candidate-card clickable-row"
            onClick={() =>
              navigate(`/platform/clients/candidateDetails/${c.id}`)
            }
          >
            {/* LEFT */}
            <div className="info">
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

            {/* MENU */}
            {isAdmin && (
              <div
                className="candidate-menu"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="menu-icon"
                  onClick={() =>
                    setMenuOpen(menuOpen === c.id ? null : c.id)
                  }
                >
                  ⋮
                </span>

                {menuOpen === c.id && (
                  <div className="candidate-menu-dropdown">
                    <button
                      onClick={() =>
                        navigate(
                          `/platform/clients/editCandidateDetails/${c.id}`
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="danger-item"
                      onClick={() => {
                        setSelectedCandidate(c);

                        setShowDeleteModal(true);

                        setMenuOpen(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div
          className="client-modal-overlay"
          onClick={() => {
            setShowDeleteModal(false);

            setSelectedCandidate(null);
          }}
        >
          <div
            className="client-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Candidate</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {selectedCandidate?.firstName}{" "}
                {selectedCandidate?.lastName}
              </strong>
              ?
            </p>

            <div className="client-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);

                  setSelectedCandidate(null);
                }}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={deleteCandidate}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
