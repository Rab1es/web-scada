import { modbusService } from "@/services/modbus.service";

const main = async () => {
  await modbusService.connect();

  setInterval(async () => {
    const state = await modbusService.getSystemState();
    console.log(state);
  }, 1000);
};

main();
