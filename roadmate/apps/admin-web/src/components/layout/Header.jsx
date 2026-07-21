import React from 'react';
import { Layout, Button, Avatar, Dropdown, Menu, Space } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

export default function Header({ collapsed, onToggle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clean session mock
    localStorage.removeItem('admin_authenticated');
    navigate('/login');
  };

  const userMenu = (
    <Menu className="rounded-xl shadow-lg border border-slate-100 p-2">
      <Menu.Item key="profile" icon={<UserOutlined />} className="rounded-lg font-sans">
        Profile Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        icon={<LogoutOutlined className="text-rose-500" />} 
        onClick={handleLogout}
        className="rounded-lg text-rose-500 hover:bg-rose-50 font-sans"
      >
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader className="bg-white px-6 border-b border-slate-100 flex items-center justify-between h-16 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="text-slate-600 text-lg hover:bg-slate-50 rounded-lg flex items-center justify-center w-10 h-10"
        />
        <h1 className="text-lg font-bold text-slate-800 font-sans mb-0 tracking-tight hidden sm:block">
          Platform Governance Console
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
          <Space className="cursor-pointer hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-all duration-300">
            <Avatar 
              icon={<UserOutlined />} 
              className="bg-[#0F3D91] flex items-center justify-center"
            />
            <div className="hidden md:block text-left font-sans">
              <p className="text-xs font-bold text-slate-700 leading-none mb-0.5">Admin Account</p>
              <p className="text-[10px] text-slate-400 font-semibold leading-none mb-0">Super Administrator</p>
            </div>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
}
