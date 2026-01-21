import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Monitor, 
  Activity, 
  FileText, 
  Settings, 
  ChevronLeft,
  Bell,
  User,
  Server,
  Wifi,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Radio,
  Menu
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// TypeScript Interfaces
interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  vendor: string;
  type: string;
  status: 'active' | 'idle';
  lastSeen: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

interface Event {
  id: string;
  type: 'join' | 'leave' | 'reassign' | 'inactive';
  message: string;
  timestamp: string;
  icon: React.ReactNode;
}

// Mock Data
const mockDevices: Device[] = [
  {
    id: '1',
    name: 'MacBook-Pro-Admin',
    ip: '192.168.1.15',
    mac: '00:1B:63:84:45:E6',
    vendor: 'Apple',
    type: 'Laptop',
    status: 'active',
    lastSeen: '2 minutes ago'
  },
  {
    id: '2',
    name: 'Galaxy-S24',
    ip: '192.168.1.23',
    mac: '5C:F9:DD:5A:12:3F',
    vendor: 'Samsung',
    type: 'Mobile',
    status: 'active',
    lastSeen: '5 minutes ago'
  },
  {
    id: '3',
    name: 'LaserJet-Pro',
    ip: '192.168.1.45',
    mac: '00:1E:C9:3A:78:B2',
    vendor: 'HP',
    type: 'Printer',
    status: 'idle',
    lastSeen: '1 hour ago'
  },
  {
    id: '4',
    name: 'RaspberryPi-IoT',
    ip: '192.168.1.67',
    mac: 'B8:27:EB:4C:91:2D',
    vendor: 'Raspberry Pi',
    type: 'IoT Device',
    status: 'active',
    lastSeen: '10 seconds ago'
  },
  {
    id: '5',
    name: 'Cisco-Switch-01',
    ip: '192.168.1.1',
    mac: '00:1A:A1:F2:34:B8',
    vendor: 'Cisco',
    type: 'Network Device',
    status: 'active',
    lastSeen: '1 minute ago'
  },
  {
    id: '6',
    name: 'iPhone-14',
    ip: '192.168.1.89',
    mac: '00:1C:B3:09:85:15',
    vendor: 'Apple',
    type: 'Mobile',
    status: 'active',
    lastSeen: '3 minutes ago'
  },
  {
    id: '7',
    name: 'ThinkPad-Lab-02',
    ip: '192.168.1.102',
    mac: '54:EE:75:2A:67:D9',
    vendor: 'Lenovo',
    type: 'Laptop',
    status: 'idle',
    lastSeen: '2 hours ago'
  }
];

const mockEvents: Event[] = [
  {
    id: '1',
    type: 'join',
    message: 'New device connected – 192.168.1.23 (Galaxy-S24)',
    timestamp: '2 minutes ago',
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />
  },
  {
    id: '2',
    type: 'inactive',
    message: 'Device became inactive – 192.168.1.102 (ThinkPad-Lab-02)',
    timestamp: '1 hour ago',
    icon: <AlertCircle className="h-4 w-4 text-yellow-600" />
  },
  {
    id: '3',
    type: 'reassign',
    message: 'IP address reassigned – 192.168.1.89 to iPhone-14',
    timestamp: '3 hours ago',
    icon: <Radio className="h-4 w-4 text-blue-600" />
  },
  {
    id: '4',
    type: 'leave',
    message: 'Device disconnected – 192.168.1.156',
    timestamp: '5 hours ago',
    icon: <AlertCircle className="h-4 w-4 text-gray-600" />
  }
];

// Components
const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
      <div className="text-slate-400">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
      {trend && (
        <div className="flex items-center mt-2 text-xs text-green-600">
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend}
        </div>
      )}
    </CardContent>
  </Card>
);

const DeviceTable: React.FC<{ devices: Device[] }> = ({ devices }) => (
  <Card>
    <CardHeader>
      <CardTitle>Connected Devices</CardTitle>
      <CardDescription>Currently monitored devices on the network</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Device Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">IP Address</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">MAC Address</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Vendor</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr 
                key={device.id} 
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-medium text-slate-900">{device.name}</td>
                <td className="py-3 px-4 text-sm text-slate-600 font-mono">{device.ip}</td>
                <td className="py-3 px-4 text-sm text-slate-600 font-mono">{device.mac}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{device.vendor}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{device.type}</td>
                <td className="py-3 px-4">
                  <Badge 
                    variant={device.status === 'active' ? 'default' : 'secondary'}
                    className={device.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}
                  >
                    {device.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-slate-500">{device.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Showing {devices.length} of {devices.length} devices</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Previous</button>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const NetworkCharts: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>ARP Requests per Minute</CardTitle>
        <CardDescription>Network resolution activity over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded">
          <div className="text-center text-slate-400">
            <Activity className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">Line chart visualization</p>
            <p className="text-xs">Peak: 145 req/min at 14:30</p>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Broadcast vs Unicast Traffic</CardTitle>
        <CardDescription>Traffic distribution analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center bg-slate-50 rounded">
          <div className="text-center text-slate-400">
            <Radio className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">Donut chart visualization</p>
            <p className="text-xs">Unicast: 87% | Broadcast: 13%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const EventFeed: React.FC<{ events: Event[] }> = ({ events }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Events</CardTitle>
      <CardDescription>Network activity and operational changes</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
            <div className="mt-0.5">{event.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-slate-900">{event.message}</p>
              <p className="text-xs text-slate-500 mt-1">{event.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeDevices = mockDevices.filter(d => d.status === 'active').length;
  const idleDevices = mockDevices.filter(d => d.status === 'idle').length;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={`bg-slate-900 text-slate-100 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          {!sidebarCollapsed && <span className="font-semibold">LAN Monitor</span>}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-slate-800 rounded"
          >
            {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        
        <nav className="p-2 space-y-1">
          {[
            { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', active: true },
            { icon: <Monitor className="h-5 w-5" />, label: 'Devices', active: false },
            { icon: <Activity className="h-5 w-5" />, label: 'Network Activity', active: false },
            { icon: <FileText className="h-5 w-5" />, label: 'Reports', active: false },
            { icon: <Settings className="h-5 w-5" />, label: 'Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                item.active 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-900">LAN Network Monitor</h1>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded text-sm text-slate-700">
              <Server className="h-4 w-4" />
              <span>Mininet Lab</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-blue-600 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-slate-100 rounded">
              <User className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Devices"
              value={activeDevices}
              description="Currently connected"
              icon={<Wifi className="h-4 w-4" />}
              trend="+2 from yesterday"
            />
            <MetricCard
              title="New Devices (Today)"
              value={2}
              description="First-time connections"
              icon={<Server className="h-4 w-4" />}
            />
            <MetricCard
              title="Inactive Devices"
              value={idleDevices}
              description="No recent activity"
              icon={<AlertCircle className="h-4 w-4" />}
            />
            <MetricCard
              title="Network Status"
              value="Healthy"
              description="All systems operational"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              title="ARP Traffic Rate"
              value="87 req/min"
              description="Current resolution activity"
              icon={<Activity className="h-4 w-4" />}
            />
            <MetricCard
              title="Broadcast Ratio"
              value="13%"
              description="Of total network traffic"
              icon={<Radio className="h-4 w-4" />}
            />
          </div>

          {/* Device Table */}
          <DeviceTable devices={mockDevices} />

          {/* Network Charts */}
          <NetworkCharts />

          {/* Event Feed */}
          <EventFeed events={mockEvents} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;