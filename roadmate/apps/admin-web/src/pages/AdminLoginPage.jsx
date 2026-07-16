import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  ArrowLeftOutlined,
  CheckCircleFilled,
  CarOutlined,
} from '@ant-design/icons';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("priya@mobility.in");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (values) => {
    const { email: loginEmail, password } = values;
    setLoading(true);
    setError("");

    setTimeout(() => {
      // Authenticating against mock superadmin credentials from Figma reference
      if (loginEmail === "priya@mobility.in" && password === "admin123") {
        navigate('/dashboard');
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    }, 900);
  };

  const handleResetPassword = (values) => {
    setEmail(values.resetEmail);
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F3D91] via-[#1a4fa8] to-[#0a2d6e] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-4 backdrop-blur-sm border border-white/20">
            <CarOutlined className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            MobilityPlatform
          </h1>
          <p className="text-blue-200 text-sm mt-2 font-medium">Enterprise Control Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {resetSent ? (
            <div className="text-center py-4">
              <CheckCircleFilled className="text-green-500 text-5xl mb-4 animate-bounce" />
              <h2 className="text-lg font-bold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Reset Link Sent!
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Check your inbox at <strong>{email}</strong>
              </p>
              <Button
                onClick={() => { setForgot(false); setResetSent(false); }}
                size="large"
                className="w-full rounded-xl hover:bg-slate-50 font-medium"
              >
                Back to Login
              </Button>
            </div>
          ) : !forgot ? (
            <>
              <h2 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome back
              </h2>
              <p className="text-slate-500 text-sm mb-6">Sign in to continue</p>
              
              {error && (
                <div className="mb-4">
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    className="rounded-xl border-red-200"
                  />
                </div>
              )}

              <Form
                name="loginForm"
                onFinish={handleLogin}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item
                  label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</span>}
                  name="email"
                  initialValue="priya@mobility.in"
                  rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-slate-400 mr-1" />}
                    placeholder="admin@mobility.in"
                    size="large"
                    className="rounded-xl py-2.5 border-slate-200 hover:border-[#0F3D91] focus:border-[#0F3D91]"
                  />
                </Form.Item>

                <Form.Item
                  label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</span>}
                  name="password"
                  rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-400 mr-1" />}
                    placeholder="Enter your password"
                    size="large"
                    className="rounded-xl py-2.5 border-slate-200 hover:border-[#0F3D91] focus:border-[#0F3D91]"
                  />
                </Form.Item>

                <div className="flex items-center justify-between mb-6">
                  <Form.Item name="remember" valuePropName="checked" noStyle initialValue={true}>
                    <Checkbox className="text-slate-600 text-sm font-normal">Remember me</Checkbox>
                  </Form.Item>
                  <button
                    type="button"
                    onClick={() => setForgot(true)}
                    className="text-sm text-[#0F3D91] font-medium hover:underline focus:outline-none bg-transparent border-0 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    className="w-full bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] hover:border-[#0c3278] font-semibold h-11 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Sign In
                  </Button>
                </Form.Item>
              </Form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <p className="text-xs font-semibold text-blue-700 mb-1.5">Demo Credentials</p>
                <p className="text-xs text-blue-600">Admin: <strong>priya@mobility.in</strong> / <strong>admin123</strong></p>
                <p className="text-xs text-blue-600 mt-0.5 font-medium">Vendors get auto-generated credentials when added by admin</p>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setForgot(false)}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D91] mb-5 transition-colors focus:outline-none bg-transparent border-0 cursor-pointer font-medium"
              >
                <ArrowLeftOutlined style={{ fontSize: '13px' }} />
                Back to login
              </button>
              <h2 className="text-xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Reset Password
              </h2>
              <p className="text-slate-500 text-sm mb-6">Enter your admin email to receive a reset link</p>
              
              <Form
                name="resetForm"
                onFinish={handleResetPassword}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item
                  label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</span>}
                  name="resetEmail"
                  initialValue={email}
                  rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-slate-400 mr-1" />}
                    placeholder="admin@mobility.in"
                    size="large"
                    className="rounded-xl py-2.5 border-slate-200"
                  />
                </Form.Item>
                
                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] hover:border-[#0c3278] font-semibold h-11 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Send Reset Link
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </div>
        <p className="text-center text-blue-200/50 text-xs mt-6">© 2024 MobilityPlatform · Enterprise Admin Panel</p>
      </div>
    </div>
  );
}
