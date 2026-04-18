import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PlatformLayout from "../layout/platform/VendorComps/PlatformLayout";

// Pages
import Organizations from "../modules/platform/pages/sections/Organizations";
import OrganizationDetails from "../modules/platform/pages/sections/OrganizationDetails";
import AddOrganization from "../modules/platform/pages/sections/AddOrganization";
import EditOrganization from "../modules/platform/pages/sections/EditOrganization";
import Dashboard from "../modules/platform/pages/sections/Dashboard";
import Home from "../modules/platform/pages/sections/Home";
import MyAccount from "../modules/platform/pages/accounts/Profile";
import Settings from "../modules/platform/pages/accounts/Settings";
import HelpSupport from "../modules/platform/pages/accounts/Help&Support";
import VerificationRequests from "../modules/platform/pages/sections/VerificationRequests";
import VerificationDetails from "../modules/platform/pages/sections/VerificationDetails";
import VerificationStatus from "../modules/platform/pages/sections/Status";
import Metrics from "../modules/platform/pages/sections/Metrics";
import Reports from "../modules/platform/pages/sections/Reports";
import Profile from "../modules/platform/pages/accounts/Profile";
import ReportsClients from "../modules/platform/pages/sections/ReportsClients";
import ReportsClientsCandidates from "../modules/platform/pages/sections/ReportsClientsCandidates";
import ManageAccounts from "../modules/platform/pages/accounts/ManageAccounts";
import Sales from "../modules/platform/pages/sections/Sales";

export default function PlatformRoutes() {
  return (
    <Routes>
      <Route element={<PlatformLayout />}>
        <Route index element={<Navigate to="home" />} />

        <Route path="home" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="organizations" element={<Organizations />} />
        <Route path="organization/new" element={<AddOrganization />} />
        <Route path="organization/:id" element={<OrganizationDetails />} />
        <Route path="organization/edit/:id" element={<EditOrganization />} />
        <Route path="verificationRequests" element={<VerificationRequests />} />
        <Route
          path="verificationDetails/:id"
          element={<VerificationDetails />}
        />
        <Route path="verificationStatus" element={<VerificationStatus />} />
        <Route path="metrics" element={<Metrics />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/clients" element={<ReportsClients />} />
        <Route
          path="reports/client/candidate/:id"
          element={<ReportsClientsCandidates />}
        />
        <Route path="settings" element={<Settings />} />
        <Route path="help&support" element={<HelpSupport />} />
        <Route path="manageAccounts" element={<ManageAccounts />} />
        <Route path="profile" element={<Profile />} />
        <Route path="sales" element={<Sales />} />
      </Route>
    </Routes>
  );
}
