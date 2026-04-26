import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import OrgLayout from "../layout/org/layoutComps/ClientLayout";

// Pages
import Candidates from "../modules/org/pages/sections/Candidates";
import AddCandidate from "../modules/org/pages/sections/AddCandidate";
import EditCandidate from "../modules/org/pages/sections/EditCandidate";
import CandidateDetails from "../modules/org/pages/sections/CandidateDetails";
import Home from "../modules/org/pages/sections/Dashboard";
import Settings from "../modules/platform/pages/accounts/Settings";
import MyAccount from "../modules/platform/pages/accounts/Profile";
import HelpSupport from "../modules/platform/pages/accounts/Help&Support";
import PullHires from "../modules/org/pages/sections/PullHires";
import Documents from "../modules/org/pages/sections/Documents";
import Verifications from "../modules/org/pages/sections/Verifications";
import Reports from "../modules/org/pages/sections/Reports";
import Notifications from "../modules/org/pages/accounts/Notifications";
import Profile from "../modules/org/pages/accounts/Profile";
import ManageAccounts from "../modules/org/pages/accounts/ManageAccounts";
import ReportDetails from "../modules/org/pages/sections/ReportDetails";

export default function OrgRoutes() {
  return (
    <Routes>
      <Route element={<OrgLayout />}>
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<Home />} />

        <Route path="candidates" element={<Candidates />} />
        <Route path="candidates/new" element={<AddCandidate />} />
        <Route
          path="candidates/candidateDetails/:id"
          element={<CandidateDetails />}
        />
        <Route path="candidates/edit/:id" element={<EditCandidate />} />
        <Route path="settings" element={<Settings />} />
        <Route path="myAccount" element={<MyAccount />} />
        <Route path="help&support" element={<HelpSupport />} />
        <Route path="pull-hires" element={<PullHires />} />
        <Route path="verifications" element={<Verifications />} />
        <Route path="reports" element={<Reports />} />
        <Route path="documents" element={<Documents />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="manageAccounts" element={<ManageAccounts />} />
        <Route path="reports/reportDetails/:id" element={<ReportDetails />} />
      </Route>
    </Routes>
  );
}
