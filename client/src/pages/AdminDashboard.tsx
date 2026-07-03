import { useEffect, useState } from 'react';
import {
  Card, Col, Row, Table, Typography, Spin, Empty,
  Input, Select, Modal, Button, Avatar,
} from 'antd';
import {
  TeamOutlined, TrophyOutlined, SafetyCertificateOutlined,
  CodeOutlined, SearchOutlined, AimOutlined,
  GithubOutlined, LinkedinOutlined, ProjectOutlined, CalendarOutlined,
  PhoneOutlined, MailOutlined,
} from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { BASE_URL } from '../utils/api';

const { Title, Text } = Typography;

interface StudentRow {
  _id: string; name: string; email: string; rollNumber: string;
  department: string; year: number; careerGoal?: string;
  linkedin?: string; github?: string; resumeUrl?: string;
  stats: { skills: number; certifications: number; achievements: number; internships: number; activities: number; projects: number; total: number };
}

interface AdminStats {
  totalStudents: number; totalCerts: number; totalAchievements: number;
  totalInternships: number; totalProjects: number;
  byDept: { _id: string; count: number }[];
  byYear: { _id: number; count: number }[];
}

interface StudentDetail {
  student: any; certifications: any[]; achievements: any[]; internships: any[]; activities: any[]; projects: any[];
}

const CHART_COLORS = ['#16a34a', '#4f46e5', '#f59e0b', '#0ea5e9', '#8b5cf6', '#ef4444'];

const AdminDashboard = () => {
  const [stats, setStats]                 = useState<AdminStats | null>(null);
  const [students, setStudents]           = useState<StudentRow[]>([]);
  const [filtered, setFiltered]           = useState<StudentRow[]>([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [deptFilter, setDeptFilter]       = useState('');
  const [yearFilter, setYearFilter]       = useState('');
  const [detail, setDetail]               = useState<StudentDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [modalOpen, setModalOpen]         = useState(false);

  const token = () => localStorage.getItem('token');

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/admin/stats`,    { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
      fetch(`${BASE_URL}/admin/students`, { headers: { Authorization: `Bearer ${token()}` } }).then(r => r.json()),
    ]).then(([s, stu]) => {
      setStats(s);
      setStudents(Array.isArray(stu) ? stu : []);
      setFiltered(Array.isArray(stu) ? stu : []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = students;
    if (search)     result = result.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(search.toLowerCase())
    );
    if (deptFilter) result = result.filter(s => s.department === deptFilter);
    if (yearFilter) result = result.filter(s => String(s.year) === yearFilter);
    setFiltered(result);
  }, [search, deptFilter, yearFilter, students]);

  const openDetail = async (id: string) => {
    setDetailLoading(true); setModalOpen(true);
    try {
      const res  = await fetch(`${BASE_URL}/admin/students/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      setDetail(data);
    } catch { /* silent */ }
    finally { setDetailLoading(false); }
  };

  const topPerformers = [...students]
    .sort((a, b) => b.stats.total - a.stats.total)
    .slice(0, 5)
    .map(s => ({ name: s.name.split(' ')[0], total: s.stats.total }));

  const deptOptions = [...new Set(students.map(s => s.department).filter(Boolean))].map(d => ({ value: d, label: d }));
  const yearOptions = [1, 2, 3, 4].map(y => ({ value: String(y), label: `Year ${y}` }));

  const columns = [
    {
      title: 'Student',
      key: 'student',
      render: (_: any, r: StudentRow) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar size={34} style={{ background: '#e8f5e9', color: '#16a34a', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
            {r.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600, color: '#111827', fontSize: 13 }}>{r.name}</div>
            <div style={{ fontSize: 11.5, color: '#9ca3af' }}>{r.rollNumber || '—'} · {r.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      key: 'dept',
      render: (_: any, r: StudentRow) => (
        <div>
          <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{r.department}</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Year {r.year}</div>
        </div>
      ),
    },
    {
      title: 'Goal',
      dataIndex: 'careerGoal',
      key: 'careerGoal',
      render: (v: string) => v
        ? <Text style={{ fontSize: 12, color: '#6b7280' }} ellipsis={{ tooltip: v }}>{v}</Text>
        : <Text style={{ color: '#d1d5db', fontSize: 12 }}>Not set</Text>,
    },
    {
      title: 'Certs',
      key: 'c',
      width: 60,
      render: (_: any, r: StudentRow) => (
        <span style={{ fontWeight: 700, color: '#16a34a', fontSize: 14 }}>{r.stats.certifications}</span>
      ),
    },
    {
      title: 'Projects',
      key: 'pr',
      width: 70,
      render: (_: any, r: StudentRow) => (
        <span style={{ fontWeight: 700, color: '#4f46e5', fontSize: 14 }}>{r.stats.projects}</span>
      ),
    },
    {
      title: 'Score',
      key: 'total',
      width: 80,
      render: (_: any, r: StudentRow) => (
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 26, borderRadius: 6,
          background: '#f0fdf4', color: '#15803d', fontWeight: 700, fontSize: 13,
        }}>
          {r.stats.total}
        </div>
      ),
      sorter: (a: StudentRow, b: StudentRow) => b.stats.total - a.stats.total,
    },
    {
      title: '',
      key: 'action',
      width: 90,
      render: (_: any, r: StudentRow) => (
        <Button
          size="small"
          onClick={(e) => { e.stopPropagation(); openDetail(r._id); }}
          style={{ borderColor: '#16a34a', color: '#16a34a', borderRadius: 6, fontSize: 12 }}
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const statCards = stats ? [
    { label: 'Total Students',    value: stats.totalStudents,     icon: <TeamOutlined />,              color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Certifications',    value: stats.totalCerts,        icon: <SafetyCertificateOutlined />, color: '#0ea5e9', bg: '#f0f9ff' },
    { label: 'Achievements',      value: stats.totalAchievements, icon: <TrophyOutlined />,            color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Internships',       value: stats.totalInternships,  icon: <TeamOutlined />,              color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Projects',          value: stats.totalProjects,     icon: <CodeOutlined />,              color: '#4f46e5', bg: '#eef2ff' },
  ] : [];

  return (
    <div style={{ padding: '0 0 32px' }}>

      {/* Page heading */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: '#111827', fontWeight: 700 }}>Institution Dashboard</Title>
        <Text style={{ color: '#6b7280', fontSize: 13 }}>Track student talent, placement readiness and platform activity</Text>
      </div>

      {/* Stat cards */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statCards.map(({ label, value, icon, color, bg }) => (
            <Col xs={12} sm={8} lg={24 / 5 as any} key={label}>
              <Card
                variant="borderless"
                style={{
                  borderRadius: 12,
                  border: '1px solid #f3f4f6',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
                styles={{ body: { padding: '18px 20px' } }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, color, marginBottom: 10,
                }}>
                  {icon}
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: '#111827', lineHeight: 1, marginBottom: 4 }}>
                  {value}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{label}</div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Charts */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={14}>
            <Card
              variant="borderless"
              style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', height: '100%' }}
            >
              <div style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>Students by Department</Text>
              </div>
              {stats.byDept.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.byDept} layout="vertical" barSize={16} margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="_id" tick={{ fontSize: 11, fill: '#374151' }} width={140} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      formatter={(v: any) => [`${v} students`, 'Count']}
                      cursor={{ fill: '#f9fafb' }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {stats.byDept.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={5}>
            <Card
              variant="borderless"
              style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', height: '100%' }}
            >
              <div style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>By Year</Text>
              </div>
              {stats.byYear.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={stats.byYear.map(y => ({ name: `Year ${y._id}`, value: y.count }))}
                      dataKey="value" nameKey="name"
                      cx="50%" cy="44%" outerRadius={68} innerRadius={36}
                      strokeWidth={0}
                    >
                      {stats.byYear.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e5e7eb' }}
                      formatter={(v: any, n: any) => [`${v} students`, n]}
                    />
                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={5}>
            <Card
              variant="borderless"
              style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', height: '100%' }}
            >
              <div style={{ marginBottom: 16 }}>
                <Text style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>Top Performers</Text>
              </div>
              {topPerformers.length > 0 ? (
                <div>
                  {topPerformers.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: i === 0 ? '#fef3c7' : i === 1 ? '#f3f4f6' : '#fdf2f8',
                        color: i === 0 ? '#d97706' : i === 1 ? '#6b7280' : '#be185d',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.name}
                        </div>
                        <div style={{
                          height: 4, borderRadius: 2, background: '#f3f4f6', marginTop: 3, overflow: 'hidden',
                        }}>
                          <div style={{
                            height: '100%', borderRadius: 2,
                            width: `${Math.round((s.total / (topPerformers[0]?.total || 1)) * 100)}%`,
                            background: CHART_COLORS[i % CHART_COLORS.length],
                          }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', flexShrink: 0 }}>{s.total}</span>
                    </div>
                  ))}
                </div>
              ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </Card>
          </Col>
        </Row>
      )}

      {/* Student table */}
      <Card
        variant="borderless"
        style={{ borderRadius: 12, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <Text style={{ fontWeight: 700, color: '#111827', fontSize: 15 }}>All Students</Text>
            <Text style={{ color: '#9ca3af', fontSize: 12, marginLeft: 8 }}>{filtered.length} shown</Text>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input
              placeholder="Search name / roll / email"
              prefix={<SearchOutlined style={{ color: '#d1d5db' }} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 220, borderRadius: 8 }}
              allowClear
            />
            <Select
              placeholder="All Departments"
              options={deptOptions}
              value={deptFilter || undefined}
              onChange={setDeptFilter}
              allowClear
              style={{ width: 160 }}
            />
            <Select
              placeholder="All Years"
              options={yearOptions}
              value={yearFilter || undefined}
              onChange={setYearFilter}
              allowClear
              style={{ width: 110 }}
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="_id"
          locale={{ emptyText: <Empty description="No students found" /> }}
          pagination={{ pageSize: 8, showSizeChanger: false, showTotal: (t) => `${t} students total` }}
          onRow={(r) => ({
            style: { cursor: 'pointer' },
            onClick: () => openDetail(r._id),
          })}
          scroll={{ x: 900 }}
          style={{ fontSize: 13 }}
        />
      </Card>

      {/* Student detail modal */}
      <Modal
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setDetail(null); }}
        footer={null}
        width="85vw"
        style={{ maxWidth: 1300, top: 40 }}
        destroyOnHidden
        styles={{ body: { padding: 0 } }}
        title={null}
      >
        {detailLoading || !detail ? (
          <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
        ) : (
          <div>
            {/* Modal header — left: identity, right: stats strip */}
            <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>

              {/* Left: student identity */}
              <div style={{ flex: 1, padding: '24px 28px 20px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <Avatar size={52} style={{ background: '#e8f5e9', color: '#16a34a', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                    {detail.student.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>{detail.student.name}</div>
                    <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                      {[detail.student.rollNumber, detail.student.department, detail.student.year ? `Year ${detail.student.year}` : null]
                        .filter(Boolean).join('  ·  ')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                    <MailOutlined style={{ color: '#b0b7c3' }} /> {detail.student.email}
                  </div>
                  {detail.student.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                      <PhoneOutlined style={{ color: '#b0b7c3' }} /> {detail.student.phone}
                    </div>
                  )}
                  {detail.student.linkedin && (
                    <a href={detail.student.linkedin} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#0077b5' }}>
                      <LinkedinOutlined /> LinkedIn
                    </a>
                  )}
                  {detail.student.github && (
                    <a href={detail.student.github} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151' }}>
                      <GithubOutlined /> GitHub
                    </a>
                  )}
                  {detail.student.resumeUrl && (
                    <a href={detail.student.resumeUrl} target="_blank" rel="noreferrer"
                      style={{ fontSize: 12, color: '#4f46e5' }}>
                      View Resume ↗
                    </a>
                  )}
                </div>

                {detail.student.careerGoal && (
                  <div style={{
                    marginTop: 12, padding: '7px 12px', background: '#f5f3ff',
                    borderRadius: 8, fontSize: 12, color: '#6d28d9',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                    <AimOutlined /> {detail.student.careerGoal}
                  </div>
                )}
              </div>

              {/* Right: quick stats vertical strip */}
              <div style={{ display: 'flex', borderLeft: '1px solid #f3f4f6', flexShrink: 0 }}>
                {[
                  { label: 'Certs',        value: detail.certifications.length, icon: <SafetyCertificateOutlined />, color: '#16a34a', bg: '#f0fdf4' },
                  { label: 'Projects',     value: detail.projects.length,       icon: <ProjectOutlined />,           color: '#4f46e5', bg: '#eef2ff' },
                  { label: 'Achievements', value: detail.achievements.length,   icon: <TrophyOutlined />,            color: '#f59e0b', bg: '#fffbeb' },
                  { label: 'Internships',  value: detail.internships.length,    icon: <TeamOutlined />,              color: '#8b5cf6', bg: '#f5f3ff' },
                  { label: 'Activities',   value: detail.activities.length,     icon: <CalendarOutlined />,          color: '#0ea5e9', bg: '#f0f9ff' },
                ].map(({ label, value, icon, color, bg }, i, arr) => (
                  <div key={label} style={{
                    width: 90, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '16px 0',
                    borderRight: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none',
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color, marginBottom: 6 }}>
                      {icon}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3, fontWeight: 500, textAlign: 'center' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail sections — 3 columns across full width */}
            <div style={{ padding: '20px 28px 24px' }}>
              <Row gutter={[16, 16]}>
                {[
                  { title: 'Certifications', icon: <SafetyCertificateOutlined />, items: detail.certifications, color: '#16a34a',
                    render: (c: any) => ({ main: c.name, sub: c.issuer }) },
                  { title: 'Projects',       icon: <ProjectOutlined />,           items: detail.projects,       color: '#4f46e5',
                    render: (p: any) => ({ main: p.title, sub: p.status }) },
                  { title: 'Achievements',   icon: <TrophyOutlined />,            items: detail.achievements,   color: '#f59e0b',
                    render: (a: any) => ({ main: a.title, sub: a.level }) },
                  { title: 'Internships',    icon: <TeamOutlined />,              items: detail.internships,    color: '#8b5cf6',
                    render: (i: any) => ({ main: i.role, sub: i.company }) },
                  { title: 'Activities',     icon: <CalendarOutlined />,          items: detail.activities,     color: '#0ea5e9',
                    render: (a: any) => ({ main: a.name, sub: a.type }) },
                ].map(({ title, icon, items, color, render }) => (
                  <Col xs={24} sm={12} lg={8} key={title}>
                    <div style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color, fontSize: 13 }}>{icon}</span>
                      <Text style={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>{title}</Text>
                      <Text style={{ color: '#9ca3af', fontSize: 12 }}>({items.length})</Text>
                    </div>
                    {items.length > 0 ? (
                      <div style={{ background: '#fafafa', borderRadius: 8, border: '1px solid #f3f4f6', overflow: 'hidden' }}>
                        {items.map((item: any, idx: number) => {
                          const { main, sub } = render(item);
                          return (
                            <div key={idx} style={{
                              padding: '9px 14px',
                              borderBottom: idx < items.length - 1 ? '1px solid #f3f4f6' : 'none',
                            }}>
                              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#111827' }}>{main}</div>
                              <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 1 }}>{sub}</div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ padding: '12px 14px', background: '#fafafa', borderRadius: 8, border: '1px solid #f3f4f6' }}>
                        <Text style={{ fontSize: 12, color: '#d1d5db' }}>Nothing uploaded yet</Text>
                      </div>
                    )}
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
