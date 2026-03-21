import ModbusRTU from "modbus-serial";
import { BoilerState } from "@/interfaces/types";
import { ModbusRegisterMap, ModbusCoilsMap, IP_ADDRESS, MODBUS_PORT } from "@/config";

class ModbusService {
  private client: ModbusRTU;
  private isConnected = false;

  private registersLength = Math.max(...Object.values(ModbusRegisterMap)) + 1;
  private coilsLength = Math.max(...Object.values(ModbusCoilsMap)) + 1;

  constructor() {
    this.client = new ModbusRTU();
  }

  async connect(): Promise<boolean> {
    try {
      const options = { port: MODBUS_PORT };
      await this.client.connectTCP(IP_ADDRESS, options);
      this.client.setID(1);

      this.isConnected = true;
      console.log("Modbus Connected");
      return true;
    } catch (error) {
      this.isConnected = false;
      console.error("Modbus Connection Failed:", error);

      return false;
    }
  }

  async getSystemState(): Promise<BoilerState | null> {
    if (!this.isConnected) {
      console.log("Modbus doesn't connected");

      return null;
    }

    try {
      const registers = await this.client.readHoldingRegisters(0, this.registersLength);
      const coils = await this.client.readCoils(0, this.coilsLength);

      const data: BoilerState = {
        temperature: registers.data[ModbusRegisterMap.TEMPERATURE],
        setpoint: registers.data[ModbusRegisterMap.SETPOINT],
        batteryLevel: registers.data[ModbusRegisterMap.BATTAREY_LEVEL],

        isHeaterOn: coils.data[ModbusCoilsMap.HEATER],
        isPumpOn: coils.data[ModbusCoilsMap.PUMP],
        hasGridPower: coils.data[ModbusCoilsMap.HAS_GRID_POWER],
      };

      return data;
    } catch (error) {
      console.error("Read Error:", error);

      return null;
    }
  }

  async setHeater(status: boolean): Promise<boolean> {
    try {
      await this.client.writeCoil(ModbusCoilsMap.HEATER, status);

      console.log(`Heater ${status ? "enabled" : "disabled"} successfully`);

      return status;
    } catch (error) {
      console.log("Error during setting heater:", error);

      return false;
    }
  }

  async setPump(status: boolean): Promise<boolean> {
    try {
      await this.client.writeCoil(ModbusCoilsMap.PUMP, status);

      console.log(`Pump ${status ? "enabled" : "disabled"} successfully`);

      return status;
    } catch (error) {
      console.log("Error during setting pump:", error);

      return false;
    }
  }

  async setSetpoint(value: number): Promise<number | null> {
    try {
      await this.client.writeRegister(ModbusRegisterMap.SETPOINT, value);

      console.log(`Setpoint has set to ${value}`);

      return value;
    } catch (error) {
      console.log("Error during setting Setpoint:", error);

      return null;
    }
  }
}

export const modbusService = new ModbusService();
