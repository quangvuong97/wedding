import React, { useState } from "react";
import { Card, Tabs, Typography } from "antd";
import { EImageStoreType } from "../../../../services/api";
import ImageGalleryTab from "./ImageGalleryTab";
import InvitationTab from "./InvitationTab";
import CoupleTab from "./CoupleTab";

const { Title , Text} = Typography;

const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(EImageStoreType.CAROUSEL);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const tabItems = [
    {
      key: EImageStoreType.CAROUSEL,
      label: "Header",
      children: (
        <ImageGalleryTab type={EImageStoreType.CAROUSEL} title={"Header"} />
      ),
    },
    {
      key: EImageStoreType.COUPLE,
      label: "Giới thiệu",
      children: <CoupleTab />,
    },
    {
      key: EImageStoreType.STORY,
      label: "Story",
      children: (
        <ImageGalleryTab
          type={EImageStoreType.STORY}
          title={"story"}
          customTitle={<Text className="block mb-2" type="warning">Hãy tải lên ảnh tỉ lệ vuông để lên web được đẹp nhé</Text>}
        />
      ),
    },
    {
      key: EImageStoreType.INVITATION,
      label: "Thiệp mời",
      children: <InvitationTab />,
    },
    {
      key: EImageStoreType.SWEET_MOMENTS,
      label: "Gallery",
      children: (
        <ImageGalleryTab
          type={EImageStoreType.SWEET_MOMENTS}
          title={"Gallery"}
        />
      ),
    },
    {
      key: EImageStoreType.FOOTER,
      label: "Footer",
      children: (
        <ImageGalleryTab type={EImageStoreType.FOOTER} title={"Footer"} />
      ),
    },
  ];

  return (
    <Card style={{ borderRadius: "0.25rem", background: "#fff" }}>
      <Title level={3} style={{ color: "#1e8267", marginBottom: "24px" }}>
        Quản Lý Ảnh
      </Title>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />
    </Card>
  );
};

export default ContentManagement;
