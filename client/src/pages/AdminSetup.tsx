import { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { LockOutlined, MailOutlined, SafetyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/api';

const { Title, Text } = Typography;

const AdminSetup = () => {
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (values: { email: string; secret: string }) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res  = await fetch(`${BASE_URL}/users/make-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) setSuccess(data.message);
      else        setError(data.message || 'Something went wrong');
    } catch {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <Card
        variant="borderless"
        style={{ width: '100%', maxWidth: 420, borderRadius: 16, boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28, color: '#fff',
          }}>
            <SafetyOutlined />
          </div>
          <Title level={3} style={{ margin: 0, color: '#1e1b4b' }}>Admin Setup</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Promote an existing account to admin using the secret key
          </Text>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#059669', marginBottom: 12 }} />
            <Alert type="success" message={success} showIcon style={{ borderRadius: 10, marginBottom: 20 }} />
            <Text type="secondary" style={{ fontSize: 13 }}>
              Log out and log back in with the same account to activate admin mode.
            </Text>
            <div style={{ marginTop: 20 }}>
              <Link to="/login">
                <Button type="primary" block style={{ borderRadius: 8, height: 42 }}>
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <Form layout="vertical" onFinish={handleSubmit}>
            {error && (
              <Alert type="error" message={error} showIcon closable onClose={() => setError('')}
                style={{ borderRadius: 10, marginBottom: 16 }} />
            )}

            <Form.Item
              name="email"
              label="Registered Email"
              rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                placeholder="The email you registered with"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="secret"
              label="Admin Secret Key"
              rules={[{ required: true, message: 'Enter the admin secret' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Secret key from .env (ADMIN_SECRET)"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{ borderRadius: 8, background: '#dc2626', borderColor: '#dc2626', height: 46 }}
              >
                Make Admin
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/login" style={{ color: '#6b7280', fontSize: 13 }}>← Back to Login</Link>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default AdminSetup;
