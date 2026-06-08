import { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Popconfirm,
  Typography, Space, Tag, message, Tooltip, Card, Row, Col,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, UserOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import { viewPharmacists, addPharmacist, deletePharmacist } from '../services/pharmacistService';

const { Title, Text } = Typography;

export default function PharmacistsPage() {
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchPharmacists = async () => {
    setLoading(true);
    try {
      const res = await viewPharmacists();
      setPharmacists(Array.isArray(res.data) ? res.data : []);
    } catch {
      message.error('Failed to load pharmacists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPharmacists(); }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await addPharmacist(values);
      message.success('Pharmacist added successfully!');
      setModalOpen(false);
      form.resetFields();
      fetchPharmacists();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || 'Failed to add pharmacist.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePharmacist(id);
      message.success('Pharmacist deleted.');
      fetchPharmacists();
    } catch {
      message.error('Delete failed.');
    }
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 55,
      render: (_, __, i) => <Text type="secondary" style={{ fontWeight: 600 }}>{i + 1}</Text>,
    },
    {
      title: 'Name',
      dataIndex: 'pharmacist_name',
      key: 'pharmacist_name',
      render: (v, r) => (
        <Space>
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#ff9966,#ff5e62)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <UserOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <div>
            <Text strong style={{ display: 'block', color: '#0a2342' }}>
              {v ?? r.name ?? r.username ?? '—'}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email ?? ''}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (v) => <Tag color="volcano">@{v ?? '—'}</Tag>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (v) => v ?? <Text type="secondary">—</Text>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (v) => <Tag color="orange">{v ?? 'Pharmacist'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Delete Pharmacist">
          <Popconfirm
            title="Delete this pharmacist?"
            description="This action cannot be undone."
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id ?? record._id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" style={{ borderRadius: 6 }} />
          </Popconfirm>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ color: '#0a2342', margin: 0 }}>
            Pharmacist Management
          </Title>
          <Text type="secondary">View and manage system pharmacists</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => { form.resetFields(); setModalOpen(true); }}
            style={{
              borderRadius: 10,
              background: 'linear-gradient(135deg,#ff9966,#ff5e62)',
              border: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(255,94,98,0.4)',
            }}
          >
            Add Pharmacist
          </Button>
        </Col>
      </Row>

      <Card style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Table
          dataSource={pharmacists}
          columns={columns}
          loading={loading}
          rowKey={(r) => r.id ?? r._id ?? Math.random()}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#ff5e62' }} />
            <span style={{ fontWeight: 700, color: '#0a2342' }}>Add New Pharmacist</span>
          </Space>
        }
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText="Add Pharmacist"
        cancelText="Cancel"
        width={480}
        okButtonProps={{
          style: {
            background: 'linear-gradient(135deg,#ff9966,#ff5e62)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        }}
      >
        <Form form={form} layout="vertical" size="middle" style={{ marginTop: 12 }}>
          <Form.Item
            name="pharmacist_name"
            label="Full Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="e.g. John Doe" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Username is required' }]}
          >
            <Input placeholder="e.g. john_pharm" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" placeholder="e.g. john@pharmacy.com" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password placeholder="Set a strong password" style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
