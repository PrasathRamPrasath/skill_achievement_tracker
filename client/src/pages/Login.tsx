import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const Login = () => {
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();
  const [form]                = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('');
    setLoading(true);
    try {
      const user = await login(values.email, values.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
          <div className="auth-badge">✦ AI-POWERED PLATFORM</div>
          <h1 className="auth-heading">
            Sign in to your{' '}
            <span className="auth-gradient-text">Skills & Achievement</span>{' '}
            Tracker
          </h1>
          <p className="auth-subtext">
            Track your skills, certifications, achievements, and internships.
            Get AI-powered recommendations to boost your career.
          </p>
          <div className="auth-pills">
            <span className="auth-pill">🔍 AI Advisor</span>
            <span className="auth-pill">📜 Certifications</span>
            <span className="auth-pill">🏆 Achievements</span>
            <span className="auth-pill">⚡ Live Insights</span>
          </div>
          <div className="auth-info-cards">
            <div className="auth-info-card">
              <div className="auth-info-icon">🎓</div>
              <div>
                <div className="auth-info-title">Students create accounts</div>
                <div className="auth-info-desc">Register with your roll number, department, and year.</div>
              </div>
            </div>
            <div className="auth-info-card">
              <div className="auth-info-icon">📊</div>
              <div>
                <div className="auth-info-title">Track everything</div>
                <div className="auth-info-desc">All your academic achievements and skills in one place.</div>
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
              <h2 className="auth-welcome">Welcome back</h2>
            </div>
          </div>

          <div className="auth-info-box">
            Student? Sign in with the email and password you registered with.
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

          <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Email address"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ height: 44, borderRadius: 8, fontWeight: 600, fontSize: 15 }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Register here</Link>
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

export default Login;
