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
} from '@ant-design/icons';

const { Sider, Header, Content } = Layout;

const navItems = [
  { key: '/dashboard',      icon: <DashboardOutlined />,         label: 'Dashboard' },
  { key: '/certifications', icon: <SafetyCertificateOutlined />, label: 'Certifications' },
  { key: '/achievements',   icon: <TrophyOutlined />,            label: 'Achievements' },
  { key: '/internships',    icon: <TeamOutlined />,              label: 'Internships' },
  { key: '/activities',     icon: <CalendarOutlined />,          label: 'Activities' },
  { key: '/ai-advisor',     icon: <RobotOutlined />,             label: 'AI Advisor' },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  const userMenuItems = [
    {
      key: 'name',
      label: (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>{user?.email}</div>
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

  const pageTitle: Record<string, string> = {
    '/dashboard':      'Dashboard',
    '/certifications': 'Certifications',
    '/achievements':   'Achievements',
    '/internships':    'Internships',
    '/activities':     'Activities',
    '/ai-advisor':     'AI Advisor',
    '/profile':        'My Profile',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={230}
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #2d2a6e 100%)',
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
        {/* Logo block */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: collapsed ? '18px 20px' : '18px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 8,
          minHeight: 64,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: '#fff',
            fontSize: 14,
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(79,70,229,0.4)',
          }}>
            ST
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 13.5, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                Skills Tracker
              </div>
              <div style={{ color: '#a5b4fc', fontSize: 11, whiteSpace: 'nowrap' }}>
                Achievement Platform
              </div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', border: 'none', padding: '0 8px' }}
        />

        {!collapsed && (
          <div style={{
            position: 'absolute',
            bottom: 60,
            left: 12,
            right: 12,
            background: 'rgba(99,102,241,0.15)',
            borderRadius: 10,
            padding: '12px 14px',
            border: '1px solid rgba(165,180,252,0.15)',
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

      {/* ── Main area ── */}
      <Layout style={{ marginLeft: collapsed ? 80 : 230, transition: 'margin-left 0.2s' }}>
        {/* Header */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 60,
        }}>
          <Space align="center" size={16}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16, color: '#4f46e5' }}
            />
            <Typography.Title level={4} style={{ margin: 0, color: '#1e1b4b', fontSize: 16 }}>
              {pageTitle[location.pathname] ?? 'Skills Tracker'}
            </Typography.Title>
          </Space>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <Space
              style={{
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: 10,
                transition: 'background 0.2s',
              }}
              className="header-user-area"
            >
              <Badge dot color="#22c55e" offset={[-2, 34]}>
                <Avatar
                  size={36}
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: '0 2px 8px rgba(79,70,229,0.35)',
                  }}
                >
                  {initials}
                </Avatar>
              </Badge>
              <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#1e1b4b' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{user?.department ?? 'Student'}</div>
              </div>
            </Space>
          </Dropdown>
        </Header>

        {/* Page content */}
        <Content style={{ padding: 24, background: '#f8f9ff', minHeight: 'calc(100vh - 60px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
