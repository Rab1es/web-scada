//addresses for Holding Registers
export const ModbusRegisterMap: Record<string, number> = {
  TEMPERATURE: 0,
  PRESSURE: 1,
  WATER_LEVEL: 2,
  BATTERY_LEVEL: 3,
  TEMPERATURE_SETPOINT: 4,
};

//addresses for Coils
export const ModbusCoilsMap: Record<string, number> = {
  HEATER: 0,
  PUMP: 1,
  HAS_GRID_POWER: 2,
  ALARM_ERROR: 3,
};
