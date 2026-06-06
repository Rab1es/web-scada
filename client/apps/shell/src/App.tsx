import React, { Suspense, useEffect, useRef, useState } from "react";
import { WS_URL } from "./config";
import {
  ModbusCoilsMap,
  SocketEvent,
  type SensorData,
} from "@scada/shared-types";

const RemoteSensorPanel = React.lazy(() => import("monitoring/SensorPanel"));

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData(data);
      } catch (e) {
        console.error("Ошибка парсинга данных:", e);
      }
    };

    return () => {
      if (socketRef.current) {
        socket.onopen = null;
        socket.onclose = null;
        socket.onmessage = null;

        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  const handleTogglePump = (value: boolean) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const commandMessage = {
        command: SocketEvent.SET_PUMP,
        value,
        address: ModbusCoilsMap.PUMP,
      };

      socketRef.current.send(JSON.stringify(commandMessage));
    } else {
      console.warn("No socket connection");
    }
  };

  const handleToggleHeater = (value: boolean) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const commandMessage = {
        command: SocketEvent.SET_HEATER,
        value,
        address: ModbusCoilsMap.HEATER,
      };

      socketRef.current.send(JSON.stringify(commandMessage));
    } else {
      console.warn("No socket connection");
    }
  };
  return (
    <div>
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <button onClick={() => handleTogglePump(true)}>Turn on pump</button>
        <button onClick={() => handleTogglePump(false)}>Turn of pump</button>
      </div>
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <button onClick={() => handleToggleHeater(true)}>Turn on heater</button>
        <button onClick={() => handleToggleHeater(false)}>
          Turn of heater
        </button>
      </div>
      <Suspense fallback={<span>Loading MF</span>}>
        <RemoteSensorPanel {...sensorData} isConnected={isConnected} />
      </Suspense>
    </div>
  );
}

export default App;
