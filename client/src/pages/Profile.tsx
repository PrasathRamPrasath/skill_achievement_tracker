import { useState, useEffect } from 'react';
import {
  Card, Form, Input, Select, Button, Avatar, Typography,
  message, Row, Col, Tag, Space,
} from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined,
  LinkedinOutlined, GithubOutlined, SaveOutlined,
  IdcardOutlined, BankOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const SectionLabel = ({ children }: { children: string }) => (
  <div style={{
    fontSize: 11,
    fontWeight: 700,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 4,
    paddingBottom: 8,
    borderBottom: '1px solid #f3f4f6',
  }}>
    {children}
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [skillPreview, setSkillPreview] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name:       user.name,
        email:      user.email,
        rollNumber: user.rollNumber,
        department: user.department,
        year:       user.year?.toString(),
        phone:      user.phone,
        linkedin:   user.linkedin,
        github:     user.github,
        skills:     user.skills?.join(', '),
        resumeUrl:  user.resumeUrl,
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
      const res = await fetch('http://localhost:8000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tkn}` },
        body: JSON.stringify({
          ...values,
          year:   values.year ? parseInt(values.year) : undefined,
          skills: skillsArray,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        message.success('Profile updated successfully!');
        localStorage.setItem('user', JSON.stringify(data));
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

  return (
    <Row gutter={[24, 24]}>
      {/* Avatar card */}
      <Col xs={24} lg={7}>
        <Card
          variant="borderless"
          style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center' }}
        >
          <Avatar
            size={96}
            style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 16,
              boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
            }}
          >
            {initials}
          </Avatar>
          <Title level={4} style={{ margin: 0, color: '#1e1b4b' }}>{user?.name}</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>{user?.email}</Text>

          {user?.department && (
            <div style={{ marginTop: 12 }}>
              <Tag color="purple" style={{ borderRadius: 20, padding: '2px 12px' }}>
                {user.department}
              </Tag>
              {user?.year && (
                <Tag color="blue" style={{ borderRadius: 20, padding: '2px 12px' }}>
                  Year {user.year}
                </Tag>
              )}
            </div>
          )}

          <div style={{ marginTop: 20, textAlign: 'left', borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>
              Quick Links
            </Text>
            {user?.linkedin && (
              <div style={{ marginTop: 8 }}>
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#0077b5', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <LinkedinOutlined /> LinkedIn Profile
                </a>
              </div>
            )}
            {user?.github && (
              <div style={{ marginTop: 6 }}>
                <a href={user.github} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#1f2937', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <GithubOutlined /> GitHub Profile
                </a>
              </div>
            )}
          </div>

          {skillPreview.length > 0 && (
            <div style={{ marginTop: 16, textAlign: 'left', borderTop: '1px solid #f3f4f6', paddingTop: 16 }}>
              <Text style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>
                Skills
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {skillPreview.slice(0, 8).map((s, i) => (
                  <Tag key={i} color="blue" style={{ borderRadius: 20, margin: 0, fontSize: 11 }}>{s}</Tag>
                ))}
                {skillPreview.length > 8 && (
                  <Tag style={{ borderRadius: 20, margin: 0, fontSize: 11 }}>+{skillPreview.length - 8}</Tag>
                )}
              </div>
            </div>
          )}
        </Card>
      </Col>

      {/* Edit form */}
      <Col xs={24} lg={17}>
        <Card
          title={<span style={{ fontWeight: 700, color: '#1e1b4b' }}>Edit Profile</span>}
          variant="borderless"
          style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
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
              <Col xs={24} md={12}>
                <Form.Item name="resumeUrl" label="Resume URL">
                  <Input placeholder="https://drive.google.com/..." />
                </Form.Item>
              </Col>
            </Row>

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

            <SectionLabel>Social Links</SectionLabel>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="linkedin" label="LinkedIn URL">
                  <Input prefix={<LinkedinOutlined style={{ color: '#0077b5' }} />} placeholder="https://linkedin.com/in/..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="github" label="GitHub URL">
                  <Input prefix={<GithubOutlined style={{ color: '#1f2937' }} />} placeholder="https://github.com/..." />
                </Form.Item>
              </Col>
            </Row>

            <SectionLabel>Skills</SectionLabel>
            <Form.Item name="skills" label="Skills (comma-separated)">
              <Input
                placeholder="e.g., JavaScript, React, Node.js, Python, SQL"
                onChange={handleSkillsChange}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  Save Changes
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
