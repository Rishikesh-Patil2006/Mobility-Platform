import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Table, Button } from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  PercentageOutlined,
  WarningOutlined,
  ArrowRightOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import KpiCard from '../components/common/KpiCard';
import StatusBadge from '../components/common/StatusBadge';

// Mock Data from Figma Design Reference
const revenueData = [
  { month: "Jan", revenue: 284000, commission: 28400, bookings: 312 },
  { month: "Feb", revenue: 319000, commission: 31900, bookings: 341 },
  { month: "Mar", revenue: 298000, commission: 29800, bookings: 298 },
  { month: "Apr", revenue: 412000, commission: 41200, bookings: 456 },
  { month: "May", revenue: 389000, commission: 38900, bookings: 421 },
  { month: "Jun", revenue: 467000, commission: 46700, bookings: 512 },
  { month: "Jul", revenue: 523000, commission: 52300, bookings: 578 },
  { month: "Aug", revenue: 489000, commission: 48900, bookings: 534 },
  { month: "Sep", revenue: 556000, commission: 55600, bookings: 601 },
  { month: "Oct", revenue: 612000, commission: 61200, bookings: 662 },
  { month: "Nov", revenue: 578000, commission: 57800, bookings: 631 },
  { month: "Dec", revenue: 694000, commission: 69400, bookings: 748 },
];

const serviceRevData = [
  { name: "Garage", value: 30, color: "#0F3D91" },
  { name: "Towing", value: 18, color: "#F97316" },
  { name: "Car Wash", value: 16, color: "#16A34A" },
  { name: "PUC", value: 10, color: "#8B5CF6" },
  { name: "Driver", value: 14, color: "#EC4899" },
  { name: "Denting", value: 8, color: "#F43F5E" },
  { name: "Service Ctr", value: 14, color: "#06B6D4" },
];

const growthData = [
  { month: "Jul", vendors: 124, customers: 1240 },
  { month: "Aug", vendors: 148, customers: 1680 },
  { month: "Sep", vendors: 167, customers: 2100 },
  { month: "Oct", vendors: 189, customers: 2540 },
  { month: "Nov", vendors: 213, customers: 3120 },
  { month: "Dec", vendors: 241, customers: 3890 },
];

const bookings = [
  { id: "B001", customer: "Arjun Reddy", vendor: "Kumar Auto Works", service: "Garage Service", amount: 4200, status: "completed", date: "Dec 28, 2024" },
  { id: "B002", customer: "Aditya Rao", vendor: "Mehta Towing Services", service: "Flatbed Towing", amount: 2500, status: "ongoing", date: "Dec 28, 2024" },
  { id: "B003", customer: "Neha Sharma", vendor: "Shine Car Wash", service: "Full Detail Wash", amount: 1200, status: "pending", date: "Dec 28, 2024" },
  { id: "B004", customer: "Siddharth Malhotra", vendor: "Nair Battery Solutions", service: "Battery Jumpstart", amount: 800, status: "confirmed", date: "Dec 27, 2024" }
];

const pendingVendors = [
  { id: "V002", name: "Suresh Mehta", business: "Mehta Towing Services", service: "Towing", city: "Pune", submitted: "Dec 26, 2024" }
];

// Helper Chart Components matching Figma UI source styles
function RevenueBarChart({ data }) {
  const maxRev = Math.max(...data.map(d => d.revenue));
  const maxComm = Math.max(...data.map(d => d.commission));
  return (
    <div className="flex items-end gap-2 h-48 w-full px-2 pt-6">
      {data.map((d, i) => {
        const barH = (d.revenue / maxRev) * 100;
        const lineH = (d.commission / maxComm) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              ₹{(d.revenue/1000).toFixed(0)}K · ₹{(d.commission/1000).toFixed(0)}K
            </div>
            <div className="w-full flex flex-col justify-end relative" style={{ height: "140px" }}>
              {/* Commission dot marker */}
              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#F97316] left-1/2 -translate-x-1/2 z-10"
                style={{ bottom: `${lineH * 1.2}%` }} />
              {/* Revenue bar */}
              <div className="w-full rounded-t bg-[#0F3D91] transition-all duration-300 group-hover:bg-[#1a4fa8]"
                style={{ height: `${barH}%`, opacity: 0.85 }} />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 mt-1 font-sans">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

function GrowthChart({ data }) {
  const maxV = Math.max(...data.map(d => d.vendors));
  const maxC = Math.max(...data.map(d => d.customers));
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-xs mb-3 font-sans">
        <span className="flex items-center gap-1.5 text-slate-500 font-medium">
          <span className="w-3 h-3 rounded bg-[#0F3D91] inline-block" />
          Vendors
        </span>
        <span className="flex items-center gap-1.5 text-slate-500 font-medium">
          <span className="w-3 h-1.5 bg-[#16A34A] inline-block rounded-full" />
          Customers (÷10)
        </span>
      </div>
      {data.map((d, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-xs font-sans text-slate-500 font-semibold">
            <span className="w-8">{d.month}</span>
            <span className="text-slate-400">{d.vendors} vendors · {d.customers.toLocaleString()} customers</span>
          </div>
          <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-slate-50 border border-slate-100">
            <div className="rounded-l bg-[#0F3D91]" style={{ width: `${(d.vendors / maxV) * 60}%`, opacity: 0.85 }} />
            <div className="rounded-r bg-[#16A34A]" style={{ width: `${(d.customers / maxC) * 40}%`, opacity: 0.75 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Columns configurations for Ant Design tables
  const pendingVendorColumns = [
    { title: 'Vendor', dataIndex: 'name', key: 'name', className: 'font-semibold font-sans text-slate-700' },
    { title: 'Business', dataIndex: 'business', key: 'business', className: 'font-sans text-slate-500' },
    { title: 'Service', dataIndex: 'service', key: 'service', className: 'font-sans text-slate-500' },
    { title: 'City', dataIndex: 'city', key: 'city', className: 'font-sans text-slate-500' },
    { title: 'Submitted', dataIndex: 'submitted', key: 'submitted', className: 'font-sans text-slate-400' },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate('/vendors')}
          size="small"
          className="bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] font-sans font-semibold rounded-lg text-xs"
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-sans tracking-tight mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Overview
          </h1>
          <p className="text-slate-400 text-sm mb-0 font-medium">Enterprise platform metrics & growth indices</p>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Total Vendors"
            value="241"
            sub="Across all cities"
            icon={BankOutlined}
            color="#0F3D91"
            trend={12.4}
            onClick={() => navigate('/vendors')}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Total Customers"
            value="3,890"
            sub="Registered users"
            icon={TeamOutlined}
            color="#16A34A"
            trend={18.7}
            onClick={() => navigate('/customers')}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Total Bookings"
            value="15,678"
            sub="All time"
            icon={FileTextOutlined}
            color="#F97316"
            trend={9.2}
            onClick={() => navigate('/dashboard')}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Today's Revenue"
            value="₹84,200"
            sub="Dec 28, 2024"
            icon={DollarOutlined}
            color="#8B5CF6"
            trend={6.1}
            onClick={() => navigate('/dashboard')}
          />
        </Col>
      </Row>

      {/* KPI Cards Row 2 */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Pending Approvals"
            value="8"
            sub="Vendors awaiting review"
            icon={ClockCircleOutlined}
            color="#EAB308"
            onClick={() => navigate('/vendors')}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Monthly Revenue"
            value="₹6,94,000"
            sub="December 2024"
            icon={RiseOutlined}
            color="#16A34A"
            trend={14.3}
            onClick={() => navigate('/dashboard')}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Platform Commission"
            value="₹69,400"
            sub="10% of revenue"
            icon={PercentageOutlined}
            color="#0F3D91"
            trend={14.3}
            onClick={() => navigate('/settings')}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Pending Settlements"
            value="₹1,24,800"
            sub="To be released"
            icon={WarningOutlined}
            color="#F97316"
            onClick={() => navigate('/settings')}
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            variant="borderless"
            className="rounded-2xl shadow-sm overflow-hidden"
            styles={{ body: { padding: '24px' } }}
          >
            <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-slate-800 font-sans text-base mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Revenue Trends 2024
                </h3>
                <p className="text-xs text-slate-400 mb-0 font-medium">Monthly revenue (bars) · commission (line)</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-sans text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded bg-[#0F3D91] inline-block" />
                  Revenue
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-1 bg-[#F97316] inline-block rounded-full" />
                  Commission
                </span>
              </div>
            </div>
            <RevenueBarChart data={revenueData} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            variant="borderless"
            className="rounded-2xl shadow-sm overflow-hidden h-full"
            styles={{ body: { padding: '24px' } }}
          >
            <h3 className="font-bold text-slate-800 font-sans text-base mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Service Revenue Split
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">By service category</p>
            <ResponsiveContainer width="100%" height={160}>
              <RePieChart>
                <Pie
                  data={serviceRevData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  {serviceRevData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Split']} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {serviceRevData.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs font-semibold text-slate-500 font-sans">
                  <span className="w-2.5 h-2.5 rounded flex-shrink-0" style={{ backgroundColor: s.color }}></span>
                  <span className="truncate">{s.name} {s.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Growth + Recent Bookings Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            variant="borderless"
            className="rounded-2xl shadow-sm overflow-hidden h-full"
            styles={{ body: { padding: '24px' } }}
          >
            <h3 className="font-bold text-slate-800 font-sans text-base mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Platform Growth
            </h3>
            <p className="text-xs text-slate-400 mb-6 font-medium">Vendors & customers (last 6 months)</p>
            <GrowthChart data={growthData} />
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card
            variant="borderless"
            className="rounded-2xl shadow-sm overflow-hidden"
            styles={{ body: { padding: '24px' } }}
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-bold text-slate-800 font-sans text-base mb-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Recent Bookings
              </h3>
              <Button
                type="link"
                icon={<ArrowRightOutlined />}
                iconPlacement="end"
                className="text-[#0F3D91] hover:text-[#0c3278] font-bold text-xs p-0 flex items-center gap-1 font-sans"
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-700 font-sans">
                      {b.service[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 font-sans mb-0.5">{b.customer}</p>
                      <p className="text-xs text-slate-400 font-sans font-medium mb-0">{b.service} · {b.vendor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800 font-sans mb-1">₹{b.amount.toLocaleString()}</p>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Pending Vendor Approvals Row */}
      <Card
        variant="borderless"
        className="rounded-2xl shadow-sm overflow-hidden"
        styles={{ body: { padding: '24px' } }}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h3 className="font-bold text-slate-800 font-sans text-base mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Pending Vendor Approvals
            </h3>
            <p className="text-xs text-slate-400 mb-0 font-medium">New registrations awaiting credentials allocation</p>
          </div>
          <Button
            type="link"
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
            onClick={() => navigate('/vendors')}
            className="text-[#0F3D91] hover:text-[#0c3278] font-bold text-xs p-0 flex items-center gap-1 font-sans"
          >
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table
            dataSource={pendingVendors}
            columns={pendingVendorColumns}
            rowKey="id"
            pagination={false}
            className="font-sans border-0"
            rowClassName="hover:bg-slate-50/50"
          />
        </div>
      </Card>
    </div>
  );
}
