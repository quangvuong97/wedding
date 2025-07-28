import { message, Space, Table, Typography } from "antd";
import { GetTrafficResponse, trafficAPI } from "../../../../services/api";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useStyle } from "../../styles";
import useScrollTable from "../../../../common/useScollTable";
import { ApiResponse } from "../../../../services/common";

const { Text } = Typography;

export interface EditingGuest {
  id: string;
  field: string;
  value: any;
}

interface TrafficsProps {
  activeTab: string;
}

function formatSecondsToHMS(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

const Traffics: React.FC<TrafficsProps> = ({ activeTab }) => {
  const { accessToken } = useAuth();
  const { styles } = useStyle();
  const scrollY = useScrollTable(312);

  const [traffic, setTraffics] = useState<
    ApiResponse<GetTrafficResponse[]> | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

  const fetchTraffics = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await trafficAPI.getTraffics(accessToken, {
        page: 1,
        size: 99999,
      });

      setTraffics(response);
    } catch (error: any) {
      message.error("Không thể tải danh sách khách mời");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "traffics") fetchTraffics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const columns: ColumnsType<GetTrafficResponse> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 140,
      ellipsis: true,
    },
    {
      title: "Nhà trai/gái",
      dataIndex: "guestOf",
      key: "guestOf",
      width: 120,
      align: "center" as const,
      render: (text: string, _: GetTrafficResponse) =>
        text === "groom" ? "Nhà trai" : text === "bride" ? "Nhà gái" : "-",
    },
    {
      title: "Thời gian hoạt động",
      dataIndex: "sessionDuration",
      key: "sessionDuration",
      width: 130,
      render: (text: number, _: GetTrafficResponse) => formatSecondsToHMS(text),
    },
    {
      title: "Địa chỉ ip",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 120,
      ellipsis: true,
    },
    {
      title: "Thiết bị",
      dataIndex: "deviceType",
      key: "deviceType",
      width: 90,
      ellipsis: true,
    },
    {
      title: "Nguồn truy cập",
      dataIndex: "source",
      key: "source",
      width: 90,
    },
    {
      title: "online",
      dataIndex: "isOnline",
      key: "isOnline",
      width: 65,
      align: "center" as const,
      render: (text: boolean, _: GetTrafficResponse) => (text ? "On" : "Off"),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (text: Date, _: GetTrafficResponse) =>
        new Date(text).toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
    },
  ];

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Text style={{ marginTop: 8 }}>
          {(traffic && traffic.totalElements) || 0} lượt truy cập
        </Text>

        <Table
          className={styles.customTable}
          columns={columns}
          dataSource={traffic?.data || []}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200, y: scrollY }}
          size="middle"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          locale={{
            emptyText:
              traffic && traffic.data && traffic.data.length === 0 && !loading
                ? "Chưa có lượt truy cập nào"
                : undefined,
          }}
        />
      </Space>
    </>
  );
};

export default Traffics;
