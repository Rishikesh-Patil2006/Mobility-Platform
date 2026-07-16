import { Card, Select, Button, Row, Col } from 'antd';
import {
  FilePdfOutlined,
  FileExcelOutlined,
  DollarOutlined,
  ShopOutlined,
  TeamOutlined,
  FileTextOutlined,
  PercentageOutlined,
  ToolOutlined,
} from '@ant-design/icons';

// Mock Revenue Data for chart rendering
const revenueData = [
  { month: "Jan", bookings: 312 },
  { month: "Feb", bookings: 341 },
  { month: "Mar", bookings: 298 },
  { month: "Apr", bookings: 456 },
  { month: "May", bookings: 421 },
  { month: "Jun", bookings: 512 },
  { month: "Jul", bookings: 578 },
  { month: "Aug", bookings: 534 },
  { month: "Sep", bookings: 601 },
  { month: "Oct", bookings: 662 },
  { month: "Nov", bookings: 631 },
  { month: "Dec", bookings: 748 },
];

function SimpleCSSBarChart({ data, color, formatValue, height = 200 }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 w-full px-2" style={{ height }}>
      {data.map((d, i) => {
        const barH = max > 0 ? (d.value / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {formatValue(d.value)}
            </div>
            <div className="w-full flex flex-col justify-end" style={{ height: height - 28 }}>
              <div className="w-full rounded-t transition-all duration-300 group-hover:opacity-100"
                style={{ height: `${barH}%`, backgroundColor: color, opacity: 0.8 }} />
            </div>
            <span className="text-[10px] font-semibold text-slate-400 mt-1 font-sans">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ReportsPage() {
  const reportCategories = [
    { title: "Revenue Report", desc: "Monthly and yearly revenue breakdown", icon: DollarOutlined, color: "#0F3D91" },
    { title: "Vendor Report", desc: "Vendor performance and activity", icon: ShopOutlined, color: "#16A34A" },
    { title: "Customer Report", desc: "Customer acquisition and retention", icon: TeamOutlined, color: "#F97316" },
    { title: "Booking Report", desc: "All booking statistics and trends", icon: FileTextOutlined, color: "#8B5CF6" },
    { title: "Commission Report", desc: "Platform commission earned", icon: PercentageOutlined, color: "#EC4899" },
    { title: "Service Report", desc: "Service category performance", icon: ToolOutlined, color: "#EAB308" },
  ];

  return (
    <div className="space-y-6">
      {/* Title Block */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 font-sans tracking-tight mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Reports & Analytics
        </h1>
        <p className="text-slate-400 text-sm mb-0 font-medium">Generate and export platform performance and ledger reports</p>
      </div>

      {/* Grid of Report Download Cards */}
      <Row gutter={[16, 16]}>
        {reportCategories.map(r => {
          const Icon = r.icon;
          return (
            <Col xs={24} sm={12} md={8} key={r.title}>
              <Card
                variant="borderless"
                className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                styles={{ body: { padding: '20px' } }}
              >
                <div className="flex items-start gap-3 mb-5 font-sans">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${r.color}15` }}
                  >
                    <Icon className="text-lg" style={{ color: r.color }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm mb-0.5">{r.title}</h3>
                    <p className="text-xs text-slate-400 font-semibold mb-0 leading-relaxed">{r.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    defaultValue="Dec 2024"
                    className="flex-1 rounded-xl font-sans"
                    size="middle"
                    options={[
                      { value: 'Dec 2024', label: 'December 2024' },
                      { value: 'Nov 2024', label: 'November 2024' },
                      { value: 'Q4 2024', label: 'Q4 2024' },
                      { value: 'Year 2024', label: 'Full Year 2024' },
                    ]}
                  />
                  <Button
                    type="default"
                    icon={<FilePdfOutlined />}
                    size="middle"
                    className="rounded-lg text-slate-600 hover:text-[#0F3D91] hover:border-[#0F3D91] font-sans font-semibold flex items-center justify-center"
                  >
                    PDF
                  </Button>
                  <Button
                    type="text"
                    icon={<FileExcelOutlined />}
                    size="middle"
                    className="rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-sans font-semibold flex items-center justify-center"
                  >
                    CSV
                  </Button>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Booking trends bar chart */}
      <Card
        variant="borderless"
        className="rounded-2xl shadow-sm overflow-hidden"
        styles={{ body: { padding: '24px' } }}
      >
        <h3 className="font-bold text-slate-800 font-sans text-base mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Booking Trends
        </h3>
        <SimpleCSSBarChart
          data={revenueData.map(d => ({ label: d.month, value: d.bookings }))}
          color="#16A34A"
          formatValue={v => v.toLocaleString()}
          height={200}
        />
      </Card>
    </div>
  );
}
