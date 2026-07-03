import { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, DatePicker, Tag,
  Space, Popconfirm, Typography, message, Row, Col, Empty,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Activity {
  _id: string;
  name: string;
  type: string;
  role: string;
  date: string;
  description: string;
}

import { BASE_URL } from '../utils/api';
const API = `${BASE_URL}/activities`;
const token = () => localStorage.getItem('token');

const typeColors: Record<string, string> = {
  Club: 'blue',
  Event: 'green',
  Volunteer: 'orange',
  Workshop: 'purple',
  Seminar: 'cyan',
  Sports: 'red',
};

const Activities = () => {
  const [items, setItems]         = useState<Activity[]>([]);
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
    } catch { message.error('Failed to load activities'); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setEditingId(null); form.resetFields(); setModalOpen(true); };

  const openEdit = (item: Activity) => {
    setEditingId(item._id);
    form.setFieldsValue({ ...item, date: dayjs(item.date) });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const body   = { ...values, date: values.date.format('YYYY-MM-DD') };
      const url    = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        message.success(editingId ? 'Activity updated!' : 'Activity added!');
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
      title: 'Activity',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#1e1b4b' }}>{text}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (v: string) => (
        <Tag color={typeColors[v] ?? 'default'} style={{ borderRadius: 20 }}>{v}</Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (v: string) => v ? <Tag color="green" style={{ borderRadius: 20 }}>{v}</Tag> : <span style={{ color: '#d1d5db' }}>—</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (d: string) => dayjs(d).format('DD MMM YYYY'),
      sorter: (a: Activity, b: Activity) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (v: string) => <span style={{ color: '#6b7280' }}>{v}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Activity) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this activity?"
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
          <Typography.Title level={3} style={{ margin: 0, color: '#1e1b4b' }}>Activities</Typography.Title>
          <Typography.Text type="secondary">Clubs, events, volunteering and more</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openAdd}>
          Add Activity
        </Button>
      </div>

      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Table
          columns={columns}
          dataSource={items}
          rowKey="_id"
          loading={loading}
          locale={{ emptyText: <Empty description="No activities yet. Click 'Add Activity' to start." /> }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <CalendarOutlined style={{ color: '#dc2626' }} />
            {editingId ? 'Edit Activity' : 'Add New Activity'}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Activity Name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g., IEEE Student Branch" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g., Club, Event, Volunteer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="Your Role">
                <Input placeholder="e.g., President, Member, Organizer" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Required' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Required' }]}>
                <Input.TextArea rows={3} placeholder="Describe the activity and your involvement..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Activities;
