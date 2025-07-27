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
  Select,
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
  EConfirmAttended,
  EGuestOfType,
  GetGuestResponse,
  guestAPI,
  UpdateGuestRequest,
} from "../../../../services/api";
import { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import InputPresent from "../../../common/InputPresent";
import { TextAreaRef } from "antd/es/input/TextArea";

const { Text } = Typography;
const { TextArea } = Input;

export interface EditingGuest {
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
  const [selectInvite, setSelectInvite] = useState<boolean | null>(null);
  const [selectAttended, setSelectAttended] = useState<boolean | null>(null);
  const [selectConfirmAttended, setSelectConfirmAttended] = useState("");
  const [editingGuest, setEditingGuest] = useState<EditingGuest | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const guestFilter = guests.filter((guest) => {
    const matchText =
      guest.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      guest.phoneNumber.includes(searchKeyword);

    const matchConfirmAttended =
      selectConfirmAttended === "" ||
      (selectConfirmAttended === EConfirmAttended.ATTENDANCE &&
        guest.confirmAttended === "attendance") ||
      (selectConfirmAttended === EConfirmAttended.NOT_ATTENDANCE &&
        guest.confirmAttended === "not_attendance") ||
      (selectConfirmAttended === "_" && !guest.confirmAttended);

    const matchInvite =
      selectInvite === null ||
      (selectInvite === true && guest.isInvite) ||
      (selectInvite === false && !guest.isInvite);

    const matchAttended =
      selectAttended === null ||
      (selectAttended === true && guest.isAttended) ||
      (selectAttended === false && !guest.isAttended);

    return matchText && matchConfirmAttended && matchInvite && matchAttended;
  });

  const updateGuest = (response: GetGuestResponse) => {
    // Update the guest in the state
    setGuests((prevGuests) =>
      prevGuests.map((guest) =>
        guest.id === response.id ? { ...guest, ...response } : guest
      )
    );
  };

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
      message.error("Không thể tải danh sách khách mời");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleEdit = (
    record: GetGuestResponse,
    field: keyof GetGuestResponse
  ) => {
    let currentValue = record[field];
    if (typeof currentValue === "boolean") {
      currentValue = !currentValue;
    }
    setEditingGuest({
      id: record.id,
      field,
      value: currentValue,
    });
  };

  const handleSaveEdit = async (editingGuest: EditingGuest) => {
    if (!editingGuest || !accessToken) return;
    try {
      const updateData: UpdateGuestRequest = {
        [editingGuest.field]: editingGuest.value,
      };

      const response = await guestAPI.updateGuest(
        accessToken,
        editingGuest.id,
        updateData
      );
      message.success("Cập nhật thành công");
      setEditingGuest(null);
      updateGuest(response);
    } catch (error: any) {
      message.error("Không thể cập nhật thông tin");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setEditingGuest(null);
    }
  };

  const handleDeleteGuests = async (guestIds: string[]) => {
    if (!accessToken) return;

    try {
      await guestAPI.deleteGuests(accessToken, guestIds);
      message.success("Xóa khách mời thành công");
      setSelectedRowKeys([]);
      setGuests((prevGuests) =>
        prevGuests.filter((guest) => !guestIds.includes(guest.id))
      );
    } catch (error: any) {
      message.error("Không thể xóa khách mời");
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as string[]);
    },
  };

  const textAreaRef = useRef<TextAreaRef | null>(null);

  useEffect(() => {
    if (editingGuest) {
      if (textAreaRef.current) {
        const domTextarea = textAreaRef.current.resizableTextArea?.textArea;

        if (domTextarea) {
          domTextarea.focus();
          const len = domTextarea.value.length;

          setTimeout(() => {
            domTextarea.setSelectionRange(len, len);
          }, 0);
        }
      }
    }
  }, [editingGuest]);

  const renderEditableCell = (
    text: any,
    record: GetGuestResponse,
    field: keyof GetGuestResponse,
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
              onClick={() => handleSaveEdit(editingGuest)}
            />
            <Button
              type="link"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => setEditingGuest(null)}
            />
          </Space>
        );
      }

      return (
        <Space size={0}>
          <TextArea
            ref={textAreaRef}
            size="small"
            value={editingGuest.value}
            onChange={(e) =>
              setEditingGuest((prev) =>
                prev ? { ...prev, value: e.target.value } : null
              )
            }
            onPressEnter={() => handleSaveEdit(editingGuest)}
            onKeyDown={handleKeyDown}
            autoSize
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
      const guestData: CreateGuestRequest = { ...values, guestOf };

      const response = await guestAPI.createGuest(accessToken, guestData);
      message.success("Thêm khách mời thành công");
      setIsModalVisible(false);
      form.resetFields();
      setGuests((prevGuests) => [response, ...prevGuests]);
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
      width: 130,
      minWidth: 130,
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
      width: 65,
      minWidth: 65,
      align: "center" as const,
      render: (text: boolean, record: GetGuestResponse) =>
        renderEditableCell(text, record, "isInvite", "checkbox"),
    },
    {
      title: "Xác nhận",
      dataIndex: "confirmAttended",
      key: "confirmAttended",
      width: 65,
      minWidth: 65,
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
      title: "Có đến",
      dataIndex: "isAttended",
      key: "isAttended",
      width: 65,
      minWidth: 65,
      align: "center" as const,
      render: (text: boolean, record: GetGuestResponse) =>
        renderEditableCell(text, record, "isAttended", "checkbox"),
    },
    {
      title: "Mừng cưới",
      dataIndex: "giftAmount",
      key: "giftAmount",
      width: 180,
      render: (text: string, record: GetGuestResponse) => (
        <InputPresent
          text={text}
          editingGuest={editingGuest}
          setEditingGuest={setEditingGuest}
          record={record}
          field="giftAmount"
          handleSaveEdit={handleSaveEdit}
        />
      ),
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
      width: 50,
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
            <Space>
              <Input
                value={searchKeyword}
                placeholder="Tìm kiếm khách mời..."
                allowClear
                size="large"
                onChange={(event) => handleSearch(event.target.value)}
                prefix={<SearchOutlined />}
                style={{ maxWidth: 400 }}
              />
              <Space size={0}>
                <Button size="large" type="text">
                  Đã mời
                </Button>
                <Select
                  defaultValue={null}
                  style={{ width: 120 }}
                  size="large"
                  onChange={setSelectInvite}
                  options={[
                    { value: null, label: "Tất cả" },
                    { value: true, label: "Đã mời" },
                    { value: false, label: "Chưa mời" },
                  ]}
                />
              </Space>
              <Space size={0}>
                <Button size="large" type="text" variant="outlined">
                  Xác nhận
                </Button>
                <Select
                  defaultValue=""
                  style={{ width: 120 }}
                  size="large"
                  onChange={setSelectConfirmAttended}
                  options={[
                    { value: "", label: "Tất cả" },
                    { value: EConfirmAttended.ATTENDANCE, label: "Yes" },
                    { value: EConfirmAttended.NOT_ATTENDANCE, label: "No" },
                    { value: "_", label: "Chưa xác nhận" },
                  ]}
                />
              </Space>
              <Space size={0}>
                <Button size="large" type="text">
                  Có đến
                </Button>
                <Select
                  defaultValue={null}
                  style={{ width: 120 }}
                  size="large"
                  onChange={setSelectAttended}
                  options={[
                    { value: null, label: "Tất cả" },
                    { value: true, label: "Có đến" },
                    { value: false, label: "Không đến" },
                  ]}
                />
              </Space>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setSearchKeyword("");
                  setSelectConfirmAttended("");
                  setSelectInvite(null);
                  setSelectAttended(null);
                }}
              >
                Xóa lọc
              </Button>
            </Space>
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

        <Text style={{ marginTop: 8 }}>
          {guestFilter ? guestFilter.length : 0}/{guests.length} tổng số khách
          mời
        </Text>
        {/* Table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={guestFilter || []}
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
