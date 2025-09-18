import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message as messageAntd,
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
import { useStyle } from "../../styles";
import useScrollTable from "../../../../common/useScrollTable";

const { Text } = Typography;
const { TextArea } = Input;

export interface EditingField {
  id: string;
  field: string;
  value: any;
}

const ExpenseTabContent: React.FC = () => {
  const { accessToken } = useAuth();
  const { styles } = useStyle();
  const scrollY = useScrollTable(312);
  const [message, contextHolder] = messageAntd.useMessage();

  const [expenses, setExpenses] = useState<GetExpenseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectSpender, setSelectSpender] = useState<string>("");
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const divRefs = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});
  const setDivRef = (id: string) => (el: HTMLDivElement | null) => {
    divRefs.current[id] = el;
  };
  const [selectDropdownOpen, setSelectDropdownOpen] = useState(false);

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
      message.error("Không thể tải danh sách chi phí");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clickedInside = Object.values(divRefs.current).some((el) => {
        if (!el) return false;
        return el.contains(event.target as Node);
      });
      if (!clickedInside && !selectDropdownOpen) {
        setEditingField(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectDropdownOpen]);

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
      message.success("Xóa chi phí thành công");
      setSelectedRowKeys([]);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => !expenseIds.includes(expense.id))
      );
    } catch (error: any) {
      message.error("Không thể xóa chi phí");
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
          // Move cursor to the end when starting to edit
          const len = domTextarea.value.length;
          domTextarea.setSelectionRange(len, len);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingField?.id, editingField?.field]);

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
          <div ref={setDivRef(`${record.id}_${field}_edit`)}>
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
          </div>
        );
      }

      if (field === "spender") {
        return (
          <Space>
            <div ref={setDivRef(`${record.id}_${field}_edit_select`)}>
              <Select
                open={selectDropdownOpen}
                onOpenChange={setSelectDropdownOpen}
                value={editingField.value}
                style={{ width: 120 }}
                onChange={(value) =>
                  setEditingField((prev) => (prev ? { ...prev, value } : null))
                }
                options={[
                  { value: "husband", label: "Chồng" },
                  { value: "wife", label: "Vợ" },
                ]}
              />
            </div>
            <div ref={setDivRef(`${record.id}_${field}_edit_save`)}>
              <Button
                type="link"
                size="small"
                icon={<SaveOutlined />}
                onClick={() => handleSaveEdit(editingField)}
              />
            </div>
            <div ref={setDivRef(`${record.id}_${field}_edit_cancel`)}>
              <Button
                type="link"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => setEditingField(null)}
              />
            </div>
          </Space>
        );
      }

      return (
        <div ref={setDivRef(`${record.id}_${field}_edit`)}>
          <TextArea
            ref={textAreaRef}
            size="small"
            value={editingField.value}
            onChange={(e) =>
              setEditingField((prev) =>
                prev ? { ...prev, value: e.target.value } : null
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSaveEdit(editingField);
              }
              handleKeyDown && handleKeyDown(e);
            }}
            autoSize
          />
        </div>
      );
    }

    return (
      <div
        onClick={() => handleEdit(record, field)}
        ref={setDivRef(`${record.id}_${field}`)}
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
    {
      title: "Thao tác",
      key: "action",
      width: 50,
      align: "center" as const,
      render: (_: any, record: GetExpenseResponse) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa chi phí này?"
          onConfirm={() => handleDeleteExpenses([record.id])}
          getPopupContainer={(triggerNode) =>
            triggerNode.closest("#root") as HTMLElement
          }
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
      {contextHolder}
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        {/* Search and Actions */}
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size={16}>
              <Input
                value={searchKeyword}
                placeholder="Tìm kiếm tên chi phí"
                allowClear
                onChange={(event) => handleSearch(event.target.value)}
                prefix={<SearchOutlined />}
                style={{ maxWidth: 400 }}
              />
              <Space size={5}>
                <Text>Ai chi:</Text>
                <Select
                  style={{ width: 120 }}
                  value={selectSpender}
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
                className="shadow-none"
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
                className="shadow-none"
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
                  <Button danger icon={<DeleteOutlined />}>
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
            Tổng chi:{" "}
            {formatNumber(
              String(expenseFilter.reduce((pre, cur) => pre + cur.amount, 0))
            )}
            ₫
          </Text>
          <Text>|</Text>
          <Text style={{ marginTop: 8 }} type="danger">
            Anh chi:{" "}
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
            Em chi:{" "}
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
          className={styles.customTable}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={expenseFilter || []}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 500, y: scrollY }}
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
                className="shadow-none"
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
