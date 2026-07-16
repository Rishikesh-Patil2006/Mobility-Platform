import { useState } from 'react';
import { Table, Button, Row, Col, Card, Steps } from 'antd';
import {
  FileTextOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import KpiCard from '../components/common/KpiCard';
import StatusBadge from '../components/common/StatusBadge';

// Mock Bookings Data from Figma reference
const initialBookings = [
  { id: "BK2024001", customer: "Arjun Reddy", vendor: "Kumar Auto Works", service: "Garage", date: "2024-12-28", amount: 3200, commission: 320, status: "completed", payment: "paid", location: "Andheri, Mumbai" },
  { id: "BK2024002", customer: "Sneha Gupta", vendor: "Mehta Towing Services", service: "Towing", date: "2024-12-27", amount: 1800, commission: 180, status: "ongoing", payment: "paid", location: "Wakad, Pune" },
  { id: "BK2024003", customer: "Vikram Singh", vendor: "Shine Car Wash", service: "Car Wash", date: "2024-12-27", amount: 800, commission: 80, status: "completed", payment: "paid", location: "Koramangala, Bangalore" },
  { id: "BK2024004", customer: "Deepa Menon", vendor: "Nair Battery Solutions", service: "Service Center", date: "2024-12-26", amount: 2400, commission: 240, status: "cancelled", payment: "refunded", location: "Banjara Hills, Hyderabad" },
  { id: "BK2024005", customer: "Rahul Joshi", vendor: "Ali PUC Center", service: "PUC", date: "2024-12-26", amount: 400, commission: 40, status: "completed", payment: "paid", location: "T. Nagar, Chennai" },
  { id: "BK2024006", customer: "Arjun Reddy", vendor: "Patel Garage & Service", service: "Service Center", date: "2024-12-25", amount: 5600, commission: 560, status: "completed", payment: "paid", location: "Navrangpura, Ahmedabad" },
];

export default function BookingsPage() {
  const [bookingsList] = useState(initialBookings);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filtered list
  const filteredBookings = filterStatus === "all"
    ? bookingsList
    : bookingsList.filter((b) => b.status === filterStatus);

  const counts = {
    all: bookingsList.length,
    ongoing: bookingsList.filter((b) => b.status === "ongoing").length,
    completed: bookingsList.filter((b) => b.status === "completed").length,
    cancelled: bookingsList.filter((b) => b.status === "cancelled").length,
  };

  // Ant Design columns configurations
  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      className: 'font-mono text-xs font-semibold text-[#0F3D91]',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      className: 'font-bold font-sans text-slate-700 text-sm',
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      className: 'font-sans text-slate-500 text-sm',
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      className: 'font-sans text-slate-500 text-sm',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      className: 'font-sans text-slate-400 text-sm',
    },
    {
      title: 'Amount',
      key: 'amount',
      className: 'font-mono font-bold text-slate-800 text-sm',
      render: (_, record) => <span>₹{record.amount.toLocaleString()}</span>,
    },
    {
      title: 'Commission',
      key: 'commission',
      className: 'font-mono text-slate-500 text-sm',
      render: (_, record) => <span>₹{record.commission.toLocaleString()}</span>,
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_, record) => <StatusBadge status={record.payment} />,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => <StatusBadge status={record.status} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBooking(record);
          }}
          size="small"
          className="bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] hover:border-[#0c3278] rounded-lg text-xs font-semibold"
        >
          View
        </Button>
      ),
    },
  ];

  if (selectedBooking) {
    return <BookingDetail booking={selectedBooking} onBack={() => setSelectedBooking(null)} />;
  }

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-sans tracking-tight mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Booking Management
        </h1>
        <p className="text-slate-400 text-sm mb-0 font-medium">All vehicle booking records generated on the platform</p>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="All Bookings"
            value="15,678"
            icon={FileTextOutlined}
            color="#0F3D91"
            onClick={() => setFilterStatus("all")}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Ongoing"
            value="234"
            icon={ClockCircleOutlined}
            color="#EAB308"
            onClick={() => setFilterStatus("ongoing")}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Completed"
            value="14,892"
            icon={CheckCircleOutlined}
            color="#16A34A"
            onClick={() => setFilterStatus("completed")}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Cancelled"
            value="552"
            icon={CloseCircleOutlined}
            color="#DC2626"
            onClick={() => setFilterStatus("cancelled")}
          />
        </Col>
      </Row>

      {/* Filters Toolbar */}
      <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
        {["all", "ongoing", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border-0 focus:outline-none cursor-pointer ${
              filterStatus === s
                ? "bg-white text-[#0F3D91] shadow-sm"
                : "text-slate-600 hover:text-slate-800 bg-transparent"
            }`}
          >
            {s} <span className="ml-1 text-[10px] opacity-60 font-mono">({counts[s] !== undefined ? counts[s] : counts.all})</span>
          </button>
        ))}
      </div>

      {/* Booking listings table */}
      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => setSelectedBooking(record),
          })}
          className="font-sans"
          rowClassName="cursor-pointer hover:bg-blue-50/10 transition-colors"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            className: "pr-6 pb-4",
          }}
        />
      </Card>
    </div>
  );
}

// ─── Sub-Component: Booking Detail View ───
function BookingDetail({ booking, onBack }) {
  // Setup timeline steps state
  const timelineItems = [
    { title: 'Booking Created', description: '10:23 AM', status: 'finish' },
    { title: 'Payment Received', description: '10:24 AM', status: 'finish' },
    { title: 'Vendor Notified', description: '10:25 AM', status: 'finish' },
    {
      title: 'Service Started',
      description: '11:00 AM',
      status: booking.status === 'cancelled' ? 'wait' : 'finish',
    },
    {
      title: 'Service Completed',
      description: '01:30 PM',
      status: booking.status === 'completed' ? 'finish' : booking.status === 'cancelled' ? 'error' : 'process',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Return Navigation */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D91] border-0 bg-transparent cursor-pointer font-bold font-sans transition-colors focus:outline-none"
        >
          <ArrowLeftOutlined style={{ fontSize: '13px' }} />
          Back to Bookings list
        </button>
      </div>

      {/* Summary Header block */}
      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
        <div className="flex items-center justify-between flex-wrap gap-4 font-sans">
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-mono mb-1">{booking.id}</h2>
            <p className="text-slate-500 mt-1 text-sm font-medium mb-0">
              {booking.service} Service · {booking.date}
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.payment} />
          </div>
        </div>
      </Card>

      {/* Overview stats layout */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden h-full" styles={{ body: { padding: '20px' } }}>
            <div className="flex items-center gap-2 mb-3">
              <UserOutlined className="text-slate-400 text-base" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0 font-sans">Customer</h4>
            </div>
            <p className="font-bold text-slate-800 text-base font-sans mb-1">{booking.customer}</p>
            <p className="text-xs text-slate-500 font-sans font-medium flex items-center gap-1 mb-0">
              <EnvironmentOutlined />
              {booking.location}
            </p>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden h-full" styles={{ body: { padding: '20px' } }}>
            <div className="flex items-center gap-2 mb-3">
              <ShopOutlined className="text-slate-400 text-base" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0 font-sans">Vendor / Provider</h4>
            </div>
            <p className="font-bold text-slate-800 text-base font-sans mb-1">{booking.vendor}</p>
            <p className="text-xs text-slate-500 font-sans font-medium mb-0">{booking.service} Service Provider</p>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden h-full" styles={{ body: { padding: '20px' } }}>
            <div className="flex items-center gap-2 mb-3">
              <DollarOutlined className="text-slate-400 text-base" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0 font-sans">Financial Details</h4>
            </div>
            <p className="text-2xl font-bold text-slate-800 font-mono mb-3">₹{booking.amount.toLocaleString()}</p>
            <div className="space-y-1.5 text-xs text-slate-500 font-sans">
              <div className="flex justify-between font-medium">
                <span>Platform Commission (10%)</span>
                <span>₹{booking.commission.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-700 pt-1 border-t border-slate-100">
                <span>Vendor Settlement</span>
                <span>₹{(booking.amount - booking.commission).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Booking Progress Timeline */}
      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <SafetyCertificateOutlined className="text-[#0F3D91] text-sm" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-0 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Booking Timeline
          </h3>
        </div>
        <div className="px-2 pt-2">
          <Steps
            direction="vertical"
            current={booking.status === 'completed' ? 4 : booking.status === 'cancelled' ? 4 : 3}
            items={timelineItems}
            className="font-sans"
          />
        </div>
      </Card>
    </div>
  );
}
