import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Divider,
  Typography,
  Spin,
  message,
  Button,
  Space,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  GiftOutlined,
  DollarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  guestAPI,
  GetGuestResponse,
  EGuestOfType,
} from "../../../../services/api";

const { Title, Text } = Typography;

interface GuestStats {
  totalInvited: number;
  totalAttended: number;
  totalNotAttended: number;
  totalWithGift: number;
  totalWithoutGift: number;
  totalNotAttendedButWithGift: number;
  totalMoneyGift: number;
  totalGoldGift: string;
}

interface ExpenseStats {
  groomExpenses: number;
  brideExpenses: number;
  totalExpenses: number;
}

const Statistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [groomStats, setGroomStats] = useState<GuestStats>({
    totalInvited: 0,
    totalAttended: 0,
    totalNotAttended: 0,
    totalWithGift: 0,
    totalWithoutGift: 0,
    totalNotAttendedButWithGift: 0,
    totalMoneyGift: 0,
    totalGoldGift: "0 cây 0 chỉ",
  });
  const [brideStats, setBrideStats] = useState<GuestStats>({
    totalInvited: 0,
    totalAttended: 0,
    totalNotAttended: 0,
    totalWithGift: 0,
    totalWithoutGift: 0,
    totalNotAttendedButWithGift: 0,
    totalMoneyGift: 0,
    totalGoldGift: "0 cây 0 chỉ",
  });
  const [allStats, setAllStats] = useState<GuestStats>({
    totalInvited: 0,
    totalAttended: 0,
    totalNotAttended: 0,
    totalWithGift: 0,
    totalWithoutGift: 0,
    totalNotAttendedButWithGift: 0,
    totalMoneyGift: 0,
    totalGoldGift: "0 cây 0 chỉ",
  });
  const [expenseStats] = useState<ExpenseStats>({
    groomExpenses: 50000000, // Example data - should be fetched from API
    brideExpenses: 30000000, // Example data - should be fetched from API
    totalExpenses: 80000000, // Example data - should be fetched from API
  });

  const calculateStats = (guests: GetGuestResponse[]): GuestStats => {
    const stats: GuestStats = {
      totalInvited: guests.filter((g) => g.isInvite).length,
      totalAttended: guests.filter((g) => g.isAttended).length,
      totalNotAttended: guests.filter((g) => g.isInvite && !g.isAttended)
        .length,
      totalWithGift: 0,
      totalWithoutGift: 0,
      totalNotAttendedButWithGift: 0,
      totalMoneyGift: 0,
      totalGoldGift: "0 cây 0 chỉ",
    };

    let totalMoney = 0;
    let totalGoldCay = 0;
    let totalGoldChi = 0;

    guests.forEach((guest) => {
      if (guest.giftAmount && guest.giftAmount.trim() !== "") {
        stats.totalWithGift++;

        // Parse gift amount
        const giftAmount = guest.giftAmount.toLowerCase();

        // Check for money (contains 'đ' or numbers only)
        if (
          giftAmount.includes("đ") ||
          /^\d+$/.test(giftAmount.replace(/[,\.]/g, ""))
        ) {
          const moneyMatch = giftAmount.match(/[\d,\.]+/);
          if (moneyMatch) {
            const amount = parseInt(moneyMatch[0].replace(/[,\.]/g, ""));
            if (!isNaN(amount)) {
              totalMoney += amount;
            }
          }
        }

        // Check for gold (contains 'cây' or 'chỉ')
        if (giftAmount.includes("cây") || giftAmount.includes("chỉ")) {
          const cayMatch = giftAmount.match(/(\d+)\s*cây/);
          const chiMatch = giftAmount.match(/(\d+)\s*chỉ/);

          if (cayMatch) {
            totalGoldCay += parseInt(cayMatch[1]);
          }
          if (chiMatch) {
            totalGoldChi += parseInt(chiMatch[1]);
          }
        }

        // Check if not attended but has gift
        if (!guest.isAttended) {
          stats.totalNotAttendedButWithGift++;
        }
      } else {
        stats.totalWithoutGift++;
      }
    });

    stats.totalMoneyGift = totalMoney;
    stats.totalGoldGift = `${totalGoldCay} cây ${totalGoldChi} chỉ`;

    return stats;
  };

  const fetchAllGuests = async (showSuccessMessage = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Không tìm thấy token xác thực");
        return;
      }

      // Fetch groom guests
      const groomGuests = await guestAPI.getGuests(token, {
        guestOf: EGuestOfType.GROOM,
        size: 1000, // Get all guests
      });

      // Fetch bride guests
      const brideGuests = await guestAPI.getGuests(token, {
        guestOf: EGuestOfType.BRIDE,
        size: 1000, // Get all guests
      });

      const allGuests = [...groomGuests, ...brideGuests];

      // Calculate statistics
      const groomStatsData = calculateStats(groomGuests);
      const brideStatsData = calculateStats(brideGuests);
      const allStatsData = calculateStats(allGuests);

      setGroomStats(groomStatsData);
      setBrideStats(brideStatsData);
      setAllStats(allStatsData);

      if (showSuccessMessage) {
        message.success("Đã cập nhật thống kê thành công!");
      }
    } catch (error) {
      console.error("Error fetching guests:", error);
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStats = () => {
    fetchAllGuests(true);
  };

  useEffect(() => {
    fetchAllGuests();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const StatCard: React.FC<{
    title: string;
    stats: GuestStats;
    color: string;
    icon: React.ReactNode;
  }> = ({ title, stats, color, icon }) => (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {icon}
          <span style={{ color }}>{title}</span>
        </div>
      }
      style={{ height: "100%" }}
      bodyStyle={{ padding: "16px" }}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Statistic
            title="Số lượng khách đã mời"
            value={stats.totalInvited}
            prefix={<UserOutlined style={{ color }} />}
            valueStyle={{ color }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Số lượng khách có tham dự"
            value={stats.totalAttended}
            prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Số lượng khách không tham dự"
            value={stats.totalNotAttended}
            prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
            valueStyle={{ color: "#ff4d4f" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Số lượng khách mừng cưới"
            value={stats.totalWithGift}
            prefix={<GiftOutlined style={{ color: "#fa8c16" }} />}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Số lượng khách không mừng cưới"
            value={stats.totalWithoutGift}
            prefix={<CloseCircleOutlined style={{ color: "#8c8c8c" }} />}
            valueStyle={{ color: "#8c8c8c" }}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Không tham dự nhưng có mừng cưới"
            value={stats.totalNotAttendedButWithGift}
            prefix={<HeartOutlined style={{ color: "#eb2f96" }} />}
            valueStyle={{ color: "#eb2f96" }}
          />
        </Col>
      </Row>

      <Divider orientation="left">
        <Text strong style={{ color }}>
          Quà cưới
        </Text>
      </Divider>

      <Row gutter={[16, 8]}>
        <Col span={24}>
          <Card
            size="small"
            style={{ backgroundColor: "#f6ffed", border: "1px solid #b7eb8f" }}
          >
            <Statistic
              title="Tổng số tiền mừng"
              value={formatCurrency(stats.totalMoneyGift)}
              prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a", fontSize: "18px" }}
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            size="small"
            style={{ backgroundColor: "#fff7e6", border: "1px solid #ffd591" }}
          >
            <div style={{ textAlign: "center" }}>
              <Text type="secondary">Tổng số vàng</Text>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#fa8c16",
                  marginTop: "4px",
                }}
              >
                {stats.totalGoldGift}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Title level={3} style={{ margin: 0, color: "#1e8267" }}>
          📊 Thống kê khách mời
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefreshStats}
            loading={loading}
            style={{
              backgroundColor: "#1e8267",
              borderColor: "#1e8267",
              borderRadius: "6px",
              height: "40px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Cập nhật thống kê
          </Button>
        </Space>
      </div>

      {/* Guest Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} lg={8}>
          <StatCard
            title="Nhà Trai"
            stats={groomStats}
            color="#1890ff"
            icon={<UserOutlined />}
          />
        </Col>
        <Col xs={24} lg={8}>
          <StatCard
            title="Nhà Gái"
            stats={brideStats}
            color="#eb2f96"
            icon={<HeartOutlined />}
          />
        </Col>
        <Col xs={24} lg={8}>
          <StatCard
            title="Tất Cả"
            stats={allStats}
            color="#1e8267"
            icon={<TeamOutlined />}
          />
        </Col>
      </Row>

      {/* Expense Statistics */}
      <Title level={3} style={{ marginBottom: "16px", color: "#1e8267" }}>
        💰 Thống kê chi tiêu
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <DollarOutlined style={{ color: "#1890ff" }} />
                <span style={{ color: "#1890ff" }}>Chi tiêu của anh</span>
              </div>
            }
            style={{ height: "100%" }}
          >
            <Statistic
              value={formatCurrency(expenseStats.groomExpenses)}
              valueStyle={{ color: "#1890ff", fontSize: "24px" }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <HeartOutlined style={{ color: "#eb2f96" }} />
                <span style={{ color: "#eb2f96" }}>Chi tiêu của em</span>
              </div>
            }
            style={{ height: "100%" }}
          >
            <Statistic
              value={formatCurrency(expenseStats.brideExpenses)}
              valueStyle={{ color: "#eb2f96", fontSize: "24px" }}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <TeamOutlined style={{ color: "#1e8267" }} />
                <span style={{ color: "#1e8267" }}>Tổng chi tiêu</span>
              </div>
            }
            style={{ height: "100%" }}
          >
            <Statistic
              value={formatCurrency(expenseStats.totalExpenses)}
              valueStyle={{ color: "#1e8267", fontSize: "24px" }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginTop: "32px" }}>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{ textAlign: "center", backgroundColor: "#f6ffed" }}
          >
            <Statistic
              title="Tổng thu"
              value={formatCurrency(allStats.totalMoneyGift)}
              valueStyle={{ color: "#52c41a", fontSize: "16px" }}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{ textAlign: "center", backgroundColor: "#fff2e8" }}
          >
            <Statistic
              title="Tổng chi"
              value={formatCurrency(expenseStats.totalExpenses)}
              valueStyle={{ color: "#fa541c", fontSize: "16px" }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{
              textAlign: "center",
              backgroundColor:
                allStats.totalMoneyGift >= expenseStats.totalExpenses
                  ? "#f6ffed"
                  : "#fff2f0",
            }}
          >
            <Statistic
              title="Chênh lệch"
              value={formatCurrency(
                allStats.totalMoneyGift - expenseStats.totalExpenses
              )}
              valueStyle={{
                color:
                  allStats.totalMoneyGift >= expenseStats.totalExpenses
                    ? "#52c41a"
                    : "#ff4d4f",
                fontSize: "16px",
              }}
              prefix={
                allStats.totalMoneyGift >= expenseStats.totalExpenses ? (
                  <CheckCircleOutlined />
                ) : (
                  <CloseCircleOutlined />
                )
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            size="small"
            style={{ textAlign: "center", backgroundColor: "#fff7e6" }}
          >
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Tổng vàng
              </Text>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#fa8c16",
                }}
              >
                {allStats.totalGoldGift}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
