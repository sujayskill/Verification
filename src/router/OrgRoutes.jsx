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
import Departments from "../modules/org/pages/sections/Departments";
import AddDepartment from "../modules/org/pages/sections/AddDepartment";
import VerificationDepartments from "../modules/org/pages/sections/VerificationDepartments";
import ReportsDepartments from "../modules/org/pages/sections/ReportsDepartments";

export default function OrgRoutes() {
  return (
    <Routes>
      <Route element={<OrgLayout />}>
        <Route index element={<Navigate to="home" />} />
        <Route path="home" element={<Home />} />

        <Route path="departments" element={<Departments />} />
        <Route path="departments/new" element={<AddDepartment />} />
        <Route path="candidates/:deptId" element={<Candidates />} />
        <Route path="candidates/edit/:id" element={<EditCandidate />} />
        <Route path="candidates/new/:deptId" element={<AddCandidate />} />
        <Route
          path="candidates/candidateDetails/:id"
          element={<CandidateDetails />}
        />

        <Route path="verifications" element={<VerificationDepartments />} />
        <Route path="verifications/:deptId" element={<Verifications />} />

        <Route path="pull-hires" element={<PullHires />} />

        <Route path="documents" element={<Documents />} />

        <Route path="reports" element={<ReportsDepartments />} />
        <Route path="reports/:deptId" element={<Reports />} />
        <Route path="reports/reportDetails/:id" element={<ReportDetails />} />

        <Route path="notifications" element={<Notifications />} />

        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="myAccount" element={<MyAccount />} />
        <Route path="help&support" element={<HelpSupport />} />
        <Route path="manageAccounts" element={<ManageAccounts />} />
      </Route>
    </Routes>
  );
}
