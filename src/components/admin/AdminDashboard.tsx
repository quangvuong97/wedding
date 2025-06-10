import React from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { getSubdomain } from '../../services/api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const subdomain = getSubdomain();

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Admin Dashboard - {subdomain}
        </Title>
        <Button 
          type="primary" 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </Header>
      
      <Content style={{ 
        padding: '24px',
        background: '#f0f2f5'
      }}>
        <div style={{
          background: '#fff',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Space direction="vertical" size="large">
            <Title level={2}>Chào mừng đến với Admin Dashboard!</Title>
            <Text type="secondary">
              Bạn đang truy cập từ subdomain: <strong>{subdomain}</strong>
            </Text>
            <Text>
              Đây là giao diện quản trị. Các tính năng sẽ được phát triển thêm trong tương lai.
            </Text>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;