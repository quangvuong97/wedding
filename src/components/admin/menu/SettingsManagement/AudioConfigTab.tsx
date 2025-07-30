import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  message as messageAntd,
  Typography,
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
import { useStyle } from "../../styles";
import useScrollTable from "../../../../common/useScollTable";

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
  const { styles } = useStyle();
  const scrollY = useScrollTable(310);
  const [message, contextHolder] = messageAntd.useMessage();

  const [loading, setLoading] = useState(false);
  const [audios, setAudios] = useState<{ id: string; url: string }[]>([]);

  useEffect(() => {
    if (profile?.config?.audios) {
      setAudios(
        profile.config.audios.length > 0
          ? profile.config.audios.map((e, i) => ({ id: i.toString(), url: e }))
          : []
      );
    } else {
      setAudios([{ id: "0", url: "" }]);
    }
  }, [profile]);

  const handleFieldChange = (index: number, value: string) => {
    setAudios((prev) => {
      const updated = [...prev];
      updated[index].url = value;
      return updated;
    });
  };

  const handleAdd = () => {
    setAudios((prev) => [
      ...prev,
      { id: (+prev[prev.length - 1].id + 1).toString(), url: "" },
    ]);
  };

  const handleRemove = (index: number) => {
    setAudios((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!accessToken) return;
    for (let i = 0; i < audios.length; i++) {
      const audio = audios[i];
      try {
        new URL(audio.url);
      } catch {
        message.error(`URL Endpoint ở dòng ${i + 1} không hợp lệ`);
        return;
      }
    }
    try {
      setLoading(true);
      const updateData: UpdateProfileRequest = {
        config: { audios: audios.map((e) => e.url) },
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
      {contextHolder}
      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text type="secondary">
          Cấu hình danh sách bài hát phát trên web. Mỗi lần vào web sẽ lấy ngẫu
          nhiên một bài để phát
        </Text>
        <Button
          type="primary"
          onClick={handleSave}
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
      </Space>
      <Table
        className={styles.customTable}
        dataSource={audios}
        rowKey={(audio) => audio.id.toString()}
        pagination={false}
        bordered
        scroll={{ y: scrollY }}
        style={{ marginBottom: 16 }}
      >
        <Table.Column
          title="Link nhạc"
          dataIndex="url"
          key="url"
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
      <Button icon={<PlusOutlined />} onClick={handleAdd} type="dashed" block>
        Thêm audio
      </Button>
    </div>
  );
};

export default AudioConfigTab;
