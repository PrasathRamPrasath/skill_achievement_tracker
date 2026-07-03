import { useEffect, useState } from 'react';
import { Tag, Typography, Spin, Empty, Button } from 'antd';
import {
  SafetyCertificateOutlined, TrophyOutlined, TeamOutlined,
  CalendarOutlined, CodeOutlined, GithubOutlined, LinkOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { BASE_URL } from '../utils/api';

const { Title, Text } = Typography;

interface TimelineItem {
  _id: string;
  type: 'certification' | 'achievement' | 'internship' | 'activity' | 'project';
  title: string;
  subtitle: string;
  date: string;
  endDate?: string;
  tags: string[];
  extra?: string;
  links?: { project?: string; github?: string };
}

const typeConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  certification: { color: '#059669', bg: '#ecfdf5', icon: <SafetyCertificateOutlined />, label: 'Certification' },
  achievement:   { color: '#d97706', bg: '#fffbeb', icon: <TrophyOutlined />,              label: 'Achievement'   },
  internship:    { color: '#7c3aed', bg: '#f5f3ff', icon: <TeamOutlined />,                label: 'Internship'    },
  activity:      { color: '#dc2626', bg: '#fef2f2', icon: <CalendarOutlined />,            label: 'Activity'      },
  project:       { color: '#4f46e5', bg: '#eef2ff', icon: <CodeOutlined />,                label: 'Project'       },
};

const ALL_TYPES = ['certification', 'achievement', 'internship', 'activity', 'project'];

const Timeline = () => {
  const [items, setItems]       = useState<TimelineItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${BASE_URL}/timeline`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const visible = filter.length === 0
    ? items
    : items.filter((i) => filter.includes(i.type));

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 24, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>Activity Timeline</Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            All your achievements, projects, and milestones in one chronological view
          </Text>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.12)', borderRadius: 10,
          padding: '8px 16px', fontSize: 13, color: '#e0e7ff',
        }}>
          {visible.length} {visible.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <Text type="secondary" style={{ fontSize: 13 }}>Filter:</Text>
        {ALL_TYPES.map((t) => {
          const cfg = typeConfig[t];
          const active = filter.includes(t);
          return (
            <button
              key={t}
              onClick={() => setFilter((prev) => active ? prev.filter((x) => x !== t) : [...prev, t])}
              style={{
                border: `2px solid ${active ? cfg.color : '#e5e7eb'}`,
                background: active ? cfg.bg : '#fff',
                color: active ? cfg.color : '#6b7280',
                borderRadius: 20, padding: '4px 14px', cursor: 'pointer',
                fontSize: 13, fontWeight: active ? 700 : 400,
                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
              }}
            >
              {cfg.icon} {cfg.label}
            </button>
          );
        })}
        {filter.length > 0 && (
          <Button type="link" size="small" onClick={() => setFilter([])}>Clear</Button>
        )}
      </div>

      {/* Timeline */}
      {visible.length === 0 ? (
        <Empty description="No items match the selected filter." />
      ) : (
        <div style={{ position: 'relative', paddingLeft: 48 }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 20, top: 0, bottom: 0,
            width: 2, background: 'linear-gradient(to bottom, #c7d2fe, #e0e7ff)',
            borderRadius: 2,
          }} />

          {visible.map((item, idx) => {
            const cfg = typeConfig[item.type];
            const isExpanded = expanded.has(item._id);
            const showYear = idx === 0 || dayjs(visible[idx - 1].date).year() !== dayjs(item.date).year();

            return (
              <div key={item._id}>
                {showYear && (
                  <div style={{
                    position: 'relative', marginBottom: 16, marginTop: idx === 0 ? 0 : 24,
                  }}>
                    <div style={{
                      position: 'absolute', left: -40, top: 2,
                      width: 20, height: 20, borderRadius: '50%',
                      background: '#1e1b4b', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#818cf8' }} />
                    </div>
                    <span style={{
                      fontWeight: 800, fontSize: 13, color: '#6366f1',
                      background: '#eef2ff', padding: '2px 12px', borderRadius: 20,
                    }}>
                      {dayjs(item.date).year()}
                    </span>
                  </div>
                )}

                <div style={{ position: 'relative', marginBottom: 20 }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: -40, top: 14,
                    width: 22, height: 22, borderRadius: '50%',
                    background: cfg.bg, border: `2px solid ${cfg.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: cfg.color, fontSize: 11,
                  }}>
                    {cfg.icon}
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => item.extra && toggleExpand(item._id)}
                    style={{
                      background: '#fff',
                      borderRadius: 12,
                      padding: '14px 20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: `1px solid ${cfg.color}20`,
                      cursor: item.extra ? 'pointer' : 'default',
                      transition: 'box-shadow 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <Tag color={cfg.color} style={{ borderRadius: 20, margin: 0, fontSize: 11 }}>
                            {cfg.label}
                          </Tag>
                          <span style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 15 }}>{item.title}</span>
                        </div>
                        <div style={{ marginTop: 4, color: '#6b7280', fontSize: 13 }}>{item.subtitle}</div>

                        {item.tags?.length > 0 && (
                          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {item.tags.map((t, i) => (
                              <Tag key={i} style={{ borderRadius: 20, margin: 0, fontSize: 11 }}>{t}</Tag>
                            ))}
                          </div>
                        )}

                        {isExpanded && item.extra && (
                          <p style={{ marginTop: 10, color: '#374151', fontSize: 13, lineHeight: 1.7 }}>
                            {item.extra}
                          </p>
                        )}

                        {item.links && (item.links.github || item.links.project) && (
                          <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                            {item.links.github && (
                              <a href={item.links.github} target="_blank" rel="noreferrer"
                                style={{ color: '#374151', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
                                onClick={(e) => e.stopPropagation()}>
                                <GithubOutlined /> GitHub
                              </a>
                            )}
                            {item.links.project && (
                              <a href={item.links.project} target="_blank" rel="noreferrer"
                                style={{ color: '#4f46e5', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}
                                onClick={(e) => e.stopPropagation()}>
                                <LinkOutlined /> Live
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {dayjs(item.date).format('DD MMM YYYY')}
                        </Text>
                        {item.endDate && (
                          <div style={{ color: '#9ca3af', fontSize: 11 }}>
                            → {dayjs(item.endDate).format('DD MMM YYYY')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Timeline;
