import { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, DatePicker,
  Select, Tag, Space, Popconfirm, Typography, message, Row, Col, Empty,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  CodeOutlined, GithubOutlined, LinkOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  role: string;
  startDate: string;
  endDate?: string;
  projectUrl?: string;
  githubUrl?: string;
  status: 'ongoing' | 'completed' | 'paused';
}

const API = 'http://localhost:8000/api/projects';
const token = () => localStorage.getItem('token');

const statusColors: Record<string, string> = {
  ongoing: 'blue',
  completed: 'green',
  paused: 'orange',
};

const Projects = () => {
  const [items, setItems]         = useState<Project[]>([]);
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res  = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch { message.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditingId(null); form.resetFields(); setModalOpen(true); };

  const openEdit = (item: Project) => {
    setEditingId(item._id);
    form.setFieldsValue({
      ...item,
      startDate: dayjs(item.startDate),
      endDate: item.endDate ? dayjs(item.endDate) : null,
      techStack: item.techStack?.join(', '),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const body = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
        techStack: values.techStack
          ? values.techStack.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [],
      };
      const url    = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        message.success(editingId ? 'Project updated!' : 'Project added!');
        setModalOpen(false);
        fetchItems();
      } else {
        const err = await res.json();
        message.error(err.message || 'Failed to save');
      }
    } catch { /* validation */ }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
      message.success('Deleted!');
      fetchItems();
    } catch { message.error('Network error'); }
  };

  const columns = [
    {
      title: 'Project',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#1e1b4b' }}>{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) => (
        <Tag color={statusColors[v] ?? 'default'} style={{ borderRadius: 20, textTransform: 'capitalize' }}>{v}</Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (v: string) => v ? <Tag color="purple" style={{ borderRadius: 20 }}>{v}</Tag> : <span style={{ color: '#d1d5db' }}>—</span>,
    },
    {
      title: 'Tech Stack',
      dataIndex: 'techStack',
      key: 'techStack',
      render: (tags: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {tags?.slice(0, 3).map((t, i) => <Tag key={i} color="cyan" style={{ borderRadius: 20, margin: 0 }}>{t}</Tag>)}
          {tags?.length > 3 && <Tag style={{ borderRadius: 20, margin: 0 }}>+{tags.length - 3}</Tag>}
        </div>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (d: string) => dayjs(d).format('DD MMM YYYY'),
      sorter: (a: Project, b: Project) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: 'Links',
      key: 'links',
      render: (_: any, r: Project) => (
        <Space>
          {r.githubUrl && <a href={r.githubUrl} target="_blank" rel="noreferrer"><GithubOutlined /></a>}
          {r.projectUrl && <a href={r.projectUrl} target="_blank" rel="noreferrer"><LinkOutlined /></a>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Project) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this project?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Delete" okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0, color: '#1e1b4b' }}>Projects</Typography.Title>
          <Typography.Text type="secondary">Technical projects, open source contributions, and more</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openAdd}
          style={{ background: '#7c3aed', borderColor: '#7c3aed' }}>
          Add Project
        </Button>
      </div>

      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Table
          columns={columns}
          dataSource={items}
          rowKey="_id"
          loading={loading}
          locale={{ emptyText: <Empty description="No projects yet. Click 'Add Project' to start." /> }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          expandable={{
            expandedRowRender: (record: Project) => (
              <p style={{ margin: 0, color: '#6b7280' }}>{record.description}</p>
            ),
          }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <CodeOutlined style={{ color: '#7c3aed' }} />
            {editingId ? 'Edit Project' : 'Add New Project'}
          </Space>
        }
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText={editingId ? 'Update' : 'Add'}
        width={680}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="title" label="Project Title" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g., Student Tracker App" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="Your Role">
                <Input placeholder="e.g., Full Stack Developer, Team Lead" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" initialValue="ongoing">
                <Select options={[
                  { value: 'ongoing',   label: 'Ongoing' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'paused',    label: 'Paused' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="techStack" label="Tech Stack (comma-separated)">
                <Input placeholder="e.g., React, Node.js, MongoDB" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Required' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="End Date">
                <DatePicker style={{ width: '100%' }} placeholder="Leave blank if ongoing" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="githubUrl" label="GitHub URL">
                <Input prefix={<GithubOutlined />} placeholder="https://github.com/..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="projectUrl" label="Live URL">
                <Input prefix={<LinkOutlined />} placeholder="https://..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Required' }]}>
                <Input.TextArea rows={3} placeholder="Describe the project, your contributions, and impact..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
