import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  message,
  Typography,
  Space,
  Popconfirm,
  List,
  Card,
  Row,
  Col,
} from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  authAPI,
  UserProfile,
  UpdateProfileRequest,
  StoryRequest,
} from "../../../../services/api";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;

interface StoryConfigTabProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const emptyStoryKey = (key: number = 0): StoryRequest & { key: string } => ({
  title: "",
  date: "",
  description: "",
  key: key.toString(),
});

const StoryConfigTab: React.FC<StoryConfigTabProps> = ({
  profile,
  onUpdate,
}) => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<(StoryRequest & { key: string })[]>([]);

  useEffect(() => {
    if (profile?.config?.story) {
      const _story = profile?.config?.story.map((e, index) => ({
        ...e,
        key: index.toString(),
      }));
      setStory(_story.length > 0 ? _story : [emptyStoryKey()]);
    } else {
      setStory([emptyStoryKey()]);
    }
  }, [profile]);

  const handleFieldChange = (
    index: number,
    field: keyof StoryRequest,
    value: string | boolean
  ) => {
    setStory((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAdd = () => {
    setStory((prev) => [...prev, emptyStoryKey(prev.length)]);
  };

  const handleRemove = (index: number) => {
    setStory((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const updateData: UpdateProfileRequest = {
        config: {
          story: story,
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
      <Space
        style={{
          marginBottom: 4,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text type="secondary">Cấu hình thông tin Câu chuyện tình iu</Text>
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
      <List
        dataSource={story}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              title={
                <Row gutter={16}>
                  <Col span={10} className="flex items-center gap-[10px]">
                    <Text>Tiêu đề:</Text>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        handleFieldChange(index, "title", e.target.value)
                      }
                      placeholder="Nhập Tiêu đề"
                    />
                  </Col>
                  <Col span={8} className="flex items-center gap-[10px]">
                    <Text>Thời gian: </Text>
                    <Input
                      value={item.date}
                      onChange={(e) =>
                        handleFieldChange(index, "date", e.target.value)
                      }
                      placeholder="Nhập thời gian"
                    />
                  </Col>
                  <Col span={6} className="flex justify-end">
                    <Space>
                      <Popconfirm
                        title="Bạn có chắc muốn xóa câu chuyện này?"
                        onConfirm={() => handleRemove(index)}
                        okText="Xóa"
                        cancelText="Hủy"
                        disabled={story.length === 1}
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          disabled={story.length === 1}
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </Space>
                  </Col>
                </Row>
              }
              className="w-full"
            >
              <Space direction="vertical" className="w-full flex">
                <TextArea
                  autoSize={{ minRows: 3 }}
                  value={item.description}
                  onChange={(e) =>
                    handleFieldChange(index, "description", e.target.value)
                  }
                  placeholder="Câu chuyện tình iu"
                />
              </Space>
            </Card>
          </List.Item>
        )}
      />
      <Button icon={<PlusOutlined />} onClick={handleAdd} type="dashed" block>
        Thêm câu chuyện
      </Button>
    </div>
  );
};

export default StoryConfigTab;
