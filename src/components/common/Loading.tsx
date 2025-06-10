import React from 'react';
import { Spin } from 'antd';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Đang tải...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Spin size="large" />
      <p style={{ marginTop: 16, color: '#666' }}>{message}</p>
    </div>
  );
};

export default Loading;