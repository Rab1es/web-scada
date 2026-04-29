import React, { Suspense, useEffect, useState } from "react";

const RemoteSensorPanel = React.lazy(() => import("monitoring/SensorPanel"));

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<any>({});

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:1880/ws/sensors');

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
        <RemoteSensorPanel {...sensorData} isLoading={isConnected}/>
      </Suspense>
    </div>
  );
}

export default App;
