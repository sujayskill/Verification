import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PlatformLayout from "../layout/platform/VendorComps/PlatformLayout";

// Pages
import Clients from "../modules/platform/pages/sections/Clients";
import ClientDetails from "../modules/platform/pages/sections/ClientDetails";
import AddClient from "../modules/platform/pages/sections/AddClient";
import EditClient from "../modules/platform/pages/sections/EditClient";
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
import ReportsClientsCandidates from "../modules/platform/pages/sections/ReportsClientsCandidates";
import ManageAccounts from "../modules/platform/pages/accounts/ManageAccounts";
import Sales from "../modules/platform/pages/sections/Sales";
import ReportDetails from "../modules/platform/pages/sections/ReportDetails";
import Notifications from "../modules/platform/pages/accounts/Notifications";
import StatusClient from "../modules/platform/pages/sections/StatusClient";
import StatusCandidate from "../modules/platform/pages/sections/StatusCandidate";
import ClientCandidates from "../modules/platform/pages/sections/ClientCandidates";

export default function PlatformRoutes() {
  return (
    <Routes>
      <Route element={<PlatformLayout />}>
        <Route index element={<Navigate to="home" />} />

        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="clients" element={<Clients />} />
                <Route path="clients/new" element={<AddClient />} />
                <Route path="clients/:id" element={<ClientDetails />} />
                        <Route path="clients/candidates/:id" element={<ClientCandidates/>} />
                <Route path="clients/edit/:id" element={<EditClient />} />


        <Route path="verifications" element={<VerificationRequests />} />
                <Route path="verifications/:orgId" element={<VerificationCX />} />
                        <Route path="verifications/verificationCX/:id" element={<VerificationCXDetails />} />
        
        
        <Route path="status" element={<Status />} />
                <Route path="status/client/:orgId" element={<StatusClient />} />
                        <Route path="status/candidate/:id" element={<StatusCandidate />} />


        <Route path="metrics" element={<Metrics />} />


        <Route path="reports" element={<Reports />} />
                <Route path="reports/:orgId" element={<ReportsClients />} />
                        <Route path="reports/client/:id" element={<ReportsClientsCandidates />}/>
                                <Route path="reports/reportDetails/:id" element={<ReportDetails />} />
        
        
        <Route path="settings" element={<Settings />} />
        <Route path="help&support" element={<HelpSupport />} />
        <Route path="manageAccounts" element={<ManageAccounts />} />
        <Route path="profile" element={<Profile />} />
        <Route path="sales" element={<Sales />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
}
