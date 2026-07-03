import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Select, Alert, Row, Col } from 'antd';
import {
  UserOutlined, MailOutlined, LockOutlined,
  IdcardOutlined, BankOutlined, PhoneOutlined,
  LinkedinOutlined, GithubOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Register = () => {
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();
  const [form]                = Form.useForm();

  const handleSubmit = async (values: any) => {
    setError('');
    setLoading(true);
    try {
      await register({
        ...values,
        year: values.year ? parseInt(values.year) : undefined,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
        <div className="auth-orb auth-orb-4" />
        <div className="auth-orb auth-orb-5" />
        <div className="auth-orb auth-orb-6" />

        <div className="auth-left-content">
          <div className="auth-badge">✦ JOIN THE COMMUNITY</div>
          <h1 className="auth-heading">
            Start your journey with{' '}
            <span className="auth-gradient-text">Skills & Achievement</span>{' '}
            Tracker
          </h1>
          <p className="auth-subtext">
            Create your student profile and begin tracking your growth.
            Get AI-powered insights on skill gaps and learning paths.
          </p>
          <div className="auth-pills">
            <span className="auth-pill">🔍 AI Advisor</span>
            <span className="auth-pill">📜 Certifications</span>
            <span className="auth-pill">🏆 Achievements</span>
            <span className="auth-pill">💼 Internships</span>
          </div>
          <div className="auth-info-cards">
            <div className="auth-info-card">
              <div className="auth-info-icon">🎓</div>
              <div>
                <div className="auth-info-title">Student profiles</div>
                <div className="auth-info-desc">Register with your roll number and department info.</div>
              </div>
            </div>
            <div className="auth-info-card">
              <div className="auth-info-icon">🤖</div>
              <div>
                <div className="auth-info-title">AI-powered advice</div>
                <div className="auth-info-desc">Get personalised skill and certification recommendations.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-logo-row">
            <div className="auth-logo-icon">ST</div>
            <div>
              <div className="auth-logo-label">SKILLS TRACKER ✦</div>
              <h2 className="auth-welcome">Create account</h2>
            </div>
          </div>

          <div className="auth-info-box">
            Fill in your student details below to create your profile.
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
              style={{ marginBottom: 16, borderRadius: 8 }}
            />
          )}

          <Form form={form} layout="vertical" onFinish={handleSubmit} size="middle">

            <div className="auth-section-title">Basic Info</div>

            <Form.Item name="name" rules={[{ required: true, message: 'Required' }]}>
              <Input prefix={<UserOutlined style={{ color: '#9ca3af' }} />} placeholder="Full name" />
            </Form.Item>

            <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Valid email required' }]}>
              <Input prefix={<MailOutlined style={{ color: '#9ca3af' }} />} placeholder="Email address" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Min 6 characters' }]}>
              <Input.Password prefix={<LockOutlined style={{ color: '#9ca3af' }} />} placeholder="Password (min 6 chars)" />
            </Form.Item>

            <div className="auth-section-title">Student Details</div>

            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="rollNumber" rules={[{ required: true, message: 'Required' }]}>
                  <Input prefix={<IdcardOutlined style={{ color: '#9ca3af' }} />} placeholder="Roll Number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="department" rules={[{ required: true, message: 'Required' }]}>
                  <Input prefix={<BankOutlined style={{ color: '#9ca3af' }} />} placeholder="Department" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="year" rules={[{ required: true, message: 'Required' }]}>
                  <Select placeholder="Year" options={[
                    { value: '1', label: 'Year 1' },
                    { value: '2', label: 'Year 2' },
                    { value: '3', label: 'Year 3' },
                    { value: '4', label: 'Year 4' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone">
                  <Input prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />} placeholder="Phone (optional)" />
                </Form.Item>
              </Col>
            </Row>

            <div className="auth-section-title">Social Links (Optional)</div>

            <Form.Item name="linkedin">
              <Input prefix={<LinkedinOutlined style={{ color: '#0077b5' }} />} placeholder="LinkedIn URL" />
            </Form.Item>

            <Form.Item name="github">
              <Input prefix={<GithubOutlined style={{ color: '#1f2937' }} />} placeholder="GitHub URL" />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ height: 44, borderRadius: 8, fontWeight: 600, fontSize: 15 }}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">Sign in here</Link>
            </p>
          </div>

          <div className="auth-powered">
            <span>Powered by</span>
            <span className="auth-brand">Skills Tracker</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
