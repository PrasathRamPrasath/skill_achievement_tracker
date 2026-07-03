import { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, DatePicker, Select,
  Tag, Space, Popconfirm, Typography, message, Row, Col, Empty,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  level: string;
}

import { BASE_URL } from '../utils/api';
const API = `${BASE_URL}/achievements`;
const token = () => localStorage.getItem('token');

const levelColors: Record<string, string> = {
  local: 'default',
  regional: 'blue',
  national: 'gold',
  international: 'purple',
};

const Achievements = () => {
  const [items, setItems]         = useState<Achievement[]>([]);
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
    } catch { message.error('Failed to load achievements'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditingId(null); form.resetFields(); setModalOpen(true); };

  const openEdit = (a: Achievement) => {
    setEditingId(a._id);
    form.setFieldsValue({ ...a, date: dayjs(a.date) });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const body = { ...values, date: values.date.format('YYYY-MM-DD') };
      const url    = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        message.success(editingId ? 'Achievement updated!' : 'Achievement added!');
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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#1e1b4b' }}>{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (v: string) => <span style={{ color: '#6b7280' }}>{v}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (v: string) => <Tag color="blue" style={{ borderRadius: 20 }}>{v}</Tag>,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (v: string) => (
        <Tag color={levelColors[v] ?? 'default'} style={{ borderRadius: 20, textTransform: 'capitalize' }}>
          {v}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (d: string) => dayjs(d).format('DD MMM YYYY'),
      sorter: (a: Achievement, b: Achievement) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Achievement) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this achievement?"
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
          <Typography.Title level={3} style={{ margin: 0, color: '#1e1b4b' }}>Achievements</Typography.Title>
          <Typography.Text type="secondary">Track your academic and extracurricular wins</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openAdd}>
          Add Achievement
        </Button>
      </div>

      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Table
          columns={columns}
          dataSource={items}
          rowKey="_id"
          loading={loading}
          locale={{ emptyText: <Empty description="No achievements yet. Click 'Add Achievement' to start." /> }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <TrophyOutlined style={{ color: '#d97706' }} />
            {editingId ? 'Edit Achievement' : 'Add New Achievement'}
          </Space>
        }
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        okText={editingId ? 'Update' : 'Add'}
        width={600}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., First Place in Hackathon" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Required' }]}>
            <Input.TextArea rows={3} placeholder="Describe your achievement..." />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Required' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g., Sports, Academic" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="level" label="Level" initialValue="local" rules={[{ required: true }]}>
                <Select options={[
                  { value: 'local',         label: 'Local' },
                  { value: 'regional',      label: 'Regional' },
                  { value: 'national',      label: 'National' },
                  { value: 'international', label: 'International' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Achievements;
