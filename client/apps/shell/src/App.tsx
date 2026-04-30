import React, { Suspense, useEffect, useState } from "react";
import { WS_URL } from "./config";
import type { SensorData } from "@scada/shared-types";

const RemoteSensorPanel = React.lazy(() => import("monitoring/SensorPanel"));

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

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
      socket.onopen = null;
      socket.onclose = null;
      socket.onmessage = null;

      socket.close();
    };
  }, []);
  return (
    <div>
      <span>shell</span>
      <h3>Виджет из микрофронтенда:</h3>
      <Suspense fallback={<span>Loading MF</span>}>
        <RemoteSensorPanel {...sensorData} isConnected={isConnected} />
      </Suspense>
    </div>
  );
}

export default App;
