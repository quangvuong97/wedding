import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Select, Divider, Space } from 'antd';
import { 
  TeamOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  GiftOutlined,
  DollarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { guestAPI, EGuestOfType, GetGuestResponse } from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

interface StatisticsData {
  totalInvited: number;
  totalAttended: number;
  totalNotAttended: number;
  totalWithGift: number;
  totalWithoutGift: number;
  totalNotAttendedButWithGift: number;
  totalGiftMoney: number;
  totalGoldGifts: string;
}

interface ExpenseData {
  groomExpenses: number;
  brideExpenses: number;
  totalExpenses: number;
}

const Statistics: React.FC = () => {
  const { accessToken } = useAuth();
  const [filter, setFilter] = useState<'all' | EGuestOfType>('all');
  const [loading, setLoading] = useState(false);
  const [groomStats, setGroomStats] = useState<StatisticsData>({
    totalInvited: 0,
    totalAttended: 0,
    totalNotAttended: 0,
    totalWithGift: 0,
    totalWithoutGift: 0,
    totalNotAttendedButWithGift: 0,
    totalGiftMoney: 0,
    totalGoldGifts: '',
  });
  const [brideStats, setBrideStats] = useState<StatisticsData>({
    totalInvited: 0,
    totalAttended: 0,
    totalNotAttended: 0,
    totalWithGift: 0,
    totalWithoutGift: 0,
    totalNotAttendedButWithGift: 0,
    totalGiftMoney: 0,
    totalGoldGifts: '',
  });
  const [expenses, setExpenses] = useState<ExpenseData>({
    groomExpenses: 50000000, // Example data - should be configurable
    brideExpenses: 30000000, // Example data - should be configurable
    totalExpenses: 80000000,
  });

  const calculateStatistics = (guests: GetGuestResponse[]): StatisticsData => {
    const totalInvited = guests.filter(guest => guest.isInvite).length;
    const totalAttended = guests.filter(guest => guest.isAttended).length;
    const totalNotAttended = guests.filter(guest => guest.isInvite && !guest.isAttended).length;
    
    const guestsWithGift = guests.filter(guest => guest.giftAmount && guest.giftAmount.trim() !== '');
    const totalWithGift = guestsWithGift.length;
    const totalWithoutGift = guests.length - totalWithGift;
    const totalNotAttendedButWithGift = guests.filter(guest => !guest.isAttended && guest.giftAmount && guest.giftAmount.trim() !== '').length;

    // Calculate total gift money and gold
    let totalGiftMoney = 0;
    const goldGifts: string[] = [];

    guestsWithGift.forEach(guest => {
      const giftAmount = guest.giftAmount.trim();
      
      // Check if it's money (contains numbers and currency symbols)
      const moneyMatch = giftAmount.match(/[\d,]+/g);
      if (moneyMatch && (giftAmount.includes('đ') || giftAmount.includes('VND') || giftAmount.includes('000'))) {
        const amount = parseInt(moneyMatch.join('').replace(/,/g, ''));
        if (!isNaN(amount)) {
          totalGiftMoney += amount;
        }
      }
      
      // Check if it's gold (contains words like "cây", "chỉ", "lượng", "vàng")
      if (giftAmount.toLowerCase().includes('cây') || 
          giftAmount.toLowerCase().includes('chỉ') || 
          giftAmount.toLowerCase().includes('lượng') || 
          giftAmount.toLowerCase().includes('vàng')) {
        goldGifts.push(giftAmount);
      }
    });

    return {
      totalInvited,
      totalAttended,
      totalNotAttended,
      totalWithGift,
      totalWithoutGift,
      totalNotAttendedButWithGift,
      totalGiftMoney,
      totalGoldGifts: goldGifts.join(', ') || 'Chưa có',
    };
  };

  const fetchStatistics = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      
      // Fetch groom guests
      const groomGuests = await guestAPI.getGuests(accessToken, {
        guestOf: EGuestOfType.GROOM,
        size: 1000, // Get all guests
        page: 1,
      });
      
      // Fetch bride guests
      const brideGuests = await guestAPI.getGuests(accessToken, {
        guestOf: EGuestOfType.BRIDE,
        size: 1000, // Get all guests
        page: 1,
      });

      const groomGuestsData = Array.isArray(groomGuests) ? groomGuests : groomGuests.data || [];
      const brideGuestsData = Array.isArray(brideGuests) ? brideGuests : brideGuests.data || [];

      setGroomStats(calculateStatistics(groomGuestsData));
      setBrideStats(calculateStatistics(brideGuestsData));
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const getCurrentStats = (): StatisticsData => {
    if (filter === EGuestOfType.GROOM) return groomStats;
    if (filter === EGuestOfType.BRIDE) return brideStats;
    
    // Combine both stats for 'all'
    return {
      totalInvited: groomStats.totalInvited + brideStats.totalInvited,
      totalAttended: groomStats.totalAttended + brideStats.totalAttended,
      totalNotAttended: groomStats.totalNotAttended + brideStats.totalNotAttended,
      totalWithGift: groomStats.totalWithGift + brideStats.totalWithGift,
      totalWithoutGift: groomStats.totalWithoutGift + brideStats.totalWithoutGift,
      totalNotAttendedButWithGift: groomStats.totalNotAttendedButWithGift + brideStats.totalNotAttendedButWithGift,
      totalGiftMoney: groomStats.totalGiftMoney + brideStats.totalGiftMoney,
      totalGoldGifts: [groomStats.totalGoldGifts, brideStats.totalGoldGifts]
        .filter(gold => gold && gold !== 'Chưa có')
        .join(', ') || 'Chưa có',
    };
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const currentStats = getCurrentStats();

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ color: '#1e8267', margin: 0 }}>
          Thống kê khách mời
        </Title>
        <Select
          value={filter}
          onChange={setFilter}
          style={{ width: 200 }}
          size="large"
        >
          <Option value="all">Tất cả</Option>
          <Option value={EGuestOfType.GROOM}>Nhà trai</Option>
          <Option value={EGuestOfType.BRIDE}>Nhà gái</Option>
        </Select>
      </div>

      {/* Guest Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Số lượng khách đã mời"
              value={currentStats.totalInvited}
              prefix={<TeamOutlined style={{ color: '#1e8267' }} />}
              valueStyle={{ color: '#1e8267' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Số lượng khách có tham dự"
              value={currentStats.totalAttended}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Số lượng khách không tham dự"
              value={currentStats.totalNotAttended}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Số lượng khách mừng cưới"
              value={currentStats.totalWithGift}
              prefix={<GiftOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Số lượng khách không mừng cưới"
              value={currentStats.totalWithoutGift}
              prefix={<CloseCircleOutlined style={{ color: '#8c8c8c' }} />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Không tham dự nhưng có mừng cưới"
              value={currentStats.totalNotAttendedButWithGift}
              prefix={<GiftOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Gift Statistics */}
      <Card style={{ marginBottom: '32px' }}>
        <Title level={4} style={{ color: '#1e8267', marginBottom: '16px' }}>
          <GiftOutlined /> Quà cưới
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card type="inner">
              <Statistic
                title="Tổng số tiền mừng"
                value={currentStats.totalGiftMoney}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card type="inner">
              <div>
                <Text strong style={{ color: '#fa8c16', fontSize: '14px' }}>
                  <TrophyOutlined /> Tổng số vàng
                </Text>
                <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>
                  {currentStats.totalGoldGifts}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Expense Statistics */}
      <Card>
        <Title level={4} style={{ color: '#1e8267', marginBottom: '16px' }}>
          <DollarOutlined /> Tổng tiền các khoản chi tiêu
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card type="inner">
              <Statistic
                title="Chi phí của anh"
                value={expenses.groomExpenses}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card type="inner">
              <Statistic
                title="Chi phí của em"
                value={expenses.brideExpenses}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card type="inner">
              <Statistic
                title="Tổng chi phí"
                value={expenses.totalExpenses}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: '#f5222d', fontSize: '20px' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Summary by Category */}
      {filter === 'all' && (
        <Row gutter={[16, 16]} style={{ marginTop: '32px' }}>
          <Col xs={24} lg={12}>
            <Card title="Thống kê nhà trai" headStyle={{ backgroundColor: '#f0f9ff', color: '#1890ff' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Khách đã mời:</Text>
                  <Text strong>{groomStats.totalInvited}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Khách tham dự:</Text>
                  <Text strong style={{ color: '#52c41a' }}>{groomStats.totalAttended}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Khách mừng cưới:</Text>
                  <Text strong style={{ color: '#fa8c16' }}>{groomStats.totalWithGift}</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Tổng tiền mừng:</Text>
                  <Text strong style={{ color: '#52c41a' }}>{formatCurrency(groomStats.totalGiftMoney)}</Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Thống kê nhà gái" headStyle={{ backgroundColor: '#fff0f6', color: '#eb2f96' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Khách đã mời:</Text>
                  <Text strong>{brideStats.totalInvited}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Khách tham dự:</Text>
                  <Text strong style={{ color: '#52c41a' }}>{brideStats.totalAttended}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Khách mừng cưới:</Text>
                  <Text strong style={{ color: '#fa8c16' }}>{brideStats.totalWithGift}</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Tổng tiền mừng:</Text>
                  <Text strong style={{ color: '#52c41a' }}>{formatCurrency(brideStats.totalGiftMoney)}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Statistics;