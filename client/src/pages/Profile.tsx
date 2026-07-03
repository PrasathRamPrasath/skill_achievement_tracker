import { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Avatar, Typography,
  message, Row, Col, Tag, Space, Select,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined,
  LinkedinOutlined, GithubOutlined, SaveOutlined,
  IdcardOutlined, BankOutlined, AimOutlined, EditOutlined, CloseOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../utils/api';

const { Title, Text } = Typography;

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{
    fontSize: 11, fontWeight: 700, color: '#9ca3af',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 12, marginTop: 4,
    paddingBottom: 8, borderBottom: '1px solid #f3f4f6',
  }}>
    {children}
  </div>
);

const ViewField = ({ label, value, icon }: { label: string; value?: string | null; icon?: React.ReactNode }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>
      {label}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: value ? '#111827' : '#d1d5db' }}>
      {icon && <span style={{ color: '#9ca3af', fontSize: 13 }}>{icon}</span>}
      {value || '—'}
    </div>
  </div>
);

const Profile = () => {
  const { user }                    = useAuth();
  const [form]                      = Form.useForm();
  const [loading, setLoading]       = useState(false);
  const [editing, setEditing]       = useState(false);
  const [skillPreview, setSkillPreview] = useState<string[]>([]);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name:        user.name,
        email:       user.email,
        rollNumber:  user.rollNumber,
        department:  user.department,
        year:        user.year?.toString(),
        phone:       user.phone,
        linkedin:    user.linkedin,
        github:      user.github,
        skills:      user.skills?.join(', '),
        careerGoal:  user.careerGoal,
        resumeUrl:   user.resumeUrl,
        designation: user.designation,
      });
      setSkillPreview(user.skills ?? []);
    }
  }, [user, form]);

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillPreview(e.target.value.split(',').map((s) => s.trim()).filter(Boolean));
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const tkn = localStorage.getItem('token');
      const skillsArray = values.skills
        ? values.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tkn}` },
        body: JSON.stringify({
          ...values,
          year:       values.year ? parseInt(values.year) : undefined,
          skills:     skillsArray,
          careerGoal: values.careerGoal || '',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success('Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify(data));
        setEditing(false);
        window.location.reload();
      } else {
        message.error(data.message || 'Failed to update profile');
      }
    } catch {
      message.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    if (user) {
      form.setFieldsValue({
        name:        user.name,
        email:       user.email,
        rollNumber:  user.rollNumber,
        department:  user.department,
        year:        user.year?.toString(),
        phone:       user.phone,
        linkedin:    user.linkedin,
        github:      user.github,
        skills:      user.skills?.join(', '),
        careerGoal:  user.careerGoal,
        resumeUrl:   user.resumeUrl,
        designation: user.designation,
      });
      setSkillPreview(user.skills ?? []);
    }
    setEditing(false);
  };

  return (
    <Row gutter={[24, 24]}>
      {/* Avatar card */}
      <Col xs={24} lg={7}>
        <Card
          variant="borderless"
          style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}
        >
          <Avatar
            size={96}
            style={{
              background: isAdmin
                ? 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)'
                : 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
              fontSize: 32, fontWeight: 700,
              marginBottom: 16,
              boxShadow: isAdmin
                ? '0 8px 24px rgba(22,163,74,0.25)'
                : '0 8px 24px rgba(79,70,229,0.25)',
            }}
          >
            {initials}
          </Avatar>

          <Title level={4} style={{ margin: 0, color: '#111827' }}>{user?.name}</Title>
          <Text style={{ color: '#9ca3af', fontSize: 13 }}>{user?.email}</Text>

          <div style={{ marginTop: 10 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
              background: '#f0fdf4', color: '#16a34a', border: '1.5px solid #bbf7d0',
            }}>
              {isAdmin ? '🏫 Admin' : '🎓 Student'}
            </span>
          </div>

          {isAdmin && user?.designation && (
            <div style={{ marginTop: 8 }}>
              <Tag icon={<SolutionOutlined />} color="green" style={{ borderRadius: 20, padding: '2px 12px', fontSize: 12 }}>
                {user.designation}
              </Tag>
            </div>
          )}

          {!isAdmin && user?.department && (
            <div style={{ marginTop: 10 }}>
              <Tag color="purple" style={{ borderRadius: 20, padding: '2px 12px' }}>{user.department}</Tag>
              {user?.year && (
                <Tag color="blue" style={{ borderRadius: 20, padding: '2px 12px' }}>Year {user.year}</Tag>
              )}
            </div>
          )}

          {!isAdmin && user?.careerGoal && (
            <div style={{ marginTop: 12, padding: '8px 12px', background: '#f5f3ff', borderRadius: 8, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <AimOutlined style={{ color: '#7c3aed', fontSize: 12 }} />
                <Text style={{ fontSize: 10, fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Career Goal
                </Text>
              </div>
              <Text style={{ fontSize: 12, color: '#4c1d95' }}>{user.careerGoal}</Text>
            </div>
          )}

          <div style={{ marginTop: 20, textAlign: 'left', borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>
              Quick Links
            </Text>
            {user?.linkedin ? (
              <div style={{ marginTop: 8 }}>
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#0077b5', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <LinkedinOutlined /> LinkedIn Profile
                </a>
              </div>
            ) : (
              <div style={{ marginTop: 8, fontSize: 13, color: '#d1d5db' }}>No links added</div>
            )}
            {user?.github && (
              <div style={{ marginTop: 6 }}>
                <a href={user.github} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#374151', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <GithubOutlined /> GitHub Profile
                </a>
              </div>
            )}
          </div>

          {!isAdmin && skillPreview.length > 0 && (
            <div style={{ marginTop: 16, textAlign: 'left', borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
              <Text style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>
                Skills
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {skillPreview.slice(0, 8).map((s, i) => (
                  <Tag key={i} style={{ borderRadius: 20, margin: 0, fontSize: 11, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151' }}>{s}</Tag>
                ))}
                {skillPreview.length > 8 && (
                  <Tag style={{ borderRadius: 20, margin: 0, fontSize: 11 }}>+{skillPreview.length - 8}</Tag>
                )}
              </div>
            </div>
          )}
        </Card>
      </Col>

      {/* Right panel */}
      <Col xs={24} lg={17}>
        <Card
          variant="borderless"
          style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: '#111827' }}>My Profile</span>
              {!editing ? (
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setEditing(true)}
                  style={{ borderRadius: 8 }}
                >
                  Edit
                </Button>
              ) : (
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  style={{ borderRadius: 8 }}
                >
                  Cancel
                </Button>
              )}
            </div>
          }
        >
          {/* ── VIEW MODE ── */}
          {!editing && (
            <div>
              <SectionLabel>Basic Info</SectionLabel>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <ViewField label="Full Name"  value={user?.name}  icon={<UserOutlined />} />
                </Col>
                <Col xs={24} md={12}>
                  <ViewField label="Email"      value={user?.email} icon={<MailOutlined />} />
                </Col>
                <Col xs={24} md={12}>
                  <ViewField label="Phone"      value={user?.phone} icon={<PhoneOutlined />} />
                </Col>
                {isAdmin && (
                  <Col xs={24} md={12}>
                    <ViewField label="Designation" value={user?.designation} icon={<SolutionOutlined />} />
                  </Col>
                )}
                {!isAdmin && (
                  <Col xs={24} md={12}>
                    <ViewField label="Resume URL" value={user?.resumeUrl} />
                  </Col>
                )}
              </Row>

              {!isAdmin && (
                <>
                  <SectionLabel>Academic Info</SectionLabel>
                  <Row gutter={24}>
                    <Col xs={24} md={8}>
                      <ViewField label="Roll Number" value={user?.rollNumber} icon={<IdcardOutlined />} />
                    </Col>
                    <Col xs={24} md={8}>
                      <ViewField label="Department"  value={user?.department} icon={<BankOutlined />} />
                    </Col>
                    <Col xs={24} md={8}>
                      <ViewField label="Year"        value={user?.year ? `Year ${user.year}` : null} />
                    </Col>
                  </Row>
                </>
              )}

              <SectionLabel>Social Links</SectionLabel>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <ViewField label="LinkedIn" value={user?.linkedin} icon={<LinkedinOutlined />} />
                </Col>
                <Col xs={24} md={12}>
                  <ViewField label="GitHub"   value={user?.github}   icon={<GithubOutlined />} />
                </Col>
              </Row>

              {!isAdmin && (
                <>
                  <SectionLabel>Career</SectionLabel>
                  <ViewField label="Career Goal" value={user?.careerGoal} icon={<AimOutlined />} />
                  <SectionLabel>Skills</SectionLabel>
                  {(user?.skills?.length ?? 0) > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {user!.skills!.map((s, i) => (
                        <Tag key={i} style={{ borderRadius: 20, margin: 0, fontSize: 12, background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151', padding: '3px 10px' }}>
                          {s}
                        </Tag>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#d1d5db', fontSize: 14 }}>—</span>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── EDIT MODE ── */}
          {editing && (
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <SectionLabel>Basic Info</SectionLabel>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="name" label="Full Name">
                    <Input prefix={<UserOutlined style={{ color: '#9ca3af' }} />} placeholder="Your full name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="email" label="Email">
                    <Input prefix={<MailOutlined style={{ color: '#9ca3af' }} />} disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="phone" label="Phone">
                    <Input prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />} placeholder="+91 9876543210" />
                  </Form.Item>
                </Col>
                {isAdmin && (
                  <Col xs={24} md={12}>
                    <Form.Item name="designation" label="Designation">
                      <Input prefix={<SolutionOutlined style={{ color: '#9ca3af' }} />} placeholder="e.g. HOD, Lecturer, Lab Admin" />
                    </Form.Item>
                  </Col>
                )}
                {!isAdmin && (
                  <Col xs={24} md={12}>
                    <Form.Item name="resumeUrl" label="Resume URL">
                      <Input placeholder="https://drive.google.com/..." />
                    </Form.Item>
                  </Col>
                )}
              </Row>

              {!isAdmin && (
                <>
                  <SectionLabel>Academic Info</SectionLabel>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item name="rollNumber" label="Roll Number">
                        <Input prefix={<IdcardOutlined style={{ color: '#9ca3af' }} />} placeholder="e.g., 21CS001" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="department" label="Department">
                        <Input prefix={<BankOutlined style={{ color: '#9ca3af' }} />} placeholder="e.g., Computer Science" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item name="year" label="Year">
                        <Select placeholder="Select year" options={[
                          { value: '1', label: 'Year 1' },
                          { value: '2', label: 'Year 2' },
                          { value: '3', label: 'Year 3' },
                          { value: '4', label: 'Year 4' },
                        ]} />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              <SectionLabel>Social Links</SectionLabel>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="linkedin" label="LinkedIn URL">
                    <Input prefix={<LinkedinOutlined style={{ color: '#0077b5' }} />} placeholder="https://linkedin.com/in/..." />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="github" label="GitHub URL">
                    <Input prefix={<GithubOutlined style={{ color: '#374151' }} />} placeholder="https://github.com/..." />
                  </Form.Item>
                </Col>
              </Row>

              {!isAdmin && (
                <>
                  <SectionLabel>Career Goal</SectionLabel>
                  <Form.Item name="careerGoal">
                    <Input placeholder="e.g., Full Stack Developer at a product startup" />
                  </Form.Item>

                  <SectionLabel>Skills</SectionLabel>
                  <Form.Item name="skills" label="Skills (comma-separated)">
                    <Input
                      placeholder="e.g., JavaScript, React, Node.js, Python"
                      onChange={handleSkillsChange}
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                    size="large"
                    style={{ background: '#16a34a', borderColor: '#16a34a' }}
                  >
                    Save Changes
                  </Button>
                  <Button size="large" onClick={handleCancel}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
