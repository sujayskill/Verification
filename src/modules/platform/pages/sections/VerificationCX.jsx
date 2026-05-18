import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/VerificationCX.css";

export default function VerificationCX() {
  const { orgId } = useParams();

  const navigate = useNavigate();

  const [notifications, setNotifications] =
    useState({});

  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");

  const [menuOpen, setMenuOpen] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedVerification, setSelectedVerification] =
    useState(null);

  const [confirmText, setConfirmText] =
    useState("");

  /* =========================
     FETCH DATA
  ========================= */

  const fetchData = async () => {
    try {
      const res = await api.get(
        `/vendor/platform/verifications/by-client?orgId=${orgId}&q=${search}`,
      );

      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     FETCH NOTIFICATIONS
  ========================= */

  const fetchVerificationNotifications =
    async () => {
      try {
        const data = await api.get(
          `/vendor/notifications/count/verifications?orgId=${orgId}`,
        );

        if (
          !data ||
          Object.keys(data).length === 0
        )
          return;

        const normalized = {};

        Object.keys(data).forEach((key) => {
          normalized[String(key)] = data[key];
        });

        setNotifications(normalized);
      } catch (err) {
        console.error(err);
      }
    };

  useEffect(() => {
    fetchVerificationNotifications();
  }, [orgId]);

  useEffect(() => {
    const interval = setInterval(
      fetchVerificationNotifications,
      10000,
    );

    return () => clearInterval(interval);
  }, [orgId]);

  useEffect(() => {
    if (orgId) fetchData();
  }, [search, orgId]);

  /* =========================
     CLOSE MENU
  ========================= */

  useEffect(() => {
    const closeMenu = () => {
      setMenuOpen(null);
    };

    document.addEventListener(
      "click",
      closeMenu,
    );

    return () => {
      document.removeEventListener(
        "click",
        closeMenu,
      );
    };
  }, []);

  /* =========================
     HIGHLIGHT
  ========================= */

  const escapeRegex = (text) =>
    text.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  const highlight = (text) => {
    if (!search || !text) return text;

    const safeSearch =
      escapeRegex(search);

    const regex = new RegExp(
      `(${safeSearch})`,
      "gi",
    );

    return text.replace(
      regex,
      "<mark>$1</mark>",
    );
  };

  /* =========================
     SLA
  ========================= */

  const getSlaDetails = (v) => {
    if (!v.createdAt)
      return {
        class: "sla-normal",
        label: "🟢 On Time",
      };

    const created = new Date(v.createdAt);

    const now = new Date();

    const diffDays =
      (now - created) /
      (1000 * 60 * 60 * 24);

    if (
      v.slaBreached ||
      diffDays > 7
    ) {
      return {
        class: "sla-breached",
        label: "🔥 SLA Breached",
      };
    }

    if (diffDays >= 5) {
      return {
        class: "sla-warning",
        label: "🟡 At Risk",
      };
    }

    return {
      class: "sla-normal",
      label: "🟢 On Time",
    };
  };

  /* =========================
     DELETE VERIFICATION
  ========================= */

  const deleteVerification =
    async () => {
      if (
        confirmText !== "CONFIRM"
      ) {
        alert(
          "Please type CONFIRM to delete",
        );
        return;
      }

      try {
        await api.delete(
          `/vendor/verifications/${selectedVerification.id}`,
        );

        setShowDeleteModal(false);

        setSelectedVerification(null);

        setConfirmText("");

        fetchData();
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <div className="vrc-page">
      {/* HEADER */}
      <div className="vrc-header">
        <div className="vrc-left">
          <div>
            <button
              className="vrc-back-btn"
              onClick={() =>
                navigate(`/platform/verifications`)}>
              ← Back
            </button>
            <h2> {data[0]?.organizationName || "Candidates"} </h2>
            <p> Manage verification candidates </p>
          </div>
        </div>
        <div className="vrc-search">
          <input className="vrc-search-input"
            placeholder="Search candidate..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
          />
        </div>
      </div>

      {/* LIST */}
      <div className="candidate-list">
        {data.map((v) => {
          const sla =
            getSlaDetails(v);

          return (
            <div
              key={v.id}
              className={`candidate-row ${sla.class}`}
              onClick={async () => {
                const key =
                  String(v.id);

                setNotifications(
                  (prev) => {
                    const copy = {
                      ...prev,
                    };

                    copy[key] = 0;

                    return copy;
                  },
                );

                try {
                  await api.put(
                    `/vendor/notifications/mark-read/${orgId}/verification/${v.id}`,
                  );
                } catch (err) {
                  console.error(
                    err,
                  );
                }

                navigate(
                  `/platform/verifications/verificationCX/${v.id}`,
                );
              }}
            >
              {/* LEFT */}
              <div className="candidate-info">
                <div className="candidate-top">
                  <h4
                    dangerouslySetInnerHTML={{
                      __html:
                        highlight(
                          v.candidateName,
                        ),
                    }}
                  />

                  {notifications[
                    v.id
                  ] && (
                      <span className="new-badge">
                        NEW
                      </span>
                    )}
                </div>

                <p
                  className="candidate-email"
                  dangerouslySetInnerHTML={{
                    __html:
                      highlight(
                        v.candidateEmail,
                      ),
                  }}
                />

                <span className="department-pill">
                  {
                    v.department
                      ?.name
                  }
                </span>
              </div>

              {/* RIGHT */}
              <div className="candidate-right">
                <span
                  className={`status ${v.status.toLowerCase()}`}
                >
                  {v.status}
                </span>

                <div
                  className={`sla-badge ${sla.class}`}
                >
                  {sla.label}
                </div>

                {/* MENU */}
                <div
                  className="candidate-menu"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                >
                  <span
                    className="menu-icon"
                    onClick={() =>
                      setMenuOpen(
                        menuOpen ===
                          v.id
                          ? null
                          : v.id,
                      )
                    }
                  >
                    ⋮
                  </span>

                  {menuOpen ===
                    v.id && (
                      <div className="candidate-menu-dropdown">
                        <button
                          className="danger-item"
                          onClick={() => {
                            setSelectedVerification(
                              v,
                            );

                            setShowDeleteModal(
                              true,
                            );

                            setMenuOpen(
                              null,
                            );
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DELETE MODAL */}
      {
        showDeleteModal && (
          <div
            className="client-modal-overlay"
            onClick={() => {
              setShowDeleteModal(
                false,
              );

              setSelectedVerification(
                null,
              );

              setConfirmText("");
            }}
          >
            <div
              className="client-delete-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <h3>
                Delete Verification
              </h3>

              <p>
                Type{" "}
                <strong>
                  CONFIRM
                </strong>{" "}
                to delete this
                verification request.
              </p>

              <input
                className="confirm-input"
                placeholder="Type CONFIRM"
                value={confirmText}
                onChange={(e) =>
                  setConfirmText(
                    e.target.value,
                  )
                }
              />

              <div className="client-modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowDeleteModal(
                      false,
                    );

                    setSelectedVerification(
                      null,
                    );

                    setConfirmText(
                      "",
                    );
                  }}
                >
                  Cancel
                </button>

                <button
                  className="confirm-delete-btn"
                  onClick={
                    deleteVerification
                  }
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}