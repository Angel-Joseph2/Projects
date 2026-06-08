import { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, InputNumber, Popconfirm,
  Typography, Space, Tag, message, Tooltip, Card, Row, Col, Select,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, MedicineBoxOutlined, SearchOutlined,
} from '@ant-design/icons';
import {
  getMedicines, addMedicine, updateMedicine, deleteMedicine,
} from '../services/medicineService';

const { Title, Text } = Typography;
const { Option } = Select;

const CATEGORIES = [
  'Antibiotic', 'Analgesic', 'Antipyretic', 'Antacid', 'Antiviral',
  'Antifungal', 'Vitamin', 'Supplement', 'Cardiovascular', 'Diabetic',
  'Dermatology', 'Neurology', 'Other',
];

export default function MedicinePage() {
  const [medicines, setMedicines] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isDoctor = user.role === 'doctor';
  const canManage = user.role === 'admin' || user.role === 'pharmacist';

  // ── Fetch ──────────────────────────────────────────────────
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await getMedicines();
      const data = Array.isArray(res.data) ? res.data : [];
      setMedicines(data);
      setFiltered(data);
    } catch {
      message.error('Failed to fetch medicines from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  // ── Search ────────────────────────────────────────────────
  const handleSearch = (val) => {
    setSearchText(val);
    const q = val.toLowerCase();
    setFiltered(
      medicines.filter(
        (m) =>
          (m.medicine_name ?? m.medicineName ?? m.name ?? '').toLowerCase().includes(q) ||
          (m.category ?? '').toLowerCase().includes(q)
      )
    );
  };

  // ── Open Modal ────────────────────────────────────────────
  const openAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    // Normalize record to ensure form fields (snake_case) are filled correctly
    const normalized = {
      ...record,
      medicine_name: record.medicine_name ?? record.medicineName ?? record.name,
      quantity: record.quantity ?? record.stock ?? record.qty,
    };
    form.setFieldsValue(normalized);
    setModalOpen(true);
  };

  // ── Save (Add / Update) ───────────────────────────────────
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      // Create a robust payload with both naming conventions
      const payload = {
        ...values,
        medicineName: values.medicine_name,
        stock: values.quantity,
        qty: values.quantity
      };

      if (editingRecord) {
        await updateMedicine(editingRecord.id ?? editingRecord._id, payload);
        message.success('Medicine updated successfully!');
      } else {
        await addMedicine(payload);
        message.success('Medicine added successfully!');
        
        // --- ADD NOTIFICATION START ---
        if (user.role === 'admin' || user.role === 'pharmacist') {
          const newNotif = {
            id: Date.now().toString(),
            medicineName: payload.medicineName,
            addedBy: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            timestamp: new Date().toISOString(),
            read: false
          };
          const existing = JSON.parse(localStorage.getItem('doctorNotifications') || '[]');
          localStorage.setItem('doctorNotifications', JSON.stringify([newNotif, ...existing]));
          window.dispatchEvent(new Event('doctorNotificationsUpdated'));
        }
        // --- ADD NOTIFICATION END ---
      }
      setModalOpen(false);
      fetchMedicines();
    } catch (err) {
      if (err?.errorFields) return; // validation
      message.error(
        err?.response?.data?.message || err?.response?.data || 'Operation failed.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteMedicine(id);
      message.success('Medicine deleted.');
      fetchMedicines();
    } catch {
      message.error('Delete failed.');
    }
  };

  // ── Columns ───────────────────────────────────────────────
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 55,
      render: (_, __, i) => (
        <Text type="secondary" style={{ fontWeight: 600 }}>{i + 1}</Text>
      ),
    },
    {
      title: 'Medicine Name',
      dataIndex: 'medicine_name',
      key: 'medicine_name',
      sorter: (a, b) => (a.medicine_name ?? a.medicineName ?? a.name ?? '').localeCompare(b.medicine_name ?? b.medicineName ?? b.name ?? ''),
      render: (v, r) => (
        <Space>
          <MedicineBoxOutlined style={{ color: '#0d6efd' }} />
          <Text strong style={{ color: '#0a2342' }}>{v ?? r.medicineName ?? r.name ?? '—'}</Text>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (v) => <Tag color="blue">{v ?? '—'}</Tag>,
    },
    {
      title: 'Price (₹)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price ?? 0) - (b.price ?? 0),
      render: (v) => <Text style={{ color: '#389e0d', fontWeight: 600 }}>₹{v ?? '—'}</Text>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (v, r) => {
        const qty = Number(v ?? r.stock ?? r.qty ?? 0);
        const color = qty <= 10 ? 'red' : qty <= 30 ? 'orange' : 'green';
        return <Tag color={color}>{qty} units</Tag>;
      },
    },
    ...(canManage ? [{
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="primary"
              ghost
              icon={<EditOutlined />}
              size="small"
              style={{ borderRadius: 6 }}
              onClick={() => openEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this medicine?"
              description="This action cannot be undone."
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDelete(record.id ?? record._id)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                style={{ borderRadius: 6 }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    }] : []),
  ];

  return (
    <div>
      {/* Page Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ color: '#0a2342', margin: 0 }}>
            {isDoctor ? 'Available Medicines' : 'Medicine Management'}
          </Title>
          <Text type="secondary">
            {isDoctor ? 'View pharmacy\'s medicine inventory' : 'Manage your pharmacy\'s medicine inventory'}
          </Text>
        </Col>
        <Col>
          {canManage && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              style={{
                borderRadius: 10,
                background: 'linear-gradient(135deg,#0a2342,#0d6efd)',
                border: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(13,110,253,0.4)',
              }}
              onClick={openAdd}
            >
              Add Medicine
            </Button>
          )}
        </Col>
      </Row>

      {/* Search */}
      <Card style={{ borderRadius: 14, marginBottom: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#0d6efd' }} />}
          placeholder="Search by name or category..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          style={{ maxWidth: 360, borderRadius: 10 }}
          size="large"
        />
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Table
          dataSource={filtered}
          columns={columns}
          loading={loading}
          rowKey={(r) => r.id ?? r._id ?? Math.random()}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 900 }}
          rowClassName={(_, i) => (i % 2 === 0 ? '' : 'alt-row')}
        />
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: '#0d6efd' }} />
            <span style={{ fontWeight: 700, color: '#0a2342' }}>
              {editingRecord ? 'Edit Medicine' : 'Add New Medicine'}
            </span>
          </Space>
        }
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText={editingRecord ? 'Update' : 'Add Medicine'}
        cancelText="Cancel"
        width={600}
        styles={{ body: { paddingTop: 12 } }}
        okButtonProps={{
          style: {
            background: 'linear-gradient(135deg,#0a2342,#0d6efd)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        }}
      >
        <Form form={form} layout="vertical" size="middle">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="medicine_name"
                label="Medicine Name"
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input placeholder="e.g. Paracetamol 500mg" style={{ borderRadius: 8 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Category">
                <Select placeholder="Select category" style={{ borderRadius: 8 }} allowClear>
                  {CATEGORIES.map((c) => (
                    <Option key={c} value={c}>{c}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price (₹)"
                rules={[{ required: true, message: 'Price is required' }]}
              >
                <InputNumber
                  min={0}
                  placeholder="0.00"
                  style={{ width: '100%', borderRadius: 8 }}
                  prefix="₹"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="quantity" label="Quantity (units)">
                <InputNumber min={0} placeholder="0" style={{ width: '100%', borderRadius: 8 }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Optional notes..." style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
