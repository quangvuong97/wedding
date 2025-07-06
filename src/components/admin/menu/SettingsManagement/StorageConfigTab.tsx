import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  message,
  Typography,
  Divider,
  Table,
  Space,
  Popconfirm,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  authAPI,
  UserProfile,
  UpdateProfileRequest,
  StorageKeyRequest,
} from "../../../../services/api";

const { Text } = Typography;

interface StorageConfigTabProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const emptyStorageKey = (): StorageKeyRequest => ({
  publicKey: "",
  privateKey: "",
  urlEndpoint: "",
  isDefault: false,
});

const StorageConfigTab: React.FC<StorageConfigTabProps> = ({
  profile,
  onUpdate,
}) => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [storageKeys, setStorageKeys] = useState<StorageKeyRequest[]>([]);

  useEffect(() => {
    if (profile?.config?.storageKey) {
      setStorageKeys(
        profile.config.storageKey.length > 0
          ? profile.config.storageKey
          : [emptyStorageKey()]
      );
    } else {
      setStorageKeys([emptyStorageKey()]);
    }
  }, [profile]);

  const handleFieldChange = (
    index: number,
    field: keyof StorageKeyRequest,
    value: string | boolean
  ) => {
    setStorageKeys((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setStorageKeys((prev) => [...prev, emptyStorageKey()]);
  };

  const handleRemove = (index: number) => {
    setStorageKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetDefault = (index: number) => {
    setStorageKeys((prev) =>
      prev.map((item, i) => ({ ...item, isDefault: i === index }))
    );
  };

  const handleSave = async () => {
    if (!accessToken) return;
    // Validate all fields
    for (let i = 0; i < storageKeys.length; i++) {
      const key = storageKeys[i];
      if (!key.publicKey || key.publicKey.length < 10) {
        message.error(`Public Key ở dòng ${i + 1} phải có ít nhất 10 ký tự`);
        return;
      }
      if (!key.privateKey || key.privateKey.length < 10) {
        message.error(`Private Key ở dòng ${i + 1} phải có ít nhất 10 ký tự`);
        return;
      }
      if (!key.urlEndpoint) {
        message.error(`URL Endpoint ở dòng ${i + 1} không được để trống`);
        return;
      }
      try {
        new URL(key.urlEndpoint);
      } catch {
        message.error(`URL Endpoint ở dòng ${i + 1} không hợp lệ`);
        return;
      }
    }
    if (!storageKeys.some((k) => k.isDefault)) {
      message.error("Phải chọn một kho lưu trữ mặc định!");
      return;
    }
    try {
      setLoading(true);
      const updateData: UpdateProfileRequest = {
        config: {
          storageKey: storageKeys,
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
      <Table
        dataSource={storageKeys}
        rowKey={(storageRequest) => storageRequest.urlEndpoint}
        pagination={false}
        bordered
        style={{ marginBottom: 16 }}
      >
        <Table.Column
          title="Public Key"
          dataIndex="publicKey"
          key="publicKey"
          render={(text, _, idx) => (
            <Input
              value={text}
              minLength={10}
              onChange={(e) =>
                handleFieldChange(idx, "publicKey", e.target.value)
              }
              placeholder="Nhập Public Key"
            />
          )}
        />
        <Table.Column
          title="Private Key"
          dataIndex="privateKey"
          key="privateKey"
          render={(text, _, idx) => (
            <Input.Password
              value={text}
              minLength={10}
              onChange={(e) =>
                handleFieldChange(idx, "privateKey", e.target.value)
              }
              placeholder="Nhập Private Key"
            />
          )}
        />
        <Table.Column
          title="URL Endpoint"
          dataIndex="urlEndpoint"
          key="urlEndpoint"
          render={(text, _, idx) => (
            <Input
              value={text}
              onChange={(e) =>
                handleFieldChange(idx, "urlEndpoint", e.target.value)
              }
              placeholder="https://your-storage-service.com/api"
            />
          )}
        />
        <Table.Column
          title="Mặc định"
          dataIndex="isDefault"
          key="isDefault"
          align="center"
          render={(_, __, idx) =>
            storageKeys[idx].isDefault ? (
              <Button type="primary" icon={<StarFilled />} disabled>
                Mặc định
              </Button>
            ) : (
              <Button
                icon={<StarOutlined />}
                onClick={() => handleSetDefault(idx)}
              >
                Đặt mặc định
              </Button>
            )
          }
        />
        <Table.Column
          title="Thao tác"
          key="actions"
          align="center"
          render={(_, __, idx) => (
            <Space>
              <Popconfirm
                title="Bạn có chắc muốn xóa kho lưu trữ này?"
                onConfirm={() => handleRemove(idx)}
                okText="Xóa"
                cancelText="Hủy"
                disabled={storageKeys.length === 1}
              >
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  disabled={storageKeys.length === 1}
                >
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
      <Button
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: 24 }}
        type="dashed"
        block
      >
        Thêm kho lưu trữ
      </Button>
      <Divider />
      <Button
        type="primary"
        onClick={handleSave}
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
    </div>
  );
};

export default StorageConfigTab;
