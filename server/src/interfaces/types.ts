//contracts for boiler
export interface BoilerState {
  temperature: number;
  pressure: number;
  temperatureSetpoint: number;
  batteryLevel: number;
  waterLevel: number;

  isHeaterOn: boolean;
  isPumpOn: boolean;
  isAlarmError: boolean;
  hasGridPower: boolean;
}

// contracts for SCADA
export interface ScadaConfig {
  minBatteryLevel: number;
  minTemperatureSetpoint: number;
  maxTemperatureSetpoint: number;
  maxPressure: number;
  minWaterLevel: number;
}
