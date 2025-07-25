import React, { useState } from "react";
import { Tabs, Typography, Card } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import {
  EGuestOfType,
} from "../../../../services/api";
import Statistics from "./Statistics";
import GuestTabContent from "./GuestTabContent";

const { Title } = Typography;

const GuestManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EGuestOfType>(EGuestOfType.GROOM);
  
  const handleTabChange = (key: string) => {
    setActiveTab(key as EGuestOfType);
  };

  const tabItems = [
    {
      key: EGuestOfType.GROOM,
      label: "Nhà trai",
      children: <GuestTabContent guestOf={EGuestOfType.GROOM} />,
    },
    {
      key: EGuestOfType.BRIDE,
      label: "Nhà gái",
      children: <GuestTabContent guestOf={EGuestOfType.BRIDE} />,
    },
    {
      key: "statistics",
      label: (
        <span>
          <BarChartOutlined />
          Thống kê
        </span>
      ),
      children: <Statistics />,
    },
  ];

  return (
    <Card
      style={{
        borderRadius: "0.25rem",
      }}
    >
      <Title level={3} style={{ color: "#1e8267", marginBottom: "24px" }}>
        Quản lý khách mời
      </Title>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </Card>
  );
};

export default GuestManagement;
