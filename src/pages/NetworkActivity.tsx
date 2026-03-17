import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Activity,
  Wifi,
  Radio,
  TrendingUp,
  TrendingDown,
  Clock,
  Laptop,
  Smartphone,
  Printer,
  Cpu,
  Server,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// TypeScript Interfaces
interface MetricCardData {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

interface TrafficDataPoint {
  time: string;
  packets: number;
  arpRequests: number;
  arpReplies: number;
}

interface DeviceActivity {
  id: string;
  name: string;
  ip: string;
  type: 'laptop' | 'mobile' | 'printer' | 'iot' | 'network';
  packetsSent: number;
  packetsReceived: number;
  activityLevel: 'low' | 'medium' | 'high';
  lastActive: string;
}

interface ActivityEvent {
  id: string;
  type: 'active' | 'idle' | 'spike' | 'load_change';
  message: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface TrafficDistribution {
  broadcast: number;
  unicast: number;
}

// Mock Data Generation
const generateTrafficData = (points: number): TrafficDataPoint[] => {
  const data: TrafficDataPoint[] = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      packets: Math.floor(Math.random() * 500) + 800,
      arpRequests: Math.floor(Math.random() * 50) + 20,
      arpReplies: Math.floor(Math.random() * 45) + 18
    });
  }
  
  return data;
};

const mockDeviceActivities: DeviceActivity[] = [
  {
    id: '1',
    name: 'MacBook-Pro-Admin',
    ip: '192.168.1.15',
    type: 'laptop',
    packetsSent: 45823,
    packetsReceived: 52341,
    activityLevel: 'high',
    lastActive: '1 minute ago'
  },
  {
    id: '2',
    name: 'Galaxy-S24',
    ip: '192.168.1.23',
    type: 'mobile',
    packetsSent: 23456,
    packetsReceived: 28934,
    activityLevel: 'medium',
    lastActive: '3 minutes ago'
  },
  {
    id: '3',
    name: 'Dell-Workstation',
    ip: '192.168.1.135',
    type: 'laptop',
    packetsSent: 38721,
    packetsReceived: 41567,
    activityLevel: 'high',
    lastActive: '30 seconds ago'
  },
  {
    id: '4',
    name: 'RaspberryPi-IoT',
    ip: '192.168.1.67',
    type: 'iot',
    packetsSent: 12345,
    packetsReceived: 11234,
    activityLevel: 'medium',
    lastActive: '2 minutes ago'
  },
  {
    id: '5',
    name: 'iPhone-14',
    ip: '192.168.1.89',
    type: 'mobile',
    packetsSent: 18934,
    packetsReceived: 21456,
    activityLevel: 'medium',
    lastActive: '5 minutes ago'
  },
  {
    id: '6',
    name: 'LaserJet-Pro',
    ip: '192.168.1.45',
    type: 'printer',
    packetsSent: 3456,
    packetsReceived: 4123,
    activityLevel: 'low',
    lastActive: '15 minutes ago'
  },
  {
    id: '7',
    name: 'Smart-Thermostat',
    ip: '192.168.1.178',
    type: 'iot',
    packetsSent: 5678,
    packetsReceived: 5234,
    activityLevel: 'low',
    lastActive: '8 minutes ago'
  },
  {
    id: '8',
    name: 'ThinkPad-Lab-02',
    ip: '192.168.1.102',
    type: 'laptop',
    packetsSent: 8234,
    packetsReceived: 9123,
    activityLevel: 'low',
    lastActive: '1 hour ago'
  }
];

const mockActivityEvents: ActivityEvent[] = [
  {
    id: '1',
    type: 'active',
    message: 'Dell-Workstation (192.168.1.135) became active',
    timestamp: '2 minutes ago',
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />
  },
  {
    id: '2',
    type: 'spike',
    message: 'ARP traffic spike detected - 145 requests/min',
    timestamp: '5 minutes ago',
    icon: <TrendingUp className="h-4 w-4 text-blue-600" />
  },
  {
    id: '3',
    type: 'idle',
    message: 'ThinkPad-Lab-02 (192.168.1.102) went idle',
    timestamp: '12 minutes ago',
    icon: <AlertCircle className="h-4 w-4 text-yellow-600" />
  },
  {
    id: '4',
    type: 'load_change',
    message: 'Network load changed from Low to Medium',
    timestamp: '18 minutes ago',
    icon: <Activity className="h-4 w-4 text-slate-600" />
  },
  {
    id: '5',
    type: 'active',
    message: 'Galaxy-S24 (192.168.1.23) became active',
    timestamp: '25 minutes ago',
    icon: <CheckCircle2 className="h-4 w-4 text-green-600" />
  }
];

// Helper Functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getDeviceIcon = (type: DeviceActivity['type'], className?: string) => {
  const icons = {
    laptop: <Laptop className={className} />,
    mobile: <Smartphone className={className} />,
    printer: <Printer className={className} />,
    iot: <Cpu className={className} />,
    network: <Server className={className} />
  };
  return icons[type] || <Server className={className} />;
};

// Components
const ActivityMetricCard: React.FC<MetricCardData> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  trendValue 
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
      <div className="text-slate-400">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
      {trend && trendValue && (
        <div className={`flex items-center mt-2 text-xs ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-600'
        }`}>
          {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
          {trendValue}
        </div>
      )}
    </CardContent>
  </Card>
);

const TrafficLineChart: React.FC<{ data: TrafficDataPoint[]; title: string; description: string }> = ({ 
  data, 
  title, 
  description 
}) => {
  const width = 800;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxPackets = Math.max(...data.map(d => d.packets));
  const minPackets = Math.min(...data.map(d => d.packets));

  const scaleY = (value: number) => {
    return graphHeight - ((value - minPackets) / (maxPackets - minPackets)) * graphHeight;
  };

  const scaleX = (index: number) => {
    return (index / (data.length - 1)) * graphWidth;
  };

  const path = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(d.packets)}`)
    .join(' ');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <g key={i}>
                <line
                  x1={0}
                  y1={graphHeight * ratio}
                  x2={graphWidth}
                  y2={graphHeight * ratio}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />
                <text
                  x={-10}
                  y={graphHeight * ratio + 5}
                  textAnchor="end"
                  className="text-xs fill-slate-500"
                >
                  {Math.round(maxPackets - (maxPackets - minPackets) * ratio)}
                </text>
              </g>
            ))}

            {/* Chart line */}
            <path
              d={path}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
            />

            {/* Data points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={scaleX(i)}
                cy={scaleY(d.packets)}
                r={3}
                fill="#3b82f6"
              />
            ))}

            {/* X-axis labels */}
            {[0, Math.floor(data.length / 2), data.length - 1].map(i => (
              <text
                key={i}
                x={scaleX(i)}
                y={graphHeight + 25}
                textAnchor="middle"
                className="text-xs fill-slate-500"
              >
                {data[i]?.time || ''}
              </text>
            ))}

            {/* Axis labels */}
            <text
              x={graphWidth / 2}
              y={graphHeight + 35}
              textAnchor="middle"
              className="text-xs fill-slate-600 font-medium"
            >
              Time
            </text>
            <text
              x={-graphHeight / 2}
              y={-45}
              textAnchor="middle"
              transform="rotate(-90)"
              className="text-xs fill-slate-600 font-medium"
            >
              Packets per Second
            </text>
          </g>
        </svg>
      </CardContent>
    </Card>
  );
};

const ARPActivityChart: React.FC<{ data: TrafficDataPoint[] }> = ({ data }) => {
  const width = 800;
  const height = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(
    ...data.map(d => Math.max(d.arpRequests, d.arpReplies))
  );

  const scaleY = (value: number) => {
    return graphHeight - (value / maxValue) * graphHeight;
  };

  const scaleX = (index: number) => {
    return (index / (data.length - 1)) * graphWidth;
  };

  const requestsPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(d.arpRequests)}`)
    .join(' ');

  const repliesPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i)} ${scaleY(d.arpReplies)}`)
    .join(' ');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>ARP Activity Breakdown</CardTitle>
            <CardDescription>Requests vs Replies over time</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-slate-600">Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded"></div>
              <span className="text-sm text-slate-600">Replies</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <g key={i}>
                <line
                  x1={0}
                  y1={graphHeight * ratio}
                  x2={graphWidth}
                  y2={graphHeight * ratio}
                  stroke="#e2e8f0"
                  strokeWidth={1}
                />
                <text
                  x={-10}
                  y={graphHeight * ratio + 5}
                  textAnchor="end"
                  className="text-xs fill-slate-500"
                >
                  {Math.round(maxValue * (1 - ratio))}
                </text>
              </g>
            ))}

            {/* ARP Requests line */}
            <path
              d={requestsPath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={2}
            />

            {/* ARP Replies line */}
            <path
              d={repliesPath}
              fill="none"
              stroke="#10b981"
              strokeWidth={2}
            />

            {/* X-axis labels */}
            {[0, Math.floor(data.length / 2), data.length - 1].map(i => (
              <text
                key={i}
                x={scaleX(i)}
                y={graphHeight + 25}
                textAnchor="middle"
                className="text-xs fill-slate-500"
              >
                {data[i]?.time || ''}
              </text>
            ))}
          </g>
        </svg>
      </CardContent>
    </Card>
  );
};

const TrafficDistributionChart: React.FC<{ distribution: TrafficDistribution }> = ({ distribution }) => {
  const total = distribution.broadcast + distribution.unicast;
  const broadcastPercent = (distribution.broadcast / total) * 100;
  const unicastPercent = (distribution.unicast / total) * 100;

  const radius = 80;
  const centerX = 120;
  const centerY = 120;
  const innerRadius = 50;

  const broadcastAngle = (broadcastPercent / 100) * 360;
  const unicastAngle = (unicastPercent / 100) * 360;

  const createArc = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const start = (startAngle - 90) * (Math.PI / 180);
    const end = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + outerR * Math.cos(start);
    const y1 = centerY + outerR * Math.sin(start);
    const x2 = centerX + outerR * Math.cos(end);
    const y2 = centerY + outerR * Math.sin(end);
    const x3 = centerX + innerR * Math.cos(end);
    const y3 = centerY + innerR * Math.sin(end);
    const x4 = centerX + innerR * Math.cos(start);
    const y4 = centerY + innerR * Math.sin(start);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Distribution</CardTitle>
        <CardDescription>Broadcast vs Unicast traffic</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <svg width="240" height="240" viewBox="0 0 240 240">
            {/* Unicast (larger portion) */}
            <path
              d={createArc(0, unicastAngle, radius, innerRadius)}
              fill="#3b82f6"
            />
            {/* Broadcast */}
            <path
              d={createArc(unicastAngle, 360, radius, innerRadius)}
              fill="#10b981"
            />
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              className="text-xl font-bold fill-slate-900"
            >
              {total}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              className="text-xs fill-slate-500"
            >
              Total Packets
            </text>
          </svg>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 bg-blue-500 rounded"></div>
                <span className="text-sm font-medium text-slate-900">Unicast</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{unicastPercent.toFixed(1)}%</div>
              <p className="text-xs text-slate-500 mt-1">{formatNumber(distribution.unicast)} packets</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 bg-green-500 rounded"></div>
                <span className="text-sm font-medium text-slate-900">Broadcast</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{broadcastPercent.toFixed(1)}%</div>
              <p className="text-xs text-slate-500 mt-1">{formatNumber(distribution.broadcast)} packets</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DeviceActivityTable: React.FC<{ devices: DeviceActivity[] }> = ({ devices }) => {
  const [sortField, setSortField] = useState<'packetsSent' | 'packetsReceived' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedDevices = [...devices].sort((a, b) => {
    if (!sortField) return 0;
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  const handleSort = (field: 'packetsSent' | 'packetsReceived') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Activity</CardTitle>
        <CardDescription>Network traffic by device</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Device</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">IP Address</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-900"
                    onClick={() => handleSort('packetsSent')}
                  >
                    Packets Sent
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-900"
                    onClick={() => handleSort('packetsReceived')}
                  >
                    Packets Received
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Activity Level</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {sortedDevices.map((device) => (
                <tr 
                  key={device.id} 
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type, 'h-4 w-4 text-slate-600')}
                      <span className="text-sm font-medium text-slate-900">{device.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 font-mono">{device.ip}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 capitalize">{device.type}</td>
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{formatNumber(device.packetsSent)}</td>
                  <td className="py-3 px-4 text-sm text-slate-900 font-medium">{formatNumber(device.packetsReceived)}</td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant="outline"
                      className={
                        device.activityLevel === 'high'
                          ? 'border-green-300 text-green-700 bg-green-50'
                          : device.activityLevel === 'medium'
                          ? 'border-blue-300 text-blue-700 bg-blue-50'
                          : 'border-slate-300 text-slate-700 bg-slate-50'
                      }
                    >
                      {device.activityLevel}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-500">{device.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivityEventFeed: React.FC<{ events: ActivityEvent[] }> = ({ events }) => (
  <Card>
    <CardHeader>
      <CardTitle>Activity Timeline</CardTitle>
      <CardDescription>Recent network events and changes</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
            <div className="mt-0.5">{event.icon}</div>
            <div className="flex-1">
              <p className="text-sm text-slate-900">{event.message}</p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const InsightsPanel: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Network Insights</CardTitle>
      <CardDescription>Automated observations from activity analysis</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
          <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-900">Network usage is higher than usual</p>
            <p className="text-xs text-slate-600 mt-1">Activity increased by 23% compared to yesterday</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-900">Most active device: MacBook-Pro-Admin</p>
            <p className="text-xs text-slate-600 mt-1">Generated 45.8K packets sent in the last hour</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
          <Activity className="h-5 w-5 text-slate-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-900">ARP activity is stable</p>
            <p className="text-xs text-slate-600 mt-1">Request/reply ratio within normal range</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Main Network Activity Page Component
const NetworkActivityPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('1h');
  const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>([]);
  const [currentPacketsPerSecond, setCurrentPacketsPerSecond] = useState(1243);

  useEffect(() => {
    // Initialize data based on time range
    const points = timeRange === '5m' ? 5 : timeRange === '1h' ? 12 : 24;
    setTrafficData(generateTrafficData(points));
  }, [timeRange]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPacketsPerSecond(prev => {
        const change = Math.floor(Math.random() * 100) - 50;
        return Math.max(800, Math.min(1500, prev + change));
      });

      setTrafficData(prev => {
        const newPoint: TrafficDataPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          packets: Math.floor(Math.random() * 500) + 800,
          arpRequests: Math.floor(Math.random() * 50) + 20,
          arpReplies: Math.floor(Math.random() * 45) + 18
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

<<<<<<< Updated upstream
  const handleRefresh = () => {
    const points = timeRange === '5m' ? 5 : timeRange === '1h' ? 12 : 24;
    setTrafficData(generateTrafficData(points));
  };
=======
  // Handle refresh button click
  // const handleRefresh = () => {
  //   refreshData();
  //   setLastUpdated(new Date().toLocaleTimeString());
  // };
>>>>>>> Stashed changes

  const trafficDistribution: TrafficDistribution = {
    broadcast: 145000,
    unicast: 982000
  };

  const activeDevices = mockDeviceActivities.filter(d => d.activityLevel !== 'low').length;
  const avgArpRate = trafficData.length > 0 
    ? Math.round(trafficData.reduce((sum, d) => sum + d.arpRequests, 0) / trafficData.length)
    : 87;

  const metricsData: MetricCardData[] = [
    {
      title: 'Packets per Second',
      value: formatNumber(currentPacketsPerSecond),
      description: 'Current network throughput',
      icon: <Activity className="h-4 w-4" />,
      trend: 'up',
      trendValue: '+12% from baseline'
    },
    {
      title: 'Active Devices',
      value: activeDevices,
      description: 'Currently transmitting',
      icon: <Wifi className="h-4 w-4" />,
      trend: 'stable',
      trendValue: 'No change'
    },
    {
      title: 'ARP Requests Rate',
      value: `${avgArpRate}/min`,
      description: 'Address resolution activity',
      icon: <Radio className="h-4 w-4" />,
      trend: 'stable',
      trendValue: 'Within normal range'
    },
    {
      title: 'Broadcast Traffic',
      value: `${((trafficDistribution.broadcast / (trafficDistribution.broadcast + trafficDistribution.unicast)) * 100).toFixed(1)}%`,
      description: 'Of total network traffic',
      icon: <Radio className="h-4 w-4" />,
      trend: 'down',
      trendValue: '-2% from average'
    },
    {
      title: 'Unicast Traffic',
      value: `${((trafficDistribution.unicast / (trafficDistribution.broadcast + trafficDistribution.unicast)) * 100).toFixed(1)}%`,
      description: 'Direct device communication',
      icon: <Activity className="h-4 w-4" />,
      trend: 'up',
      trendValue: '+2% from average'
    },
    {
      title: 'Network Load',
      value: 'Medium',
      description: 'Overall utilization status',
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'stable',
      trendValue: 'Stable'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Network Activity</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time and historical LAN traffic insights</p>
        </div>
        
<<<<<<< Updated upstream
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
=======
        {/* <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
>>>>>>> Stashed changes
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">Last 5 minutes</SelectItem>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div> */}
      </div>

      <Separator />

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricsData.map((metric, idx) => (
          <ActivityMetricCard key={idx} {...metric} />
        ))}
      </div>

      {/* Traffic Trends Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficLineChart 
            data={trafficData}
            title="Packet Rate Over Time"
            description="Network throughput trends"
          />
        </div>
        
        <div>
          <TrafficDistributionChart distribution={trafficDistribution} />
        </div>
      </div>

      {/* ARP Activity Chart */}
      <ARPActivityChart data={trafficData} />

      {/* Device Activity Table */}
      <DeviceActivityTable devices={mockDeviceActivities} />

      {/* Bottom Section: Activity Feed and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityEventFeed events={mockActivityEvents} />
        <InsightsPanel />
      </div>
    </div>
  );
};

export default NetworkActivityPage;