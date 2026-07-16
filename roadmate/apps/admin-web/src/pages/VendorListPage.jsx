import { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Tabs,
  Card,
  Alert,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  StarFilled,
  PhoneOutlined,
  MailOutlined,
  LeftOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  DollarOutlined,
  CalendarOutlined,
  CompassOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import KpiCard from '../components/common/KpiCard';
import StatusBadge from '../components/common/StatusBadge';

// Complete mock data set from Figma reference
const initialVendors = [
  { id:"V001", name:"Rajesh Kumar",    business:"Kumar Auto Works",          mobile:"9876543210", city:"Mumbai",    area:"Andheri",       address:"12, MG Road, Andheri East, Mumbai - 400069",      service:"Garage",           rating:4.8, bookings:342, revenue:284000, status:"active",    email:"rajesh@kumar.com",    age:38, gender:"Male",   gst:"27AAPFU0939F1ZV", pan:"AAPFU0939F", aadhaar:"XXXX-XXXX-4521", account:"42156897031", ifsc:"HDFC0001234", upi:"rajesh@hdfcbank",  joinDate:"Jan 15, 2023" },
  { id:"V002", name:"Suresh Mehta",    business:"Mehta Towing Services",     mobile:"9765432109", city:"Pune",      area:"Wakad",         address:"45, Hinjewadi Road, Wakad, Pune - 411057",        service:"Towing",           rating:4.5, bookings:198, revenue:176000, status:"pending",   email:"suresh@mehta.com",    age:42, gender:"Male",   gst:"27AAPFU0939F1ZW", pan:"BAPFU0839F", aadhaar:"XXXX-XXXX-7832", account:"53267908042", ifsc:"ICIC0002345", upi:"suresh@icici",     joinDate:"Mar 3, 2024"  },
  { id:"V003", name:"Priya Sharma",    business:"Shine Car Wash",            mobile:"9654321098", city:"Bangalore", area:"Koramangala",   address:"8, 80 Feet Rd, Koramangala 4th Block, BLR - 560034",service:"Car Wash",        rating:4.9, bookings:521, revenue:312000, status:"active",    email:"priya@shine.com",     age:31, gender:"Female", gst:"29AAPFU0939F1ZX", pan:"CAPFU0739F", aadhaar:"XXXX-XXXX-2341", account:"64378019031", ifsc:"AXIS0003456", upi:"priya@axisbank",   joinDate:"Feb 10, 2023" },
  { id:"V004", name:"Amit Patel",      business:"Patel Garage & Service",    mobile:"9543210987", city:"Ahmedabad", area:"Navrangpura",   address:"22, CG Road, Navrangpura, Ahmedabad - 380009",     service:"Garage",           rating:4.2, bookings:167, revenue:148000, status:"suspended", email:"amit@patel.com",      age:45, gender:"Male",   gst:"24AAPFU0939F1ZY", pan:"DAPFU0639F", aadhaar:"XXXX-XXXX-6543", account:"75489120045", ifsc:"SBI0004567",  upi:"amit@sbi",         joinDate:"Jun 20, 2023" },
  { id:"V005", name:"Kavitha Nair",    business:"Nair Battery Solutions",    mobile:"9432109876", city:"Hyderabad", area:"Banjara Hills", address:"15, Road No 12, Banjara Hills, Hyderabad - 500034", service:"Service Center",  rating:4.7, bookings:289, revenue:234000, status:"active",    email:"kavitha@nair.com",    age:35, gender:"Female", gst:"36AAPFU0939F1ZZ", pan:"EAPFU0539F", aadhaar:"XXXX-XXXX-9087", account:"86590231035", ifsc:"KOTAK0005678",upi:"kavitha@kotak",    joinDate:"Apr 5, 2023"  },
  { id:"V006", name:"Mohammed Ali",    business:"Ali PUC Center",            mobile:"9321098765", city:"Chennai",   area:"T. Nagar",      address:"3, Usman Road, T. Nagar, Chennai - 600017",        service:"PUC",              rating:4.6, bookings:445, revenue:198000, status:"pending",   email:"ali@puc.com",         age:39, gender:"Male",   gst:"33AAPFU0939F1ZA", pan:"FAPFU0439F", aadhaar:"XXXX-XXXX-3456", account:"97601342039", ifsc:"BOB0006789",  upi:"ali@bob",          joinDate:"Jul 11, 2024" },
  { id:"V007", name:"Deepika Reddy",   business:"Reddy Battery Hub",         mobile:"9210987654", city:"Hyderabad", area:"Gachibowli",    address:"Plot 42, HITEC City, Gachibowli, Hyderabad - 500032",service:"Service Center", rating:4.4, bookings:213, revenue:187000, status:"active",    email:"deepika@reddy.com",   age:33, gender:"Female", gst:"36BAPFU0239F1ZB", pan:"GAPFU0339F", aadhaar:"XXXX-XXXX-1122", account:"11223344033", ifsc:"HDFC0007890", upi:"deepika@hdfc",     joinDate:"Aug 8, 2023"  },
  { id:"V008", name:"Sanjay Verma",    business:"Verma Tyre & Wheel",        mobile:"9109876543", city:"Delhi",     area:"Dwarka",        address:"Block 7, Sector 10, Dwarka, New Delhi - 110075",   service:"Garage",           rating:4.3, bookings:178, revenue:156000, status:"active",    email:"sanjay@verma.com",    age:47, gender:"Male",   gst:"07CAPFU0139F1ZC", pan:"HAPFU0239F", aadhaar:"XXXX-XXXX-3344", account:"22334455047", ifsc:"PNB0008901",  upi:"sanjay@pnb",       joinDate:"Sep 14, 2023" },
  { id:"V009", name:"Anitha Krishnan", business:"Krishnan Denting Studio",   mobile:"9098765432", city:"Chennai",   area:"Adyar",         address:"24, LB Road, Adyar, Chennai - 600020",             service:"Denting & Painting",rating:4.7,bookings:134, revenue:198000, status:"active",    email:"anitha@krishnan.com", age:36, gender:"Female", gst:"33DAPFU0039F1ZD", pan:"IAPFU0139F", aadhaar:"XXXX-XXXX-5566", account:"33445566036", ifsc:"ICIC0009012", upi:"anitha@icici",     joinDate:"Oct 2, 2023"  },
  { id:"V010", name:"Ravi Shankar",    business:"Shankar Insurance Point",   mobile:"8987654321", city:"Bangalore", area:"Whitefield",    address:"Shop 5, ITPL Main Rd, Whitefield, BLR - 560066",   service:"Service Center",   rating:4.6, bookings:89,  revenue:567000, status:"active",    email:"ravi@shankar.com",    age:50, gender:"Male",   gst:"29EAPFU9939F1ZE", pan:"JAPFU0039F", aadhaar:"XXXX-XXXX-7788", account:"44556677050", ifsc:"AXIS0010123", upi:"ravi@axis",        joinDate:"Nov 17, 2022" },
];

export default function VendorListPage() {
  const [vendorsList, setVendorsList] = useState(initialVendors);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCredentials, setNewCredentials] = useState(null);

  const [form] = Form.useForm();

  // Helper count status logic
  const getCounts = () => {
    return {
      all: vendorsList.length,
      active: vendorsList.filter((v) => v.status === "active").length,
      pending: vendorsList.filter((v) => v.status === "pending").length,
      suspended: vendorsList.filter((v) => v.status === "suspended").length,
    };
  };

  const counts = getCounts();

  const handleUpdateStatus = (id, newStatus) => {
    const updated = vendorsList.map((v) =>
      v.id === id ? { ...v, status: newStatus } : v
    );
    setVendorsList(updated);
    if (selectedVendor && selectedVendor.id === id) {
      setSelectedVendor({ ...selectedVendor, status: newStatus });
    }
    message.success(`Vendor status updated to ${newStatus}`);
  };

  const handleAddVendorSubmit = (values) => {
    const generatedId = `V0${vendorsList.length + 1}`;
    const generatedPassword = `pwd-${Math.random().toString(36).substring(2, 8)}`;
    
    const newVendor = {
      ...values,
      id: generatedId,
      rating: 0,
      bookings: 0,
      revenue: 0,
      status: 'pending',
      joinDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setVendorsList([newVendor, ...vendorsList]);
    setShowAddModal(false);
    form.resetFields();

    // Show credential modal
    setNewCredentials({
      vendorName: newVendor.name,
      email: newVendor.email,
      password: generatedPassword,
    });
  };

  const handleCopyCredentials = () => {
    const text = `Email: ${newCredentials.email}\nPassword: ${newCredentials.password}`;
    navigator.clipboard.writeText(text).then(() => {
      message.success("Credentials copied to clipboard!");
    });
  };

  // Filter logic
  const filteredVendors = vendorsList.filter((v) => {
    const matchStatus = filterStatus === "all" || v.status === filterStatus;
    const s = searchText.toLowerCase();
    const matchSearch =
      !s ||
      v.name.toLowerCase().includes(s) ||
      v.business.toLowerCase().includes(s) ||
      v.mobile.includes(s) ||
      v.city.toLowerCase().includes(s) ||
      v.area.toLowerCase().includes(s) ||
      v.service.toLowerCase().includes(s) ||
      v.email.toLowerCase().includes(s);
    return matchStatus && matchSearch;
  });

  // Ant Design Table Columns for list view
  const columns = [
    {
      title: '#',
      key: 'idx',
      render: (_, __, idx) => <span className="font-mono text-slate-400 text-xs">{idx + 1}</span>,
    },
    {
      title: 'Vendor',
      key: 'vendor',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0F3D91] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {record.name[0]}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm mb-0.5 font-sans">{record.name}</p>
            <p className="text-[10px] text-slate-400 mb-0 font-sans">{record.id} · {record.gender}, {record.age}y</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Business / Service',
      key: 'business',
      render: (_, record) => (
        <div>
          <p className="font-semibold text-slate-700 text-sm mb-0.5 font-sans">{record.business}</p>
          <p className="text-xs text-slate-400 mb-0 font-sans">{record.service}</p>
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
      title: 'Location',
      key: 'location',
      render: (_, record) => (
        <div>
          <p className="text-sm text-slate-700 font-sans mb-0.5">{record.city}</p>
          <p className="text-xs text-slate-400 font-sans mb-0">{record.area}</p>
        </div>
      ),
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_, record) => (
        <span className="flex items-center gap-1 text-amber-500 font-bold text-sm font-sans">
          <StarFilled className="text-xs" />
          {record.rating > 0 ? record.rating : "New"}
        </span>
      ),
    },
    {
      title: 'Bookings',
      dataIndex: 'bookings',
      key: 'bookings',
      className: 'font-mono text-slate-700 text-sm',
    },
    {
      title: 'Revenue',
      key: 'revenue',
      className: 'font-mono text-slate-700 text-sm',
      render: (_, record) => <span>₹{record.revenue >= 1000 ? `${(record.revenue / 1000).toFixed(0)}K` : record.revenue}</span>,
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
        <div className="flex gap-1 flex-wrap" onClick={(e) => e.stopPropagation()}>
          <Button
            type="primary"
            onClick={() => setSelectedVendor(record)}
            size="small"
            className="bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] hover:border-[#0c3278] rounded-lg text-xs font-semibold"
          >
            View
          </Button>
          {record.status === "pending" && (
            <>
              <Button
                type="primary"
                onClick={() => handleUpdateStatus(record.id, "active")}
                size="small"
                className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-lg text-xs font-semibold"
              >
                Approve
              </Button>
            </>
          )}
          {record.status === "active" && (
            <Button
              danger
              onClick={() => handleUpdateStatus(record.id, "suspended")}
              size="small"
              className="rounded-lg text-xs font-semibold"
            >
              Suspend
            </Button>
          )}
          {record.status === "suspended" && (
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

  // Return to list view handler
  const handleBackToList = () => {
    setSelectedVendor(null);
  };

  if (selectedVendor) {
    return <VendorDetail vendor={selectedVendor} onBack={handleBackToList} onUpdateStatus={handleUpdateStatus} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-sans tracking-tight mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Vendor Management
          </h1>
          <p className="text-slate-400 text-sm mb-0 font-medium">{counts.all} total vendors registered across all zones</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddModal(true)}
          className="bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] hover:border-[#0c3278] h-10 px-5 rounded-xl font-semibold shadow-sm font-sans"
        >
          Add Vendor
        </Button>
      </div>

      {/* Overview Cards Row */}
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Total Vendors"
            value={counts.all.toString()}
            icon={GlobalOutlined}
            color="#0F3D91"
            onClick={() => setFilterStatus("all")}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Active Vendors"
            value={counts.active.toString()}
            icon={CheckCircleOutlined}
            color="#16A34A"
            onClick={() => setFilterStatus("active")}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Pending Approval"
            value={counts.pending.toString()}
            icon={CalendarOutlined}
            color="#EAB308"
            onClick={() => setFilterStatus("pending")}
          />
        </Col>
        <Col xs={12} sm={12} md={6}>
          <KpiCard
            label="Suspended"
            value={counts.suspended.toString()}
            icon={StopOutlined}
            color="#F97316"
            onClick={() => setFilterStatus("suspended")}
          />
        </Col>
      </Row>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
          {["all", "active", "pending", "suspended"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border-0 focus:outline-none cursor-pointer ${
                filterStatus === s
                  ? "bg-white text-[#0F3D91] shadow-sm"
                  : "text-slate-600 hover:text-slate-800 bg-transparent"
              }`}
            >
              {s} <span className="ml-1 text-[10px] opacity-60 font-mono">({counts[s]})</span>
            </button>
          ))}
        </div>
        <Input
          prefix={<SearchOutlined className="text-slate-400 mr-1" />}
          placeholder="Search by name, city, service, mobile…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          size="large"
          className="rounded-xl border-slate-200 hover:border-[#0F3D91] focus:border-[#0F3D91] max-w-sm"
        />
      </div>

      {/* Result metrics */}
      <p className="text-xs text-slate-400 font-medium">
        Showing <span className="font-semibold text-slate-700">{filteredVendors.length}</span> of {counts.all} vendors
        {searchText && (
          <> matching "<span className="text-[#0F3D91] font-semibold">{searchText}</span>"</>
        )}
      </p>

      {/* Primary Paginated Data Table */}
      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: 0 } }}>
        <Table
          columns={columns}
          dataSource={filteredVendors}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => setSelectedVendor(record),
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

      {/* Form Dialog: Add Vendor Modal */}
      <Modal
        title={<span className="text-lg font-bold text-slate-800 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Add New Vendor</span>}
        open={showAddModal}
        onCancel={() => {
          setShowAddModal(false);
          form.resetFields();
        }}
        footer={null}
        width={720}
        destroyOnHidden
        className="rounded-2xl overflow-hidden font-sans"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddVendorSubmit}
          className="mt-4"
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</span>}
                name="name"
                rules={[{ required: true, message: 'Please enter vendor full name!' }]}
              >
                <Input placeholder="John Doe" className="rounded-xl py-2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Business Name</span>}
                name="business"
                rules={[{ required: true, message: 'Please enter business name!' }]}
              >
                <Input placeholder="Doe Services Ltd" className="rounded-xl py-2" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mobile Number</span>}
                name="mobile"
                rules={[
                  { required: true, message: 'Please enter mobile number!' },
                  { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit number!' }
                ]}
              >
                <Input placeholder="9876543210" className="rounded-xl py-2" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</span>}
                name="email"
                rules={[
                  { required: true, message: 'Please enter email address!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input placeholder="john@example.com" className="rounded-xl py-2" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">City</span>}
                name="city"
                rules={[{ required: true, message: 'Please select city!' }]}
              >
                <Select placeholder="Select City" className="rounded-xl h-10 select-py-1">
                  <Select.Option value="Mumbai">Mumbai</Select.Option>
                  <Select.Option value="Pune">Pune</Select.Option>
                  <Select.Option value="Bangalore">Bangalore</Select.Option>
                  <Select.Option value="Ahmedabad">Ahmedabad</Select.Option>
                  <Select.Option value="Hyderabad">Hyderabad</Select.Option>
                  <Select.Option value="Chennai">Chennai</Select.Option>
                  <Select.Option value="Delhi">Delhi</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Area / Suburb</span>}
                name="area"
                rules={[{ required: true, message: 'Please enter area!' }]}
              >
                <Input placeholder="Andheri East / Wakad" className="rounded-xl py-2" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Service Category</span>}
                name="service"
                rules={[{ required: true, message: 'Please select service type!' }]}
              >
                <Select placeholder="Select Service" className="rounded-xl h-10">
                  <Select.Option value="Garage">Garage</Select.Option>
                  <Select.Option value="Towing">Towing</Select.Option>
                  <Select.Option value="Car Wash">Car Wash</Select.Option>
                  <Select.Option value="PUC">PUC</Select.Option>
                  <Select.Option value="Service Center">Service Center</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Age</span>}
                name="age"
                rules={[{ required: true, message: 'Required!' }]}
              >
                <Input type="number" placeholder="32" className="rounded-xl py-2" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gender</span>}
                name="gender"
                rules={[{ required: true, message: 'Required!' }]}
              >
                <Select placeholder="Gender" className="rounded-xl h-10">
                  <Select.Option value="Male">Male</Select.Option>
                  <Select.Option value="Female">Female</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Address</span>}
            name="address"
            rules={[{ required: true, message: 'Please enter full business address!' }]}
          >
            <Input.TextArea rows={3} placeholder="Flat / Shop No, Street, Landmark, PIN Code" className="rounded-xl" />
          </Form.Item>

          <div className="flex gap-2 justify-end mt-6">
            <Button
              onClick={() => {
                setShowAddModal(false);
                form.resetFields();
              }}
              size="large"
              className="rounded-xl hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] hover:border-[#0c3278] rounded-xl font-semibold px-6 shadow-sm"
            >
              Add Vendor
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Generated Credentials Callback Dialog */}
      <Modal
        title={<span className="text-lg font-bold text-slate-800 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Vendor Account Created</span>}
        open={newCredentials !== null}
        onCancel={() => setNewCredentials(null)}
        footer={[
          <Button key="close" onClick={() => setNewCredentials(null)} size="large" className="rounded-xl">
            Close
          </Button>,
          <Button key="copy" type="primary" onClick={handleCopyCredentials} size="large" className="bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] rounded-xl font-semibold shadow-sm">
            Copy Credentials
          </Button>
        ]}
        width={480}
        destroyOnHidden
        className="rounded-2xl overflow-hidden font-sans"
      >
        {newCredentials && (
          <div className="mt-4 space-y-4">
            <Alert
              message="Vendor profile registered in database with a status of 'Pending Approval'."
              type="success"
              showIcon
              className="rounded-xl"
            />
            <p className="text-slate-500 text-sm">
              Copy and share these credentials with <strong>{newCredentials.vendorName}</strong> to enable portal login.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-sm space-y-2">
              <div>
                <span className="text-slate-400">Email:</span> <span className="font-semibold text-slate-800">{newCredentials.email}</span>
              </div>
              <div>
                <span className="text-slate-400">Password:</span> <span className="font-semibold text-slate-800">{newCredentials.password}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Sub-Component: Vendor Detailed Screen ───
function VendorDetail({ vendor, onBack, onUpdateStatus }) {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="space-y-6">
      {/* Navigation Return Hook */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D91] border-0 bg-transparent cursor-pointer font-bold font-sans transition-colors focus:outline-none"
        >
          <LeftOutlined style={{ fontSize: '13px' }} />
          Back to Vendors list
        </button>
      </div>

      {/* Header Info Block Card */}
      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0F3D91] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {vendor.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-slate-800 font-sans mb-0" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {vendor.name}
                </h2>
                <StatusBadge status={vendor.status} />
              </div>
              <p className="text-slate-500 mt-1 text-sm font-sans font-medium mb-0">
                {vendor.business} · {vendor.service} · {vendor.city}, {vendor.area}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap font-sans font-medium">
                <span className="flex items-center gap-1">
                  <PhoneOutlined />
                  {vendor.mobile}
                </span>
                <span className="flex items-center gap-1">
                  <MailOutlined />
                  {vendor.email}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <StarFilled />
                  {vendor.rating > 0 ? `${vendor.rating} rating` : "New Profile"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {vendor.status === "pending" && (
              <>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => onUpdateStatus(vendor.id, "active")}
                  className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-xl font-semibold shadow-sm h-10 px-5 font-sans"
                >
                  Approve
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => onUpdateStatus(vendor.id, "rejected")}
                  className="rounded-xl font-semibold shadow-sm h-10 px-5 font-sans"
                >
                  Reject
                </Button>
              </>
            )}
            {vendor.status === "active" && (
              <Button
                danger
                icon={<StopOutlined />}
                onClick={() => onUpdateStatus(vendor.id, "suspended")}
                className="rounded-xl font-semibold shadow-sm h-10 px-5 font-sans"
              >
                Suspend
              </Button>
            )}
            {vendor.status === "suspended" && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => onUpdateStatus(vendor.id, "active")}
                className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-xl font-semibold shadow-sm h-10 px-5 font-sans"
              >
                Activate
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Ant Design Tabs for Modular Details */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        className="vendor-detail-tabs font-sans"
        items={[
          {
            key: 'personal',
            label: 'Personal',
            children: (
              <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
                <h3 className="font-bold text-slate-800 text-base mb-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Personal Details
                </h3>
                <Row gutter={[24, 24]}>
                  {[
                    ["Full Name", vendor.name],
                    ["Gender", vendor.gender],
                    ["Age", `${vendor.age} years`],
                    ["Mobile", vendor.mobile],
                    ["Email", vendor.email],
                    ["City & Area", `${vendor.city}, ${vendor.area}`],
                    ["Full Address", vendor.address || `${vendor.area}, ${vendor.city}`],
                    ["Member Since", vendor.joinDate || "—"]
                  ].map(([k, v]) => (
                    <Col xs={24} sm={12} md={8} key={k}>
                      <div className="font-sans">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{k}</p>
                        <p className="font-semibold text-slate-700 text-sm mb-0 leading-relaxed whitespace-pre-line">{v}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )
          },
          {
            key: 'business',
            label: 'Business',
            children: (
              <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
                <h3 className="font-bold text-slate-800 text-base mb-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Business Details
                </h3>
                <Row gutter={[24, 24]}>
                  {[
                    ["Business Name", vendor.business],
                    ["Service Type", vendor.service],
                    ["GST Number", vendor.gst || "—"],
                    ["PAN Number", vendor.pan || "—"],
                    ["Aadhaar", vendor.aadhaar || "—"],
                    ["Service Area", vendor.area]
                  ].map(([k, v]) => (
                    <Col xs={24} sm={12} md={8} key={k}>
                      <div className="font-sans">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{k}</p>
                        <p className="font-semibold text-slate-700 text-sm font-mono mb-0">{v}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )
          },
          {
            key: 'documents',
            label: 'Documents',
            children: (
              <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
                <h3 className="font-bold text-slate-800 text-base mb-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Verification Documents
                </h3>
                <Row gutter={[16, 16]}>
                  {["Aadhaar Card", "PAN Card", "GST Certificate", "Business License"].map(doc => (
                    <Col xs={24} sm={12} md={6} key={doc}>
                      <div className="border-2 border-dashed border-slate-200 hover:border-[#0F3D91] rounded-2xl p-6 text-center transition-colors group">
                        <FileTextOutlined className="text-slate-300 group-hover:text-[#0F3D91] text-3xl mb-3 transition-colors" />
                        <p className="text-sm font-bold text-slate-700 mb-4 font-sans">{doc}</p>
                        <Button
                          type="dashed"
                          size="small"
                          className="rounded-lg font-sans font-semibold border-slate-200 hover:border-[#0F3D91] hover:text-[#0F3D91]"
                        >
                          View Document
                        </Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )
          },
          {
            key: 'bank',
            label: 'Bank details',
            children: (
              <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
                <h3 className="font-bold text-slate-800 text-base mb-6 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Bank Details
                </h3>
                <Row gutter={[24, 24]}>
                  {[
                    ["Account Holder", vendor.name],
                    ["Account Number", vendor.account || "—"],
                    ["IFSC Code", vendor.ifsc || "—"],
                    ["UPI ID", vendor.upi || "—"],
                    ["Bank Name", "HDFC Bank"],
                    ["Branch", "Andheri West Branch"]
                  ].map(([k, v]) => (
                    <Col xs={24} sm={12} md={8} key={k}>
                      <div className="font-sans">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{k}</p>
                        <p className="font-semibold text-slate-700 text-sm font-mono mb-0">{v}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )
          },
          {
            key: 'performance',
            label: 'Performance',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={12} md={6}>
                  <KpiCard
                    label="Total Bookings"
                    value={vendor.bookings.toString()}
                    icon={CalendarOutlined}
                    color="#0F3D91"
                  />
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <KpiCard
                    label="Revenue Generated"
                    value={`₹${vendor.revenue >= 1000 ? `${(vendor.revenue / 1000).toFixed(0)}K` : vendor.revenue}`}
                    icon={DollarOutlined}
                    color="#16A34A"
                  />
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <KpiCard
                    label="Average Rating"
                    value={vendor.rating > 0 ? vendor.rating.toString() : "New"}
                    icon={StarFilled}
                    color="#EAB308"
                  />
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <KpiCard
                    label="Completion Rate"
                    value={vendor.bookings > 0 ? "94%" : "100%"}
                    icon={CheckCircleOutlined}
                    color="#8B5CF6"
                  />
                </Col>
              </Row>
            )
          },
          {
            key: 'location',
            label: 'Add Location',
            children: <AddLocationTab vendor={vendor} />
          }
        ]}
      />
    </div>
  );
}

// ─── Sub-Component: Add Location Tab (Nominatim OS Map logic) ───
function AddLocationTab({ vendor }) {
  const [locState, setLocState] = useState("idle");
  const [coords, setCoords] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [locError, setLocError] = useState("");

  const vendorAddress = vendor.address || (vendor.area && vendor.city ? `${vendor.area}, ${vendor.city}` : null);

  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      const a = data.address || {};
      const parts = [
        a.suburb || a.neighbourhood || a.quarter || a.road,
        a.city || a.town || a.village || a.county,
        a.state,
        a.country,
      ].filter(Boolean);
      return parts.join(",\n") || data.display_name || "Address not available";
    } catch {
      return "Address not available";
    }
  }

  function handleGetLocation() {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser.");
      setLocState("error");
      return;
    }
    setLocState("loading");
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        const addr = await reverseGeocode(lat, lng);
        setCurrentAddress(addr);
        setLocState("success");
      },
      (err) => {
        const msgs = {
          1: "Location permission denied. Please allow access in your browser settings.",
          2: "Location unavailable. Please try again.",
          3: "Request timed out. Please try again.",
        };
        setLocError(msgs[err.code] || "Unable to retrieve your location.");
        setLocState("error");
      },
      { timeout: 10000 }
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Vendor Profile Address */}
      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <EnvironmentOutlined className="text-[#0F3D91] text-sm" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-0 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Registered Address
          </h3>
        </div>
        {vendorAddress ? (
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4">
            <p className="text-sm text-slate-600 leading-relaxed font-semibold font-sans mb-0 whitespace-pre-line">
              {vendorAddress}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic mb-0 font-sans">No address documented in profile</p>
        )}
      </Card>

      {/* Fetch Geolocation Block */}
      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <GlobalOutlined className="text-[#0F3D91] text-sm" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm mb-0 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Map Coordinates Alignment
          </h3>
        </div>

        {locState === "idle" && (
          <p className="text-sm text-slate-400 italic mb-6 font-sans">Current location not retrieved yet.</p>
        )}

        {locState === "loading" && (
          <div className="flex items-center gap-3 py-4 mb-6">
            <div className="w-5 h-5 border-2 border-[#0F3D91] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium mb-0 font-sans">Resolving coordinates with GPS satellites…</p>
          </div>
        )}

        {locState === "error" && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm text-red-600 mb-0 font-sans font-medium">{locError}</p>
          </div>
        )}

        {locState === "success" && coords && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 mb-6 space-y-3 font-sans">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Latitude</p>
                <p className="font-mono font-bold text-slate-700 text-sm mb-0">{coords.lat.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Longitude</p>
                <p className="font-mono font-bold text-slate-700 text-sm mb-0">{coords.lng.toFixed(6)}</p>
              </div>
            </div>
            {currentAddress && (
              <div className="pt-3 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Resolved Address</p>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold whitespace-pre-line mb-0">{currentAddress}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button
            type="primary"
            icon={<CompassOutlined className="text-xs" />}
            onClick={handleGetLocation}
            disabled={locState === "loading"}
            className="bg-[#0F3D91] hover:bg-[#0d3580] border-[#0F3D91] rounded-xl font-sans font-semibold h-10 px-5 shadow-sm"
          >
            {locState === "loading" ? "Aligning GPS…" : "Retrieve Current Location"}
          </Button>
          {locState === "success" && coords && (
            <Button
              onClick={() => window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, "_blank")}
              className="rounded-xl font-sans font-semibold border-slate-200 h-10 px-5 shadow-sm"
            >
              Open in Google Maps
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
