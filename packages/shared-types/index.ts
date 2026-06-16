export interface HardwareData {
  tempSupply: number;
  tempReturn: number;
  tempOutdoor: number;
  tempIndoor: number;
  pressure: number;
  batteryLevel: number;
  gasLevel: number;
  pumpActive: boolean;
  heaterActive: boolean;
  flameActive: boolean;
  pumpSpeed: number;
}

export interface SoftwareData {
  systemState: string;
  hasGridPower: boolean;
  isAutoMode: boolean;
  isEmergencyStop: boolean;
  temperatureSetpoint: [number, number];
  batteryTimeRemaining: number;
}

export interface BaseChartPoint {
  time: string;
  timestamp: number;
}

export type TemperatureChartPoint = BaseChartPoint &
  Pick<HardwareData, "tempSupply" | "tempReturn"> &
  Pick<SoftwareData, "temperatureSetpoint">;

export type UpsDataPoint = BaseChartPoint & Pick<HardwareData, "batteryLevel">;

// Объединяем их в один объект, который прилетит с бэкенда
export interface ScadaCharts {
  temperature: TemperatureChartPoint[];
  battery: UpsDataPoint[];
}

export interface ScadaPayload extends HardwareData, SoftwareData {
  charts?: ScadaCharts;
  logs?: ScadaLogEntry[];
}

export interface SensorPanelProps extends ScadaPayload {
  isConnected: boolean;
}

export interface WithSocketProps {
  sendCommand: (payload: SockectMessage) => void;
}

export interface DashboardProps
  extends
    WithSocketProps,
    HardwareData,
    Pick<SoftwareData, "isAutoMode" | "temperatureSetpoint" | "hasGridPower"> {}

export interface UpsInfoProps
  extends
    Pick<
      HardwareData,
      "batteryLevel" | "pumpActive" | "pumpSpeed" | "heaterActive"
    >,
    Pick<SoftwareData, "batteryTimeRemaining" | "hasGridPower"> {}

export type AnalyticsProps = Pick<ScadaPayload, "charts">;

export type EventLogsProps = Pick<ScadaPayload, "logs">;

export const SocketEvent = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  SET_HEATER: "set-heater",
  SET_PUMP: "set-pump",
  SET_TEMPERATURE_SETPOINT: "set-temperature-setpoint",
  SET_AUTO_MODE: "set-auto-mode",
  EMERGENCY_STOP: "emergency-stop",
} as const;

export type SocketCommand = (typeof SocketEvent)[keyof typeof SocketEvent];
export type SocketMessageValue = number | string | boolean | [number, number];

export interface SockectMessage {
  command: SocketCommand;
  value: SocketMessageValue;
}

export type LogCategory = "info" | "warning" | "critical" | "command";
export type LogInitiator = "Operator" | "Automation";

export interface ScadaLogEntry {
  id: string;
  timestamp: number; // Для точного сортування масиву на фронті
  time: string; // "14:05:22"
  date: string; // "15.06.2026"
  category: LogCategory;
  initiator: LogInitiator;
  message: string;
}
