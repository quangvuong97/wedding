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
import { SaveOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  authAPI,
  UserProfile,
  UpdateProfileRequest,
} from "../../../../services/api";

const { Text } = Typography;

interface AudioConfigTabProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const AudioConfigTab: React.FC<AudioConfigTabProps> = ({
  profile,
  onUpdate,
}) => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [audios, setAudios] = useState<string[]>([]);

  useEffect(() => {
    if (profile?.config?.audios) {
      setAudios(
        profile.config.audios.length > 0 ? profile.config.audios : [""]
      );
    } else {
      setAudios([""]);
    }
  }, [profile]);

  const handleFieldChange = (index: number, value: string) => {
    setAudios((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAdd = () => {
    setAudios((prev) => [...prev, ""]);
  };

  const handleRemove = (index: number) => {
    setAudios((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!accessToken) return;
    for (let i = 0; i < audios.length; i++) {
      const audio = audios[i];
      try {
        new URL(audio);
      } catch {
        message.error(`URL Endpoint ở dòng ${i + 1} không hợp lệ`);
        return;
      }
    }
    try {
      setLoading(true);
      const updateData: UpdateProfileRequest = {
        config: { audios },
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
        dataSource={audios}
        // rowKey={(storageRequest) => storageRequest.urlEndpoint}
        pagination={false}
        bordered
        style={{ marginBottom: 16 }}
      >
        <Table.Column
          title="Link nhạc"
          dataIndex="audio"
          key="audio"
          render={(text, _, idx) => (
            <Input
              value={text}
              minLength={10}
              onChange={(e) => handleFieldChange(idx, e.target.value)}
              placeholder="Nhập link nhạc"
            />
          )}
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
                disabled={audios.length === 1}
              >
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  disabled={audios.length === 1}
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
        Thêm audio
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

export default AudioConfigTab;
