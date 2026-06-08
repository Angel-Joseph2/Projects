import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message, Divider, Radio } from 'antd';
import { UserOutlined, LockOutlined, MedicineBoxOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons';
import { loginAdmin, loginDoctor, loginPharmacist } from '../services/authService';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      let res;
      if (role === 'admin') {
        res = await loginAdmin(values);
      } else if (role === 'doctor') {
        res = await loginDoctor(values);
      } else {
        res = await loginPharmacist(values);
      }
      
      // Backend returns null or empty if login fails (even with 200 OK)
      if (!res.data || res.data === '') {
        throw new Error('Invalid credentials');
      }

      // Store the returned user object and role
      const userData = { ...res.data, role };
      localStorage.setItem('user', JSON.stringify(userData));
      
      message.success(`Login successful! Welcome back, ${role}.`);
      
      // Navigate based on role
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'doctor') navigate('/doctor/dashboard');
      else navigate('/pharmacist/dashboard');
      
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        err?.response?.data ||
        'Invalid credentials. Please try again.';
      message.error(typeof msg === 'string' ? msg : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a2342 0%, #1a3a6b 40%, #0d6efd 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Card
        style={{
          width: 450,
          borderRadius: 20,
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          border: 'none',
          padding: '8px 8px',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0a2342, #0d6efd)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(13,110,253,0.35)',
            }}
          >
            <MedicineBoxOutlined style={{ fontSize: 36, color: '#fff' }} />
          </div>
          <Title level={3} style={{ margin: 0, color: '#0a2342' }}>
            Pharmacy Management
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Please select your role and sign in
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleLogin} size="large">
          <Form.Item label={<span style={{ fontWeight: 600 }}>Select Role</span>} style={{ textAlign: 'center' }}>
            <Radio.Group 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="admin"><TeamOutlined /> Admin</Radio.Button>
              <Radio.Button value="doctor"><UserOutlined /> Doctor</Radio.Button>
              <Radio.Button value="pharmacist"><SafetyCertificateOutlined /> Pharmacist</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Divider style={{ margin: '12px 0 24px' }} />

          <Form.Item
            name={role === 'admin' ? 'email' : 'username'}
            label={<span style={{ fontWeight: 600, color: '#0a2342' }}>{role === 'admin' ? 'Email Address' : 'Username'}</span>}
            rules={[{ required: true, message: `Please enter your ${role === 'admin' ? 'email' : 'username'}` }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#0d6efd' }} />}
              placeholder={`Enter ${role === 'admin' ? 'email' : 'username'}`}
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ fontWeight: 600, color: '#0a2342' }}>Password</span>}
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#0d6efd' }} />}
              placeholder="Enter password"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #0a2342, #0d6efd)',
                border: 'none',
                boxShadow: '0 4px 16px rgba(13,110,253,0.4)',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
