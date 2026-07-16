import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShopOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  CarOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/vendors', icon: <ShopOutlined />, label: 'Vendors' },
    { key: '/customers', icon: <UserOutlined />, label: 'Customers' },
    { key: '/bookings', icon: <CalendarOutlined />, label: 'Bookings' },
    { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      style={{ backgroundColor: '#0F3D91' }}
      className="border-r border-white/10"
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <CarOutlined className="text-white text-lg" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-tight font-sans mb-0">
              MobilityPlatform
            </p>
            <p className="text-blue-200 text-xs font-sans mb-0">Super Admin</p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between" style={{ height: 'calc(100vh - 74px)' }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          style={{ backgroundColor: 'transparent', border: 0 }}
          className="pt-4 px-2"
          items={menuItems.map(item => ({
            ...item,
            className: `rounded-lg mb-1 transition-all ${
              location.pathname === item.key 
                ? "!bg-white !text-[#0F3D91] !font-semibold" 
                : "!text-blue-100 hover:!text-white hover:!bg-white/10"
            }`
          }))}
        />

        <div className="px-2 pb-4 pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white text-sm transition-all border-0 bg-transparent cursor-pointer text-left focus:outline-none"
          >
            <LogoutOutlined className="text-lg flex-shrink-0" />
            {!collapsed && <span className="font-sans font-medium">Sign Out</span>}
          </button>
        </div>
      </div>
    </Sider>
  );
}
