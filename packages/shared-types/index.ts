export interface SensorData {
  temperature?: number;
  pressure?: number;
  battareyLevel?: number;
  waterLevel?: number;
  pumpActive?: boolean;
  heaterActive?: boolean;
  systemState?: string;
  pumpSpeed?: number;
}

export interface SensorPanelProps extends SensorData {
  isConnected: boolean;
}

export const SocketEvent = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  SET_HEATER: "set-heater",
  SET_PUMP: "set-pump",
  SET_SETPOINT: "set-setpoint",
};

export const ModbusRegisterMap: Record<string, number> = {
  TEMPERATURE: 0,
  PRESSURE: 1,
  WATER_LEVEL: 2,
  BATTERY_LEVEL: 3,
  TEMPERATURE_SETPOINT: 4,
};

export const ModbusCoilsMap: Record<string, number> = {
  HEATER: 0,
  PUMP: 1,
  HAS_GRID_POWER: 2,
  ALARM_ERROR: 3,
};
