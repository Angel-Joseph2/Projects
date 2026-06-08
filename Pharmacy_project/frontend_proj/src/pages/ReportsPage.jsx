import { useEffect, useState } from 'react';
import { 
  Row, Col, Card, Statistic, Typography, Table, Tag, 
  Divider, Space, Spin, Alert, Progress 
} from 'antd';
import {
  BarChartOutlined,
  ShoppingOutlined,
  MedicineBoxOutlined,
  ArrowUpOutlined,
  TeamOutlined,
  WarningOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { getMedicines } from '../services/medicineService';
import { viewDoctors } from '../services/doctorService';
import { viewPharmacists } from '../services/pharmacistService';
import { viewBills } from '../services/billingService';

const { Title, Text } = Typography;

export default function ReportsPage() {
  const [data, setData] = useState({
    medicines: [],
    doctors: [],
    pharmacists: [],
    bills: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [meds, docs, pharms, bills] = await Promise.all([
          getMedicines(),
          viewDoctors(),
          viewPharmacists(),
          viewBills()
        ]);
        setData({
          medicines: Array.isArray(meds.data) ? meds.data : [],
          doctors: Array.isArray(docs.data) ? docs.data : [],
          pharmacists: Array.isArray(pharms.data) ? pharms.data : [],
          bills: Array.isArray(bills.data) ? bills.data : []
        });
      } catch (err) {
        console.error('Reports fetch error:', err);
        setError('Failed to load report data. Check backend connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalSales = data.bills.reduce((sum, b) => sum + (Number(b.total_amount ?? b.totalAmount ?? 0)), 0);
  const lowStockCount = data.medicines.filter(m => {
    const qty = Number(m.quantity ?? m.stock ?? m.qty ?? 0);
    return qty > 0 && qty <= 10;
  }).length;
  const outOfStockCount = data.medicines.filter(m => Number(m.quantity ?? m.stock ?? m.qty ?? 0) === 0).length;

  const billColumns = [
    { 
      title: 'Bill ID', 
      dataIndex: 'id', 
      key: 'id',
      render: (v) => <Tag color="blue">#00{v}</Tag>
    },
    { 
      title: 'Patient', 
      dataIndex: 'patient_name', 
      key: 'patient_name', 
      render: (v, r) => <Text strong>{v ?? r.patientName ?? '—'}</Text> 
    },
    { 
      title: 'Amount', 
      dataIndex: 'total_amount', 
      key: 'total_amount', 
      render: (v, r) => <Text style={{ color: '#3f8600', fontWeight: 600 }}>₹{v ?? r.totalAmount ?? 0}</Text> 
    },
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      render: (v) => <Space><ClockCircleOutlined style={{ color: '#bfbfbf' }} /> {v}</Space>
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin size="large" tip="Generating comprehensive reports..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '0px' }}>
      <Title level={3} style={{ color: '#0a2342', marginBottom: 4 }}>
        <BarChartOutlined style={{ marginRight: 12, color: '#0d6efd' }} />
        Pharmacy Reports & Analytics
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Detailed overview of financial performance, inventory health, and human resources.
      </Text>

      {error && (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />
      )}

      {/* Summary Cards */}
      <Row gutter={[20, 20]} style={{ marginBottom: 28 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Statistic
              title={<Text type="secondary">Total Revenue</Text>}
              value={totalSales}
              precision={2}
              prefix={<ShoppingOutlined style={{ color: '#3f8600', marginRight: 8 }} />}
              suffix="₹"
              valueStyle={{ color: '#3f8600', fontWeight: 700, fontSize: 24 }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="success"><ArrowUpOutlined /> Total Income</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Statistic
              title={<Text type="secondary">Medicine Inventory</Text>}
              value={data.medicines.length}
              prefix={<MedicineBoxOutlined style={{ color: '#0d6efd', marginRight: 8 }} />}
              valueStyle={{ color: '#0d6efd', fontWeight: 700, fontSize: 24 }}
            />
            <Progress 
               percent={Number(((data.medicines.length - lowStockCount - outOfStockCount) / (data.medicines.length || 1) * 100).toFixed(0))} 
               size="small" 
               status="active" 
               strokeColor="#0d6efd"
               style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Statistic
              title={<Text type="secondary">Medical Staff</Text>}
              value={data.doctors.length + data.pharmacists.length}
              prefix={<TeamOutlined style={{ color: '#722ed1', marginRight: 8 }} />}
              valueStyle={{ color: '#722ed1', fontWeight: 700, fontSize: 24 }}
            />
            <div style={{ marginTop: 12 }}>
              <Space split={<Divider type="vertical" />}>
                <Text style={{ fontSize: 12 }}>{data.doctors.length} Doctors</Text>
                <Text style={{ fontSize: 12 }}>{data.pharmacists.length} Pharms</Text>
              </Space>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Statistic
              title={<Text type="secondary">Stock Alerts</Text>}
              value={lowStockCount + outOfStockCount}
              prefix={<WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />}
              valueStyle={{ color: '#faad14', fontWeight: 700, fontSize: 24 }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="error">{outOfStockCount} Empty</Tag>
              <Tag color="warning">{lowStockCount} Low</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title={<Text strong style={{ fontSize: 16 }}>📊 Recent Transactions</Text>} 
            bordered={false} 
            style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
          >
            <Table 
              dataSource={data.bills.slice(-5).reverse()} 
              columns={billColumns} 
              pagination={false} 
              rowKey={(r) => r.id ?? Math.random()}
              size="middle"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<Text strong style={{ fontSize: 16 }}>📈 Inventory Health</Text>} 
            bordered={false} 
            style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Available Stock</Text>
                <Text strong>{((data.medicines.length - lowStockCount - outOfStockCount) / (data.medicines.length || 1) * 100).toFixed(1)}%</Text>
              </div>
              <Progress percent={Number(((data.medicines.length - lowStockCount - outOfStockCount) / (data.medicines.length || 1) * 100).toFixed(1))} strokeColor="#52c41a" showInfo={false} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Low Stock Warning</Text>
                <Text strong>{(lowStockCount / (data.medicines.length || 1) * 100).toFixed(1)}%</Text>
              </div>
              <Progress percent={Number((lowStockCount / (data.medicines.length || 1) * 100).toFixed(1))} status="active" strokeColor="#faad14" showInfo={false} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Out of Stock</Text>
                <Text strong>{(outOfStockCount / (data.medicines.length || 1) * 100).toFixed(1)}%</Text>
              </div>
              <Progress percent={Number((outOfStockCount / (data.medicines.length || 1) * 100).toFixed(1))} status="exception" strokeColor="#ff4d4f" showInfo={false} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
