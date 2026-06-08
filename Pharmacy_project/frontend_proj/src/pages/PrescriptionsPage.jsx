import { useEffect, useState } from 'react';
import {
  Table, Button, Modal, Form, Input, Typography, Space, message, Card, Row, Col, Select, Tag, Divider
} from 'antd';
import {
  PlusOutlined, SearchOutlined, FileTextOutlined, MedicineBoxOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import { addPrescription, viewPrescriptions } from '../services/prescriptionService';
import { getMedicines } from '../services/medicineService';

const { Title, Text } = Typography;
const { Option } = Select;

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [preRes, medRes] = await Promise.all([viewPrescriptions(), getMedicines()]);
      
      let prescData = Array.isArray(preRes.data) ? [...preRes.data] : [];
      prescData.sort((a, b) => (b.id || 0) - (a.id || 0));
      
      setPrescriptions(prescData);
      setMedicines(Array.isArray(medRes.data) ? medRes.data : []);
    } catch {
      message.error('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const calculateTotalQty = (dosage, days) => {
    if (!dosage || !days) return 0;
    const d = String(dosage).toLowerCase();
    const dayCount = parseInt(days) || 0;
    let timesPerDay = 0;

    if (d.includes('-')) {
      const parts = d.split('-');
      timesPerDay = parts.reduce((acc, curr) => acc + (parseInt(curr.trim()) || 0), 0);
    } else if (d.includes('morning') && d.includes('night') && d.includes('afternoon')) {
      timesPerDay = 3;
    } else if (d.includes('morning') && d.includes('night')) {
      timesPerDay = 2;
    } else if (d.includes('twice')) {
      timesPerDay = 2;
    } else if (d.includes('thrice')) {
      timesPerDay = 3;
    } else if (d.includes('morning') || d.includes('night') || d.includes('once')) {
      timesPerDay = 1;
    } else {
      timesPerDay = parseInt(d) || 1;
    }

    if (timesPerDay === 0) timesPerDay = 1;
    return timesPerDay * dayCount;
  };

  const handleAdd = async () => {
    try {
      const { patient_name, notes, medicines_list } = await form.validateFields();
      setSaving(true);
      
      const doctor_info = user.doctor_name || user.name || user.username || 'Doctor';
      const date = new Date().toISOString().split('T')[0];

      // Send a request for each medicine in the list
      const promises = medicines_list.map((med) => {
        const qty = calculateTotalQty(med.dosage, med.days);
        const payload = {
          patientName: patient_name,
          medicineName: med.medicine_name,
          dosage: med.dosage,
          days: parseInt(med.days) || 0,
          quantity: qty,
          doctorName: doctor_info,
          date
        };
        return addPrescription(payload);
      });

      await Promise.all(promises);
      
      message.success(`Successfully created ${medicines_list.length} prescription entries!`);
      setModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      if (err?.errorFields) return;
      message.error('Failed to create prescription. Check backend.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { 
      title: 'Date', 
      dataIndex: 'date', 
      key: 'date',
      render: (v) => v ? new Date(v).toLocaleDateString() : '—'
    },
    { 
      title: 'Patient Name', 
      key: 'patient_name',
      render: (_, r) => (
        <Text strong>
          {r.patient_name ?? r.patientName ?? r.patient ?? r.name ?? '—'}
        </Text>
      )
    },
    { 
      title: 'Medicine', 
      key: 'medicine_name',
      render: (_, r) => (
        <Tag color="blue">
          {r.medicine_name ?? r.medicineName ?? r.medicine ?? r.name ?? '—'}
        </Tag>
      )
    },
    { title: 'Dosage', dataIndex: 'dosage', key: 'dosage' },
    { title: 'Days', dataIndex: 'days', key: 'days', width: 80 },
    { 
      title: 'Total Qty', 
      key: 'quantity',
      render: (_, r) => (
        <Tag color="orange" style={{ fontWeight: 600 }}>
          {r.quantity ?? r.total_quantity ?? r.totalQuantity ?? '—'}
        </Tag>
      )
    },
    { 
      title: 'Doctor', 
      key: 'doctor_name',
      render: (_, r) => r.doctor_name ?? r.doctorName ?? r.doctor ?? '—'
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ color: '#0a2342', margin: 0 }}>
            Prescription Management
          </Title>
          <Text type="secondary">Create and view patient prescriptions</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => { 
              form.resetFields(); 
              form.setFieldsValue({ medicines_list: [{}] }); // Start with one row
              setModalOpen(true); 
            }}
            style={{
              borderRadius: 10,
              background: 'linear-gradient(135deg,#0a2342,#0d6efd)',
              border: 'none',
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(13,110,253,0.4)',
            }}
          >
            New Prescription
          </Button>
        </Col>
      </Row>

      <Card style={{ borderRadius: 14, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <Table 
          columns={columns} 
          dataSource={prescriptions} 
          loading={loading}
          rowKey={(r) => r.id ?? Math.random()}
          locale={{ emptyText: 'No prescriptions found. Start by creating a new one.' }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ color: '#0d6efd' }} />
            <span style={{ fontWeight: 700, color: '#0a2342' }}>Create New Prescription</span>
          </Space>
        }
        open={modalOpen}
        onOk={handleAdd}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText="Create Prescription"
        width={700}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="patient_name"
            label="Patient Name"
            rules={[{ required: true, message: 'Patient name is required' }]}
          >
            <Input placeholder="Enter patient's full name" size="large" style={{ borderRadius: 8 }} />
          </Form.Item>

          <Divider orientation="left" style={{ margin: '24px 0 12px' }}>
            <span style={{ fontSize: 13, color: '#8c8c8c' }}>MEDICINES & DOSAGE</span>
          </Divider>

          <Form.List name="medicines_list">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card 
                    key={key} 
                    size="small" 
                    style={{ marginBottom: 12, borderRadius: 10, backgroundColor: '#fafafa' }}
                    bodyStyle={{ padding: '12px 16px' }}
                  >
                    <Row gutter={12} align="middle">
                      <Col span={9}>
                        <Form.Item
                          {...restField}
                          name={[name, 'medicine_name']}
                          label="Medicine"
                          rules={[{ required: true, message: 'Select medicine' }]}
                        >
                          <Select showSearch placeholder="Search medicine" style={{ borderRadius: 6 }}>
                            {medicines.map(m => {
                              const mName = m.medicine_name ?? m.medicineName ?? m.name ?? 'Unknown';
                              return <Option key={m.id} value={mName}>{mName}</Option>;
                            })}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'dosage']}
                          label="Dosage"
                          rules={[{ required: true, message: 'Dosage' }]}
                        >
                          <Input placeholder="e.g. 1-0-1" style={{ borderRadius: 6 }} />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item
                          {...restField}
                          name={[name, 'days']}
                          label="Days"
                          rules={[{ required: true, message: 'Days' }]}
                        >
                          <Input type="number" placeholder="Days" style={{ borderRadius: 6 }} />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        {fields.length > 1 && (
                          <MinusCircleOutlined 
                            onClick={() => remove(name)} 
                            style={{ color: '#ff4d4f', fontSize: 18, marginTop: 10 }} 
                          />
                        )}
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                    style={{ borderRadius: 8, height: 40 }}
                  >
                    Add Another Medicine
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item name="notes" label="Additional Notes (Optional)">
            <Input.TextArea rows={2} placeholder="Instructions for pharmacist or patient..." style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
