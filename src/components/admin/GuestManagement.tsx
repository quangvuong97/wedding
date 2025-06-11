import React, { useState, useEffect } from "react";
import {
  Tabs,
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  message,
  Checkbox,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import {
  guestAPI,
  EGuestOfType,
  GetGuestResponse,
  CreateGuestRequest,
  UpdateGuestRequest,
} from "../../services/api";

const { Title } = Typography;
const { Search } = Input;

interface EditingGuest {
  id: string;
  field: string;
  value: any;
}

const GuestManagement: React.FC = () => {
  const { accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<EGuestOfType>(EGuestOfType.GROOM);
  const [guests, setGuests] = useState<GetGuestResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGuest, setEditingGuest] = useState<EditingGuest | null>(null);
  const [form] = Form.useForm();

  // Fetch guests data
  const fetchGuests = async (
    guestOf: EGuestOfType = activeTab,
    page: number = pagination.current,
    keyword: string = searchKeyword
  ) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await guestAPI.getGuests(accessToken, {
        guestOf,
        page,
        size: pagination.pageSize,
        keyword: keyword || undefined,
      });

      console.log("GuestManagement: API response:", response);
      console.log(
        "GuestManagement: Response type:",
        typeof response,
        "isArray:",
        Array.isArray(response)
      );

      // API always returns array directly (not wrapped in pagination object)
      const guestsData = Array.isArray(response)
        ? response
        : response.data || [];
      console.log("GuestManagement: Final guests data:", guestsData);

      setGuests(Array.isArray(guestsData) ? guestsData : []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: guestsData.length,
      }));
    } catch (error: any) {
      console.error("GuestManagement: Error fetching guests:", error);
      message.error("Không thể tải danh sách khách mời");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [activeTab, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key as EGuestOfType);
    setSelectedRowKeys([]);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchGuests(activeTab, 1, value);
  };

  // Handle pagination change
  const handleTableChange = (pagination: any) => {
    setPagination((prev) => ({ ...prev, current: pagination.current }));
    fetchGuests(activeTab, pagination.current);
  };

  // Handle create guest
  const handleCreateGuest = async (values: any) => {
    if (!accessToken) return;

    try {
      const guestData: CreateGuestRequest = {
        ...values,
        guestOf: activeTab,
      };

      await guestAPI.createGuest(accessToken, guestData);
      message.success("Thêm khách mời thành công");
      setIsModalVisible(false);
      form.resetFields();
      fetchGuests();
    } catch (error: any) {
      message.error("Không thể thêm khách mời");
    }
  };

  // Handle inline edit
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

  // Render editable cell
  const renderEditableCell = (
    text: any,
    record: GetGuestResponse,
    field: string,
    type: "text" | "checkbox" = "text"
  ) => {
    const isEditing =
      editingGuest?.id === record.id && editingGuest?.field === field;

    if (isEditing) {
      if (type === "checkbox") {
        return (
          <Space>
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
        <Space>
          <Input
            size="small"
            value={editingGuest.value}
            onChange={(e) =>
              setEditingGuest((prev) =>
                prev ? { ...prev, value: e.target.value } : null
              )
            }
            onPressEnter={handleSaveEdit}
            style={{ width: 120 }}
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
        }}
        className="editable-cell"
      >
        {text || "-"}
      </div>
    );
  };

  // Table columns
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "name"),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 120,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "slug"),
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "phoneNumber"),
    },
    {
      title: "Facebook",
      dataIndex: "facebook",
      key: "facebook",
      width: 150,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "facebook"),
    },
    {
      title: "Mối quan hệ",
      dataIndex: "relation",
      key: "relation",
      width: 120,
      render: (text: string, record: GetGuestResponse) =>
        renderEditableCell(text, record, "relation"),
    },
    {
      title: "Đã mời",
      dataIndex: "isInvite",
      key: "isInvite",
      width: 80,
      align: "center" as const,
      render: (text: boolean, record: GetGuestResponse) =>
        renderEditableCell(text, record, "isInvite", "checkbox"),
    },
    {
      title: "Có tham dự",
      dataIndex: "isAttended",
      key: "isAttended",
      width: 100,
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

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as string[]);
    },
  };

  console.log("GuestManagement: Current guests state:", guests);
  console.log("GuestManagement: Current activeTab:", activeTab);
  console.log("GuestManagement: Current loading:", loading);

  // Render tab content
  const renderTabContent = () => (
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
              onClick={() => setIsModalVisible(true)}
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
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} khách mời`,
        }}
        onChange={handleTableChange}
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
  );

  const tabItems = [
    {
      key: EGuestOfType.GROOM,
      label: "Nhà trai",
      children: renderTabContent(),
    },
    {
      key: EGuestOfType.BRIDE,
      label: "Nhà gái",
      children: renderTabContent(),
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

      {/* Create Guest Modal */}
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
              <Form.Item
                label="Slug"
                name="slug"
                rules={[{ required: true, message: "Vui lòng nhập slug!" }]}
              >
                <Input placeholder="Nhập slug" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mối quan hệ" name="relation">
                <Input placeholder="Nhập mối quan hệ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Facebook" name="facebook">
            <Input placeholder="Nhập link Facebook" />
          </Form.Item>

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
    </Card>
  );
};

export default GuestManagement;
