import { CheckCircle2 } from "lucide-react";

/* Backend Device → UI Device */
export const mapDevice = (device: any) => ({
  id: device.device_id,
  name: device.hostname ?? "Unknown",
  ip: device.ip_address ?? "—",
  mac: device.mac_address ?? "—",
  vendor: device.vendor ?? "Unknown",
  type: device.device_type ?? "Unknown",
  status: (device.is_active ? "active" : "idle") as "active" | "idle",
  lastSeen: device.last_seen
    ? new Date(device.last_seen).toLocaleTimeString()
    : "—",
});

/* Backend Event → UI Event */
export const mapEvent = (data: any) => ({
  id: data.meta.sequence.toString(),
  type: "join" as const,
  message: `New device connected – ${data.payload.device.ip_address}`,
  timestamp: new Date(data.meta.timestamp).toLocaleTimeString(),
  icon: <CheckCircle2 className="h-4 w-4 text-green-600" />,
});
