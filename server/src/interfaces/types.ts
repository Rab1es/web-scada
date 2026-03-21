//contracts for boiler
export interface BoilerState {
  temperature: number;
  setpoint: number;
  batteryLevel: number;

  isHeaterOn: boolean;
  isPumpOn: boolean;
  hasGridPower: boolean;
}

// contracts for SCADA
export interface ScadaConfig {
  minBatteryLevel: number;
  ecoSetpoint: number;
}
