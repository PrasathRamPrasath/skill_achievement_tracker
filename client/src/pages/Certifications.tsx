import { useState, useEffect } from 'react';
import {
  Card, Table, Button, Modal, Form, Input, DatePicker, Tag,
  Space, Popconfirm, Typography, message, Row, Col, Empty,
  Upload, Image, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined,
  SafetyCertificateOutlined, PictureOutlined, EyeOutlined,
  DeleteFilled, GlobalOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { UploadFile } from 'antd';

interface Certification {
  _id: string;
  name: string;
  issuer: string;
  date: string;
  certificateUrl?: string;
  imageUrl?: string;
  skills: string[];
}

import { BASE_URL } from '../utils/api';
const API = `${BASE_URL}/certifications`;
const token = () => localStorage.getItem('token');

/** Convert Google Drive share links → embeddable preview URL */
const toEmbedUrl = (url: string): string => {
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return url;
};

const Certifications = () => {
  const [certs, setCerts]             = useState<Certification[]>([]);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [saving, setSaving]           = useState(false);
  const [imagePreview, setImagePreview]   = useState<string>('');
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [linkPreviewUrl, setLinkPreviewUrl] = useState('');
  const [linkPreviewOpen, setLinkPreviewOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { fetchCerts(); }, []);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const res  = await fetch(API, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      setCerts(Array.isArray(data) ? data : []);
    } catch { message.error('Failed to load certifications'); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditingId(null);
    setImagePreview('');
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (cert: Certification) => {
    setEditingId(cert._id);
    setImagePreview(cert.imageUrl ?? '');
    form.setFieldsValue({
      name:           cert.name,
      issuer:         cert.issuer,
      date:           dayjs(cert.date),
      certificateUrl: cert.certificateUrl ?? '',
      skills:         cert.skills.join(', '),
    });
    setModalOpen(true);
  };

  const openLinkPreview = (url: string) => {
    if (!url) { message.warning('No certificate URL provided'); return; }
    setLinkPreviewUrl(url);
    setLinkPreviewOpen(true);
  };

  const handleImageSelect = (file: UploadFile['originFileObj']): boolean => {
    if (!file) return false;
    if (!file.type?.startsWith('image/')) {
      message.error('Please upload an image file (JPG, PNG, etc.)');
      return false;
    }
    if (file.size! / 1024 / 1024 > 5) {
      message.error('Image must be smaller than 5 MB');
      return false;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file as unknown as Blob);
    return false;
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const body = {
        ...values,
        date:     values.date.format('YYYY-MM-DD'),
        skills:   values.skills ? values.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        imageUrl: imagePreview || null,
      };
      const url    = editingId ? `${API}/${editingId}` : API;
      const method = editingId ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        message.success(editingId ? 'Certification updated!' : 'Certification added!');
        setModalOpen(false);
        fetchCerts();
      } else {
        const err = await res.json();
        message.error(err.message || 'Failed to save');
      }
    } catch { /* validation */ }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (res.ok) { message.success('Deleted!'); fetchCerts(); }
      else message.error('Failed to delete');
    } catch { message.error('Network error'); }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 70,
      render: (url?: string) =>
        url ? (
          <Image
            src={url}
            width={48}
            height={48}
            style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #e8e5ff' }}
            preview={{ mask: <EyeOutlined style={{ fontSize: 14 }} /> }}
          />
        ) : (
          <div style={{
            width: 48, height: 48, borderRadius: 8,
            background: '#f5f3ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#c4b5fd', fontSize: 18,
          }}>
            <PictureOutlined />
          </div>
        ),
    },
    {
      title: 'Certification',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <SafetyCertificateOutlined style={{ color: '#4f46e5' }} />
          <span style={{ fontWeight: 600, color: '#1e1b4b' }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Issuer',
      dataIndex: 'issuer',
      key: 'issuer',
      render: (v: string) => <span style={{ color: '#6b7280' }}>{v}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (d: string) => dayjs(d).format('DD MMM YYYY'),
      sorter: (a: Certification, b: Certification) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {skills.map((s) => (
            <Tag key={s} color="blue" style={{ margin: 0, borderRadius: 20 }}>{s}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 240,
      render: (_: any, record: Certification) => (
        <Space>
          {record.certificateUrl && (
            <>
              <Tooltip title="Preview certificate in-app">
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => openLinkPreview(record.certificateUrl!)}
                >
                  Preview
                </Button>
              </Tooltip>
              <Tooltip title="Open in new tab">
                <Button
                  size="small"
                  type="text"
                  icon={<LinkOutlined />}
                  href={record.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </Tooltip>
            </>
          )}
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm
            title="Delete this certification?"
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
          <Typography.Title level={3} style={{ margin: 0, color: '#1e1b4b' }}>Certifications</Typography.Title>
          <Typography.Text type="secondary">Manage your professional certifications</Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={openAdd}>
          Add Certification
        </Button>
      </div>

      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Table
          columns={columns}
          dataSource={certs}
          rowKey="_id"
          loading={loading}
          locale={{ emptyText: <Empty description="No certifications yet. Click 'Add Certification' to start." /> }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      {/* ── Add / Edit Modal ── */}
      <Modal
        title={
          <Space>
            <SafetyCertificateOutlined style={{ color: '#4f46e5' }} />
            {editingId ? 'Edit Certification' : 'Add New Certification'}
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
              <Form.Item name="name" label="Certification Name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g., AWS Solutions Architect" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="issuer" label="Issuer" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="e.g., Amazon Web Services" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Required' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            {/* Certificate URL with inline Preview button */}
            <Col span={12}>
              <Form.Item label="Certificate URL">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="certificateUrl" noStyle>
                    <Input placeholder="https://..." prefix={<LinkOutlined style={{ color: '#9ca3af' }} />} />
                  </Form.Item>
                  <Tooltip title="Preview link in-app">
                    <Button
                      icon={<GlobalOutlined />}
                      onClick={() => openLinkPreview(form.getFieldValue('certificateUrl'))}
                    />
                  </Tooltip>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="skills" label="Skills (comma-separated)">
                <Input placeholder="e.g., AWS, Cloud, DevOps, Terraform" />
              </Form.Item>
            </Col>

            {/* ── Image Upload ── */}
            <Col span={24}>
              <Form.Item label="Certificate Image">
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => handleImageSelect(file)}
                    maxCount={1}
                  >
                    {imagePreview ? (
                      <div style={{
                        width: 120, height: 120, borderRadius: 10,
                        border: '1px dashed #818cf8',
                        overflow: 'hidden', cursor: 'pointer', position: 'relative',
                      }}>
                        <img
                          src={imagePreview}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          alt="preview"
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: 120, height: 120, borderRadius: 10,
                        border: '2px dashed #c4b5fd',
                        background: '#f5f3ff',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', gap: 6, color: '#7c3aed',
                      }}>
                        <PictureOutlined style={{ fontSize: 28 }} />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>Upload Image</span>
                        <span style={{ fontSize: 11, color: '#a78bfa' }}>JPG, PNG · max 5 MB</span>
                      </div>
                    )}
                  </Upload>

                  <div style={{ flex: 1 }}>
                    {imagePreview ? (
                      <>
                        <div style={{ fontWeight: 600, color: '#1e1b4b', marginBottom: 4, fontSize: 13 }}>
                          Image ready
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 12 }}>
                          Click the image to replace it.
                        </div>
                        {/* Hidden Image — drives antd lightbox */}
                        <Image
                          src={imagePreview}
                          style={{ display: 'none' }}
                          preview={{
                            visible: lightboxOpen,
                            onVisibleChange: setLightboxOpen,
                          }}
                        />
                        <Space>
                          <Button size="small" icon={<EyeOutlined />} onClick={() => setLightboxOpen(true)}>
                            Full Preview
                          </Button>
                          <Button size="small" danger icon={<DeleteFilled />} onClick={() => setImagePreview('')}>
                            Remove
                          </Button>
                        </Space>
                      </>
                    ) : (
                      <div style={{ color: '#9ca3af', fontSize: 13 }}>
                        Upload a photo of your certificate for easy reference.
                        Supports JPG, PNG up to 5 MB.
                      </div>
                    )}
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* ── Link Preview Modal (iframe) ── */}
      <Modal
        title={
          <Space>
            <GlobalOutlined style={{ color: '#4f46e5' }} />
            Certificate Preview
            <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              — {linkPreviewUrl}
            </Typography.Text>
          </Space>
        }
        open={linkPreviewOpen}
        onCancel={() => setLinkPreviewOpen(false)}
        footer={[
          <Button key="open" type="primary" icon={<LinkOutlined />}
            href={linkPreviewUrl} target="_blank" rel="noopener noreferrer">
            Open in New Tab
          </Button>,
          <Button key="close" onClick={() => setLinkPreviewOpen(false)}>Close</Button>,
        ]}
        width="80vw"
        style={{ top: 24 }}
        styles={{ body: { padding: 0, height: '70vh' } }}
        destroyOnHidden
      >
        <iframe
          src={toEmbedUrl(linkPreviewUrl)}
          style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '0 0 8px 8px' }}
          title="Certificate Preview"
          allow="fullscreen"
        />
      </Modal>
    </div>
  );
};

export default Certifications;
