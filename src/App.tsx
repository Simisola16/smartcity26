import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { RegistrationProvider } from "./context/RegistrationContext.js";
import { RegistrationPage } from "./pages/RegistrationPage.js";
import { PreviewPage } from "./pages/PreviewPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { ClubPortal } from "./pages/ClubPortal.js";
import { AdminPage } from "./pages/AdminPage.js";
import { PublicPage } from "./components/PublicPage.js";
import { RefereePage } from "./pages/RefereePage.js";
import { LandingPage } from "./pages/LandingPage.jsx";
import { ClubRegisterPage } from "./pages/ClubRegisterPage.jsx";
import { ClubApprovalsPage } from "./pages/ClubApprovalsPage.jsx";
import { ClubLoginPage } from "./pages/ClubLoginPage.jsx";
import { ClubDashboardPage } from "./pages/ClubDashboardPage.jsx";

export default function App() {
  return (
    <RegistrationProvider>
      <Router>
        <Routes>
          {/* Public Intake registration */}
          <Route path="/register" element={<RegistrationPage />} />
          
          {/* Staging & layouts validation previews */}
          <Route path="/preview" element={<PreviewPage />} />

           {/* Public Tournament Hub - no login required */}
          <Route path="/livescore" element={<PublicPage />} /> 

          <Route path="/referee" element={<RefereePage />} />
          
          {/* Traditional Club authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/club-register" element={<ClubRegisterPage />} />
          
          {/* Authentic workspace panels */}
          <Route path="/portal" element={<ClubPortal />} />
          
          {/* Administrative supervision systems */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/clubs" element={<ClubApprovalsPage />} />

          {/* Club portal — login & dashboard */}
          <Route path="/club-login" element={<ClubLoginPage />} />
          <Route path="/club-dashboard" element={<ClubDashboardPage />} />

          {/* Wildcard rerouter links */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </RegistrationProvider>
  );
}
