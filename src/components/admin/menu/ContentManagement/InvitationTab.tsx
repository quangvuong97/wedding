import React, { useState } from "react";
import {
  Row,
  Col,
  Image,
  Button,
  Upload,
  message,
  Spin,
  Modal,
  Input,
  Tabs,
} from "antd";
import {
  UploadOutlined,
  ReloadOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../../contexts/AuthContext";
import { imageAPI } from "../../../../services/api";
import { useAdminData } from "../../../../contexts/AdminDataContext";

const INVITATION_IMAGES = [
  {
    key: "groomFamily",
    label: "Thiệp nhà trai",
    name: "groomFamily",
  },
  {
    key: "brideFamily",
    label: "Thiệp nhà gái",
    name: "brideFamily",
  },
];

const imageBoxStyle: React.CSSProperties = {
  width: 300,
  height: 300,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#fafafa",
  borderRadius: 8,
  overflow: "hidden",
  border: "1px solid #eee",
  margin: "0 auto",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  display: "block",
};

const { TextArea } = Input;

const InvitationTab: React.FC = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<{ [key: string]: boolean }>({});

  const adminData = useAdminData();

  const [uploadModal, setUploadModal] = useState<{
    open: boolean;
    name: string | null;
  }>({ open: false, name: null });
  const [uploadTab, setUploadTab] = useState<string>("local");
  const [fileList, setFileList] = useState<any[]>([]);
  const [urlInput, setUrlInput] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (
    file: File | null,
    name: string,
    url?: string
  ) => {
    if (!accessToken) return;
    setLoading((prev) => ({ ...prev, [name]: true }));
    try {
      if (file) {
        await imageAPI.uploadImageWithName(accessToken, file, name);
      } else if (url) {
        await imageAPI.uploadImageWithName(
          accessToken,
          undefined as any,
          name,
          url
        );
      }
      message.success("Tải lên thành công!");
      setReloadKey((k) => k + 1);
      setError((prev) => ({ ...prev, [name]: false }));
    } catch (error: any) {
      message.error(error.message || "Tải lên thất bại");
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }));
      setUploading(false);
      setUploadModal({ open: false, name: null });
      setFileList([]);
      setUrlInput("");
    }
  };

  const handleImageError = (name: string) => {
    setError((prev) => ({ ...prev, [name]: true }));
  };

  const handleImageLoad = (name: string) => {
    setError((prev) => ({ ...prev, [name]: false }));
  };

  return (
    <Row gutter={32} justify="center">
      {INVITATION_IMAGES.map((img) => (
        <Col key={img.key} xs={24} md={12} style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 16, fontWeight: 600 }}>{img.label}</div>
          <Spin spinning={!!loading[img.name]}>
            <div style={imageBoxStyle}>
              {!error[img.name] ? (
                <Image
                  key={reloadKey + img.key}
                  src={`${adminData?.config?.storageKey?.urlEndpoint}/${
                    img.name
                  }?${Date.now()}${reloadKey}`}
                  alt={img.label}
                  style={imageStyle}
                  width={300}
                  height={300}
                  preview={true}
                  fallback=""
                  onError={() => handleImageError(img.name)}
                  onLoad={() => handleImageLoad(img.name)}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#bfbfbf",
                    background: "#f5f5f5",
                  }}
                >
                  <FileImageOutlined
                    style={{ fontSize: 48, marginBottom: 12 }}
                  />
                  <div style={{ fontSize: 16, color: "#bfbfbf" }}>
                    Chưa có ảnh
                  </div>
                  <div style={{ fontSize: 13, color: "#bfbfbf" }}>
                    Nhấn "Tải lên/thay thế ảnh" để thêm
                  </div>
                </div>
              )}
            </div>
            <Button
              icon={<UploadOutlined />}
              loading={!!loading[img.name]}
              style={{ marginTop: 16 }}
              onClick={() => setUploadModal({ open: true, name: img.name })}
            >
              {"Tải lên/thay thế ảnh"}
            </Button>
            <Button
              icon={<ReloadOutlined />}
              style={{ marginTop: 8, marginLeft: 8 }}
              onClick={() => {
                setReloadKey((k) => k + 1);
                setError((prev) => ({ ...prev, [img.name]: false }));
              }}
            >
              Reload
            </Button>
          </Spin>
        </Col>
      ))}

      {/* Upload Modal */}
      <Modal
        title="Tải lên/thay thế ảnh"
        open={uploadModal.open}
        onCancel={() => {
          setUploadModal({ open: false, name: null });
          setFileList([]);
          setUrlInput("");
        }}
        onOk={async () => {
          setUploading(true);
          if (uploadTab === "local" && fileList.length > 0) {
            await handleUpload(fileList[0].originFileObj, uploadModal.name!);
          } else if (uploadTab === "url" && urlInput.trim()) {
            await handleUpload(null, uploadModal.name!, urlInput.trim());
          } else {
            message.warning("Vui lòng chọn ảnh hoặc nhập URL");
            setUploading(false);
          }
        }}
        okText="Tải lên"
        cancelText="Hủy"
        confirmLoading={uploading}
        width={400}
      >
        <Tabs
          activeKey={uploadTab}
          onChange={setUploadTab}
          items={[
            {
              key: "local",
              label: "Từ máy tính",
              children: (
                <Upload
                  fileList={fileList}
                  beforeUpload={() => false}
                  accept="image/*"
                  maxCount={1}
                  onChange={({ fileList: newList }) => setFileList(newList)}
                  listType="picture-card"
                >
                  {fileList.length === 0 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                    </div>
                  )}
                </Upload>
              ),
            },
            {
              key: "url",
              label: "Nhập URL",
              children: (
                <TextArea
                  placeholder="Nhập URL ảnh"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  rows={3}
                />
              ),
            },
          ]}
        />
      </Modal>
    </Row>
  );
};

export default InvitationTab;
