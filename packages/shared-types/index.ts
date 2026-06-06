export interface SensorData {
  //registers
  temperature?: number;
  pressure?: number;
  batteryLevel?: number;
  waterLevel?: number;
  gasLevel?: number;
  pumpActive?: boolean;
  heaterActive?: boolean;
  flameActive?: boolean;
  pumpSpeed?: number;

  //software
  systemState?: string;
  hasGridPower?: boolean;
  isAutoMode?: boolean;
  isEmergencyStop?: boolean;
  temperatureSetpoint?: boolean;
}

export interface SensorPanelProps extends SensorData {
  isConnected: boolean;
}

export interface WithSocketProps {
  sendCommand: (payload: SockectMessage) => void;
}

export const SocketEvent = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  SET_HEATER: "set-heater",
  SET_PUMP: "set-pump",
  SET_SETPOINT: "set-setpoint",
  SET_AUTO_MODE: "set-auto-mode",
  EMERGENCY_STOP: "emergency-stop",
} as const;

export type SocketCommand = (typeof SocketEvent)[keyof typeof SocketEvent];
export type SocketMessageValue = number | string | boolean;

export interface SockectMessage {
  command: SocketCommand;
  value: SocketMessageValue;
}
