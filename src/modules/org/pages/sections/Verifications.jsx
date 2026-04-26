import { useEffect, useState } from "react";
import { api } from "../../../../services/api/Api";
import "../../styles/Verifications.css";

export default function Verifications() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 🔥 FETCH API
  const fetchData = async () => {
    try {
      const res = await api.get(
        `/org/verifications/search?q=${search}&page=${page}&size=6`,
      );

      setData(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, page]);

  // 🔥 HIGHLIGHT FUNCTION
  const highlight = (text) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  return (
    <div className="content">
      <h2>Verification Status</h2>

      {/* 🔍 SEARCH */}
      <div className="search-bar">
        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // reset page
          }}
        />
      </div>

      {/* LIST */}
      {data.map((v) => (
        <div key={v.id} className="card">
          <h4
            dangerouslySetInnerHTML={{
              __html: highlight(v.candidateName),
            }}
          />
              <h5>{v.candidateEmail}</h5>   {/* 👈 Added email under name */}

          {/* 🔥 TIMELINE */}
          <div className="timeline">
            {["INITIATED", "IN_PROGRESS", "COMPLETED"].map((step) => (
              <span
                key={step}
                className={`step ${v.status === step ? "active" : ""}`}
              >
                {step}
              </span>
            ))}
          </div>

          <p>Status: {v.status}</p>

          <p>
            <b>Vendor Note:</b> {v.comment || "No updates yet"}
          </p>

          {v.status === "COMPLETED" && v.reportUrl && (
            <a
              href={`http://localhost:8081/org/verifications/download/${v.id}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 Download Report
            </a>
          )}
        </div>
      ))}

      {/* 🔥 PAGINATION */}
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page === totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
