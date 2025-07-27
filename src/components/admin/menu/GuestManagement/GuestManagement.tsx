import React, { useState } from "react";
import { Tabs, Typography, Card } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { EGuestOfType } from "../../../../services/api";
import Statistics from "./Statistics";
import GuestTabContent from "./GuestTabContent";
import ExpenseTabContent from "./ExpenseTabContent";

const { Title } = Typography;

const GuestManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(EGuestOfType.GROOM);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
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
      key: "expense",
      label: "Chi phí",
      children: <ExpenseTabContent />,
    },
    {
      key: "statistics",
      label: (
        <span>
          <BarChartOutlined />
          Thống kê
        </span>
      ),
      children: <Statistics activeTab={activeTab} />,
    },
  ];

  return (
    <Card
      style={{
        borderRadius: "0.25rem",
      }}
      styles={{ body: { padding: 12 } }}
    >
      <Title level={3} style={{ color: "#1e8267", marginBottom: "12px" }}>
        Quản lý khách mời
      </Title>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </Card>
  );
};

export default GuestManagement;
