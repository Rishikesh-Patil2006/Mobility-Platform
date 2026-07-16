import { useState } from 'react';
import { Table, Button, Input, Row, Col, Tabs, Card, message } from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  LeftOutlined,
  StopOutlined,
  CheckCircleOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  RiseOutlined,
  CarOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import KpiCard from '../components/common/KpiCard';
import StatusBadge from '../components/common/StatusBadge';

// Complete mock customers data set from Figma reference
const initialCustomers = [
  { id:"C001", name:"Arjun Reddy",       mobile:"9811234567", email:"arjun@gmail.com",       city:"Hyderabad",  address:"Flat 3B, Sunshine Apts, Madhapur, Hyderabad - 500081",        orders:18, spend:54200,  status:"active",   vehicle:"TS09AB1234", brand:"Maruti",  model:"Swift",    fuel:"Petrol", year:2021, joinDate:"Feb 12, 2023" },
  { id:"C002", name:"Sneha Gupta",        mobile:"9722345678", email:"sneha@gmail.com",        city:"Delhi",      address:"House 42, Sector 15, Rohini, New Delhi - 110085",             orders:24, spend:78900,  status:"active",   vehicle:"DL01XY5678", brand:"Hyundai", model:"i20",      fuel:"Diesel", year:2020, joinDate:"Mar 5, 2023"  },
  { id:"C003", name:"Vikram Singh",       mobile:"9633456789", email:"vikram@gmail.com",       city:"Jaipur",     address:"12, Vaishali Nagar, Jaipur - 302021",                         orders:9,  spend:28400,  status:"active",   vehicle:"RJ14CD9012", brand:"Honda",   model:"City",     fuel:"Petrol", year:2022, joinDate:"Apr 18, 2023" },
  { id:"C004", name:"Deepa Menon",        mobile:"9544567890", email:"deepa@gmail.com",        city:"Kochi",      address:"TC 14/2201, Palarivattom, Ernakulam, Kochi - 682025",         orders:31, spend:102300, status:"active",   vehicle:"KL07EF3456", brand:"Toyota",  model:"Innova",   fuel:"Diesel", year:2019, joinDate:"Jan 3, 2023"  },
  { id:"C005", name:"Rahul Joshi",        mobile:"9455678901", email:"rahul@gmail.com",        city:"Lucknow",    address:"D-Block, Gomti Nagar, Lucknow - 226010",                      orders:6,  spend:18700,  status:"inactive", vehicle:"UP32GH7890", brand:"Tata",    model:"Nexon",    fuel:"EV",     year:2023, joinDate:"Aug 20, 2023" },
  { id:"C006", name:"Preethi Narayanan", mobile:"9346789012", email:"preethi@gmail.com",      city:"Chennai",    address:"5/2, Anna Nagar East, Chennai - 600102",                      orders:14, spend:42300,  status:"active",   vehicle:"TN09BC2345", brand:"Maruti",  model:"Baleno",   fuel:"Petrol", year:2022, joinDate:"May 8, 2023"  },
  { id:"C007", name:"Ajay Sharma",        mobile:"9237890123", email:"ajay@gmail.com",         city:"Mumbai",     address:"301, Sai Residency, Malad West, Mumbai - 400064",             orders:22, spend:67800,  status:"active",   vehicle:"MH01DE3456", brand:"Hyundai", model:"Verna",    fuel:"Petrol", year:2021, joinDate:"Jun 14, 2023" },
  { id:"C008", name:"Kavya Krishnan",    mobile:"9128901234", email:"kavya@gmail.com",        city:"Bangalore",  address:"No 8, BTM Layout 2nd Stage, Bangalore - 560076",              orders:17, spend:53100,  status:"active",   vehicle:"KA03EF4567", brand:"Honda",   model:"Amaze",    fuel:"Diesel", year:2020, joinDate:"Jul 22, 2023" },
  { id:"C009", name:"Siddharth Rao",     mobile:"9019012345", email:"sid@gmail.com",          city:"Pune",       address:"A-204, Aundh Enclave, Aundh, Pune - 411007",                  orders:11, spend:34500,  status:"active",   vehicle:"MH12GH5678", brand:"Maruti",  model:"Ertiga",   fuel:"CNG",    year:2021, joinDate:"Sep 1, 2023"  },
  { id:"C010", name:"Fatima Sheikh",     mobile:"8910123456", email:"fatima@gmail.com",       city:"Hyderabad",  address:"6-3-248/1, Banjara Hills, Hyderabad - 500034",                orders:8,  spend:24600,  status:"active",   vehicle:"TS07IJ6789", brand:"Renault", model:"Kwid",     fuel:"Petrol", year:2022, joinDate:"Oct 10, 2023" },
];

const mockBookings = [
  { id: "B001", customer: "Arjun Reddy", vendor: "Kumar Auto Works", service: "Garage Service", amount: 4200, status: "completed", date: "Dec 28, 2024", location: "Andheri, Mumbai" },
  { id: "B002", customer: "Aditya Rao", vendor: "Mehta Towing Services", service: "Flatbed Towing", amount: 2500, status: "ongoing", date: "Dec 28, 2024", location: "Wakad, Pune" },
  { id: "B003", customer: "Neha Sharma", vendor: "Shine Car Wash", service: "Full Detail Wash", amount: 1200, status: "pending", date: "Dec 28, 2024", location: "Koramangala, Bangalore" },
  { id: "B004", customer: "Siddharth Malhotra", vendor: "Nair Battery Solutions", service: "Battery Jumpstart", amount: 800, status: "confirmed", date: "Dec 27, 2024", location: "Banjara Hills, Hyderabad" }
];

export default function CustomerListPage() {
  const [customersList, setCustomersList] = useState(initialCustomers);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const counts = {
    all: customersList.length,
    active: customersList.filter((c) => c.status === "active").length,
    inactive: customersList.filter((c) => c.status === "inactive").length,
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = customersList.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setCustomersList(updated);
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer({ ...selectedCustomer, status: newStatus });
    }
    message.success(`Customer profile status updated to ${newStatus}`);
  };

  // Filter logic
  const filteredCustomers = customersList.filter((c) => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const s = searchText.toLowerCase();
    const matchSearch =
      !s ||
      c.name.toLowerCase().includes(s) ||
      c.mobile.includes(s) ||
      c.email.toLowerCase().includes(s) ||
      c.city.toLowerCase().includes(s) ||
      c.vehicle.toLowerCase().includes(s) ||
      c.brand.toLowerCase().includes(s) ||
      c.model.toLowerCase().includes(s) ||
      c.id.toLowerCase().includes(s);
    return matchStatus && matchSearch;
  });

  // Columns configs
  const columns = [
    {
      title: '#',
      key: 'idx',
      render: (_, __, idx) => <span className="font-mono text-slate-400 text-xs">{idx + 1}</span>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {record.name[0]}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm mb-0.5 font-sans">{record.name}</p>
            <p className="text-[10px] text-slate-400 mb-0 font-sans">{record.id} · Joined {record.joinDate}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <p className="text-sm text-slate-700 font-sans mb-0.5">{record.mobile}</p>
          <p className="text-xs text-slate-400 font-sans mb-0 truncate max-w-[140px]">{record.email}</p>
        </div>
      ),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      className: 'text-sm text-slate-700 font-sans',
    },
    {
      title: 'Vehicle',
      key: 'vehicle',
      render: (_, record) => (
        <div>
          <p className="font-mono text-xs font-semibold text-slate-700 mb-0.5">{record.vehicle}</p>
          <p className="text-xs text-slate-400 mb-0 font-sans">{record.brand} {record.model} · {record.fuel}</p>
        </div>
      ),
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      className: 'font-mono text-slate-700 text-sm',
    },
    {
      title: 'Total Spend',
      key: 'spend',
      className: 'font-mono font-semibold text-slate-800 text-sm',
      render: (_, record) => <span>₹{record.spend.toLocaleString()}</span>,
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
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            type="primary"
            onClick={() => setSelectedCustomer(record)}
            size="small"
            className="bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] hover:border-[#0c3278] rounded-lg text-xs font-semibold"
          >
            View
          </Button>
          {record.status === "active" ? (
            <Button
              danger
              icon={<StopOutlined />}
              onClick={() => handleUpdateStatus(record.id, "inactive")}
              size="small"
              className="rounded-lg text-xs font-semibold flex items-center"
            >
              Block
            </Button>
          ) : (
            <Button
              onClick={() => handleUpdateStatus(record.id, "active")}
              size="small"
              className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white rounded-lg text-xs font-semibold"
            >
              Activate
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (selectedCustomer) {
    return (
      <CustomerDetail
        customer={selectedCustomer}
        onBack={() => setSelectedCustomer(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-sans tracking-tight mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Customer Management
        </h1>
        <p className="text-slate-400 text-sm mb-0 font-medium">{counts.all} total registered customers</p>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <KpiCard
            label="Total Customers"
            value={counts.all.toString()}
            icon={UserOutlined}
            color="#0F3D91"
            trend={18.7}
            onClick={() => setFilterStatus("all")}
          />
        </Col>
        <Col xs={24} sm={12}>
          <KpiCard
            label="Active Customers"
            value={counts.active.toString()}
            icon={CheckCircleOutlined}
            color="#16A34A"
            onClick={() => setFilterStatus("active")}
          />
        </Col>
      </Row>

      {/* Search and Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
          {["all", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border-0 focus:outline-none cursor-pointer ${
                filterStatus === s
                  ? "bg-white text-[#0F3D91] shadow-sm"
                  : "text-slate-600 hover:text-slate-800 bg-transparent"
              }`}
            >
              {s === "inactive" ? "blocked" : s} <span className="ml-1 text-[10px] opacity-60 font-mono">({counts[s]})</span>
            </button>
          ))}
        </div>
        <Input
          prefix={<SearchOutlined className="text-slate-400 mr-1" />}
          placeholder="Search by name, mobile, city, vehicle…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size="large"
          className="rounded-xl border-slate-200 hover:border-[#0F3D91] focus:border-[#0F3D91] max-w-sm"
        />
      </div>

      {/* Result Metrics */}
      <p className="text-xs text-slate-400 font-medium">
        Showing <span className="font-semibold text-slate-700">{filteredCustomers.length}</span> of {counts.all} customers
        {searchText && (
          <> matching "<span className="text-[#0F3D91] font-semibold">{searchText}</span>"</>
        )}
      </p>

      {/* Data Table */}
      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => setSelectedCustomer(record),
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

// ─── Sub-Component: Customer Detail Panel ───
function CustomerDetail({ customer, onBack, onUpdateStatus }) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      {/* Return Navigation */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D91] border-0 bg-transparent cursor-pointer font-bold font-sans transition-colors focus:outline-none"
        >
          <LeftOutlined style={{ fontSize: '13px' }} />
          Back to Customers list
        </button>
      </div>

      {/* Header Panel */}
      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {customer.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-slate-800 font-sans mb-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {customer.name}
                </h2>
                <StatusBadge status={customer.status} />
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap font-sans font-medium">
                <span className="flex items-center gap-1">
                  <MailOutlined />
                  {customer.email}
                </span>
                <span className="flex items-center gap-1">
                  <PhoneOutlined />
                  {customer.mobile}
                </span>
                <span className="flex items-center gap-1">
                  <EnvironmentOutlined />
                  {customer.city}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarOutlined />
                  Joined {customer.joinDate} · ID: {customer.id}
                </span>
              </div>
            </div>
          </div>

          <div>
            {customer.status === "active" ? (
              <Button
                danger
                icon={<StopOutlined />}
                onClick={() => onUpdateStatus(customer.id, "inactive")}
                className="rounded-xl font-semibold shadow-sm h-10 px-5 font-sans"
              >
                Block Customer
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => onUpdateStatus(customer.id, "active")}
                className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-xl font-semibold shadow-sm h-10 px-5 font-sans"
              >
                Activate Customer
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Overview stats */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Total Orders"
            value={customer.orders.toString()}
            icon={FileTextOutlined}
            color="#0F3D91"
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Total Spend"
            value={`₹${customer.spend.toLocaleString()}`}
            icon={DollarOutlined}
            color="#16A34A"
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Avg per Order"
            value={`₹${Math.round(customer.spend / Math.max(customer.orders, 1)).toLocaleString()}`}
            icon={RiseOutlined}
            color="#F97316"
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Registered Vehicles"
            value="1"
            icon={CarOutlined}
            color="#8B5CF6"
          />
        </Col>
      </Row>

      {/* Tabs Layout */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        className="customer-detail-tabs font-sans"
        items={[
          {
            key: 'profile',
            label: 'Profile Info',
            children: (
              <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
                <h3 className="font-bold text-slate-800 text-base mb-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Personal Information
                </h3>
                <Row gutter={[24, 24]}>
                  {[
                    ["Full Name", customer.name],
                    ["Email Address", customer.email],
                    ["Mobile Number", customer.mobile],
                    ["City", customer.city],
                    ["Member Since", customer.joinDate],
                    ["Account Status", customer.status === "active" ? "Active" : "Blocked"],
                    ["Full Address", customer.address || `${customer.city}, India`]
                  ].map(([k, v]) => (
                    <Col xs={24} sm={12} key={k}>
                      <div className="font-sans border-b border-slate-50 pb-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">{k}</p>
                        <p className="font-semibold text-slate-700 text-sm mb-0 leading-relaxed">{v}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )
          },
          {
            key: 'vehicle',
            label: 'Vehicle Info',
            children: (
              <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
                <h3 className="font-bold text-slate-800 text-base mb-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Vehicle Information
                </h3>
                <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-[#0F3D91] flex items-center justify-center flex-shrink-0">
                    <CarOutlined className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="font-bold text-base text-slate-800 font-mono mb-0.5 leading-none">{customer.vehicle}</p>
                    <p className="text-slate-400 text-xs mb-0 font-sans font-semibold">{customer.brand} {customer.model} · {customer.year}</p>
                  </div>
                </div>
                <Row gutter={[24, 24]}>
                  {[
                    ["Vehicle Plate No", customer.vehicle],
                    ["Brand Name", customer.brand],
                    ["Model Series", customer.model],
                    ["Fuel Category", customer.fuel],
                    ["Manufacturing Year", customer.year.toString()],
                    ["Registration Type", "Passenger Car"]
                  ].map(([k, v]) => (
                    <Col xs={24} sm={12} md={8} key={k}>
                      <div className="font-sans border-b border-slate-50 pb-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">{k}</p>
                        <p className="font-semibold text-slate-700 text-sm mb-0">{v}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )
          },
          {
            key: 'bookings',
            label: 'Booking History',
            children: (
              <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
                <h3 className="font-bold text-slate-800 text-base mb-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Booking Ledger
                </h3>
                <div className="space-y-3">
                  {mockBookings.filter(b => b.customer === customer.name).length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-8 font-sans font-medium">No bookings logged for this customer profile.</p>
                  ) : (
                    mockBookings.filter(b => b.customer === customer.name).map(b => (
                      <div key={b.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-blue-50/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100/60 flex items-center justify-center text-[#0F3D91] font-bold text-sm font-sans flex-shrink-0">
                            {b.service[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-700 text-sm mb-0.5 font-sans">{b.service}</p>
                            <p className="text-xs text-slate-400 font-sans font-semibold mb-1">{b.vendor} · {b.date}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-sans font-medium mb-0">
                              <EnvironmentOutlined />
                              {b.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800 font-sans mb-1">₹{b.amount.toLocaleString()}</p>
                          <StatusBadge status={b.status} />
                          <p className="text-[10px] text-slate-400 font-mono mt-1 mb-0">#{b.id}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )
          },
          {
            key: 'documents',
            label: 'Documents',
            children: (
              <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
                <h3 className="font-bold text-slate-800 text-base mb-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Verification Status
                </h3>
                <Row gutter={[16, 16]}>
                  {["Aadhaar Card", "PAN Card", "Driving License", "Vehicle RC Book", "Insurance Certificate"].map(doc => (
                    <Col xs={24} sm={12} md={8} key={doc}>
                      <div className="border border-slate-100 rounded-2xl p-5 text-center bg-slate-50/50 group hover:bg-slate-50 transition-colors">
                        <FileTextOutlined className="text-slate-300 group-hover:text-[#0F3D91] text-2xl mb-2 transition-colors" />
                        <p className="text-sm font-bold text-slate-700 mb-2 font-sans">{doc}</p>
                        <span className="text-xs text-green-600 font-semibold flex items-center justify-center gap-1 font-sans">
                          <CheckOutlined />
                          Verified
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )
          }
        ]}
      />
    </div>
  );
}
