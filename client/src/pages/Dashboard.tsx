import { useEffect, useState } from 'react';
import {
  Card, Col, Row, Statistic, Tag, List, Typography, Spin, Empty,
} from 'antd';
import {
  TrophyOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  CalendarOutlined,
  CodeOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface DashboardData {
  user: { name: string; email: string; rollNumber?: string; department?: string; year?: number };
  stats: {
    totalSkills: number;
    totalCertifications: number;
    totalAchievements: number;
    totalInternships: number;
    totalActivities: number;
  };
  recentCertifications: any[];
  recentAchievements: any[];
  recentInternships: any[];
  recentActivities: any[];
  allSkills: string[];
}

const statConfig = [
  { key: 'totalSkills',         label: 'Skills',         icon: <CodeOutlined />,                color: '#4f46e5', bg: '#eef2ff' },
  { key: 'totalCertifications', label: 'Certifications', icon: <SafetyCertificateOutlined />,   color: '#059669', bg: '#ecfdf5' },
  { key: 'totalAchievements',   label: 'Achievements',   icon: <TrophyOutlined />,              color: '#d97706', bg: '#fffbeb' },
  { key: 'totalInternships',    label: 'Internships',    icon: <TeamOutlined />,                color: '#7c3aed', bg: '#f5f3ff' },
  { key: 'totalActivities',     label: 'Activities',     icon: <CalendarOutlined />,            color: '#dc2626', bg: '#fef2f2' },
];

const Dashboard = () => {
  const [data, setData]     = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <Empty description="Failed to load dashboard. Please refresh." />;
  }

  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        borderRadius: 16,
        padding: '28px 32px',
        marginBottom: 24,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -20, top: -20,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', right: 60, bottom: -40,
          width: 140, height: 140, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <RiseOutlined style={{ fontSize: 16 }} />
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
            Skills & Achievement Tracker
          </Text>
        </div>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          Welcome back, {data.user.name}!
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
          {data.user.department}
          {data.user.year ? ` · Year ${data.user.year}` : ''}
          {data.user.rollNumber ? ` · ${data.user.rollNumber}` : ''}
        </Text>
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statConfig.map(({ key, label, icon, color, bg }) => (
          <Col xs={12} sm={12} md={8} lg={8} xl={24 / 5 as any} key={key} style={{ flex: '1 1 0', minWidth: 140 }}>
            <Card
              variant="borderless"
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                height: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  color,
                  flexShrink: 0,
                }}>
                  {icon}
                </div>
                <Statistic
                  title={<span style={{ color: '#6b7280', fontSize: 12, fontWeight: 500 }}>{label}</span>}
                  value={data.stats[key as keyof typeof data.stats]}
                  valueStyle={{ color, fontWeight: 700, fontSize: 28, lineHeight: 1 }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Skills */}
      <Card
        title={<span style={{ fontWeight: 700, color: '#1e1b4b' }}>Your Skills</span>}
        variant="borderless"
        style={{ borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        {data.allSkills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {data.allSkills.map((skill, i) => (
              <Tag
                key={i}
                color="blue"
                style={{ fontSize: 13, padding: '4px 12px', borderRadius: 20, margin: 0 }}
              >
                {skill}
              </Tag>
            ))}
          </div>
        ) : (
          <Text type="secondary">No skills added yet. Go to Profile to add your skills.</Text>
        )}
      </Card>

      {/* Recent items */}
      <Row gutter={[16, 16]}>
        {[
          {
            title: 'Recent Certifications',
            items: data.recentCertifications,
            renderTitle: (c: any) => c.name,
            renderDesc: (c: any) => `${c.issuer} · ${new Date(c.date).toLocaleDateString()}`,
          },
          {
            title: 'Recent Achievements',
            items: data.recentAchievements,
            renderTitle: (a: any) => a.title,
            renderDesc: (a: any) => `${a.category} · ${new Date(a.date).toLocaleDateString()}`,
          },
          {
            title: 'Recent Internships',
            items: data.recentInternships,
            renderTitle: (i: any) => i.company,
            renderDesc: (i: any) => `${i.role} · ${new Date(i.startDate).toLocaleDateString()}`,
          },
          {
            title: 'Recent Activities',
            items: data.recentActivities,
            renderTitle: (a: any) => a.name,
            renderDesc: (a: any) => `${a.type} · ${new Date(a.date).toLocaleDateString()}`,
          },
        ].map(({ title, items, renderTitle, renderDesc }) => (
          <Col xs={24} lg={12} key={title}>
            <Card
              title={<span style={{ fontWeight: 700, color: '#1e1b4b' }}>{title}</span>}
              variant="borderless"
              style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', height: '100%' }}
            >
              <List
                size="small"
                dataSource={items}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nothing yet" /> }}
                renderItem={(item) => (
                  <List.Item style={{ padding: '10px 0' }}>
                    <List.Item.Meta
                      title={<span style={{ fontWeight: 600, color: '#1f2937' }}>{renderTitle(item)}</span>}
                      description={<span style={{ color: '#9ca3af', fontSize: 12 }}>{renderDesc(item)}</span>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;
