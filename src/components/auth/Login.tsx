import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI, LoginRequest } from '../../services/api';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(values);
      
      if (!response.accessToken) {
        throw new Error('No access token in response');
      }
      
      login(response.accessToken);
      message.success('Đăng nhập thành công! Đang chuyển hướng...');
    } catch (error: any) {
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      switch (error.message) {
        case 'Invalid credentials':
          errorMessage = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
          break;
        case 'Network error':
          errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
          break;
        case 'Server error':
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
          break;
        case 'Login failed':
          errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.';
          break;
        default:
          errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
      }
      
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fffe 0%, #f0faf8 100%)'
    }}>
      <Card style={{ 
        width: 420, 
        boxShadow: '0 8px 32px rgba(30, 130, 103, 0.15)',
        borderRadius: '0.25rem',
        border: '1px solid rgba(30, 130, 103, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: '#1e8267', marginBottom: '8px' }}>
            Đăng nhập Admin
          </Title>
          <Text style={{ color: '#666', fontSize: '16px' }}>
            Vui lòng đăng nhập để tiếp tục
          </Text>
        </div>
        
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setError('')}
          />
        )}
        
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Tên đăng nhập" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ 
                width: '100%',
                height: '48px',
                background: '#1e8267',
                borderColor: '#1e8267',
                borderRadius: '0.25rem',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;