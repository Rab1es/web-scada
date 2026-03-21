import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { modbusService } from "@/services/modbus.service";
import { SERVER_PORT } from "@/config";
import { SocketEvent } from "@/config/events";

const app = express();
app.use(cors());

const server = http.createServer(app);

const socketSettings = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
};

const io = new Server(server, socketSettings);

const main = async () => {
  await modbusService.connect();

  io.on(SocketEvent.CONNECTION, (socket) => {
    console.log(`User connected, id: ${socket.id}`);

    socket.on(SocketEvent.SET_HEATER, (heaterStatus: boolean) => {
      modbusService.setHeater(heaterStatus);
    });
    socket.on(SocketEvent.SET_PUMP, (pumpStatus: boolean) => {
      modbusService.setPump(pumpStatus);
    });
    socket.on(SocketEvent.SET_SETPOINT, (setpointValue: number) => {
      modbusService.setSetpoint(setpointValue);
    });
    socket.on(SocketEvent.DISCONNECT, () => {
      console.log(`User disconnected, id: ${socket.id}`);
    });
  });

  setInterval(async () => {
    const state = await modbusService.getSystemState();
    io.emit("boiler-state", state);
  }, 1000);

  server.listen(SERVER_PORT, () => {
    console.log(`🚀 Server is running on port ${SERVER_PORT}`);
  });
};

main();
