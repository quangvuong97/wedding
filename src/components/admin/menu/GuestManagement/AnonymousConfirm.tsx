import { message, Space, Table, Typography, Button } from "antd";
import {
  anonymousAPI,
  GetAnonymousConfirmResponse,
} from "../../../../services/api";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useStyle } from "../../styles";
import useScrollTable from "../../../../common/useScollTable";
import { ApiResponse } from "../../../../services/common";

const { Text } = Typography;

interface AnonymousConfirmProps {
  activeTab: string;
}

const AnonymousConfirm: React.FC<AnonymousConfirmProps> = ({ activeTab }) => {
  const { accessToken } = useAuth();
  const { styles } = useStyle();
  const scrollY = useScrollTable(242);

  const [anonymousConfirm, setAnonymousConfirm] = useState<
    ApiResponse<GetAnonymousConfirmResponse[]> | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const size = 20;

  const fetchAnonymousConfirm = async (pageNumber: number) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await anonymousAPI.getAnonymous(accessToken, {
        page: pageNumber,
        size,
      });

      setAnonymousConfirm((prev) => {
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
      message.error("Không thể tải danh sách khách mời ẩn danh");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "anonymousConfirm") {
      setPage(1);
      fetchAnonymousConfirm(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (
      scrollTop + clientHeight >= scrollHeight - 50 &&
      anonymousConfirm &&
      anonymousConfirm.data &&
      anonymousConfirm.data.length < anonymousConfirm.totalElements! &&
      !loading
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAnonymousConfirm(nextPage);
    }
  };

  const columns: ColumnsType<GetAnonymousConfirmResponse> = [
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
      title: "Thời gian xác nhận",
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
    {
      title: "Xác nhận tham dự",
      dataIndex: "confirmAttended",
      key: "confirmAttended",
      width: 65,
      minWidth: 65,
      align: "center" as const,
      render: (text: string) => {
        if (text === "attendance") {
          return <Text type="success">Yes</Text>;
        }
        if (text === "not_attendance") {
          return <Text type="danger">No</Text>;
        }
        return <Text>-</Text>;
      },
    },
    {
      title: "Thao tác",
      dataIndex: "resolved",
      key: "resolved",
      width: 65,
      align: "center" as const,
      render: (text: boolean) => (text ? "Đã xử lý" : "chưa xử lý"),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={16}>
      <Text style={{ marginTop: 8 }}>
        {(anonymousConfirm && anonymousConfirm.totalElements) || 0} lượt phản
        hồi
      </Text>

      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={anonymousConfirm?.data || []}
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
            anonymousConfirm &&
            anonymousConfirm.data &&
            anonymousConfirm.data.length === 0 &&
            !loading
              ? "Chưa có khách truy cập ẩn danh nào confirm"
              : undefined,
        }}
      />

      {anonymousConfirm &&
        anonymousConfirm.data &&
        anonymousConfirm.data.length < anonymousConfirm.totalElements! && (
          <Button
            onClick={() => {
              if (!loading) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchAnonymousConfirm(nextPage);
              }
            }}
            loading={loading}
            block
          >
            Tải thêm
          </Button>
        )}
    </Space>
  );
};

export default AnonymousConfirm;
