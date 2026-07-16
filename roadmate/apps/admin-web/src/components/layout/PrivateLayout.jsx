import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const { Content } = Layout;

export default function PrivateLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} />
      <Layout className="site-layout">
        <Header collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        <Content
          className="bg-[#F0F4F8] p-6 overflow-y-auto"
          style={{
            minHeight: 280,
            height: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
