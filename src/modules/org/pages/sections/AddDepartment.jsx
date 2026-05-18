import { useState } from "react";
import { api } from "../../../../services/api/Api";
import { useNavigate } from "react-router-dom";
import { getBasePath } from "../../../../utils/PathHelper";
import "../../styles/Departments.css";

export default function AddDepartment() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const base = getBasePath();

  const createDepartment = async () => {
    if (!name.trim()) {
      alert("Department name is required");
      return;
    }

    try {
      await api.post("/departments/create", { name });
      navigate(-1); // go back to list
    } catch (err) {
      console.error(err);
      alert("Failed to create department");
    }
  };

  return (
    <div className="dept-page">
      <button onClick={() => navigate(`/${base}/departments`)}>← Back</button>

      <div className="dept-form-card">
        <h2>Create Department</h2>

        <input
          placeholder="Enter department name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="dept-form-actions">
          <button className="primary-btn" onClick={createDepartment}>
            Create
          </button>

          <button className="secondary-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
