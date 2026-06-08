import { useEffect, useState } from 'react';
import {
  Typography, Card, Table, Button, InputNumber, Row, Col,
  Statistic, Space, Select, Divider, message, Input, Form, Tag, Tooltip, Modal, Radio
} from 'antd';
import {
  ShoppingOutlined,
  PrinterOutlined,
  DeleteOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { getMedicines, updateMedicine } from '../services/medicineService';
import { addBill } from '../services/billingService';
import { viewPrescriptions } from '../services/prescriptionService';

const { Title, Text } = Typography;
const { Option } = Select;

export default function BillingPage() {
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [cart, setCart] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [fetchingPres, setFetchingPres] = useState(false);
  const [prescriptionFilter, setPrescriptionFilter] = useState('Pending');

  // Fetch medicines and prescriptions
  const fetchData = async () => {
    setLoading(true);
    try {
      const [medRes, presRes] = await Promise.all([
        getMedicines(),
        viewPrescriptions()
      ]);
      setMedicines(Array.isArray(medRes.data) ? medRes.data : []);
      setPrescriptions(Array.isArray(presRes.data) ? presRes.data : []);
    } catch {
      message.error('Failed to load system data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCart = (medicineId, prescribedQty = 1) => {
    setCart(prevCart => {
      const med = medicines.find(m => m.id === medicineId);
      if (!med) return prevCart;

      const existing = prevCart.find(item => item.id === medicineId);
      const name = med.medicine_name ?? med.medicineName ?? med.name;
      const price = med.price ?? 0;
      const stock = Number(med.quantity ?? med.stock ?? 0);

      if (stock <= 0) {
        message.error(`"${name}" is out of stock!`);
        return prevCart;
      }

      if (existing) {
        let newQty = existing.quantity + prescribedQty;
        if (newQty > stock) {
          message.warning(`Only ${stock} units available in stock for ${name}.`);
          newQty = stock;
        }
        return prevCart.map(item => 
          item.id === medicineId ? { ...item, quantity: newQty, total: price * newQty } : item
        );
      }

      const finalQty = Math.min(prescribedQty, stock);
      message.success(`${name} added to cart.`);
      return [...prevCart, {
        id: med.id,
        name,
        price,
        quantity: finalQty,
        total: price * finalQty,
        stock
      }];
    });
  };

  const calculatePrescribedQty = (dosage, days) => {
    if (!dosage || !days) return 1;
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

  const loadFromPrescription = (groupKey) => {
    // Find all prescriptions in this group
    const relatedPrescriptions = prescriptions.filter(p => {
      const key = `${p.patientName ?? p.patient_name}-${p.date}-${p.doctorName ?? p.doctor_name}`;
      return key === groupKey;
    });

    if (relatedPrescriptions.length === 0) return;

    const first = relatedPrescriptions[0];
    setPatientName(first.patientName ?? first.patient_name ?? '');

    relatedPrescriptions.forEach(pres => {
      const medName = pres.medicine_name ?? pres.medicineName;
      const med = medicines.find(m => 
        (m.medicine_name ?? m.medicineName ?? m.name ?? '').toLowerCase() === (medName ?? '').toLowerCase()
      );

      if (med) {
        let calculatedQty = pres.quantity ?? pres.total_quantity ?? pres.totalQuantity ?? 0;
        if (!calculatedQty || calculatedQty === 0) {
          calculatedQty = calculatePrescribedQty(pres.dosage, pres.days);
        }
        addToCart(med.id, calculatedQty);
      }
    });

    message.success(`Loaded ${relatedPrescriptions.length} items from prescription.`);
  };

  const updateQuantity = (id, qty) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        if (qty > item.stock) {
          message.warning(`Only ${item.stock} units available in stock.`);
          qty = item.stock;
        }
        return { ...item, quantity: qty, total: item.price * qty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  const handleGenerateBill = async () => {
    if (!patientName) {
      message.error('Please enter patient name.');
      return;
    }
    if (cart.length === 0) {
      message.error('Cart is empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const billData = {
        patient_name: patientName,
        patientName: patientName,
        total_amount: totalAmount,
        totalAmount: totalAmount,
        items: cart.map(item => ({
          medicine_id: item.id,
          medicine_name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        date: new Date().toISOString().split('T')[0]
      };

      // 1. Save the bill
      await addBill(billData);

      // 2. Reduce stock for each item in the cart
      const updatePromises = cart.map(item => {
        const originalMed = medicines.find(m => m.id === item.id);
        const newQty = item.stock - item.quantity;
        
        // Prepare the update payload (preserving other fields like category, price etc)
        const updatePayload = {
          ...originalMed,
          quantity: newQty,
          // Handle camelCase if backend uses it
          stock: newQty,
          qty: newQty
        };
        
        return updateMedicine(item.id, updatePayload);
      });

      await Promise.all(updatePromises);

      message.success('Bill generated and stock updated successfully!');
      
      setCurrentBill({
        patientName,
        items: [...cart],
        totalAmount,
        date: new Date().toLocaleDateString()
      });
      setPrintModalOpen(true);
      
      setCart([]);
      setPatientName('');
      fetchData(); // Refresh medicines to show updated stock
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to process bill or update stock. Check connection.';
      message.error(errMsg);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClosePrintModal = () => {
    setPrintModalOpen(false);
    setCurrentBill(null);
  };

  const columns = [
    { 
      title: 'Item', 
      dataIndex: 'name', 
      key: 'name', 
      render: (v) => <Space><MedicineBoxOutlined style={{color: '#0d6efd'}} /><Text strong>{v}</Text></Space> 
    },
    { 
      title: 'Price', 
      dataIndex: 'price', 
      key: 'price', 
      render: (v) => <Text style={{fontWeight: 600}}>₹{v}</Text> 
    },
    {
      title: 'Qty',
      key: 'quantity',
      width: 100,
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.stock}
          value={record.quantity}
          onChange={(val) => updateQuantity(record.id, val)}
          style={{ width: 70, borderRadius: 6 }}
        />
      )
    },
    { 
      title: 'Total', 
      dataIndex: 'total', 
      key: 'total', 
      render: (v) => <Text strong style={{ color: '#3f8600' }}>₹{v.toFixed(2)}</Text> 
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.id)}
        />
      )
    },
  ];

  return (
    <div style={{ padding: '0px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ color: '#0a2342', margin: 0 }}>
            Billing & Sales
          </Title>
          <Text type="secondary">Search patient prescriptions and generate bills</Text>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          {/* Prescription Search Section */}
          <Card
            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 20, borderTop: '4px solid #0d6efd' }}
          >
            <Text strong style={{ display: 'block', marginBottom: 12, fontSize: 16 }}>
              <FileTextOutlined style={{ marginRight: 8, color: '#0d6efd' }} />
              Quick Fetch: Search Patient Prescription
            </Text>
            
            <div style={{ marginBottom: 16 }}>
              <Radio.Group 
                value={prescriptionFilter} 
                onChange={e => setPrescriptionFilter(e.target.value)}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="All">All</Radio.Button>
                <Radio.Button value="Pending">Pending</Radio.Button>
                <Radio.Button value="Completed">Completed</Radio.Button>
              </Radio.Group>
            </div>

            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Search by Patient Name..."
              optionFilterProp="children"
              onChange={loadFromPrescription}
              value={null}
              size="large"
              loading={loading}
              filterOption={(input, option) => {
                return (option.dataSearch ?? '').toLowerCase().includes(input.toLowerCase());
              }}
            >
              {Object.values(prescriptions.reduce((acc, p) => {
                const pName = p.patientName ?? p.patient_name ?? 'Unknown';
                const dName = p.doctorName ?? p.doctor_name ?? 'Unknown';
                const key = `${pName}-${p.date}-${dName}`;
                if (!acc[key]) {
                  acc[key] = { 
                    key, 
                    patientName: pName, 
                    date: p.date, 
                    doctorName: dName, 
                    medicines: [],
                    status: p.billingStatus ?? p.billing_status ?? 'Pending'
                  };
                }
                acc[key].medicines.push(p.medicineName ?? p.medicine_name ?? 'Unknown');
                return acc;
              }, {}))
              .filter(group => {
                if (prescriptionFilter === 'All') return true;
                const isCompleted = group.status.toLowerCase() === 'completed';
                if (prescriptionFilter === 'Completed') return isCompleted;
                if (prescriptionFilter === 'Pending') return !isCompleted;
                return true;
              })
              .map(group => {
                const isCompleted = group.status.toLowerCase() === 'completed';
                return (
                <Option 
                  key={group.key} 
                  value={group.key} 
                  dataSearch={`${group.patientName} ${group.doctorName}`}
                >
                  <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                    <Col>
                      <Text strong>{group.patientName}</Text>
                      <Text type="secondary" style={{ marginLeft: 8 }}>({group.date})</Text>
                      <Tag 
                        color={isCompleted ? 'green' : 'orange'} 
                        style={{ marginLeft: 8, fontWeight: 600 }}
                      >
                        {isCompleted ? 'Completed' : 'Pending'}
                      </Tag>
                    </Col>
                    <Col>
                      <Tag color="blue">{group.medicines.length} Medicines</Tag>
                      <Tooltip title={group.medicines.join(', ')}>
                        <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                          {group.medicines.length > 1 ? `${group.medicines[0]} +${group.medicines.length - 1}` : group.medicines[0]}
                        </Text>
                      </Tooltip>
                    </Col>
                  </Row>
                </Option>
              )})}
            </Select>
            <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
              Selecting a prescription will automatically fill the patient name and add the medicine to the cart.
            </Text>
          </Card>

          <Card
            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 20 }}
            title={<Space><ShoppingOutlined style={{color: '#0d6efd'}} /> Billing Cart</Space>}
          >
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 8, color: '#0a2342' }}>Manual Medicine Add</Text>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Select additional medicine..."
                optionFilterProp="children"
                onChange={(id) => addToCart(id)}
                value={null}
                loading={loading}
                filterOption={(input, option) =>
                  (option?.children?.props?.children[0]?.props?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {medicines.map(m => {
                  const name = m.medicine_name ?? m.medicineName ?? m.name;
                  const stock = Number(m.quantity ?? m.stock ?? 0);
                  return (
                    <Option key={m.id} value={m.id} disabled={stock <= 0}>
                      <Space justify="space-between" style={{ width: '100%' }}>
                        <span>{name} - ₹{m.price}</span>
                        <Tag color={stock <= 10 ? 'red' : 'green'}>{stock} in stock</Tag>
                      </Space>
                    </Option>
                  );
                })}
              </Select>
            </div>

            <Table
              columns={columns}
              dataSource={cart}
              pagination={false}
              rowKey="id"
              locale={{ emptyText: 'Cart is empty. Search a prescription or add medicines manually.' }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<Space><UserOutlined style={{color: '#0d6efd'}} /> Checkout Details</Space>}
            style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 20 }}
          >
            <Form layout="vertical">
              <Form.Item label={<Text strong>Patient Name</Text>} required>
                <Input
                  size="large"
                  prefix={<UserOutlined style={{color: '#bfbfbf'}} />}
                  placeholder="Patient Name"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
              <Form.Item label={<Text strong>Billing Date</Text>}>
                <Input
                  size="large"
                  value={new Date().toLocaleDateString()}
                  disabled
                  style={{ borderRadius: 8, backgroundColor: '#f5f5f5' }}
                />
              </Form.Item>
            </Form>

            <Divider />

            <div style={{ padding: '4px 0' }}>
              <Row justify="space-between" style={{ marginBottom: 12 }}>
                <Text type="secondary">Subtotal:</Text>
                <Text strong>₹{totalAmount.toFixed(2)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 600 }}>Total Payable:</Text>
                <Text style={{ fontSize: 22, fontWeight: 700, color: '#3f8600' }}>₹{totalAmount.toFixed(2)}</Text>
              </Row>
            </div>

            <Button
              type="primary"
              block
              size="large"
              icon={<PrinterOutlined />}
              onClick={handleGenerateBill}
              loading={isSubmitting}
              disabled={cart.length === 0}
              style={{
                height: 52,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 16,
                background: 'linear-gradient(135deg, #0a2342, #0d6efd)',
                border: 'none',
                boxShadow: '0 4px 14px rgba(13,110,253,0.4)',
                marginTop: 10
              }}
            >
              Confirm & Generate Bill
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Print Bill Modal */}
      <Modal
        title={<Space><PrinterOutlined style={{color: '#0d6efd'}} /> <span style={{ fontWeight: 700, color: '#0a2342' }}>Print Bill</span></Space>}
        open={printModalOpen}
        onCancel={handleClosePrintModal}
        footer={[
          <Button key="close" onClick={handleClosePrintModal} style={{ borderRadius: 8 }}>
            Close
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint} style={{ background: '#0a2342', borderColor: '#0a2342', borderRadius: 8 }}>
            Print Bill
          </Button>,
        ]}
        width={500}
      >
        {currentBill && (
          <div id="print-section" style={{ padding: 12 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Title level={4} style={{ margin: 0, color: '#0a2342' }}>Pharmacy Management</Title>
              <Text type="secondary">Patient Prescription & Bill</Text>
            </div>
            
            <Row justify="space-between" style={{ marginBottom: 16 }}>
              <Col>
                <Text type="secondary">Patient Name:</Text>
                <br />
                <Text strong>{currentBill.patientName}</Text>
              </Col>
              <Col style={{ textAlign: 'right' }}>
                <Text type="secondary">Date:</Text>
                <br />
                <Text strong>{currentBill.date}</Text>
              </Col>
            </Row>

            <Divider dashed style={{ margin: '12px 0' }} />

            <table style={{ width: '100%', marginBottom: 16, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>Item</th>
                  <th style={{ textAlign: 'center', paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>Qty</th>
                  <th style={{ textAlign: 'right', paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>Price</th>
                  <th style={{ textAlign: 'right', paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {currentBill.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '8px 0', borderBottom: '1px solid #f9f9f9' }}>{item.name}</td>
                    <td style={{ textAlign: 'center', padding: '8px 0', borderBottom: '1px solid #f9f9f9' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #f9f9f9' }}>₹{item.price}</td>
                    <td style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #f9f9f9' }}>₹{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Row justify="space-between" style={{ marginTop: 12 }}>
              <Col><Text strong>Grand Total:</Text></Col>
              <Col><Text strong style={{ fontSize: 16, color: '#3f8600' }}>₹{currentBill.totalAmount.toFixed(2)}</Text></Col>
            </Row>

            <div style={{ textAlign: 'center', marginTop: 30 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Thank you for visiting.</Text>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


