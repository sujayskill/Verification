import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PlatformLayout from "../layout/platform/layoutComps/PlatformLayout";

// Pages
import Clients from "../modules/platform/pages/sections/Clients";
import ClientDetails from "../modules/platform/pages/sections/ClientDetails";
import AddClient from "../modules/platform/pages/sections/AddClient";
import EditClient from "../modules/platform/pages/sections/EditClientDetails";
import Dashboard from "../modules/platform/pages/sections/Dashboard";
import Home from "../modules/platform/pages/sections/Home";
import MyAccount from "../modules/platform/pages/accounts/Profile";
import Settings from "../modules/platform/pages/accounts/Settings";
import HelpSupport from "../modules/platform/pages/accounts/Help&Support";
import VerificationRequests from "../modules/platform/pages/sections/VerificationRequests";
import VerificationCX from "../modules/platform/pages/sections/VerificationCX";
import VerificationCXDetails from "../modules/platform/pages/sections/VerificationCXDetails";
import Status from "../modules/platform/pages/sections/Status";
import Metrics from "../modules/platform/pages/sections/Metrics";
import Reports from "../modules/platform/pages/sections/Reports";
import Profile from "../modules/platform/pages/accounts/Profile";
import ReportsClients from "../modules/platform/pages/sections/ReportsClients";
import ReportsCandidates from "../modules/platform/pages/sections/ReportsClientCandidates";
import ManageAccountsVendorAdmin from "../modules/platform/pages/accounts/ManageAccountsVendorAdmin";
import ManageAccountsVendor from "../modules/platform/pages/accounts/ManageAccountsVendor";
import Sales from "../modules/platform/pages/sections/Sales";
import ReportDetails from "../modules/platform/pages/sections/ReportDetails";
import Notifications from "../modules/platform/pages/accounts/Notifications";
import StatusClients from "../modules/platform/pages/sections/StatusCandidates";
import StatusCandidate from "../modules/platform/pages/sections/StatusCandidateDetails";
import ClientCandidates from "../modules/platform/pages/sections/ClientCandidates";
import ClientDepartments from "../modules/platform/pages/sections/ClientDepartments";
import VerificationDepartments from "../modules/platform/unused/VerificationDepartments";
import StatusDepartments from "../modules/platform/unused/StatusDepartment";
import ReportsDepartments from "../modules/platform/unused/ReportsDepartments";
import CandidateDetails from "../modules/platform/pages/sections/CandidateDetails";
import EditCandidate from "../modules/platform/pages/sections/EditCandidate";

export default function PlatformRoutes() {
  return (
    <Routes>
      <Route element={<PlatformLayout />}>
        <Route index element={<Navigate to="home" />} />

        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />


        <Route path="clients" element={<Clients />} />
        <Route path="clients/:orgId/departments" element={<ClientDepartments />} />
        <Route path="clientsDetails/:orgId" element={<ClientDetails />} />
        <Route path="clients/edit/:id/:orgId" element={<EditClient />} />
        <Route path="clients/editCandidateDetails/:id" element={<EditCandidate />} />
        <Route path="clients/:orgId/departments/:deptId" element={<ClientCandidates />} />
        <Route path="clients/new" element={<AddClient />} />
        <Route path="clients/candidateDetails/:id" element={<CandidateDetails />} />


        <Route path="verifications" element={<VerificationRequests />} />
        {/* <Route path="verifications/:orgId/departments" element={<VerificationDepartments />} /> */}
        <Route path="verifications/:orgId" element={<VerificationCX />} />
        <Route path="verifications/verificationCX/:id" element={<VerificationCXDetails />} />


        <Route path="status" element={<Status />} />
        {/* <Route path="status/:orgId/departments" element={<StatusDepartments />} /> */}
        <Route path="status/:orgId" element={<StatusClients />} />
        <Route path="status/candidate/:id" element={<StatusCandidate />} />


        <Route path="reports" element={<Reports />} />
        {/* <Route path="reports/:orgId/departments" element={<ReportsDepartments />} /> */}
        <Route path="reports/:orgId" element={<ReportsClients />} />
        <Route path="reports/client/:id" element={<ReportsCandidates />} />
        <Route path="reports/reportDetails/:id" element={<ReportDetails />} />


        <Route path="metrics" element={<Metrics />} />


        <Route path="sales" element={<Sales />} />


        <Route path="settings" element={<Settings />} />
        <Route path="help&support" element={<HelpSupport />} />
        <Route path="manage-account/admin" element={<ManageAccountsVendorAdmin />} />
        <Route path="manage-account/vendor" element={<ManageAccountsVendor />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}
