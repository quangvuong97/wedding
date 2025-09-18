import {
  message as messageAntd,
  Space,
  Table,
  Typography,
  Button,
  Row,
  Select,
  Popconfirm,
  Col,
} from "antd";
import {
  anonymousAPI,
  GetAnonymousConfirmResponse,
} from "../../../../services/api";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useStyle } from "../../styles";
import useScrollTable from "../../../../common/useScrollTable";
import { ApiResponse } from "../../../../services/common";

import { DeleteOutlined, FileDoneOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface AnonymousConfirmProps {
  activeTab: string;
}

const AnonymousConfirm: React.FC<AnonymousConfirmProps> = ({ activeTab }) => {
  const { accessToken } = useAuth();
  const { styles } = useStyle();
  const scrollY = useScrollTable(290);
  const [message, contextHolder] = messageAntd.useMessage();

  const [anonymousConfirm, setAnonymousConfirm] = useState<
    ApiResponse<GetAnonymousConfirmResponse[]> | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

  const [selectResolved, setSelectResolved] = useState<boolean | "-">("-");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const size = 20;

  const fetchAnonymousConfirm = async (pageNumber: number) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await anonymousAPI.getAnonymous(accessToken, {
        page: pageNumber,
        size,
        resolved: selectResolved === "-" ? undefined : selectResolved,
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
      message.error("Không thể tải danh sách lượt phản hồi ẩn danh");
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
  }, [activeTab, selectResolved]);

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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as string[]);
    },
  };

  const columns: ColumnsType<GetAnonymousConfirmResponse> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 120,
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
      align: "center" as const,
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
      width: 100,
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
      title: "Trạng thái",
      dataIndex: "resolved",
      key: "resolved",
      width: 65,
      align: "center" as const,
      render: (text: boolean) => (text ? "Đã xử lý" : "chưa xử lý"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 50,
      align: "center" as const,
      render: (_: any, record: GetAnonymousConfirmResponse) => (
        <Space>
          <Button
            size="small"
            type="link"
            disabled={record.resolved}
            icon={<FileDoneOutlined />}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa khách mời này?"
            // onConfirm={() => handleDeleteGuests([record.id])}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="link"
              className="shadow-none"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size={16}>
              <Space size={5}>
                <Text>Trạng thái:</Text>
                <Select
                  style={{ width: 120 }}
                  value={selectResolved}
                  onChange={setSelectResolved}
                  options={[
                    { value: "-", label: "Tất cả" },
                    { value: true, label: "Đã xử lý" },
                    { value: false, label: "Chưa xử lý" },
                  ]}
                />
              </Space>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} lượt phản hồi đã chọn?`}
                  // onConfirm={() => handleDeleteExpenses(selectedRowKeys)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Xóa đã chọn ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>
        <Text style={{ marginTop: 8 }}>
          {anonymousConfirm?.data.length || 0}/
          {(anonymousConfirm && anonymousConfirm.totalElements) || 0} lượt phản
          hồi
        </Text>

        <Table
          className={styles.customTable}
          columns={columns}
          rowSelection={rowSelection}
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
      </Space>
    </>
  );
};

export default AnonymousConfirm;
