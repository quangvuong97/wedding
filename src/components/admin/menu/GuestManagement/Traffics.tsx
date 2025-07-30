import { message as messageAntd, Space, Table, Typography, Button } from "antd";
import { GetTrafficResponse, trafficAPI } from "../../../../services/api";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useStyle } from "../../styles";
import useScrollTable from "../../../../common/useScollTable";
import { ApiResponse } from "../../../../services/common";

const { Text } = Typography;

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
  const scrollY = useScrollTable(242);
  const [message, contextHolder] = messageAntd.useMessage();

  const [traffic, setTraffics] = useState<
    ApiResponse<GetTrafficResponse[]> | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const size = 20;

  const fetchTraffics = async (pageNumber: number) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await trafficAPI.getTraffics(accessToken, {
        page: pageNumber,
        size,
      });

      setTraffics((prev) => {
        if (!prev || pageNumber === 1) {
          return response;
        } else {
          return {
            ...response,
            data: [...(prev.data || []), ...(response.data || [])],
            totalElements: response.totalElements,
          };
        }
      });
    } catch (error: any) {
      message.error("Không thể tải danh sách lượt truy cập");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "traffics") {
      setPage(1);
      fetchTraffics(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (
      scrollTop + clientHeight >= scrollHeight - 50 &&
      traffic &&
      traffic.data &&
      traffic.data.length < traffic.totalElements! &&
      !loading
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchTraffics(nextPage);
    }
  };

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
      render: (text: string) =>
        text === "groom" ? "Nhà trai" : text === "bride" ? "Nhà gái" : "-",
    },
    {
      title: "Thời gian hoạt động",
      dataIndex: "sessionDuration",
      key: "sessionDuration",
      width: 130,
      render: (text: number) => formatSecondsToHMS(text),
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
      render: (text: boolean) => (text ? "On" : "Off"),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (text: Date) =>
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
      {contextHolder}
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
          onScroll={handleScroll}
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

        {traffic &&
          traffic.data &&
          traffic.data.length < traffic.totalElements! && (
            <Button
              onClick={() => {
                if (!loading) {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchTraffics(nextPage);
                }
              }}
              loading={loading}
              block
            >
              Tải thêm
            </Button>
          )}
      </Space>
    </>
  );
};

export default Traffics;
