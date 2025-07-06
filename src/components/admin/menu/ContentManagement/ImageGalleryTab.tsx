import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Upload,
  Modal,
  Input,
  message,
  Spin,
  Checkbox,
  Popconfirm,
  Row,
  Col,
  Image,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  LinkOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  imageAPI,
  EImageStoreType,
  GetImageResponse,
} from "../../../../services/api";
import type { UploadFile } from "antd/es/upload/interface";
import { useAdminData } from "../../../../contexts/AdminDataContext";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ImageGalleryTabProps {
  type: EImageStoreType;
  title: string;
}

const ImageGalleryTab: React.FC<ImageGalleryTabProps> = ({ type, title }) => {
  const { accessToken } = useAuth();
  const [images, setImages] = useState<GetImageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const { adminData } = useAdminData();
  const urlEndpoint = useMemo(() => {
    return adminData?.config.storageKey.filter((e) => e.isDefault)[0]
      .urlEndpoint;
  }, [adminData]);

  // Load images
  const loadImages = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const data = await imageAPI.getImages(accessToken, type);
      setImages(data);
    } catch (error: any) {
      message.error(`Không thể tải danh sách ảnh: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, type]);

  // Handle image selection
  const handleImageSelect = (imageId: string, checked: boolean) => {
    if (checked) {
      setSelectedImages((prev) => [...prev, imageId]);
    } else {
      setSelectedImages((prev) => prev.filter((id) => id !== imageId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedImages(images.map((img) => img.id));
    } else {
      setSelectedImages([]);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!accessToken || selectedImages.length === 0) return;

    try {
      setLoading(true);
      const result = await imageAPI.bulkDeleteImages(accessToken, {
        type,
        imageIds: selectedImages,
      });
      message.success(`Đã xóa ${result.deletedCount} ảnh thành công`);
      setSelectedImages([]);
      await loadImages();
    } catch (error: any) {
      message.error(`Không thể xóa ảnh: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle single delete
  const handleSingleDelete = async (imageId: string) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      await imageAPI.bulkDeleteImages(accessToken, {
        type,
        imageIds: [imageId],
      });
      message.success("Đã xóa ảnh thành công");
      await loadImages();
    } catch (error: any) {
      message.error(`Không thể xóa ảnh: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!accessToken) return;

    const files = fileList
      .map((file) => file.originFileObj as File)
      .filter(Boolean);
    const urls = urlInput
      .split("\n")
      .filter((url) => url.trim())
      .map((url) => url.trim());

    if (files.length === 0 && urls.length === 0) {
      message.warning("Vui lòng chọn ảnh hoặc nhập URL");
      return;
    }

    try {
      setUploadLoading(true);
      const result = await imageAPI.uploadImages(accessToken, files, {
        type,
        urls,
      });
      message.success(`Đã tải lên ${result.length} ảnh thành công`);
      setUploadModalVisible(false);
      setFileList([]);
      setUrlInput("");
      await loadImages();
    } catch (error: any) {
      message.error(`Không thể tải lên ảnh: ${error.message}`);
    } finally {
      setUploadLoading(false);
    }
  };

  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
      setFileList(newFileList);
    },
    beforeUpload: () => false, // Prevent auto upload
    accept: "image/*",
    multiple: true,
    listType: "picture-card" as const,
  };

  return (
    <div>
      {/* Header Actions */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space>
          <Checkbox
            checked={
              selectedImages.length === images.length && images.length > 0
            }
            indeterminate={
              selectedImages.length > 0 && selectedImages.length < images.length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            Chọn tất cả ({selectedImages.length}/{images.length})
          </Checkbox>
          {selectedImages.length > 0 && (
            <Popconfirm
              title={`Bạn có chắc chắn muốn xóa ${selectedImages.length} ảnh đã chọn?`}
              onConfirm={handleBulkDelete}
              okText="Xóa"
              cancelText="Hủy"
              okType="danger"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Xóa đã chọn ({selectedImages.length})
              </Button>
            </Popconfirm>
          )}
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setUploadModalVisible(true)}
          style={{ background: "#1e8267", borderColor: "#1e8267" }}
        >
          Tải lên ảnh
        </Button>
      </div>

      {/* Image Gallery */}
      <Spin spinning={loading}>
        {images.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fafafa",
              borderRadius: "8px",
              border: "1px dashed #d9d9d9",
            }}
          >
            <FileImageOutlined
              style={{
                fontSize: "48px",
                color: "#bfbfbf",
                marginBottom: "16px",
              }}
            />
            <Title level={4} style={{ color: "#bfbfbf", margin: 0 }}>
              Chưa có ảnh nào
            </Title>
            <Text style={{ color: "#8c8c8c" }}>
              Nhấn "Tải lên ảnh" để thêm ảnh mới
            </Text>
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {images.map((image) => (
              <Col key={image.id} xs={12} sm={8} md={6} lg={4}>
                <div
                  style={{
                    position: "relative",
                    border: selectedImages.includes(image.id)
                      ? "2px solid #1e8267"
                      : "1px solid #f0f0f0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  {/* Selection Checkbox */}
                  <Checkbox
                    checked={selectedImages.includes(image.id)}
                    onChange={(e) =>
                      handleImageSelect(image.id, e.target.checked)
                    }
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      zIndex: 2,
                      background: "rgba(255,255,255,0.8)",
                      borderRadius: "4px",
                      padding: "2px",
                    }}
                  />

                  {/* Delete Button */}
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa ảnh này?"
                    onConfirm={() => handleSingleDelete(image.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                    okType="danger"
                  >
                    <Button
                      type="primary"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        zIndex: 2,
                      }}
                    />
                  </Popconfirm>

                  {/* Image */}
                  <Image
                    src={urlEndpoint ? urlEndpoint + image.imagePath : ""}
                    alt="Gallery image"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      display: "block",
                    }}
                    preview={{
                      mask: (
                        <div
                          style={{
                            background: "rgba(0,0,0,0.5)",
                            color: "white",
                          }}
                        >
                          Xem
                        </div>
                      ),
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Spin>

      {/* Upload Modal */}
      <Modal
        title={`Tải lên ảnh - ${title}`}
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          setFileList([]);
          setUrlInput("");
        }}
        onOk={handleUpload}
        confirmLoading={uploadLoading}
        okText="Tải lên"
        cancelText="Hủy"
        width={600}
        okButtonProps={{
          style: { background: "#1e8267", borderColor: "#1e8267" },
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={5} style={{ marginBottom: 8 }}>
            <UploadOutlined /> Tải lên từ máy tính
          </Title>
          <Upload {...uploadProps}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Chọn ảnh</div>
            </div>
          </Upload>
        </div>

        <Divider>HOẶC</Divider>

        <div>
          <Title level={5} style={{ marginBottom: 8 }}>
            <LinkOutlined /> Tải lên từ URL
          </Title>
          <TextArea
            placeholder="Nhập URL ảnh, mỗi URL một dòng&#10;Ví dụ:&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ImageGalleryTab;
