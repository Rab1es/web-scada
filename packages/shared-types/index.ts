export interface HardwareData {
  tempSupply?: number; // Температура подачи (бывшая общая temperature)
  tempReturn?: number; // Температура обратки
  tempOutdoor?: number;
  tempIndoor?: number;
  pressure?: number;
  batteryLevel?: number;
  gasLevel?: number;
  pumpActive?: boolean;
  heaterActive?: boolean;
  flameActive?: boolean;
  pumpSpeed?: number;
}

export interface SoftwareData {
  systemState?: string;
  hasGridPower?: boolean;
  isAutoMode?: boolean;
  isEmergencyStop?: boolean;
  temperatureSetpoint?: [number, number];
  batteryTimeRemaining?: number;
}

export interface ScadaPayload extends HardwareData, SoftwareData {}

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
    Pick<HardwareData, "batteryLevel">,
    Pick<SoftwareData, "batteryTimeRemaining" | "hasGridPower"> {}

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
