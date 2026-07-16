import { useState } from 'react';
import { Card, Button, Input, Form, Select, Switch, Row, Col, message } from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  SafetyOutlined,
  CreditCardOutlined,
  PercentageOutlined,
  DollarOutlined,
  ToolOutlined,
  EnvironmentOutlined,
  BellOutlined,
  FileTextOutlined,
  StarOutlined,
  ArrowRightOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  LayoutOutlined,
  ReloadOutlined,
  HistoryOutlined,
  AlertOutlined,
  ApiOutlined,
  MessageOutlined,
  AppstoreOutlined,
  SearchOutlined,
  LeftOutlined,
  SaveOutlined,
} from '@ant-design/icons';

// Mock settings categories matching Figma references
const settingCategories = [
  { id: "general", title: "General Settings", desc: "Platform name, timezone, language, currency", icon: SettingOutlined, color: "#0F3D91" },
  { id: "user-roles", title: "User & Role Settings", desc: "Roles, permissions and admin users", icon: UserOutlined, color: "#8B5CF6" },
  { id: "security", title: "Security Settings", desc: "2FA, password policy, IP whitelist", icon: SafetyOutlined, color: "#DC2626" },
  { id: "payment", title: "Payment Settings", desc: "Gateways, UPI, cards, wallets", icon: CreditCardOutlined, color: "#16A34A" },
  { id: "commission", title: "Commission Settings", desc: "Global & service-wise commission rates", icon: PercentageOutlined, color: "#F97316" },
  { id: "settlement", title: "Settlement Settings", desc: "Auto settlement, cycle, hold period", icon: DollarOutlined, color: "#EAB308" },
  { id: "service", title: "Service Settings", desc: "Enable/disable services, pricing limits", icon: ToolOutlined, color: "#06B6D4" },
  { id: "location", title: "Location Settings", desc: "States, cities, areas & service zones", icon: EnvironmentOutlined, color: "#16A34A", badge: "28 states" },
  { id: "notification", title: "Notification Settings", desc: "Email, SMS, push alerts configuration", icon: BellOutlined, color: "#F97316" },
  { id: "document", title: "Document Settings", desc: "Required docs per vendor type", icon: FileTextOutlined, color: "#6366F1" },
  { id: "review", title: "Review Settings", desc: "Ratings moderation & display rules", icon: StarOutlined, color: "#EAB308" },
  { id: "referral", title: "Referral Settings", desc: "Referral bonuses and limits", icon: ArrowRightOutlined, color: "#EC4899" },
  { id: "loyalty", title: "Loyalty Settings", desc: "Points per booking, redemption rules", icon: RiseOutlined, color: "#0F3D91" },
  { id: "ai", title: "AI Settings", desc: "Smart recommendations & auto-assign", icon: ThunderboltOutlined, color: "#8B5CF6", badge: "Beta" },
  { id: "seo", title: "SEO Settings", desc: "Meta tags, sitemap, robots.txt", icon: GlobalOutlined, color: "#16A34A" },
  { id: "appearance", title: "Appearance Settings", desc: "Theme colors, logo, fonts", icon: LayoutOutlined, color: "#F97316" },
  { id: "backup", title: "Backup Settings", desc: "Auto backups, export & restore", icon: ReloadOutlined, color: "#06B6D4" },
  { id: "audit", title: "Audit Logs", desc: "All admin actions and system events", icon: HistoryOutlined, color: "#64748B" },
  { id: "fraud", title: "Fraud Management", desc: "Detection rules and flagged accounts", icon: AlertOutlined, color: "#DC2626" },
  { id: "api", title: "API Integrations", desc: "Third-party APIs and webhook setup", icon: ApiOutlined, color: "#0F3D91" },
  { id: "support", title: "Support Settings", desc: "Helpdesk, live chat, ticket system", icon: MessageOutlined, color: "#16A34A" },
  { id: "multi-city", title: "Multi-City Settings", desc: "City expansion and zone management", icon: AppstoreOutlined, color: "#8B5CF6", badge: "8 cities" },
];

export default function SettingsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Search filter
  const filtered = settingCategories.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (selectedCategory) {
    return <SettingDetail category={selectedCategory} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-sans tracking-tight mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Platform Settings
          </h1>
          <p className="text-slate-400 text-sm mb-0 font-medium">Configure every aspect of your MobilityPlatform</p>
        </div>
        <Input
          prefix={<SearchOutlined className="text-slate-400 mr-1" />}
          placeholder="Search settings category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          size="large"
          className="rounded-xl border-slate-200 hover:border-[#0F3D91] focus:border-[#0F3D91] max-w-sm"
        />
      </div>

      {/* Quick Shortcuts */}
      <div className="flex flex-wrap gap-2">
        {["Payment Gateway", "Commission %", "OTP / 2FA", "Settlement Cycle", "Add City"].map((s) => (
          <button
            key={s}
            onClick={() => {
              const matched = settingCategories.find(c => c.title.toLowerCase().includes(s.split(" ")[0].toLowerCase()));
              if (matched) {
                setSelectedCategory(matched);
              } else {
                message.info(`Opening shortcut context: ${s}`);
              }
            }}
            className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:text-[#0F3D91] hover:border-[#0f3d91]/30 hover:bg-blue-50/20 transition-all cursor-pointer focus:outline-none"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid of Settings categories */}
      <Row gutter={[16, 16]}>
        {filtered.map((cat) => {
          const Icon = cat.icon;
          return (
            <Col xs={24} sm={12} md={8} key={cat.id}>
              <button
                onClick={() => setSelectedCategory(cat)}
                className="w-full bg-white rounded-2xl border border-slate-100 p-5 text-left hover:shadow-md hover:border-blue-200 transition-all duration-200 group cursor-pointer focus:outline-none"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    <Icon className="text-lg" style={{ color: cat.color }} />
                  </div>
                  {cat.badge && (
                    <span className="px-2 py-0.5 bg-blue-50/70 border border-blue-100 text-blue-700 rounded-full text-[10px] font-bold font-sans">
                      {cat.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1 font-sans group-hover:text-[#0F3D91] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mb-0 leading-relaxed font-sans">
                  {cat.desc}
                </p>
              </button>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

// ─── Sub-Component: Settings details dynamic form ───
function SettingDetail({ category, onBack }) {
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success(`${category.title} saved successfully`);
    onBack();
  };

  const getFields = () => {
    switch (category.id) {
      case 'general':
        return (
          <>
            <Form.Item label="Platform Name" name="platformName" initialValue="Roadmate Superadmin">
              <Input placeholder="Enter platform name" className="rounded-xl py-2" />
            </Form.Item>
            <Form.Item label="System Timezone" name="timezone" initialValue="Asia/Kolkata">
              <Select placeholder="Select Timezone" className="rounded-xl h-10">
                <Select.Option value="Asia/Kolkata">Asia/Kolkata (IST)</Select.Option>
                <Select.Option value="UTC">UTC (GMT)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Base Currency Symbol" name="currency" initialValue="INR">
              <Select placeholder="Select Currency" className="rounded-xl h-10">
                <Select.Option value="INR">INR (₹)</Select.Option>
                <Select.Option value="USD">USD ($)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Language Interface" name="lang" initialValue="en">
              <Select placeholder="Select Language" className="rounded-xl h-10">
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="hi">Hindi</Select.Option>
              </Select>
            </Form.Item>
          </>
        );

      case 'commission':
        return (
          <>
            <Form.Item label="Global Platform Commission (%)" name="platformCommission" initialValue={10}>
              <Input type="number" suffix="%" className="rounded-xl py-2" />
            </Form.Item>
            <Form.Item label="Auto Hold Settlements Period" name="holdPeriod" initialValue={7}>
              <Select placeholder="Hold Period" className="rounded-xl h-10">
                <Select.Option value="3">3 Days Hold</Select.Option>
                <Select.Option value="7">7 Days Hold</Select.Option>
                <Select.Option value="14">14 Days Hold</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Minimum Settlement Release Threshold" name="minRelease" initialValue={500}>
              <Input type="number" prefix="₹" className="rounded-xl py-2" />
            </Form.Item>
          </>
        );

      default:
        // Generic fallback fields
        return (
          <>
            <Form.Item label="Configuration Value / Key" name="key1" initialValue="Enabled">
              <Input placeholder="Enter value" className="rounded-xl py-2" />
            </Form.Item>
            <Form.Item label="Status Mode Toggle" name="toggle1" valuePropName="checked" initialValue={true}>
              <Switch checkedChildren="Active" unCheckedChildren="Disabled" />
            </Form.Item>
            <Form.Item label="Automatic Database Synchronization" name="sync" valuePropName="checked" initialValue={true}>
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Return button */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0F3D91] border-0 bg-transparent cursor-pointer font-bold font-sans transition-colors focus:outline-none"
        >
          <LeftOutlined style={{ fontSize: '13px' }} />
          Back to settings Directory
        </button>
      </div>

      <Card variant="borderless" className="rounded-2xl shadow-sm overflow-hidden" styles={{ body: { padding: '24px' } }}>
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <category.icon className="text-lg" style={{ color: category.color }} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-sans mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {category.title}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mb-0 leading-relaxed font-sans">{category.desc}</p>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          requiredMark={false}
          className="max-w-lg font-sans"
        >
          {getFields()}

          <div className="pt-4 border-t border-slate-100 flex gap-2">
            <Button
              onClick={onBack}
              size="large"
              className="rounded-xl hover:bg-slate-50 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              className="bg-[#0F3D91] hover:bg-[#0c3278] border-[#0F3D91] hover:border-[#0c3278] rounded-xl font-semibold shadow-sm flex items-center justify-center px-6"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
