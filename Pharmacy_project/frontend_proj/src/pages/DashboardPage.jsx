import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Alert, Table, Tag, Space, Modal } from 'antd';
import {
  MedicineBoxOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { getMedicines } from '../services/medicineService';
import { viewAdmins } from '../services/authService';
import { viewBills } from '../services/billingService';
import { viewPrescriptions } from '../services/prescriptionService';

const { Title, Text } = Typography;

const statCardStyle = (gradient) => ({
  borderRadius: 16,
  background: gradient,
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  color: '#fff',
});

export default function DashboardPage() {
  const [medicines, setMedicines] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [bills, setBills] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLowStockModalVisible, setIsLowStockModalVisible] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}') || {};

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const medRes = await getMedicines();
        setMedicines(Array.isArray(medRes.data) ? medRes.data : []);

        if (user.role === 'admin') {
          const [admRes, billRes, presRes] = await Promise.all([
            viewAdmins(),
            viewBills(),
            viewPrescriptions()
          ]);
          setAdmins(Array.isArray(admRes.data) ? admRes.data : []);
          setBills(Array.isArray(billRes.data) ? billRes.data : []);
          setPrescriptions(Array.isArray(presRes.data) ? presRes.data : []);
        } else if (user.role === 'doctor') {
          const presRes = await viewPrescriptions();
          setPrescriptions(Array.isArray(presRes.data) ? presRes.data : []);
        } else if (user.role === 'pharmacist') {
          const billRes = await viewBills();
          setBills(Array.isArray(billRes.data) ? billRes.data : []);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data. Some features may be restricted.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user.role]);

  const totalSales = bills.reduce((sum, b) => sum + (Number(b.total_amount ?? b.totalAmount ?? 0)), 0);

  // Derive low-stock medicines (quantity <= 10)
  const lowStock = medicines.filter(
    (m) => Number(m.quantity ?? m.stock ?? m.qty ?? 0) <= 10
  );

  const recentMedicines = [...medicines].slice(0, 5);

  const columns = [
    { title: 'Medicine Name', dataIndex: 'medicine_name', key: 'medicine_name', render: (v, r) => <Text strong>{v ?? r.medicineName ?? r.name ?? '—'}</Text> },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Price (₹)', dataIndex: 'price', key: 'price', render: (v) => `₹${v ?? '-'}` },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (v, r) => {
        const qty = Number(v ?? r.stock ?? r.qty ?? 0);
        return (
          <Tag color={qty <= 10 ? 'red' : qty <= 30 ? 'orange' : 'green'}>
            {qty} units
          </Tag>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div>
      <Title level={3} style={{ color: '#0a2342', marginBottom: 4 }}>
        Dashboard Overview
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 28 }}>
        Welcome back! Here's what's happening in your pharmacy today.
      </Text>

      {error && (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />
      )}

      {/* Stats Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle('linear-gradient(135deg,#0a2342,#1a3a6b)')}>
            <Statistic
              title={<span style={{ color: '#a8c8ff' }}>Total Medicines</span>}
              value={medicines.length}
              prefix={<MedicineBoxOutlined style={{ color: '#4fc3f7' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle('linear-gradient(135deg,#1a6b3a,#2ea84e)')}>
            <Statistic
              title={<span style={{ color: '#b3f5cb' }}>In Stock</span>}
              value={medicines.length - lowStock.length}
              prefix={<CheckCircleOutlined style={{ color: '#b3f5cb' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{...statCardStyle('linear-gradient(135deg,#8b3a0a,#d4642c)'), cursor: 'pointer'}}
            onClick={() => setIsLowStockModalVisible(true)}
            hoverable
          >
            <Statistic
              title={<span style={{ color: '#ffd4b3' }}>Low Stock</span>}
              value={lowStock.length}
              prefix={<WarningOutlined style={{ color: '#ffd4b3' }} />}
              valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={statCardStyle('linear-gradient(135deg,#4a0a8b,#7b42d6)')}>
            {user.role === 'admin' ? (
              <Statistic
                title={<span style={{ color: '#d4b3ff' }}>Total Admins</span>}
                value={admins.length}
                prefix={<TeamOutlined style={{ color: '#d4b3ff' }} />}
                valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
              />
            ) : user.role === 'doctor' ? (
              <Statistic
                title={<span style={{ color: '#d4b3ff' }}>Total Prescriptions</span>}
                value={prescriptions.length}
                prefix={<FileTextOutlined style={{ color: '#d4b3ff' }} />}
                valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
              />
            ) : (
              <Statistic
                title={<span style={{ color: '#d4b3ff' }}>Total Sales (Income)</span>}
                value={totalSales}
                precision={2}
                prefix={<ShoppingOutlined style={{ color: '#d4b3ff' }} />}
                valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24}>
          {/* Recent Medicines Table */}
          <Card
            title={
              <Space>
                <MedicineBoxOutlined style={{ color: '#0d6efd' }} />
                <span style={{ color: '#0a2342', fontWeight: 700 }}>🧪 Recent Medicines</span>
              </Space>
            }
            style={{ borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          >
            <Table
              dataSource={recentMedicines}
              columns={columns}
              rowKey={(r) => r.id ?? r._id ?? Math.random()}
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: '#d4642c' }} />
            <span style={{ color: '#0a2342', fontWeight: 700 }}>Low Stock Medicines</span>
          </Space>
        }
        open={isLowStockModalVisible}
        onCancel={() => setIsLowStockModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={lowStock}
          columns={columns}
          rowKey={(r) => r.id ?? r._id ?? Math.random()}
          pagination={{ pageSize: 5 }}
          size="middle"
        />
      </Modal>
    </div>
  );
}
