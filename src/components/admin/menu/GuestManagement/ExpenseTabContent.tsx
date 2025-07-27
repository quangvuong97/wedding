import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
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
  CreateExpenseRequest,
  GetExpenseResponse,
  expenseAPI,
  UpdateExpenseRequest,
  ESpender,
} from "../../../../services/api";
import { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { TextAreaRef } from "antd/es/input/TextArea";
import { formatNumber } from "../../../common/InputPresent";

const { Text } = Typography;
const { TextArea } = Input;

export interface EditingField {
  id: string;
  field: string;
  value: any;
}

const ExpenseTabContent: React.FC = () => {
  const { accessToken } = useAuth();

  const [expenses, setExpenses] = useState<GetExpenseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectSpender, setSelectSpender] = useState<string>("");
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const expenseFilter = expenses.filter((expense) => {
    const matchText = expense.name
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());

    const matchSpender =
      selectSpender === "" ||
      (selectSpender === ESpender.HUSBAND &&
        expense.spender === ESpender.HUSBAND) ||
      (selectSpender === ESpender.WIFE && expense.spender === ESpender.WIFE);

    return matchText && matchSpender;
  });

  const updateExpense = (response: GetExpenseResponse) => {
    // Update the expense in the state
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === response.id ? { ...expense, ...response } : expense
      )
    );
  };

  const fetchExpenses = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const response = await expenseAPI.getExpenses(accessToken, {
        page: 1,
        size: 99999,
      });

      setExpenses(response);
    } catch (error: any) {
      message.error("Không thể tải danh sách khách mời");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleEdit = (
    record: GetExpenseResponse,
    field: keyof GetExpenseResponse
  ) => {
    let currentValue = record[field];
    setEditingField({
      id: record.id,
      field,
      value: currentValue,
    });
  };

  const handleSaveEdit = async (editingExpense: EditingField) => {
    if (!editingExpense || !accessToken) return;
    try {
      const updateData: UpdateExpenseRequest = {
        [editingExpense.field]: editingExpense.value,
      };

      const response = await expenseAPI.updateExpense(
        accessToken,
        editingExpense.id,
        updateData
      );
      message.success("Cập nhật thành công");
      setEditingField(null);
      updateExpense(response);
    } catch (error: any) {
      message.error("Không thể cập nhật thông tin");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === "Escape") {
      setEditingField(null);
    }
  };

  const handleDeleteExpenses = async (expenseIds: string[]) => {
    if (!accessToken) return;

    try {
      await expenseAPI.deleteExpenses(accessToken, expenseIds);
      message.success("Xóa khách mời thành công");
      setSelectedRowKeys([]);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => !expenseIds.includes(expense.id))
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
    if (editingField) {
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
  }, [editingField]);

  const renderEditableCell = (
    text: any,
    record: GetExpenseResponse,
    field: keyof GetExpenseResponse,
    style?: React.CSSProperties
  ) => {
    const isEditing =
      editingField?.id === record.id && editingField?.field === field;

    if (isEditing) {
      if (field === "amount") {
        return (
          <InputNumber
            autoFocus
            style={{ width: "100%" }}
            formatter={(value) =>
              `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) =>
              value?.replace(/₫\s?|(,*)/g, "") as unknown as number
            }
            value={editingField.value}
            onChange={(value) =>
              setEditingField((prev) => (prev ? { ...prev, value } : null))
            }
            onPressEnter={() => handleSaveEdit(editingField)}
            onKeyDown={handleKeyDown}
          />
        );
      }

      if (field === "spender") {
        return (
          <Space>
            <Select
              value={editingField.value}
              style={{ width: 120 }}
              size="large"
              onChange={(value) =>
                setEditingField((prev) => (prev ? { ...prev, value } : null))
              }
              options={[
                { value: "husband", label: "Chồng" },
                { value: "wife", label: "Vợ" },
              ]}
            />
            <Button
              type="link"
              size="small"
              icon={<SaveOutlined />}
              onClick={() => handleSaveEdit(editingField)}
            />
            <Button
              type="link"
              size="small"
              icon={<CloseOutlined />}
              onClick={() => setEditingField(null)}
            />
          </Space>
        );
      }

      return (
        <TextArea
          ref={textAreaRef}
          size="small"
          value={editingField.value}
          onChange={(e) =>
            setEditingField((prev) =>
              prev ? { ...prev, value: e.target.value } : null
            )
          }
          onPressEnter={() => handleSaveEdit(editingField)}
          onKeyDown={handleKeyDown}
          autoSize
        />
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
        {field === "amount"
          ? `${String(text).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}₫`
          : field === "spender"
          ? text === ESpender.HUSBAND
            ? "chồng"
            : "vợ"
          : text}
      </div>
    );
  };

  const handleCreateExpense = async (values: any) => {
    if (!accessToken) return;

    try {
      const expenseData: CreateExpenseRequest = { ...values };

      const response = await expenseAPI.createExpense(accessToken, expenseData);
      message.success("Thêm chi phí thành công");
      setIsModalVisible(false);
      form.resetFields();
      setExpenses((prevExpenses) => [response, ...prevExpenses]);
    } catch (error: any) {
      message.error("Không thể thêm chi phí");
    }
  };

  const columns: ColumnsType<GetExpenseResponse> = [
    {
      title: "Thao tác",
      key: "action",
      width: 50,
      align: "center" as const,
      render: (_: any, record: GetExpenseResponse) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa chi phí này?"
          onConfirm={() => handleDeleteExpenses([record.id])}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="link" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 150,
      ellipsis: true,
      render: (text: string, record: GetExpenseResponse) =>
        renderEditableCell(text, record, "name"),
    },
    {
      title: "Chi phí",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (text: string, record: GetExpenseResponse) =>
        renderEditableCell(text, record, "amount"),
    },
    {
      title: "Ai chi",
      dataIndex: "spender",
      key: "spender",
      width: 150,
      render: (text: string, record: GetExpenseResponse) =>
        renderEditableCell(text, record, "spender"),
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
                placeholder="Tìm kiếm chi phí..."
                allowClear
                size="large"
                onChange={(event) => handleSearch(event.target.value)}
                prefix={<SearchOutlined />}
                style={{ maxWidth: 400 }}
              />
              <Space size={0}>
                <Button size="large" type="text">
                  Ai chi
                </Button>
                <Select
                  style={{ width: 120 }}
                  value={selectSpender}
                  size="large"
                  onChange={setSelectSpender}
                  options={[
                    { value: "", label: "Tất cả" },
                    { value: "husband", label: "Chồng" },
                    { value: "wife", label: "Vợ" },
                  ]}
                />
              </Space>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setSearchKeyword("");
                  setSelectSpender("");
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
                  title={`Bạn có chắc muốn xóa ${selectedRowKeys.length} Chi phí đã chọn?`}
                  onConfirm={() => handleDeleteExpenses(selectedRowKeys)}
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

        <Space>
          <Text style={{ marginTop: 8 }}>
            {expenseFilter ? expenseFilter.length : 0}/{expenses.length} tổng số
            chi phí
          </Text>
          <Text>|</Text>
          <Text style={{ marginTop: 8 }} type="success">
            TỔNG CHI:{" "}
            {formatNumber(
              String(expenseFilter.reduce((pre, cur) => pre + cur.amount, 0))
            )}
            ₫
          </Text>
          <Text>|</Text>
          <Text style={{ marginTop: 8 }} type="danger">
            ANH CHI:{" "}
            {formatNumber(
              String(
                expenseFilter
                  .filter((e) => e.spender === ESpender.HUSBAND)
                  .reduce((pre, cur) => pre + cur.amount, 0)
              )
            )}
            ₫
          </Text>
          <Text>|</Text>
          <Text style={{ marginTop: 8 }} type="warning">
            EM CHI:{" "}
            {formatNumber(
              String(
                expenseFilter
                  .filter((e) => e.spender === ESpender.WIFE)
                  .reduce((pre, cur) => pre + cur.amount, 0)
              )
            )}
            ₫
          </Text>
        </Space>
        {/* Table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={expenseFilter || []}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 500 }}
          size="middle"
          rowClassName={(_, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          locale={{
            emptyText:
              expenses && expenses.length === 0 && !loading
                ? "Chưa có chi phí nào"
                : undefined,
          }}
        />
      </Space>
      <Modal
        title="Thêm chi phí mới"
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
          onFinish={handleCreateExpense}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Nhập tên Chi phí" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Chi phí"
                name="amount"
                rules={[{ required: true, message: "Vui lòng nhập chi phí!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập chi phí"
                  formatter={(value) =>
                    `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value?.replace(/₫\s?|(,*)/g, "") as unknown as number
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ai chi"
                name="spender"
                rules={[{ required: true, message: "Vui lòng chọn ai chi!" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: "husband", label: "Chồng" },
                    { value: "wife", label: "Vợ" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

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

export default ExpenseTabContent;
