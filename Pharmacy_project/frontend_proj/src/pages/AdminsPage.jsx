import { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Popconfirm,
  Typography, Space, Tag, message, Tooltip, Card, Row, Col,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, TeamOutlined, UserOutlined,
} from '@ant-design/icons';
import { viewAdmins, addAdmin, deleteAdmin } from '../services/authService';

const { Title, Text } = Typography;

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await viewAdmins();
      setAdmins(Array.isArray(res.data) ? res.data : []);
    } catch {
      message.error('Failed to load admins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await addAdmin(values);
      message.success('Admin added successfully!');
      setModalOpen(false);
      form.resetFields();
      fetchAdmins();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || 'Failed to add admin.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdmin(id);
      message.success('Admin deleted.');
      fetchAdmins();
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
      dataIndex: 'name',
      key: 'name',
      render: (v, r) => (
        <Space>
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#0a2342,#0d6efd)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <UserOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <div>
            <Text strong style={{ display: 'block', color: '#0a2342' }}>
              {v ?? r.username ?? '—'}
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
      render: (v) => <Tag color="geekblue">@{v ?? '—'}</Tag>,
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
      render: (v) => <Tag color="purple">{v ?? 'Admin'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Delete Admin">
          <Popconfirm
            title="Delete this admin?"
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
            Admin Management
          </Title>
          <Text type="secondary">View and manage system administrators</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => { form.resetFields(); setModalOpen(true); }}
            style={{
              borderRadius: 10,
              background: 'linear-gradient(135deg,#0a2342,#0d6efd)',
              border: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(13,110,253,0.4)',
            }}
          >
            Add Admin
          </Button>
        </Col>
      </Row>

      <Card style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Table
          dataSource={admins}
          columns={columns}
          loading={loading}
          rowKey={(r) => r.id ?? r._id ?? Math.random()}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <TeamOutlined style={{ color: '#0d6efd' }} />
            <span style={{ fontWeight: 700, color: '#0a2342' }}>Add New Admin</span>
          </Space>
        }
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText="Add Admin"
        cancelText="Cancel"
        width={480}
        okButtonProps={{
          style: {
            background: 'linear-gradient(135deg,#0a2342,#0d6efd)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        }}
      >
        <Form form={form} layout="vertical" size="middle" style={{ marginTop: 12 }}>
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="e.g. Dr. John Smith" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Username is required' }]}
          >
            <Input placeholder="e.g. john_admin" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" placeholder="e.g. admin@pharmacy.com" style={{ borderRadius: 8 }} />
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
