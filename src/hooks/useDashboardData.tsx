import { mapDevice, mapEvent } from "@/lib/mappers";
import { Activity } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { connectWebSocket, disconnectWebSocket, isWebSocketConnected } from "../services/websocket";

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  vendor: string;
  type: string;
  status: "active" | "idle";
  lastSeen: string;
}

export interface Event {
  id: string;
  type: "join" | "leave" | "reassign" | "inactive" | "metric";
  message: string;
  timestamp: string;
  icon?: React.ReactNode;
  payload?: any;
}

export interface Metrics {
  totalDevices: number;
  activeDevices: number;
  dataSent: number;
  dataReceived: number;
  broadcastPackets: number;
  unicastPackets: number;
  arpRequests: number;
  arpReplies: number;
}

export const useDashboardData = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState<Metrics>({
    totalDevices: 0,
    activeDevices: 0,
    dataSent: 0,
    dataReceived: 0,
    broadcastPackets: 0,
    unicastPackets: 0,
    arpRequests: 0,
    arpReplies: 0,
  });

  // Track previous metric for ARP rate calculation
  const prevArpRef = useRef<{ arpRequests: number; timestamp: number } | null>(null);
  const [arpRate, setArpRate] = useState<number>(0);

  useEffect(() => {
    connectWebSocket((data: any) => {
      setIsConnected(true);

      // DEVICE_JOINED: Add new device
      if (data.type === "TOPOLOGY" && data.subtype === "DEVICE_JOINED") {
        const device = mapDevice(data.payload.device);
        const event = mapEvent(data);

        setDevices((prev) =>
          prev.some((d) => d.id === device.id)
            ? prev
            : [{ ...device, status: "active", lastSeen: new Date().toISOString()}, ...prev]
        );

        setEvents((prev) => [event, ...prev]);
      }

      // DEVICE_LEFT: Mark device as idle
      if (data.type === "TOPOLOGY" && data.subtype === "DEVICE_LEFT") {
        const deviceId = data.payload.device.device_id;
        const event = mapEvent(data);

        setDevices((prev) =>
          prev.map((d) =>
            d.id === deviceId
              ? { ...d, status: "idle", lastSeen: new Date().toISOString() }
              : d
          )
        );

        setEvents((prev) => [event, ...prev]);
      }

      // METRIC update
      if (data.type === "METRIC" && data.subtype === "PERIODIC_METRIC_STATE") {
        const m = data.payload.metrics;
        const metricTime = new Date(m.measure_time || data.meta.timestamp).getTime();

        setMetrics({
          totalDevices: m.total_devices,
          activeDevices: m.active_devices,
          dataSent: m.data_sent,
          dataReceived: m.data_received,
          broadcastPackets: m.total_broadcast_packets,
          unicastPackets: m.total_unicast_packets,
          arpRequests: m.arp_requests,
          arpReplies: m.arp_replies,
        });

        if (prevArpRef.current) {
          const timeDiffMs = new Date().getTime() - new Date(m.measure_time).getTime();
          const timeDiffMins = timeDiffMs / (1000 * 60);
          const rate = timeDiffMins > 0 ? (m.arp_requests) / timeDiffMins : 0;
          setArpRate(Math.round(rate));
        }
        prevArpRef.current = { arpRequests: m.arp_requests, timestamp: metricTime };

        // Update device statuses
        setDevices((prev) =>
          prev.map((d, i) => ({
            ...d,
            status: i < m.active_devices ? "active" : "idle",
            lastSeen: new Date(metricTime).toISOString(),
          }))
        );

        // Add metric event to feed
        const metricEvent: Event = {
          id: data.meta.sequence.toString(),
          type: "metric",
          message: `Metrics update: ${m.total_devices} devices, ${m.active_devices} active`,
          timestamp: new Date(data.meta.timestamp).toLocaleTimeString(),
          icon: <Activity className="h-4 w-4 text-blue-600" />,
          payload: m,
        };
        setEvents((prev) => [metricEvent, ...prev]);
      }
    });

    return () => disconnectWebSocket();
  }, []);

  // Poll connection status
  useEffect(() => {
    const interval = setInterval(() => setIsConnected(isWebSocketConnected()), 500);
    return () => clearInterval(interval);
  }, []);

  return {
    devices,
    events,
    metrics,
    activeDevices: metrics.activeDevices,
    idleDevices: metrics.totalDevices - metrics.activeDevices,
    isConnected,
    arpRate, // ARP requests per minute
  };
};
