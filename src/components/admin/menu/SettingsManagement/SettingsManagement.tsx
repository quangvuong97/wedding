import React, { useState } from "react";
import { Card, Tabs, Typography } from "antd";
import WeddingConfigTab from "./WeddingConfigTab";
import StorageConfigTab from "./StorageConfigTab";
import { useAdminData } from "../../../../contexts/AdminDataContext";
import StoryConfigTab from "./StoryConfigTab";
import AudioConfigTab from "./AudioConfigTab";
import { UserProfile } from "../../../../services/api";

const { Title, Text } = Typography;

const SettingsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("storage");
  const { adminData: profile, setAdminData } = useAdminData();

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setAdminData(updatedProfile);
  };

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
    {
      key: "story",
      label: "Cấu hình story",
      children: (
        <StoryConfigTab profile={profile} onUpdate={handleProfileUpdate} />
      ),
    },
    {
      key: "audio",
      label: "Cấu hình nhạc",
      children: (
        <AudioConfigTab profile={profile} onUpdate={handleProfileUpdate} />
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Card
      style={{ borderRadius: "0.25rem", background: "#fff" }}
      styles={{ body: { padding: 12 } }}
    >
      <Title level={3} style={{ color: "#1e8267", marginBottom: "12px" }}>
        Cài Đặt Trang
      </Title>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </Card>
  );
};

export default SettingsManagement;