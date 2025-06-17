import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button, Card, message, Spin } from 'antd';
import { 
  SettingOutlined, 
  FileTextOutlined, 
  TeamOutlined, 
  LogoutOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI, UserProfile } from '../../services/api';
import GuestManagement from './GuestManagement';
import ImageGalleryManagement from './ImageGalleryManagement';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

// Menu items
const menuItems = [
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Cài Đặt Trang',
  },
  {
    key: 'content',
    icon: <FileTextOutlined />,
    label: 'Nội Dung Trang',
  },
  {
    key: 'guests',
    icon: <TeamOutlined />,
    label: 'Khách Mời',
  },
];

const AdminDashboard: React.FC = () => {
  const { logout, accessToken, isLoading: authLoading } = useAuth();
  const [selectedKey, setSelectedKey] = useState('settings');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (authLoading) {
        return;
      }
      
      if (!accessToken) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const profileData = await authAPI.getProfile(accessToken);
        setProfile(profileData);
      } catch (error: any) {
        if (error.message === 'Unauthorized') {
          message.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          logout();
        } else if (error.message === 'Network error') {
          message.warning('Lỗi kết nối mạng. Một số tính năng có thể không hoạt động.');
        } else {
          message.warning('Không thể tải thông tin profile. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken, logout, authLoading]);

  const handleLogout = () => {
    logout();
    message.success('Đăng xuất thành công!');
  };

  const renderContent = () => {
    const cardStyle = {
      borderRadius: '0.25rem',
      background: '#fff'
    };

    const titleStyle = {
      color: '#1e8267',
      marginBottom: '16px'
    };

    switch (selectedKey) {
      case 'settings':
        return (
          <Card style={cardStyle}>
            <Title level={3} style={titleStyle}>Cài Đặt Trang</Title>
            <Text style={{ color: '#666', fontSize: '16px' }}>
              Chào mừng đến với trang cài đặt. Tính năng sẽ được phát triển thêm.
            </Text>
          </Card>
        );
      case 'content':
        return <ImageGalleryManagement />;
      case 'guests':
        return <GuestManagement />;
      default:
        return null;
    }
  };

  if (loading || authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        <Sider 
          width={280} 
          style={{ 
            background: '#fff',
            borderRight: '1px solid #e6ebf1'
          }}
        >
          {/* Wedding Info Header */}
          {/* <div style={{ 
            padding: '24px 16px',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #1e8267, #2ea886)',
              borderRadius: '0.25rem',
              padding: '24px',
              color: 'white',
              marginBottom: '20px',
              boxShadow: '0 8px 32px rgba(30, 130, 103, 0.2)'
            }}>
              <HeartOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
              <Title level={4} style={{ color: 'white', margin: '8px 0 4px 0' }}>
                Đám Cưới
              </Title>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                <span>{profile?.config?.groomName || 'Chồng'}</span>
                <HeartOutlined style={{ fontSize: '14px' }} />
                <span>{profile?.config?.brideName || 'Vợ'}</span>
              </div>
              {profile?.config?.weddingDate && (
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>
                  {new Date(profile.config.weddingDate).toLocaleDateString('vi-VN')}
                </Text>
              )}
            </div>
          </div> */}

          {/* Menu */}
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ 
              border: 'none',
              padding: '16px 0',
              background: 'transparent'
            }}
            theme="light"
            items={menuItems}
            onClick={({ key }) => setSelectedKey(key)}
          />

          {/* Logout Button */}
          <div style={{ 
            position: 'absolute',
            bottom: '24px',
            left: '16px',
            right: '16px'
          }}>
            <Button 
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ 
                width: '100%',
                background: '#1e8267',
                borderColor: '#1e8267',
                borderRadius: '0.25rem',
                height: '44px',
                fontWeight: '500'
              }}
            >
              Đăng xuất
            </Button>
          </div>
        </Sider>

        <Content style={{ 
          padding: '24px',
          background: 'linear-gradient(135deg, #f8fffe 0%, #f0faf8 100%)',
          minHeight: '100vh'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;