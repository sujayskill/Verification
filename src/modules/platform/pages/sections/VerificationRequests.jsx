import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import "../../styles/VerificationRequests.css";

export default function VerificationRequests() {
  const [notifications, setNotifications] = useState({});
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [menuOpen, setMenuOpen] = useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedClient, setSelectedClient] =
    useState(null);

  const navigate = useNavigate();

  /* =========================
     FETCH DATA
  ========================= */

  const fetchData = async () => {
    try {
      const res = await api.get(
        `/platform/verifications/clients?q=${search}`,
      );

      setData(res.content || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
  };

  /* =========================
     FETCH NOTIFICATIONS
  ========================= */

  const fetchNotifications = async () => {
    try {
      const res = await api.get(
        "/vendor/notifications/count",
      );

      setNotifications(res || {});
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     OPEN CLIENT
  ========================= */

  const openClient = (orgId) => {
    setNotifications((prev) => ({
      ...prev,
      [orgId]: 0,
    }));

    navigate(`/platform/verifications/${orgId}`);
  };

  /* =========================
     DELETE CLIENT
  ========================= */

  const deleteClient = async () => {
    if (!selectedClient) return;

    try {
      await api.delete(
        `/platform/verifications/client/${selectedClient.orgId}`,
      );

      setShowDeleteModal(false);
      setSelectedClient(null);

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     SEARCH DELAY
  ========================= */

  useEffect(() => {
    const delay = setTimeout(fetchData, 400);

    return () => clearTimeout(delay);
  }, [search]);

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* =========================
     CLOSE MENU OUTSIDE CLICK
  ========================= */

  useEffect(() => {
    const closeMenu = () => {
      setMenuOpen(null);
    };

    document.addEventListener("click", closeMenu);

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

  const highlight = (text) => {
    if (!search) return text;

    return text.replace(
      new RegExp(`(${search})`, "gi"),
      "<mark>$1</mark>",
    );
  };

  return (
    <div className="vr-page">
      {/* HEADER */}
      <div className="org-header">
        <div>
          <h2>Verification Requests</h2>

          <p>
            Manage verification requests by client
          </p>
        </div>

        <div className="vr-org-actions">
          <input
            placeholder="Search organization..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
      </div>

      {/* EMPTY */}
      {data.length === 0 && (
        <p className="empty-text">
          No organizations found
        </p>
      )}

      {/* GRID */}
      <div className="org-list">
        {data.map((org) => (
          <div
            key={org.orgId}
            className={`verifications-org-card clickable-row ${notifications[org.orgId]
                ? "highlight-card"
                : ""
              }`}
            onClick={() =>
              openClient(org.orgId)
            }
          >
            {/* BADGE */}
            {notifications[org.orgId] > 0 && (
              <span className="notif-badge">
                {notifications[org.orgId] > 3
                  ? "3+"
                  : notifications[org.orgId]}
              </span>
            )}

            {/* INFO */}
            <div className="verifications-org-info">
              <h3
                dangerouslySetInnerHTML={{
                  __html: highlight(
                    org.organizationName,
                  ),
                }}
              />

              <p>
                {org.count} Verification Requests
              </p>
            </div>

            {/* MENU */}
            <div
              className="org-menu"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <span
                className="menu-icon"
                onClick={() =>
                  setMenuOpen(
                    menuOpen === org.orgId
                      ? null
                      : org.orgId,
                  )
                }
              >
                ⋮
              </span>

              {menuOpen === org.orgId && (
                <div className="org-menu-dropdown">
                  <button
                    onClick={() =>
                      navigate(
                        `/platform/verifications/edit/${org.orgId}`,
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="danger-item"
                    onClick={() => {
                      setSelectedClient(org);

                      setShowDeleteModal(
                        true,
                      );

                      setMenuOpen(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div
          className="client-modal-overlay"
          onClick={() => {
            setShowDeleteModal(false);

            setSelectedClient(null);
          }}
        >
          <div
            className="client-delete-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <h3>Delete Client</h3>

            <p>
              Are you sure you want to delete{" "}
              <strong>
                {
                  selectedClient?.organizationName
                }
              </strong>
              ?
            </p>

            <div className="client-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);

                  setSelectedClient(null);
                }}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={deleteClient}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}