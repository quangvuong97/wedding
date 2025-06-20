import React, { useState, useEffect } from "react";
import { Card, Tabs, message, Spin, Typography } from "antd";
import { useAuth } from "../../../../contexts/AuthContext";
import { authAPI, UserProfile } from "../../../../services/api";
import WeddingConfigTab from "./WeddingConfigTab";
import StorageConfigTab from "./StorageConfigTab";

const { Title, Text } = Typography;

const SettingsManagement: React.FC = () => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("storage");

  const loadProfile = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const profileData = await authAPI.getProfile(accessToken);
      setProfile(profileData);
    } catch (error: any) {
      message.error(`Không thể tải thông tin profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <Card
        style={{
          borderRadius: "0.25rem",
          background: "#fff",
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải cấu hình...</Text>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card
        style={{
          borderRadius: "0.25rem",
          background: "#fff",
          textAlign: "center",
          padding: "60px 20px",
        }}
      >
        <Text type="danger">Không thể tải thông tin profile</Text>
      </Card>
    );
  }

  const tabItems = [
    {
      key: "storage",
      label: "Cấu hình kho lưu trữ",
      children: (
        <StorageConfigTab profile={profile} onUpdate={handleProfileUpdate} />
      ),
    },
    {
      key: "wedding",
      label: "Cấu hình cưới",
      children: (
        <WeddingConfigTab profile={profile} onUpdate={handleProfileUpdate} />
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Card style={{ borderRadius: "0.25rem", background: "#fff" }}>
      <Title level={3} style={{ color: "#1e8267", marginBottom: "24px" }}>
        Cài Đặt Trang
      </Title>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </Card>
  );
};

export default SettingsManagement;
