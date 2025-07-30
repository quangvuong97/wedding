import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Divider,
  Typography,
  Spin,
  message as messageAntd,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  GiftOutlined,
  DollarOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { statisticAPI, GetStatisticResponse } from "../../../../services/api";
import { useAuth } from "../../../../contexts/AuthContext";
import { formatNumber } from "../../../common/InputPresent";

const { Title, Text } = Typography;

interface StatisticProps {
  activeTab: string;
}

const Statistics: React.FC<StatisticProps> = ({ activeTab }) => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<GetStatisticResponse>();
  const [message, contextHolder] = messageAntd.useMessage();

  const fetchStatistic = async (showSuccessMessage = false) => {
    if (!accessToken) return;
    try {
      setLoading(true);

      const statisticsRes = await statisticAPI.get(accessToken);

      setStatistics(statisticsRes);
      if (showSuccessMessage) {
        message.success("Đã cập nhật thống kê thành công!");
      }
    } catch (error) {
      message.error("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "statistics") fetchStatistic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const StatCard: React.FC<{
    title: string;
    type: "groom" | "bride" | "all";
    color: string;
    icon: React.ReactNode;
  }> = ({ title, type, color, icon }) =>
    !statistics ? null : (
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {icon}
            <span style={{ color }}>{title}</span>
          </div>
        }
        style={{ height: "100%" }}
        styles={{ body: { padding: "16px" } }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title="Số lượng khách"
              value={statistics[type].invitedCount}
              prefix={<UserOutlined style={{ color }} />}
              valueStyle={{ color }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Số lượng khách có tham dự"
              value={statistics[type].attendingCount}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Số lượng khách không tham dự"
              value={statistics[type].notAttendingCount}
              prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Số lượng khách mừng cưới"
              value={statistics[type].weddingGiftCount}
              prefix={<GiftOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Số lượng khách không mừng cưới"
              value={statistics[type].noGiftCount}
              prefix={<CloseCircleOutlined style={{ color: "#8c8c8c" }} />}
              valueStyle={{ color: "#8c8c8c" }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Không tham dự nhưng có mừng cưới"
              value={statistics[type].noShowButGiftCount}
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
              style={{
                backgroundColor: "#f6ffed",
                border: "1px solid #b7eb8f",
              }}
            >
              <Statistic
                title="Tổng số tiền mừng"
                value={formatNumber(String(statistics[type].totalGiftMoney))}
                prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
                suffix={"₫"}
                valueStyle={{ color: "#52c41a", fontSize: "18px" }}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card
              size="small"
              style={{
                backgroundColor: "#fff7e6",
                border: "1px solid #ffd591",
              }}
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
                  {statistics[type].totalGiftGold}
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
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Title level={4} style={{ margin: 0, color: "#1e8267" }}>
          📊 Thống kê khách mời
        </Title>
      </div>

      {/* Guest Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col xs={24} lg={8}>
          <StatCard
            title="Nhà Trai"
            type="groom"
            color="#1890ff"
            icon={<UserOutlined />}
          />
        </Col>
        <Col xs={24} lg={8}>
          <StatCard
            title="Nhà Gái"
            type="bride"
            color="#eb2f96"
            icon={<HeartOutlined />}
          />
        </Col>
        <Col xs={24} lg={8}>
          <StatCard
            title="Tất Cả"
            type="all"
            color="#1e8267"
            icon={<TeamOutlined />}
          />
        </Col>
      </Row>

      {/* Expense Statistics */}
      <Title level={4} style={{ marginBottom: "16px", color: "#1e8267" }}>
        💰 Thống kê chi tiêu
      </Title>

      <Row gutter={[16, 16]}>
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
              value={formatNumber(String(statistics?.husbandSpend) || "")}
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
              value={formatNumber(String(statistics?.wifeSpend) || "")}
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
              value={formatNumber(String(statistics?.allSpend) || "")}
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
              value={formatNumber(String(statistics?.all.totalGiftMoney) || "")}
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
              value={formatNumber(String(statistics?.allSpend) || "")}
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
                (statistics?.all.totalGiftMoney || 0) >=
                (statistics?.allSpend || 0)
                  ? "#f6ffed"
                  : "#fff2f0",
            }}
          >
            <Statistic
              title="Chênh lệch"
              value={formatNumber(
                String(
                  (statistics?.all.totalGiftMoney || 0) -
                    (statistics?.allSpend || 0)
                )
              )}
              valueStyle={{
                color:
                  (statistics?.all.totalGiftMoney || 0) >=
                  (statistics?.allSpend || 0)
                    ? "#52c41a"
                    : "#ff4d4f",
                fontSize: "16px",
              }}
              prefix={
                (statistics?.all.totalGiftMoney || 0) >=
                (statistics?.allSpend || 0) ? (
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
                {statistics?.all.totalGiftGold || "0 chỉ"}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
