//addresses for Holding Registers
export const ModbusRegisterMap: Record<string, number> = {
  TEMPERATURE: 0,
  BATTAREY_LEVEL: 1,
  SETPOINT: 2,
};

//addresses for Coils
export const ModbusCoilsMap: Record<string, number> = {
  HEATER: 0,
  PUMP: 1,
  HAS_GRID_POWER: 2,
};
