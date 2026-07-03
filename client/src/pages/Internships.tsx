import { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, DatePicker, Tag,
  Space, Popconfirm, Typography, message, Row, Col, Empty, Badge,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Internship {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  skills: string[];
}

const API = 'http://localhost:8000/api/internships';
const token = () => localStorage.getItem('token');

const Internships = () => {
  const [items, setItems]         = useState<Internship[]>([]);
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
    } catch { message.error('Failed to load internships'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditingId(null); form.resetFields(); setModalOpen(true); };

  const openEdit = (item: Internship) => {
    setEditingId(item._id);
    form.setFieldsValue({
      ...item,
      startDate: dayjs(item.startDate),
      endDate:   item.endDate ? dayjs(item.endDate) : null,
      skills:    item.skills.join(', '),
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
        endDate:   values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        skills:    values.skills ? values.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      };
      const url    = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        message.success(editingId ? 'Internship updated!' : 'Internship added!');
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
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#1e1b4b' }}>{text}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (v: string) => <span style={{ color: '#4f46e5', fontWeight: 500 }}>{v}</span>,
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_: any, r: Internship) => (
        <Space>
          <CalendarOutlined style={{ color: '#9ca3af' }} />
          <span style={{ color: '#6b7280', fontSize: 13 }}>
            {dayjs(r.startDate).format('MMM YYYY')} –{' '}
            {r.endDate ? dayjs(r.endDate).format('MMM YYYY') : <Badge status="processing" text="Present" />}
          </span>
        </Space>
      ),
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {skills.map((s) => <Tag key={s} color="purple" style={{ margin: 0, borderRadius: 20 }}>{s}</Tag>)}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Internship) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this internship?"
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
          <Typography.Title level={3} style={{ margin: 0, color: '#1e1b4b' }}>Internships</Typography.Title>
          <Typography.Text type="secondary">Track your work experience and internships</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openAdd}>
          Add Internship
        </Button>
      </div>

      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Table
          columns={columns}
          dataSource={items}
          rowKey="_id"
          loading={loading}
          locale={{ emptyText: <Empty description="No internships yet. Click 'Add Internship' to start." /> }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '8px 16px', color: '#6b7280' }}>
                <strong>Description:</strong> {record.description}
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <TeamOutlined style={{ color: '#7c3aed' }} />
            {editingId ? 'Edit Internship' : 'Add New Internship'}
          </Space>
        }
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText={editingId ? 'Update' : 'Add'}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g., Google" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="Role / Position" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g., Software Engineer Intern" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Required' }]}>
                <DatePicker style={{ width: '100%' }} picker="month" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endDate" label="End Date (leave blank if ongoing)">
                <DatePicker style={{ width: '100%' }} picker="month" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Required' }]}>
                <Input.TextArea rows={3} placeholder="Describe your role and responsibilities..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="skills" label="Skills used (comma-separated)">
                <Input placeholder="e.g., React, Python, SQL, Git" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Internships;
