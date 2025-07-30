import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, message, Spin } from "antd";
import {
  SettingOutlined,
  FileTextOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI, UserProfile } from "../../services/api";
import { AdminDataContext } from "../../contexts/AdminDataContext";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Sider, Content } = Layout;

// Menu items
const menuItems = [
  {
    key: "/admin/settings",
    icon: <SettingOutlined />,
    label: "Cài Đặt Trang",
  },
  {
    key: "/admin/content",
    icon: <FileTextOutlined />,
    label: "Quản Lý Ảnh",
  },
  {
    key: "/admin/guests",
    icon: <TeamOutlined />,
    label: "Khách Mời",
  },
];

const AdminDashboard: React.FC = () => {
  const { logout, accessToken, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) {
        return;
      }

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profileData = await authAPI.getProfile(accessToken);
        setProfile(profileData);
      } catch (error: any) {
        if (error.message === "Unauthorized") {
          message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          logout();
        } else if (error.message === "Network error") {
          message.warning(
            "Lỗi kết nối mạng. Một số tính năng có thể không hoạt động."
          );
        } else {
          message.warning(
            "Không thể tải thông tin profile. Vui lòng thử lại sau."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken, logout, authLoading]);

  // Redirect to settings if on base admin path
  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      navigate("/admin/settings", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    message.success("Đăng xuất thành công!");
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  if (loading || authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <AdminDataContext.Provider
      value={{ adminData: profile, setAdminData: setProfile }}
    >
      <Layout style={{ minHeight: "100vh" }} hasSider>
        <Layout>
          <Sider
            width={220}
            style={{
              background: "#fff",
              borderRight: "1px solid #e6ebf1",
              overflow: "auto",
              height: "100vh",
              position: "sticky",
              insetInlineStart: 0,
              top: 0,
              bottom: 0,
              scrollbarWidth: "thin",
              scrollbarGutter: "stable",
            }}
          >
            {/* Menu */}
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              style={{
                border: "none",
                padding: "16px 0",
                background: "transparent",
              }}
              theme="light"
              items={menuItems}
              onClick={handleMenuClick}
            />

            {/* Logout Button */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "16px",
                right: "16px",
              }}
            >
              <Button
                type="primary"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{
                  width: "100%",
                  background: "#1e8267",
                  borderColor: "#1e8267",
                  borderRadius: "0.25rem",
                  height: "44px",
                  fontWeight: "500",
                }}
              >
                Đăng xuất
              </Button>
            </div>
          </Sider>
          <Layout>
            <Content
              style={{
                overflowY: "auto",
                padding: "12px",
                background: "linear-gradient(135deg, #f8fffe 0%, #f0faf8 100%)",
                height: "100vh",
                scrollbarWidth: "thin",
                scrollbarColor: "#eaeaea transparent",
              }}
            >
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </AdminDataContext.Provider>
  );
};

export default AdminDashboard;