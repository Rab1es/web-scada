export interface SensorData {
  temperature?: number;
  pressure?: number;
  battareyLevel?: number;
  waterLevel?: number;
}

export interface SensorPanelProps extends SensorData {
  isConnected: boolean;
}
