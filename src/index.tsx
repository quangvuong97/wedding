import "@ant-design/v5-patch-for-react-19";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HomePage, AdminDashboard, ProtectedRoute } from "./components";
import "./styles/theme.css";
import reportWebVitals from "./reportWebVitals";

import "@flaticon/flaticon-uicons/css/all/all.css"; // Import tất cả icon
import { ConfigProvider } from "antd";
import QrViewPage from "./components/home/QrViewPage";
import SettingsManagement from "./components/admin/menu/SettingsManagement/SettingsManagement";
import ContentManagement from "./components/admin/menu/ContentManagement/ContentManagement";
import GuestManagement from "./components/admin/menu/GuestManagement/GuestManagement";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#1e8267",
      },
    }}
  >
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/qr-view" element={<QrViewPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            >
              <Route path="settings" element={<SettingsManagement />} />
              <Route path="content" element={<ContentManagement />} />
              <Route path="guests" element={<GuestManagement />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();