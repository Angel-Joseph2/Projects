import { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Popconfirm,
  Typography, Space, Tag, message, Tooltip, Card, Row, Col,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, UserOutlined, MedicineBoxOutlined
} from '@ant-design/icons';
import { viewDoctors, addDoctor, deleteDoctor } from '../services/doctorService';

const { Title, Text } = Typography;

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await viewDoctors();
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch {
      message.error('Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await addDoctor(values);
      message.success('Doctor added successfully!');
      setModalOpen(false);
      form.resetFields();
      fetchDoctors();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message || 'Failed to add doctor.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      message.success('Doctor deleted.');
      fetchDoctors();
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
      dataIndex: 'doctor_name',
      key: 'doctor_name',
      render: (v, r) => (
        <Space>
          <div
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg,#00b09b,#96c93d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <UserOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <div>
            <Text strong style={{ display: 'block', color: '#0a2342' }}>
              {v ?? r.doctor_name ?? r.doctorName ?? r.name ?? '—'}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{r.email ?? ''}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (v) => <Tag color="cyan">{v ?? 'General'}</Tag>,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (v) => <Tag color="blue">@{v ?? '—'}</Tag>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (v) => v ?? <Text type="secondary">—</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Tooltip title="Delete Doctor">
          <Popconfirm
            title="Delete this doctor?"
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
            Doctor Management
          </Title>
          <Text type="secondary">View and manage system doctors</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => { form.resetFields(); setModalOpen(true); }}
            style={{
              borderRadius: 10,
              background: 'linear-gradient(135deg,#00b09b,#96c93d)',
              border: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0,176,155,0.4)',
            }}
          >
            Add Doctor
          </Button>
        </Col>
      </Row>

      <Card style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Table
          dataSource={doctors}
          columns={columns}
          loading={loading}
          rowKey={(r) => r.id ?? r._id ?? Math.random()}
          pagination={{ pageSize: 8, showSizeChanger: false }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: '#00b09b' }} />
            <span style={{ fontWeight: 700, color: '#0a2342' }}>Add New Doctor</span>
          </Space>
        }
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText="Add Doctor"
        cancelText="Cancel"
        width={480}
        okButtonProps={{
          style: {
            background: 'linear-gradient(135deg,#00b09b,#96c93d)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
          },
        }}
      >
        <Form form={form} layout="vertical" size="middle" style={{ marginTop: 12 }}>
          <Form.Item
            name="doctor_name"
            label="Doctor Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="e.g. Dr. Sarah Connor" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[{ required: true, message: 'Specialization is required' }]}
          >
            <Input placeholder="e.g. Cardiology" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Username is required' }]}
          >
            <Input placeholder="e.g. sarah123" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" placeholder="e.g. sarah@pharmacy.com" style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password placeholder="Enter password" style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
