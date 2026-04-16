// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// // Layouts
// import PlatformLayout from "../layout/platform-layout/PlatformLayout";
// import OrgLayout from "../layout/org-layout/OrgLayout";

// // Platform (4.1)
// import PlatformDashboard from "../modules/platform/pages/Dashboard";
// import Organizations from "../modules/platform/pages/Organizations";

// // Org (4.2)
// import OrgDashboard from "../modules/org/Pages/Dashboard";
// import Candidates from "../modules/org/Pages/Candidates";
// import AddCandidate from "../modules/org/Pages/AddCandidate";
// import EditCandidate from "../modules/org/Pages/EditCandidate";
// import CandidateDetails from "../modules/org/Pages/CandidateDetails";

// export default function AppRouter() {
//   return (
//     <Routes>
//       {/* PLATFORM ROUTES */}
//       <Route element={<PlatformLayout />}>
//         <Route path="/platform/dashboard" element={<PlatformDashboard />} />
//         <Route path="/platform/organizations" element={<Organizations />} />
//       </Route>

//       {/* ORG ROUTES */}
//       <Route element={<OrgLayout />}>
//         <Route path="/org/dashboard" element={<OrgDashboard />} />
//         <Route path="/org/candidates/getAll" element={<Candidates />} />
//         <Route path="/org/candidates/create" element={<AddCandidate />} />
//         <Route path="/org/candidates/edit/:id" element={<EditCandidate />} />
//         <Route path="/org/candidates/delete/:id" element={<CandidateDetails />} />
//       </Route>

//       {/* DEFAULT */}
//       <Route path="*" element={<Navigate to="/platform/dashboard" />} />
//     </Routes>
//   );
// }

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PlatformRoutes from "./PlatformRoutes";
import OrgRoutes from "./OrgRoutes";
import Login from "../modules/auth/pages/Login";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export default function AppRouter() {
  return (
    <Routes>

      {/* 🔓 PUBLIC ROUTE */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* 🔐 PLATFORM (ADMIN + SUPER ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_VENDOR", "ROLE_VENDOR_ADMIN"]} />}>
        <Route path="/platform/*" element={<PlatformRoutes />} />
      </Route>

      {/* 🔐 ORG */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_CLIENT"]} />}>
        <Route path="/org/*" element={<OrgRoutes />} />
      </Route>

      {/* DEFAULT REDIRECT */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}