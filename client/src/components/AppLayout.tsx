import { useState } from 'react';
import type { ReactNode } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Button, Badge } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  DashboardOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  RobotOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BulbOutlined,
  ProjectOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { Sider, Header, Content } = Layout;

const studentNavItems = [
  { key: '/dashboard',      icon: <DashboardOutlined />,         label: 'Dashboard' },
  { key: '/certifications', icon: <SafetyCertificateOutlined />, label: 'Certifications' },
  { key: '/achievements',   icon: <TrophyOutlined />,            label: 'Achievements' },
  { key: '/internships',    icon: <TeamOutlined />,              label: 'Internships' },
  { key: '/projects',       icon: <ProjectOutlined />,           label: 'Projects' },
  { key: '/activities',     icon: <CalendarOutlined />,          label: 'Activities' },
  { key: '/timeline',       icon: <ClockCircleOutlined />,       label: 'Timeline' },
  { key: '/ai-advisor',     icon: <RobotOutlined />,             label: 'AI Advisor' },
];

const adminNavItems = [
  { key: '/admin',   icon: <BarChartOutlined />, label: 'Institution Dashboard' },
  { key: '/profile', icon: <UserOutlined />,     label: 'My Profile' },
];

const pageTitle: Record<string, string> = {
  '/dashboard':      'Dashboard',
  '/certifications': 'Certifications',
  '/achievements':   'Achievements',
  '/internships':    'Internships',
  '/projects':       'Projects',
  '/activities':     'Activities',
  '/timeline':       'Timeline',
  '/ai-advisor':     'AI Advisor',
  '/profile':        'My Profile',
  '/admin':          'Institution Dashboard',
};

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate         = useNavigate();
  const location         = useLocation();
  const { user, logout } = useAuth();

  const isAdmin  = user?.role === 'admin';
  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  const userMenuItems = [
    {
      key: 'info',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{user?.email}</div>
          <div style={{
            marginTop: 4, fontSize: 11, fontWeight: 700,
            color: isAdmin ? '#16a34a' : '#059669',
          }}>
            {isAdmin ? '🏫 Admin' : '🎓 Student'}
          </div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' as const },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign Out',
      danger: true,
      onClick: () => { logout(); navigate('/login'); },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={230}
        style={{
          background: isAdmin
            ? 'linear-gradient(180deg, #052e16 0%, #064e3b 100%)'
            : 'linear-gradient(180deg, #1e1b4b 0%, #2d2a6e 100%)',
          boxShadow: '2px 0 12px rgba(0,0,0,0.18)',
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          zIndex: 200,
          overflow: 'hidden',
        }}
        trigger={null}
      >
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 8,
          minHeight: 64,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: isAdmin
              ? 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)'
              : 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: 15, flexShrink: 0,
            boxShadow: isAdmin
              ? '0 4px 12px rgba(22,163,74,0.45)'
              : '0 4px 12px rgba(79,70,229,0.4)',
          }}>
            {isAdmin ? '🏫' : 'ST'}
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13.5, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                Skills Tracker
              </div>
              <div style={{ color: isAdmin ? '#86efac' : '#a5b4fc', fontSize: 11, whiteSpace: 'nowrap' }}>
                {isAdmin ? 'Admin Panel' : 'Achievement Platform'}
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', border: 'none', padding: '0 8px' }}
        />

        {/* Pro tip — students only */}
        {!collapsed && !isAdmin && (
          <div style={{
            position: 'absolute', bottom: 60, left: 12, right: 12,
            background: 'rgba(99,102,241,0.15)', borderRadius: 10,
            padding: '12px 14px', border: '1px solid rgba(165,180,252,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#a5b4fc', fontSize: 12 }}>
              <BulbOutlined />
              <span style={{ fontWeight: 600 }}>Pro tip</span>
            </div>
            <div style={{ color: '#c7d2fe', fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>
              Use AI Advisor to get personalized skill recommendations
            </div>
          </div>
        )}
      </Sider>

      {/* ── Main ── */}
      <Layout style={{ marginLeft: collapsed ? 80 : 230, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          position: 'sticky', top: 0, zIndex: 100, height: 60,
        }}>
          <Space align="center" size={16}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, color: isAdmin ? '#16a34a' : '#4f46e5' }}
            />
            <Typography.Title level={4} style={{ margin: 0, color: '#1e1b4b', fontSize: 16 }}>
              {pageTitle[location.pathname] ?? 'Skills Tracker'}
            </Typography.Title>
          </Space>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <Space style={{ cursor: 'pointer', padding: '6px 12px', borderRadius: 10 }} className="header-user-area">
              <Badge dot color="#22c55e" offset={[-2, 34]}>
                <Avatar
                  size={36}
                  style={{
                    background: isAdmin
                      ? 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)'
                      : 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
                    fontWeight: 700, fontSize: 14,
                    boxShadow: isAdmin
                      ? '0 2px 8px rgba(22,163,74,0.35)'
                      : '0 2px 8px rgba(79,70,229,0.3)',
                  }}
                >
                  {initials}
                </Avatar>
              </Badge>
              <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1e1b4b' }}>{user?.name}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: isAdmin ? '#16a34a' : '#059669' }}>
                  {isAdmin ? '🏫 Admin' : `🎓 ${user?.department ?? 'Student'}`}
                </div>
              </div>
            </Space>
          </Dropdown>
        </Header>

        {/* Content */}
        <Content style={{ padding: 24, background: '#f9fafb', minHeight: 'calc(100vh - 60px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
