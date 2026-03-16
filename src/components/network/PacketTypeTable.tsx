import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, Radio, Wifi, GitMerge, GitFork, Globe, Server, Mail, Shield, Activity } from 'lucide-react';
import React, { useState } from 'react';

interface PacketDetails {
  packetType: string;
  totalPackets: number;
  packetsPerSecond: number;
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
  icon?: React.ReactNode;
}

interface PacketTypeTableProps {
  packetDetails: PacketDetails[];
  totalPackets: number;
  currentPacketsPerSecond: number;
  metrics?: {
    ip_packets?: number;
    tcp_packets?: number;
    udp_packets?: number;
    icmp_packets?: number;
    dns_queries?: number;
    dhcp_packets?: number;
    http_requests?: number;
    tls_handshakes?: number;
    arp_requests?: number;
  };
}

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// Helper function to format packets per second
const formatRate = (rate: number): string => {
  if (rate >= 1000) return (rate / 1000).toFixed(1) + 'K';
  return rate.toFixed(1);
};

// Get icon based on packet type
const getPacketTypeIcon = (packetType: string, className?: string) => {
  const icons: Record<string, React.ReactNode> = {
    'Broadcast': <Radio className={className} />,
    'Unicast': <Wifi className={className} />,
    'ARP Requests': <GitMerge className={className} />,
    'ARP Replies': <GitFork className={className} />,
    'IP Packets': <Globe className={className} />,
    'TCP Packets': <Server className={className} />,
    'UDP Packets': <Activity className={className} />,
    'ICMP Packets': <Shield className={className} />,
    'DNS Queries': <Globe className={className} />,
    'DHCP Packets': <Mail className={className} />,
    'HTTP Requests': <Globe className={className} />,
    'TLS Handshakes': <Shield className={className} />
  };
  return icons[packetType] || <Activity className={className} />;
};

// Get badge color based on packet type
const getBadgeColor = (packetType: string): string => {
  const colors: Record<string, string> = {
    'Broadcast': 'bg-purple-50 text-purple-700 border-purple-200',
    'Unicast': 'bg-blue-50 text-blue-700 border-blue-200',
    'ARP Requests': 'bg-amber-50 text-amber-700 border-amber-200',
    'ARP Replies': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'IP Packets': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'TCP Packets': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'UDP Packets': 'bg-sky-50 text-sky-700 border-sky-200',
    'ICMP Packets': 'bg-rose-50 text-rose-700 border-rose-200',
    'DNS Queries': 'bg-violet-50 text-violet-700 border-violet-200',
    'DHCP Packets': 'bg-orange-50 text-orange-700 border-orange-200',
    'HTTP Requests': 'bg-pink-50 text-pink-700 border-pink-200',
    'TLS Handshakes': 'bg-teal-50 text-teal-700 border-teal-200'
  };
  return colors[packetType] || 'bg-slate-50 text-slate-700 border-slate-200';
};

// Get progress bar color
const getProgressBarColor = (packetType: string): string => {
  const colors: Record<string, string> = {
    'Broadcast': 'bg-purple-500',
    'Unicast': 'bg-blue-500',
    'ARP Requests': 'bg-amber-500',
    'ARP Replies': 'bg-emerald-500',
    'IP Packets': 'bg-indigo-500',
    'TCP Packets': 'bg-cyan-500',
    'UDP Packets': 'bg-sky-500',
    'ICMP Packets': 'bg-rose-500',
    'DNS Queries': 'bg-violet-500',
    'DHCP Packets': 'bg-orange-500',
    'HTTP Requests': 'bg-pink-500',
    'TLS Handshakes': 'bg-teal-500'
  };
  return colors[packetType] || 'bg-slate-500';
};

// Get trend indicator
const getTrendIndicator = (trend?: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <span className="text-green-600 text-sm">↑</span>;
    case 'down':
      return <span className="text-red-600 text-sm">↓</span>;
    default:
      return <span className="text-slate-400 text-sm">→</span>;
  }
};

const PacketTypeTable: React.FC<PacketTypeTableProps> = ({ 
  packetDetails, 
  totalPackets,
  currentPacketsPerSecond,
  metrics 
}) => {
  const [sortField, setSortField] = useState<'totalPackets' | 'packetsPerSecond' | 'percentage'>('totalPackets');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Create advanced packet details from metrics
  const advancedPacketDetails: PacketDetails[] = [];
  
  if (metrics) {
    // Only add items if they have values > 0
    const advancedTypes = [
      { type: 'TCP Packets', value: metrics.tcp_packets },
      { type: 'UDP Packets', value: metrics.udp_packets },
      { type: 'ICMP Packets', value: metrics.icmp_packets },
      { type: 'DNS Queries', value: metrics.dns_queries },
      { type: 'DHCP Packets', value: metrics.dhcp_packets },
      { type: 'HTTP Requests', value: metrics.http_requests },
      { type: 'TLS Handshakes', value: metrics.tls_handshakes }
    ];

    advancedTypes.forEach(({ type, value }) => {
      if (value && value > 0) {
        advancedPacketDetails.push({
          packetType: type,
          totalPackets: value,
          packetsPerSecond: value / 10, // Calculate rate
          percentage: totalPackets > 0 ? Number(((value / totalPackets) * 100).toFixed(1)) : 0,
        });
      }
    });
  }

  // Combine basic and advanced packet details based on showAdvanced state
  const allPacketDetails = showAdvanced 
    ? [...packetDetails, ...advancedPacketDetails]
    : packetDetails;


    console.log('Metrics:', metrics);
console.log('Advanced Packet Details:', advancedPacketDetails);

  const sortedDetails = [...allPacketDetails].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    if (sortField === 'totalPackets') {
      return (a.totalPackets - b.totalPackets) * multiplier;
    }
    if (sortField === 'packetsPerSecond') {
      return (a.packetsPerSecond - b.packetsPerSecond) * multiplier;
    }
    if (sortField === 'percentage') {
      return (a.percentage - b.percentage) * multiplier;
    }
    return 0;
  });

  const handleSort = (field: 'totalPackets' | 'packetsPerSecond' | 'percentage') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (!packetDetails.length && !advancedPacketDetails.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Packet Type Distribution</CardTitle>
          <CardDescription>Breakdown of network packets by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            No packet data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Packet Type Distribution</CardTitle>
            <CardDescription>Breakdown of network packets by type</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm">
              Total: {formatNumber(totalPackets)} packets
            </Badge>
            <Badge variant="outline" className="text-sm bg-blue-50">
              {formatRate(currentPacketsPerSecond)} pps
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs text-slate-500">Broadcast</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatNumber(packetDetails.find(d => d.packetType === 'Broadcast')?.totalPackets || 0)}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs text-slate-500">Unicast</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatNumber(packetDetails.find(d => d.packetType === 'Unicast')?.totalPackets || 0)}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs text-slate-500">ARP Total</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatNumber((packetDetails.find(d => d.packetType === 'ARP Requests')?.totalPackets || 0) + 
                           (packetDetails.find(d => d.packetType === 'ARP Replies')?.totalPackets || 0))}
            </p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs text-slate-500">IP Packets</p>
            <p className="text-lg font-semibold text-slate-900">
              {formatNumber(metrics?.ip_packets || 0)}
            </p>
          </div>
        </div>

        {/* Toggle for advanced view */}
        {advancedPacketDetails.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {showAdvanced ? '▼ Hide advanced packet types' : '▶ Show advanced packet types'}
            </button>
            {!showAdvanced && (
              <span className="ml-2 text-xs text-slate-500">
                ({advancedPacketDetails.length} additional types available)
              </span>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Packet Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-900"
                    onClick={() => handleSort('totalPackets')}
                  >
                    Total Packets
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-900"
                    onClick={() => handleSort('packetsPerSecond')}
                  >
                    Packets/Sec
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">
                  <button 
                    className="flex items-center gap-1 hover:text-slate-900"
                    onClick={() => handleSort('percentage')}
                  >
                    % of Total
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {sortedDetails.map((detail, index) => {
                const barWidth = (detail.percentage / 100) * 100;
                
                return (
                  <tr 
                    key={index} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getPacketTypeIcon(detail.packetType, 'h-4 w-4 text-slate-600')}
                        <span className="text-sm font-medium text-slate-900">
                          {detail.packetType}
                        </span>
                        {detail.trend && (
                          <span className="ml-1">{getTrendIndicator(detail.trend)}</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-slate-900">
                        {formatNumber(detail.totalPackets)}
                      </span>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-900 font-medium">
                          {formatRate(detail.packetsPerSecond)}
                        </span>
                        <span className="text-xs text-slate-500">pps</span>
                      </div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <Badge 
                        variant="outline"
                        className={getBadgeColor(detail.packetType)}
                      >
                        {detail.percentage}%
                      </Badge>
                    </td>
                    
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${getProgressBarColor(detail.packetType)}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {detail.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            
            {/* Summary Row */}
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td className="py-3 px-4 text-sm font-medium text-slate-700">Total</td>
                <td className="py-3 px-4 text-sm font-bold text-slate-900">
                  {formatNumber(totalPackets)}
                </td>
                <td className="py-3 px-4 text-sm text-slate-700">
                  {formatRate(currentPacketsPerSecond)} pps
                </td>
                <td className="py-3 px-4 text-sm text-slate-700">100%</td>
                <td className="py-3 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-slate-600">Broadcast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-slate-600">Unicast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-slate-600">ARP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-xs text-slate-600">IP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span className="text-xs text-slate-600">TCP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-500"></div>
            <span className="text-xs text-slate-600">UDP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500"></div>
            <span className="text-xs text-slate-600">DNS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-slate-600">DHCP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span className="text-xs text-slate-600">HTTP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-500"></div>
            <span className="text-xs text-slate-600">TLS</span>
          </div>
        </div>

        {/* Insights based on actual data */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600">
            <span className="font-medium">Network Analysis:</span>{' '}
            {metrics?.dhcp_packets && metrics.dhcp_packets > 100 
              ? 'High DHCP traffic detected. Multiple devices requesting IP addresses.'
              : metrics?.tcp_packets && metrics.udp_packets && metrics.tcp_packets > metrics.udp_packets
              ? 'TCP traffic dominates. Connection-oriented communication prevalent.'
              : metrics?.udp_packets && metrics.tcp_packets && metrics.udp_packets > metrics.tcp_packets
              ? 'UDP traffic dominates. Streaming or real-time applications active.'
              : 'Network traffic pattern normal.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PacketTypeTable;