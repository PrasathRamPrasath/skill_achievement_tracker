import { useState } from 'react';
import { Card, Button, Typography, Alert, Spin, Row, Col, Divider } from 'antd';
import {
  SearchOutlined, SafetyCertificateOutlined, CompassOutlined, RobotOutlined,
  BulbOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// ── Inline markdown renderer ──────────────────────────────────────────────────

/** Convert common LaTeX math sequences to unicode so they render as text */
const stripLatex = (text: string): string =>
  text
    .replace(/\$\\rightarrow\$/gi,    '→')
    .replace(/\$\\Rightarrow\$/gi,    '⇒')
    .replace(/\$\\leftarrow\$/gi,     '←')
    .replace(/\$\\leftrightarrow\$/gi,'↔')
    .replace(/\$\\to\$/gi,            '→')
    .replace(/\$\\geq?\$/gi,          '≥')
    .replace(/\$\\leq?\$/gi,          '≤')
    .replace(/\$\\neq\$/gi,           '≠')
    .replace(/\$\\approx\$/gi,        '≈')
    .replace(/\$\\times\$/gi,         '×')
    .replace(/\$\\cdot\$/gi,          '·')
    .replace(/\$\\pm\$/gi,            '±')
    .replace(/\$\\ldots?\$/gi,        '…')
    // strip any remaining $...$ wrappers, keep inner text
    .replace(/\$([^$\n]+)\$/g, '$1');

/** Parse **bold** and *italic* inline markers */
const parseInline = (raw: string): React.ReactNode[] => {
  const text = stripLatex(raw);
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
};

const MarkdownBlock = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    nodes.push(
      <ul key={`ul-${listKey++}`} style={{ paddingLeft: 20, margin: '6px 0 10px' }}>
        {listItems}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();

    // H1 / H2
    if (/^#{1,2}\s/.test(line)) {
      flushList();
      const t = line.replace(/^#{1,2}\s/, '');
      nodes.push(
        <div key={i} style={{ fontWeight: 700, fontSize: 17, color: '#1e1b4b', marginTop: 22, marginBottom: 4 }}>
          {parseInline(t)}
        </div>
      );
    // H3
    } else if (/^###\s/.test(line)) {
      flushList();
      const t = line.replace(/^###\s/, '');
      nodes.push(
        <div key={i} style={{ fontWeight: 700, fontSize: 15, color: '#312e81', marginTop: 16, marginBottom: 3 }}>
          {parseInline(t)}
        </div>
      );
    // Numbered list
    } else if (/^\d+\.\s/.test(line)) {
      flushList();
      const t   = line.replace(/^\d+\.\s/, '');
      const num = line.match(/^(\d+)\./)?.[1];
      nodes.push(
        <div key={i} style={{ display: 'flex', gap: 10, margin: '6px 0', alignItems: 'flex-start' }}>
          <span style={{
            minWidth: 24, height: 24, borderRadius: '50%',
            background: '#eef2ff', color: '#4f46e5',
            fontSize: 12, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{num}</span>
          <span style={{ color: '#374151', lineHeight: 1.7 }}>{parseInline(t)}</span>
        </div>
      );
    // Task-list checkbox: "- [ ] text" or "* [x] text"
    } else if (/^[\*\-]\s\[[ xX]\]\s/.test(line)) {
      const checked = /^[\*\-]\s\[[xX]\]\s/.test(line);
      const t = line.replace(/^[\*\-]\s\[[ xX]\]\s/, '');
      listItems.push(
        <li key={i} style={{ listStyle: 'none', display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 16, height: 16, marginTop: 3, borderRadius: 4, flexShrink: 0,
            border: `2px solid ${checked ? '#4f46e5' : '#d1d5db'}`,
            background: checked ? '#4f46e5' : 'transparent',
            color: '#fff', fontSize: 10, fontWeight: 700,
          }}>
            {checked && '✓'}
          </span>
          <span style={{ color: checked ? '#9ca3af' : '#374151', lineHeight: 1.7, textDecoration: checked ? 'line-through' : 'none' }}>
            {parseInline(t)}
          </span>
        </li>
      );
    // Regular bullet
    } else if (/^[\*\-]\s/.test(line)) {
      const t = line.replace(/^[\*\-]\s/, '');
      listItems.push(
        <li key={i} style={{ color: '#374151', lineHeight: 1.7, marginBottom: 3 }}>
          {parseInline(t)}
        </li>
      );
    // Blank line
    } else if (line.trim() === '') {
      flushList();
      if (nodes.length > 0) nodes.push(<div key={`sp-${i}`} style={{ height: 4 }} />);
    // Paragraph
    } else {
      flushList();
      nodes.push(
        <p key={i} style={{ margin: '4px 0', color: '#374151', lineHeight: 1.8 }}>
          {parseInline(line)}
        </p>
      );
    }
  });

  flushList();
  return <>{nodes}</>;
};

const advisorTypes = [
  {
    key: 'skill-gap',
    icon: <SearchOutlined style={{ fontSize: 28 }} />,
    title: 'Skill Gap Analysis',
    desc: 'Find out what skills you are missing for your target role',
    color: '#4f46e5',
    bg: '#eef2ff',
  },
  {
    key: 'certifications',
    icon: <SafetyCertificateOutlined style={{ fontSize: 28 }} />,
    title: 'Certification Suggestions',
    desc: 'Discover which certifications to get next based on your profile',
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    key: 'learning-path',
    icon: <CompassOutlined style={{ fontSize: 28 }} />,
    title: 'Learning Path',
    desc: 'Get a personalised 3-month study plan to accelerate your growth',
    color: '#d97706',
    bg: '#fffbeb',
  },
];

const AIAdvisor = () => {
  const [loading, setLoading]     = useState(false);
  const [advice, setAdvice]       = useState('');
  const [activeType, setActiveType] = useState('');
  const [error, setError]         = useState('');

  const getAdvice = async (type: string) => {
    setLoading(true);
    setAdvice('');
    setError('');
    setActiveType(type);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:8000/api/ai/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok) setAdvice(data.advice);
      else setError(data.message || 'Failed to get AI advice');
    } catch {
      setError('Could not connect to server. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const activeConfig = advisorTypes.find((t) => t.key === activeType);

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)',
        borderRadius: 16,
        padding: '28px 32px',
        marginBottom: 24,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0,
        }}>
          <RobotOutlined />
        </div>
        <div>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>AI Advisor</Title>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
            Powered by AI — get personalised career advice based on your skills and profile
          </Text>
        </div>
      </div>

      {/* Option cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {advisorTypes.map(({ key, icon, title, desc, color, bg }) => (
          <Col xs={24} md={8} key={key}>
            <Card
              hoverable
              onClick={() => !loading && getAdvice(key)}
              style={{
                borderRadius: 12,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: activeType === key ? `2px solid ${color}` : '2px solid transparent',
                boxShadow: activeType === key
                  ? `0 4px 20px ${color}25`
                  : '0 2px 8px rgba(0,0,0,0.06)',
                opacity: loading && activeType !== key ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
              variant="borderless"
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color, marginBottom: 14,
              }}>
                {icon}
              </div>
              <Text style={{ fontWeight: 700, fontSize: 15, color: '#1e1b4b', display: 'block', marginBottom: 6 }}>
                {title}
              </Text>
              <Text type="secondary" style={{ fontSize: 13 }}>{desc}</Text>
              <Button
                type={activeType === key ? 'primary' : 'default'}
                size="small"
                loading={loading && activeType === key}
                style={{ marginTop: 16, borderRadius: 20 }}
                onClick={(e) => { e.stopPropagation(); !loading && getAdvice(key); }}
              >
                {loading && activeType === key ? 'Thinking...' : 'Get Advice'}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Error */}
      {error && (
        <Alert type="error" message={error} showIcon closable onClose={() => setError('')} style={{ marginBottom: 16, borderRadius: 10 }} />
      )}

      {/* Loading state */}
      {loading && (
        <Card variant="borderless" style={{ borderRadius: 12, textAlign: 'center', padding: '40px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#4f46e5', fontWeight: 600 }}>Analysing your full profile…</div>
          <div style={{ marginTop: 6, color: '#9ca3af', fontSize: 13 }}>
            Gemma is reviewing your skills, certifications, achievements, internships & activities
          </div>
        </Card>
      )}

      {/* AI response */}
      {advice && !loading && (
        <Card
          variant="borderless"
          style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}
          styles={{ body: { padding: 0 } }}
        >
          {/* Response header bar */}
          <div style={{
            background: `linear-gradient(135deg, ${activeConfig?.color}15 0%, ${activeConfig?.color}08 100%)`,
            borderBottom: `1px solid ${activeConfig?.color}20`,
            padding: '14px 24px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: activeConfig?.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: activeConfig?.color, fontSize: 18, flexShrink: 0,
            }}>
              {activeConfig?.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: 15 }}>{activeConfig?.title}</div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>Personalised advice based on your complete profile</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{
                background: '#dcfce7', color: '#16a34a',
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <BulbOutlined /> AI Generated
              </span>
            </div>
          </div>

          {/* Rendered markdown body */}
          <div style={{ padding: '20px 28px 24px' }}>
            <MarkdownBlock text={advice} />
          </div>

          <Divider style={{ margin: 0 }} />
          <div style={{ padding: '10px 24px', background: '#fafafa', borderRadius: '0 0 12px 12px' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Generated by Gemma · Based on your skills, certifications, achievements, internships & activities
            </Text>
          </div>
        </Card>
      )}

      {/* Placeholder */}
      {!loading && !advice && !error && (
        <Card variant="borderless" style={{ borderRadius: 12, textAlign: 'center', padding: '40px 0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <RobotOutlined style={{ fontSize: 48, color: '#c7d2fe', marginBottom: 12 }} />
          <div style={{ color: '#9ca3af', fontSize: 15 }}>
            Select an option above to get AI-powered career advice
          </div>
        </Card>
      )}
    </div>
  );
};

export default AIAdvisor;
