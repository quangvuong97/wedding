import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Typography,
  Space,
  DatePicker,
  Row,
  Col,
  Select,
  Image,
} from "antd";
import {
  SaveOutlined,
  UserOutlined,
  CalendarOutlined,
  QrcodeOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  authAPI,
  UserProfile,
  UpdateProfileRequest,
  Banks,
} from "../../../../services/api";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

const { Title, Text } = Typography;

interface WeddingConfigTabProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const WeddingConfigTab: React.FC<WeddingConfigTabProps> = ({
  profile,
  onUpdate,
}) => {
  const { accessToken } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [, setLoadingBanks] = useState(false);
  const [banks, setBanks] = useState<any>();

  useEffect(() => {
    if (profile?.config && banks && banks.length > 0) {
      const brideBank = banks?.find(
        (e: any) => e.id === profile.config?.brideBankId
      );
      const groomBank = banks?.find(
        (e: any) => e.id === profile.config?.groomBankId
      );
      form.setFieldsValue({
        brideBank: brideBank.shortName,
        groomBank: groomBank.shortName,
      });
    }
  }, [profile, form, banks]);

  useEffect(() => {
    if (profile?.config) {
      form.setFieldsValue({
        brideAccountName: profile.config.brideAccountName,
        brideAccountNumber: profile.config.brideAccountNumber,
        brideAddress: profile.config.brideAddress,
        brideGgAddress: profile.config.brideGgAddress,
        brideName: profile.config.brideName,
        groomIntroduction: profile.config.groomIntroduction,
        brideIntroduction: profile.config.brideIntroduction,
        groomAccountName: profile.config.groomAccountName,
        groomAccountNumber: profile.config.groomAccountNumber,
        groomAddress: profile.config.groomAddress,
        groomGgAddress: profile.config.groomGgAddress,
        groomName: profile.config.groomName,
        solarDate: profile.config.solarDate
          ? dayjs(profile.config.solarDate)
          : null,
        lunarDate: profile.config.lunarDate,
        weddingHours: profile.config.weddingHours,
        brideSolarDate: profile.config.brideSolarDate
          ? dayjs(profile.config.brideSolarDate)
          : null,
        brideLunarDate: profile.config.brideLunarDate,
        brideWeddingHours: profile.config.brideWeddingHours,
      });
    }
  }, [profile, form]);

  const fetchBanks = async () => {
    try {
      setLoadingBanks(true);
      const response = await authAPI.getListBank();

      setBanks(response);
    } catch (error: any) {
      console.error("GuestManagement: Error fetching guests:", error);
      message.error("Không thể tải danh sách khách mời");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleSave = async (values: any) => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const updateData: UpdateProfileRequest = {
        config: {
          brideAccountName: values.brideAccountName,
          brideAccountNumber: values.brideAccountNumber,
          brideAddress: values.brideAddress,
          brideBank: banks.find((e: Banks) => e.shortName === values.brideBank),
          brideGgAddress: values.brideGgAddress,
          brideName: values.brideName,
          groomIntroduction: values.groomIntroduction,
          brideIntroduction: values.brideIntroduction,
          groomAccountName: values.groomAccountName,
          groomAccountNumber: values.groomAccountNumber,
          groomAddress: values.groomAddress,
          groomBank: banks.find((e: Banks) => e.shortName === values.groomBank),
          groomGgAddress: values.groomGgAddress,
          groomName: values.groomName,
          lunarDate: values.lunarDate,
          solarDate: values.solarDate ? values.solarDate.toDate() : undefined,
          weddingHours: values.weddingHours,
          brideLunarDate: values.brideLunarDate,
          brideSolarDate: values.brideSolarDate
            ? values.brideSolarDate.toDate()
            : undefined,
          brideWeddingHours: values.brideWeddingHours,
        },
      };

      const updatedProfile = await authAPI.updateProfile(
        accessToken,
        updateData
      );
      onUpdate(updatedProfile);
      message.success("Cấu hình đám cưới đã được cập nhật thành công!");
    } catch (error: any) {
      message.error(`Không thể cập nhật cấu hình: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderBankSelect = (fieldName: string) => (
    <Form.Item shouldUpdate noStyle>
      {() => (
        <Space.Compact block style={{ width: "100%" }}>
          <Button style={{ width: "33%" }}>Ngân hàng</Button>
          <Form.Item name={fieldName} noStyle>
            <Select
              style={{ width: "100%" }}
              showSearch
              placeholder="Chọn bank"
              options={banks?.map((e: Banks) => ({
                value: e.shortName,
                label: e.shortName,
                logo: e.logo,
              }))}
              optionRender={(option) => (
                <Space>
                  <Image src={option.data.logo} preview={false} width={24} />
                  <Text>{option.label}</Text>
                </Space>
              )}
            />
          </Form.Item>
        </Space.Compact>
      )}
    </Form.Item>
  );

  return (
    <Form form={form} layout="vertical" onFinish={handleSave} size="large">
      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text type="secondary">
          Thiết lập thông tin cơ bản về đám cưới của bạn
        </Text>
        <Form.Item style={{ marginBottom: 0 }} noStyle>
          <Button
            size="middle"
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            style={{
              background: "#1e8267",
              borderColor: "#1e8267",
              minWidth: "120px",
            }}
          >
            Lưu Cấu Hình
          </Button>
        </Form.Item>
      </Space>

      {/* Thông tin cô dâu chú rể */}
      <Card
        size="small"
        title={
          <Space>
            <UserOutlined style={{ color: "#1e8267" }} />
            <span>Thông Tin Cô Dâu & Chú Rể</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Space direction="vertical" style={{ display: "flex" }}>
              <Form.Item
                style={{ margin: 0 }}
                label="Tên Chú Rể"
                name="groomName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên chú rể" },
                  { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input
                  placeholder="Nhập tên chú rể"
                  prefix={<UserOutlined style={{ color: "#1e8267" }} />}
                />
              </Form.Item>
              <Form.Item
                label="Lời giới thiệu"
                name="groomIntroduction"
                style={{ margin: 0 }}
              >
                <TextArea
                  rows={5}
                  style={{ textAlign: "right" }}
                  placeholder="Nhập địa chỉ tổ chức nhà trai"
                />
              </Form.Item>
            </Space>
          </Col>

          <Col xs={24} lg={12}>
            <Space direction="vertical" style={{ display: "flex" }}>
              <Form.Item
                style={{ margin: 0 }}
                label="Tên Cô Dâu"
                name="brideName"
                rules={[
                  { required: true, message: "Vui lòng nhập tên cô dâu" },
                  { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                ]}
              >
                <Input
                  placeholder="Nhập tên cô dâu"
                  prefix={<UserOutlined style={{ color: "#1e8267" }} />}
                />
              </Form.Item>
              <Form.Item
                label="Lời giới thiệu"
                name="brideIntroduction"
                style={{ margin: 0 }}
              >
                <TextArea
                  rows={5}
                  style={{ textAlign: "left" }}
                  placeholder="Nhập địa chỉ tổ chức nhà trai"
                />
              </Form.Item>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Ngày cưới */}
      <Card
        size="small"
        title={
          <Space>
            <CalendarOutlined style={{ color: "#1e8267" }} />
            <span>Ngày Cưới</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Title level={5}>Nhà Trai</Title>
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={6}>
                <Form.Item
                  label="Giờ"
                  name="weddingHours"
                  style={{ margin: 0 }}
                >
                  <Input
                    placeholder="Nhập giờ tổ chức"
                    suffix={<CalendarOutlined style={{ color: "#1e8267" }} />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label="Dương lịch"
                  name="solarDate"
                  style={{ margin: 0 }}
                >
                  <DatePicker
                    placeholder="Chọn ngày cưới"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    suffixIcon={
                      <CalendarOutlined style={{ color: "#1e8267" }} />
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Âm lịch"
                  name="lunarDate"
                  style={{ margin: 0 }}
                >
                  <Input
                    placeholder="Nhập lịch âm"
                    suffix={<CalendarOutlined style={{ color: "#1e8267" }} />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col xs={24} lg={12}>
            <Title level={5}>Nhà Gái</Title>
            <Row gutter={[24, 0]}>
              <Col xs={24} lg={6}>
                <Form.Item
                  label="Giờ"
                  name="brideWeddingHours"
                  style={{ margin: 0 }}
                >
                  <Input
                    placeholder="Nhập giờ tổ chức"
                    suffix={<CalendarOutlined style={{ color: "#1e8267" }} />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item
                  label="Dương lịch"
                  name="brideSolarDate"
                  style={{ margin: 0 }}
                >
                  <DatePicker
                    placeholder="Chọn ngày cưới"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    suffixIcon={
                      <CalendarOutlined style={{ color: "#1e8267" }} />
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <Form.Item
                  label="Âm lịch"
                  name="brideLunarDate"
                  style={{ margin: 0 }}
                >
                  <Input
                    placeholder="Nhập lịch âm"
                    suffix={<CalendarOutlined style={{ color: "#1e8267" }} />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/** Địa chỉ */}
      <Card
        size="small"
        title={
          <Space>
            <EnvironmentOutlined style={{ color: "#1e8267" }} />
            <span>Địa chỉ tổ chức</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Title level={5}>Nhà Trai</Title>
            <Space direction="vertical" style={{ display: "flex" }}>
              <Form.Item
                label="Địa chỉ"
                name="groomAddress"
                style={{ margin: 0 }}
              >
                <TextArea
                  rows={2}
                  style={{ textAlign: "center" }}
                  placeholder="Nhập địa chỉ tổ chức nhà trai"
                />
              </Form.Item>
              <Space.Compact style={{ width: "100%" }} block>
                <Button style={{ width: "30%" }}>Google Map</Button>
                <Form.Item name="groomGgAddress" noStyle>
                  <Input placeholder="Nhập google map nhà trai" />
                </Form.Item>
              </Space.Compact>
            </Space>
          </Col>

          <Col xs={24} lg={12}>
            <Title level={5}>Nhà Gái</Title>
            <Space direction="vertical" style={{ display: "flex" }}>
              <Form.Item
                name="brideAddress"
                style={{ margin: 0 }}
                label="Địa chỉ"
              >
                <TextArea
                  rows={2}
                  style={{ textAlign: "center" }}
                  placeholder="Nhập địa chỉ tổ chức nhà gái"
                />
              </Form.Item>
              <Space.Compact style={{ width: "100%" }} block>
                <Button style={{ width: "30%" }}>Google Map</Button>
                <Form.Item name="brideGgAddress" noStyle>
                  <Input placeholder="Nhập google map nhà gái" />
                </Form.Item>
              </Space.Compact>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* QR Code URLs */}
      <Card
        size="small"
        title={
          <Space>
            <QrcodeOutlined style={{ color: "#1e8267" }} />
            <span>Tài khoản ngân hàng</span>
          </Space>
        }
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Title level={5}>Nhà Trai</Title>
            <Space direction="vertical" style={{ display: "flex" }}>
              {renderBankSelect("groomBank")}
              <Space.Compact style={{ width: "100%" }} block>
                <Button style={{ width: "33%" }}>Tên tài khoản</Button>
                <Form.Item name="groomAccountName" noStyle>
                  <Input placeholder="Nhập tên tài khoản" />
                </Form.Item>
              </Space.Compact>
              <Space.Compact style={{ width: "100%" }} block>
                <Button style={{ width: "33%" }}>Số tài khoản</Button>
                <Form.Item name="groomAccountNumber" noStyle>
                  <Input placeholder="Nhập số tài khoản" />
                </Form.Item>
              </Space.Compact>
            </Space>
          </Col>

          <Col xs={24} lg={12}>
            <Title level={5}>Nhà Gái</Title>
            <Space direction="vertical" style={{ display: "flex" }}>
              {renderBankSelect("brideBank")}
              <Space.Compact style={{ width: "100%" }} block>
                <Button style={{ width: "33%" }}>Tên tài khoản</Button>
                <Form.Item name="brideAccountName" noStyle>
                  <Input placeholder="Nhập tên tài khoản" />
                </Form.Item>
              </Space.Compact>
              <Space.Compact style={{ width: "100%" }} block>
                <Button style={{ width: "33%" }}>Số tài khoản</Button>
                <Form.Item name="brideAccountNumber" noStyle>
                  <Input placeholder="Nhập số tài khoản" />
                </Form.Item>
              </Space.Compact>
            </Space>
          </Col>
        </Row>
      </Card>
    </Form>
  );
};

export default WeddingConfigTab;
