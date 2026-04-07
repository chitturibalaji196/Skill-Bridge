import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Login.css'; // Reusing login styles for consistency

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetUrl, setResetUrl] = useState('');

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    setSuccess('');
    setResetUrl('');
    try {
      const response = await api.post('/auth/forgotpassword', { email: values.email });
      setSuccess(response.data.message || 'Email sent successfully. Please check your inbox.');
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl);
      }
    } catch (err) {
      const detail = err.response?.data?.detail ? ` (${err.response.data.detail})` : '';
      setError((err.response?.data?.message || 'Failed to send reset email. Please try again.') + detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <Title level={2}>Forgot Password</Title>
          <Text type="secondary">Enter your email and we will send you a reset link</Text>
        </div>

        {error && <Alert message={error} type="error" showIcon className="login-alert" />}
        {success && (
          <Alert 
            message={success} 
            type="success" 
            showIcon 
            className="login-alert" 
          />
        )}
        
        {/* FALLBACK FOR RENDER DEMO MODE */}
        {resetUrl && (
            <div style={{ marginTop: '15px', marginBottom: '20px', textAlign: 'center' }}>
                <Button type="primary" size="large" style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}>
                    <a href={resetUrl.replace(window.location.origin, '')} style={{ color: 'white' }}>Demo: Click Here To Reset Password</a>
                </Button>
            </div>
        )}

        <Form
          name="forgot_password"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
          className="login-form"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button" loading={loading} block>
              Send Reset Link
            </Button>
          </Form.Item>
          
          <div className="login-footer">
            <Text>Remember your password? <Link to="/login">Login here</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
