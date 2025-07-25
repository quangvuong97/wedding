import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  CreateGuestRequest,
  EGuestOfType,
  GetGuestResponse,
  guestAPI,
  UpdateGuestRequest,
} from "../../../../services/api";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

const { Text } = Typography;
const { Search, TextArea } = Input;

interface EditingGuest {
  id: string;
  field: string;
  value: any;
}

interface GuestTabContentProps {
  guestOf: EGuestOfType;
}

const GuestTabContent: React.FC<GuestTabContentProps> = ({ guestOf }) => {
  const { accessToken } = useAuth();

  const [guests, setGuests] = useState<GetGuestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editingGuest, setEditingGuest] = useState<EditingGuest | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  // Fetch guests data
  const fetchGuests = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await guestAPI.getGuests(accessToken, {
        guestOf,
        page: 1,
        size: 99999,
      });

      setGuests(response);
    } catch (error: any) {
      console.error("GuestManagement: Error fetching guests:", error);
      message.error("Không thể tải danh sách khách mời");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    fetchGuests();
  };

  const handleEdit = (record: GetGuestResponse, field: string) => {
    setEditingGuest({
      id: record.id,
      field,
      value: record[field as keyof GetGuestResponse],
    });
  };

  const handleSaveEdit = async () => {
    if (!editingGuest || !accessToken) return;

    try {
      const updateData: UpdateGuestRequest = {
        [editingGuest.field]: editingGuest.value,
      };

      await guestAPI.updateGuest(accessToken, editingGuest.id, updateData);
      message.success("Cập nhật thành công");
      setEditingGuest(null);
      fetchGuests();
    } catch (error: any) {
      message.error("Không thể cập nhật thông tin");
    }
  };

  const handleCancelEdit = () => {
    setEditingGuest(null);
  };

  // Handle delete guests
  const handleDeleteGuests = async (guestIds: string[]) => {
    if (!accessToken) return;

    try {
      await guestAPI.deleteGuests(accessToken, guestIds);
      message.success("Xóa khách mời thành công");
      setSelectedRowKeys([]);
      fetchGuests();
    } catch (error: any) {
      message.error("Không thể xóa khách mời");
    }
  };

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as string[]);
    },
  };

  const renderEditableCell = (
    text: any,
    record: GetGuestResponse,
    field: string,
    type: "text" | "checkbox" = "text",
    style?: React.CSSProperties
  ) => {
    const isEditing =
      editingGuest?.id === record.id && editingGuest?.field === field;

    if (isEditing) {
      if (type === "checkbox") {
        return (
          <Space size={0}>
            <Checkbox
              checked={editingGuest.value}
              onChange={(e) =>
                setEditingGuest((prev) =>
                  prev ? { ...prev, value: e.target.checked } : null
                )
              }
            />
            <Button
              type="link"
              size="small"
              icon={<SaveOutlined />}
              onClick={handleSaveEdit}
            />
            <Button
              type="link"
              size="small"
              icon={<CloseOutlined />}
              onClick={handleCancelEdit}
            />
          </Space>
        );
      }

      return (
        <Space size={0}>
          <TextArea
            size="small"
            value={editingGuest.value}
            onChange={(e) =>
              setEditingGuest((prev) =>
                prev ? { ...prev, value: e.target.value } : null
              )
            }
            onPressEnter={handleSaveEdit}
            autoSize
          />
          <Button
            type="link"
            size="small"
            icon={<SaveOutlined />}
            onClick={handleSaveEdit}
          />
          <Button
            type="link"
            size="small"
            icon={<CloseOutlined />}
            onClick={handleCancelEdit}
          />
        </Space>
      );
    }

    if (type === "checkbox") {
      return (
        <Checkbox checked={text} onClick={() => handleEdit(record, field)} />
      );
    }

    return (
      <div
        onClick={() => handleEdit(record, field)}
        style={{
          cursor: "pointer",
          padding: "4px",
          borderRadius: "4px",
          minHeight: "22px",
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          ...style,
        }}
        className="editable-cell"
      >
        {text || "-"}
      </div>
    );
  };

  const handleCreateGuest = async (values: any) => {
    if (!accessToken) return;

    try {
      const guestData: CreateGuestRequest = {
        ...values,
        guestOf: guestOf,
      };

      await guestAPI.createGuest(accessToken, guestData);
      message.success("Thêm khách mời thành công");
      setIsModalVisible(false);
      form.resetFields();
      // fetchGuests();
    } catch (error: any) {
      message.error("Không thể thêm khách mời");
    }
  };

  const columns: ColumnsType<GetGuestResponse> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 120,
      minWidth: 120,
      ellipsis: true,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "name", "text", {
          whiteSpace: "wrap",
        }),
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 110,
      minWidth: 110,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "phoneNumber", "text", {
          overflow: "hidden",
          whiteSpace: "nowrap",
        }),
    },
    {
      title: "Facebook",
      dataIndex: "facebook",
      key: "facebook",
      width: 120,
      minWidth: 120,
      ellipsis: true,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "facebook", "text", {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }),
    },
    {
      title: "Lời mời",
      dataIndex: "invitationText",
      key: "invitationText",
      width: 200,
      minWidth: 200,
      ellipsis: true,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "invitationText", "text", {
          whiteSpace: "wrap",
        }),
    },
    {
      title: "Đã mời",
      dataIndex: "isInvite",
      key: "isInvite",
      width: 80,
      minWidth: 80,
      align: "center" as const,
      render: (text: boolean, record: GetGuestResponse) =>
        renderEditableCell(text, record, "isInvite", "checkbox"),
    },
    {
      title: "Xác nhận",
      dataIndex: "confirmAttended",
      key: "confirmAttended",
      width: 80,
      minWidth: 80,
      align: "center" as const,
      render: (text: boolean, record: GetGuestResponse) => {
        if (record.confirmAttended === "attendance") {
          return <Text type="success">Yes</Text>;
        }
        if (record.confirmAttended === "not_attendance") {
          return <Text type="danger">No</Text>;
        }
        return <Text>-</Text>;
      },
    },
    {
      title: "Có đi",
      dataIndex: "isAttended",
      key: "isAttended",
      width: 80,
      minWidth: 80,
      align: "center" as const,
      render: (text: boolean, record: GetGuestResponse) =>
        renderEditableCell(text, record, "isAttended", "checkbox"),
    },
    {
      title: "Mừng cưới",
      dataIndex: "giftAmount",
      key: "giftAmount",
      width: 120,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "giftAmount"),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "note"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: any, record: GetGuestResponse) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa khách mời này?"
          onConfirm={() => handleDeleteGuests([record.id])}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="link" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Search and Actions */}
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm khách mời..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              style={{ maxWidth: 400 }}
            />
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                // onClick={() => setIsModalVisible(true)}
                style={{
                  background: "#1e8267",
                  borderColor: "#1e8267",
                }}
              >
                Thêm mới
              </Button>
              {selectedRowKeys.length > 0 && (
                <Popconfirm
                  title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} khách mời đã chọn?`}
                  onConfirm={() => handleDeleteGuests(selectedRowKeys)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button danger icon={<DeleteOutlined />} size="large">
                    Xóa đã chọn ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              )}
            </Space>
          </Col>
        </Row>

        {/* Table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={guests || []}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
          size="middle"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          locale={{
            emptyText:
              guests && guests.length === 0 && !loading
                ? "Chưa có khách mời nào"
                : undefined,
          }}
        />
      </Space>
      <Modal
        title="Thêm khách mời mới"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateGuest}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input placeholder="Nhập tên khách mời" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Facebook" name="facebook">
                <Input placeholder="Nhập link Facebook" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Lời mời" name="invitationText">
                <Input placeholder="Nhập Lời mời" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  background: "#1e8267",
                  borderColor: "#1e8267",
                }}
              >
                Thêm mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default GuestTabContent;
