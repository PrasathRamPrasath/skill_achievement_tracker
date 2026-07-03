import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, Col, Row, Tag, List, Typography, Spin, Empty } from 'antd';
import {
  TrophyOutlined, SafetyCertificateOutlined, TeamOutlined,
  CalendarOutlined, CodeOutlined, AimOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../utils/api';

const { Title, Text } = Typography;

interface DashboardData {
  user: {
    name: string; email: string; rollNumber?: string;
    department?: string; year?: number; careerGoal?: string; role?: string;
  };
  stats: {
    totalSkills: number; totalCertifications: number; totalAchievements: number;
    totalInternships: number; totalActivities: number; totalProjects: number;
  };
  recentCertifications: any[];
  recentAchievements: any[];
  recentInternships: any[];
  recentActivities: any[];
  recentProjects: any[];
  allSkills: string[];
  charts: {
    monthlyActivity: { month: string; certifications: number; achievements: number; internships: number; activities: number; projects: number }[];
    achievementsByCategory: { name: string; value: number }[];
    activitiesByType: { name: string; value: number }[];
    projectsByStatus: { name: string; value: number }[];
  };
}

const statConfig = [
  { key: 'totalSkills',         label: 'Skills',        icon: <CodeOutlined />,              color: '#4f46e5', bg: '#eef2ff' },
  { key: 'totalCertifications', label: 'Certifications', icon: <SafetyCertificateOutlined />, color: '#16a34a', bg: '#f0fdf4' },
  { key: 'totalAchievements',   label: 'Achievements',  icon: <TrophyOutlined />,            color: '#f59e0b', bg: '#fffbeb' },
  { key: 'totalInternships',    label: 'Internships',   icon: <TeamOutlined />,              color: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'totalActivities',     label: 'Activities',    icon: <CalendarOutlined />,          color: '#0ea5e9', bg: '#f0f9ff' },
  { key: 'totalProjects',       label: 'Projects',      icon: <CodeOutlined />,              color: '#ef4444', bg: '#fef2f2' },
];

const PIE_COLORS = ['#4f46e5', '#16a34a', '#f59e0b', '#8b5cf6', '#0ea5e9', '#ef4444'];

const BAR_COLORS: Record<string, string> = {
  certifications: '#16a34a',
  achievements:   '#f59e0b',
  internships:    '#8b5cf6',
  activities:     '#0ea5e9',
  projects:       '#4f46e5',
};

const formatMonth = (m: string) => {
  const [y, mo] = m.split('-');
  return new Date(+y, +mo - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
};

const Dashboard = () => {
  const { user }              = useAuth();
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${BASE_URL}/dashboard`, {
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

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (!data) return <Empty description="Failed to load dashboard. Please refresh." />;

  const hasChartData = data.charts?.monthlyActivity?.some(
    (m) => m.certifications + m.achievements + m.internships + m.activities + m.projects > 0
  );

  return (
    <div style={{ paddingBottom: 32 }}>

      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#111827', fontWeight: 700 }}>
          Welcome back, {data.user.name}
        </Title>
        <Text style={{ color: '#6b7280', fontSize: 13 }}>
          {[data.user.department, data.user.year ? `Year ${data.user.year}` : null, data.user.rollNumber]
            .filter(Boolean).join('  ·  ')}
        </Text>
        {data.user.careerGoal && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            marginTop: 8, padding: '5px 12px', background: '#f5f3ff',
            borderRadius: 20, fontSize: 12, color: '#7c3aed',
          }}>
            <AimOutlined /> {data.user.careerGoal}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statConfig.map(({ key, label, icon, color, bg }) => (
          <Col xs={12} sm={8} lg={4} key={key}>
            <Card
              variant="borderless"
              style={{
                borderRadius: 12,
                border: '1px solid #f3f4f6',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
              styles={{ body: { padding: '18px 16px' } }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 9, background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color, marginBottom: 10,
              }}>
                {icon}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#111827', lineHeight: 1, marginBottom: 4 }}>
                {data.stats[key as keyof typeof data.stats]}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>Activity — Last 6 Months</Text>
            </div>
            {hasChartData ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.charts.monthlyActivity} barSize={7}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} width={24} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    labelFormatter={formatMonth}
                    cursor={{ fill: '#f9fafb' }}
                  />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  {Object.entries(BAR_COLORS).map(([k, color]) => (
                    <Bar key={k} dataKey={k} fill={color} radius={[3, 3, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No activity recorded yet" />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={5}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', height: '100%' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>Achievements</Text>
            </div>
            {data.charts.achievementsByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.charts.achievementsByCategory} dataKey="value" nameKey="name"
                    cx="50%" cy="42%" outerRadius={64} strokeWidth={0}>
                    {data.charts.achievementsByCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e5e7eb' }} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No achievements yet" />
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={5}>
          <Card
            variant="borderless"
            style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', height: '100%' }}
          >
            <div style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>Activities</Text>
            </div>
            {data.charts.activitiesByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={data.charts.activitiesByType} dataKey="value" nameKey="name"
                    cx="50%" cy="42%" outerRadius={64} strokeWidth={0}>
                    {data.charts.activitiesByType.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e5e7eb' }} />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No activities yet" />
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Skills */}
      {data.allSkills.length > 0 && (
        <Card
          variant="borderless"
          style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: 24 }}
          styles={{ body: { padding: '18px 20px' } }}
        >
          <Text style={{ fontWeight: 700, color: '#111827', fontSize: 14, display: 'block', marginBottom: 12 }}>
            Your Skills
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.allSkills.map((skill, i) => (
              <Tag key={i} style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 20, margin: 0,
                background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#374151',
              }}>
                {skill}
              </Tag>
            ))}
          </div>
        </Card>
      )}

      {/* Recent items */}
      <Row gutter={[16, 16]}>
        {[
          {
            title: 'Recent Certifications',
            items: data.recentCertifications,
            renderTitle: (c: any) => c.name,
            renderDesc:  (c: any) => `${c.issuer}  ·  ${new Date(c.date).toLocaleDateString()}`,
            color: '#16a34a',
          },
          {
            title: 'Recent Achievements',
            items: data.recentAchievements,
            renderTitle: (a: any) => a.title,
            renderDesc:  (a: any) => `${a.category}  ·  ${new Date(a.date).toLocaleDateString()}`,
            color: '#f59e0b',
          },
          {
            title: 'Recent Projects',
            items: data.recentProjects,
            renderTitle: (p: any) => p.title,
            renderDesc:  (p: any) => `${p.status}  ·  ${new Date(p.startDate).toLocaleDateString()}`,
            color: '#4f46e5',
          },
          {
            title: 'Recent Internships',
            items: data.recentInternships,
            renderTitle: (i: any) => i.company,
            renderDesc:  (i: any) => `${i.role}  ·  ${new Date(i.startDate).toLocaleDateString()}`,
            color: '#8b5cf6',
          },
        ].map(({ title, items, renderTitle, renderDesc, color }) => (
          <Col xs={24} lg={12} key={title}>
            <Card
              variant="borderless"
              style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              styles={{ body: { padding: '18px 20px' } }}
            >
              <Text style={{ fontWeight: 700, color: '#111827', fontSize: 14, display: 'block', marginBottom: 12 }}>
                {title}
              </Text>
              <List
                size="small"
                dataSource={items}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nothing yet" /> }}
                renderItem={(item) => (
                  <List.Item style={{ padding: '8px 0', borderColor: '#f9fafb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: color, flexShrink: 0,
                      }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#111827', fontSize: 13 }}>{renderTitle(item)}</div>
                        <div style={{ color: '#9ca3af', fontSize: 11.5, marginTop: 1 }}>{renderDesc(item)}</div>
                      </div>
                    </div>
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
