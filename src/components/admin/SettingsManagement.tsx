import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  message, 
  Spin, 
  Typography,
  Space,
  Divider,
  DatePicker,
  Row,
  Col
} from 'antd';
import { 
  SaveOutlined, 
  DatabaseOutlined,
  HeartOutlined,
  UserOutlined,
  LinkOutlined,
  CalendarOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI, UserProfile, UpdateProfileRequest } from '../../services/api';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface StorageConfigTabProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const StorageConfigTab: React.FC<StorageConfigTabProps> = ({ profile, onUpdate }) => {
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
          }
        }
      };

      const updatedProfile = await authAPI.updateProfile(accessToken, updateData);
      onUpdate(updatedProfile);
      message.success('Cấu hình kho lưu trữ đã được cập nhật thành công!');
    } catch (error: any) {
      message.error(`Không thể cập nhật cấu hình: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ color: '#1e8267', marginBottom: 8 }}>
          <DatabaseOutlined /> Cấu Hình Kho Lưu Trữ
        </Title>
        <Text type="secondary">
          Cấu hình th��ng tin kết nối với dịch vụ lưu trữ ảnh và tệp tin
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        size="large"
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={12}>
            <Form.Item
              label="Public Key"
              name="publicKey"
              rules={[
                { required: true, message: 'Vui lòng nhập Public Key' },
                { min: 10, message: 'Public Key phải có ít nhất 10 ký tự' }
              ]}
            >
              <Input 
                placeholder="Nhập Public Key của dịch vụ lưu trữ"
                prefix={<LinkOutlined style={{ color: '#1e8267' }} />}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} lg={12}>
            <Form.Item
              label="Private Key"
              name="privateKey"
              rules={[
                { required: true, message: 'Vui lòng nhập Private Key' },
                { min: 10, message: 'Private Key phải có ít nhất 10 ký tự' }
              ]}
            >
              <Input.Password 
                placeholder="Nhập Private Key của dịch vụ lưu trữ"
                prefix={<LinkOutlined style={{ color: '#1e8267' }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="URL Endpoint"
          name="urlEndpoint"
          rules={[
            { required: true, message: 'Vui lòng nhập URL Endpoint' },
            { type: 'url', message: 'Vui lòng nhập URL hợp lệ' }
          ]}
        >
          <Input 
            placeholder="https://your-storage-service.com/api"
            prefix={<LinkOutlined style={{ color: '#1e8267' }} />}
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
              background: '#1e8267', 
              borderColor: '#1e8267',
              minWidth: '120px'
            }}
          >
            Lưu Cấu Hình
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

interface WeddingConfigTabProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
}

const WeddingConfigTab: React.FC<WeddingConfigTabProps> = ({ profile, onUpdate }) => {
  const { accessToken } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.config) {
      form.setFieldsValue({
        groomName: profile.config.groomName,
        brideName: profile.config.brideName,
        QRCodeGroomUrl: profile.config.QRCodeGroomUrl,
        QRCodeBrideUrl: profile.config.QRCodeBrideUrl,
        weddingDate: profile.config.weddingDate ? dayjs(profile.config.weddingDate) : null,
      });
    }
  }, [profile, form]);

  const handleSave = async (values: any) => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const updateData: UpdateProfileRequest = {
        config: {
          groomName: values.groomName,
          brideName: values.brideName,
          QRCodeGroomUrl: values.QRCodeGroomUrl,
          QRCodeBrideUrl: values.QRCodeBrideUrl,
          weddingDate: values.weddingDate ? values.weddingDate.toDate() : undefined,
        }
      };

      const updatedProfile = await authAPI.updateProfile(accessToken, updateData);
      onUpdate(updatedProfile);
      message.success('Cấu hình đám cưới đã được cập nhật thành công!');
    } catch (error: any) {
      message.error(`Không thể cập nhật cấu hình: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ color: '#1e8267', marginBottom: 8 }}>
          <HeartOutlined /> Cấu Hình Đám Cưới
        </Title>
        <Text type="secondary">
          Thiết lập thông tin cơ bản về đám cưới của bạn
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        size="large"
      >
        {/* Thông tin cô dâu chú rể */}
        <Card 
          size="small" 
          title={
            <Space>
              <UserOutlined style={{ color: '#1e8267' }} />
              <span>Thông Tin Cô Dâu & Chú Rể</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                label="Tên Chú Rể"
                name="groomName"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên chú rể' },
                  { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
                ]}
              >
                <Input 
                  placeholder="Nhập tên chú rể"
                  prefix={<UserOutlined style={{ color: '#1e8267' }} />}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} lg={12}>
              <Form.Item
                label="Tên Cô Dâu"
                name="brideName"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên cô dâu' },
                  { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
                ]}
              >
                <Input 
                  placeholder="Nhập tên cô dâu"
                  prefix={<UserOutlined style={{ color: '#1e8267' }} />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Ngày cưới */}
        <Card 
          size="small" 
          title={
            <Space>
              <CalendarOutlined style={{ color: '#1e8267' }} />
              <span>Ngày Cưới</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Form.Item
            label="Ngày Tổ Chức Đám Cưới"
            name="weddingDate"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày cưới' }
            ]}
          >
            <DatePicker 
              placeholder="Chọn ngày cưới"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              suffixIcon={<CalendarOutlined style={{ color: '#1e8267' }} />}
            />
          </Form.Item>
        </Card>

        {/* QR Code URLs */}
        <Card 
          size="small" 
          title={
            <Space>
              <QrcodeOutlined style={{ color: '#1e8267' }} />
              <span>Mã QR Code</span>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={12}>
              <Form.Item
                label="QR Code Chú Rể"
                name="QRCodeGroomUrl"
                rules={[
                  { type: 'url', message: 'Vui lòng nhập URL hợp lệ' }
                ]}
              >
                <Input 
                  placeholder="https://example.com/qr-groom.png"
                  prefix={<QrcodeOutlined style={{ color: '#1e8267' }} />}
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} lg={12}>
              <Form.Item
                label="QR Code Cô Dâu"
                name="QRCodeBrideUrl"
                rules={[
                  { type: 'url', message: 'Vui lòng nhập URL hợp lệ' }
                ]}
              >
                <Input 
                  placeholder="https://example.com/qr-bride.png"
                  prefix={<QrcodeOutlined style={{ color: '#1e8267' }} />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider />

        <Form.Item style={{ marginBottom: 0 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
            style={{ 
              background: '#1e8267', 
              borderColor: '#1e8267',
              minWidth: '120px'
            }}
          >
            Lưu Cấu Hình
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const SettingsManagement: React.FC = () => {
  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    if (!accessToken) return;
    
    try {
      setLoading(true);
      const profileData = await authAPI.getProfile(accessToken);
      setProfile(profileData);
    } catch (error: any) {
      message.error(`Không thể tải thông tin profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [accessToken]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <Card style={{ borderRadius: '0.25rem', background: '#fff', textAlign: 'center', padding: '60px 20px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải cấu hình...</Text>
        </div>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card style={{ borderRadius: '0.25rem', background: '#fff', textAlign: 'center', padding: '60px 20px' }}>
        <Text type="danger">Không thể tải thông tin profile</Text>
      </Card>
    );
  }

  return (
    <Card style={{ borderRadius: '0.25rem', background: '#fff' }}>
      <Title level={3} style={{ color: '#1e8267', marginBottom: '24px' }}>
        Cài Đặt Trang
      </Title>
      
      <Tabs defaultActiveKey="storage" type="card" size="large">
        <TabPane 
          tab={
            <Space>
              <DatabaseOutlined />
              <span>Cấu hình kho lưu trữ</span>
            </Space>
          } 
          key="storage"
        >
          <StorageConfigTab profile={profile} onUpdate={handleProfileUpdate} />
        </TabPane>
        
        <TabPane 
          tab={
            <Space>
              <HeartOutlined />
              <span>Cấu hình cưới</span>
            </Space>
          } 
          key="wedding"
        >
          <WeddingConfigTab profile={profile} onUpdate={handleProfileUpdate} />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SettingsManagement;