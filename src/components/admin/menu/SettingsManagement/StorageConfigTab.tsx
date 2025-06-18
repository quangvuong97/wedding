import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";
import { SaveOutlined, LinkOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  authAPI,
  UserProfile,
  UpdateProfileRequest,
} from "../../../../services/api";

const { Text } = Typography;

interface StorageConfigTabProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const StorageConfigTab: React.FC<StorageConfigTabProps> = ({
  profile,
  onUpdate,
}) => {
  const { accessToken } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.config?.storageKey) {
      form.setFieldsValue({
        publicKey: profile.config.storageKey.publicKey,
        privateKey: profile.config.storageKey.privateKey,
        urlEndpoint: profile.config.storageKey.urlEndpoint,
      });
    }
  }, [profile, form]);

  const handleSave = async (values: any) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const updateData: UpdateProfileRequest = {
        config: {
          storageKey: {
            publicKey: values.publicKey,
            privateKey: values.privateKey,
            urlEndpoint: values.urlEndpoint,
          },
        },
      };

      const updatedProfile = await authAPI.updateProfile(
        accessToken,
        updateData
      );
      onUpdate(updatedProfile);
      message.success("Cấu hình kho lưu trữ đã được cập nhật thành công!");
    } catch (error: any) {
      message.error(`Không thể cập nhật cấu hình: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Text type="secondary">
          Cấu hình thông tin kết nối với dịch vụ lưu trữ ảnh và tệp tin
        </Text>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSave} size="large">
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              label="Public Key"
              name="publicKey"
              rules={[
                { required: true, message: "Vui lòng nhập Public Key" },
                { min: 10, message: "Public Key phải có ít nhất 10 ký tự" },
              ]}
            >
              <Input
                placeholder="Nhập Public Key của dịch vụ lưu trữ"
                prefix={<LinkOutlined style={{ color: "#1e8267" }} />}
              />
            </Form.Item>
          </Col>

          <Col xs={24} lg={12}>
            <Form.Item
              label="Private Key"
              name="privateKey"
              rules={[
                { required: true, message: "Vui lòng nhập Private Key" },
                { min: 10, message: "Private Key phải có ít nhất 10 ký tự" },
              ]}
            >
              <Input.Password
                placeholder="Nhập Private Key của dịch vụ lưu trữ"
                prefix={<LinkOutlined style={{ color: "#1e8267" }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="URL Endpoint"
          name="urlEndpoint"
          rules={[
            { required: true, message: "Vui lòng nhập URL Endpoint" },
            { type: "url", message: "Vui lòng nhập URL hợp lệ" },
          ]}
        >
          <Input
            placeholder="https://your-storage-service.com/api"
            prefix={<LinkOutlined style={{ color: "#1e8267" }} />}
          />
        </Form.Item>

        <Divider />

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
            style={{
              background: "#1e8267",
              borderColor: "#1e8267",
              minWidth: "120px",
            }}
          >
            Lưu Cấu Hình
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StorageConfigTab;
