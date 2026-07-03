import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Select, Alert, Row, Col } from 'antd';
import {
  UserOutlined, MailOutlined, LockOutlined,
  IdcardOutlined, BankOutlined, PhoneOutlined,
  LinkedinOutlined, GithubOutlined, SafetyOutlined, SolutionOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

type Mode = 'student' | 'admin';

const Register = () => {
  const [mode, setMode]       = useState<Mode>('student');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { register }          = useAuth();
  const navigate              = useNavigate();
  const [form]                = Form.useForm();

  const switchMode = (m: Mode) => { setMode(m); setError(''); form.resetFields(); };

  const handleSubmit = async (values: any) => {
    setError('');
    setLoading(true);
    try {
      await register({
        ...values,
        year: values.year ? parseInt(values.year) : undefined,
      });
      navigate(mode === 'admin' ? '/admin' : '/dashboard');
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
            {mode === 'admin'
              ? <>Set up your <span className="auth-gradient-text">Institution Admin</span> account</>
              : <>Start your journey with <span className="auth-gradient-text">Skills & Achievement</span> Tracker</>
            }
          </h1>
          <p className="auth-subtext">
            {mode === 'admin'
              ? 'Create your admin account to manage student profiles, track department-level talent, and support placement preparation.'
              : 'Create your student profile and begin tracking your growth. Get AI-powered insights on skill gaps and learning paths.'
            }
          </p>
          <div className="auth-pills">
            {mode === 'admin' ? (
              <>
                <span className="auth-pill">📊 Analytics</span>
                <span className="auth-pill">👥 All Students</span>
                <span className="auth-pill">🏆 Top Talent</span>
                <span className="auth-pill">🎓 Placement Ready</span>
              </>
            ) : (
              <>
                <span className="auth-pill">🔍 AI Advisor</span>
                <span className="auth-pill">📜 Certifications</span>
                <span className="auth-pill">🏆 Achievements</span>
                <span className="auth-pill">💼 Internships</span>
              </>
            )}
          </div>
          <div className="auth-info-cards">
            {mode === 'admin' ? (
              <>
                <div className="auth-info-card">
                  <div className="auth-info-icon">🏫</div>
                  <div>
                    <div className="auth-info-title">Institution view</div>
                    <div className="auth-info-desc">See all students, departments, and engagement stats.</div>
                  </div>
                </div>
                <div className="auth-info-card">
                  <div className="auth-info-icon">🔐</div>
                  <div>
                    <div className="auth-info-title">Secret key required</div>
                    <div className="auth-info-desc">Admin accounts need the institution secret key to register.</div>
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="auth-logo-row">
            <div className="auth-logo-icon" style={mode === 'admin' ? { background: 'linear-gradient(135deg, #4ade80, #16a34a)' } : {}}>
              {mode === 'admin' ? '🏫' : 'ST'}
            </div>
            <div>
              <div className="auth-logo-label">SKILLS TRACKER ✦</div>
              <h2 className="auth-welcome">{mode === 'admin' ? 'Admin Register' : 'Create account'}</h2>
            </div>
          </div>

          {/* Mode toggle */}
          <div style={{
            display: 'flex', background: '#f3f4f6', borderRadius: 10,
            padding: 4, marginBottom: 20, gap: 4,
          }}>
            {(['student', 'admin'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
                  background: mode === m ? (m === 'admin' ? '#16a34a' : '#4f46e5') : 'transparent',
                  color: mode === m ? '#fff' : '#6b7280',
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                {m === 'student' ? '🎓 Student' : '🏫 Admin'}
              </button>
            ))}
          </div>

          <div className="auth-info-box" style={mode === 'admin' ? { background: '#f0fdf4', borderColor: '#bbf7d0', color: '#14532d' } : {}}>
            {mode === 'admin'
              ? 'Admin accounts require the institution secret key. Contact your system administrator if you don\'t have it.'
              : 'Fill in your student details below to create your profile.'}
          </div>

          {error && (
            <Alert message={error} type="error" showIcon closable onClose={() => setError('')}
              style={{ marginBottom: 16, borderRadius: 8 }} />
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

            {mode === 'student' && (
              <>
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
              </>
            )}

            {mode === 'admin' && (
              <>
                <div className="auth-section-title">Admin Details</div>
                <Form.Item name="designation" rules={[{ required: true, message: 'Designation is required' }]}>
                  <Input prefix={<SolutionOutlined style={{ color: '#9ca3af' }} />} placeholder="e.g. HOD, Lecturer, Lab Admin" />
                </Form.Item>

                <div className="auth-section-title">Institution Secret Key</div>
                <Form.Item name="adminSecret" rules={[{ required: true, message: 'Secret key is required' }]}>
                  <Input.Password
                    prefix={<SafetyOutlined style={{ color: '#16a34a' }} />}
                    placeholder="Admin secret key"
                  />
                </Form.Item>
              </>
            )}

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  height: 44, borderRadius: 8, fontWeight: 600, fontSize: 15,
                  background: mode === 'admin' ? '#16a34a' : undefined,
                  borderColor: mode === 'admin' ? '#16a34a' : undefined,
                }}
              >
                {mode === 'admin' ? 'Create Admin Account' : 'Create Student Account'}
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
