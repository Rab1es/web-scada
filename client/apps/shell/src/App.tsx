import React, { Suspense, useEffect, useRef, useState } from "react";
import { WS_URL } from "./config";
import {
  SocketEvent,
  type SensorData,
  type SockectMessage,
} from "@scada/shared-types";

import { Layout, Spin, theme } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar, AppHeader } from "./components";
import "./index.css";

const { Content } = Layout;
// @ts-ignore
const RemoteSensorPanel = React.lazy(() => import("monitoring/SensorPanel"));
const MfeDashboard = React.lazy(() => import("monitoring/Dashboard"));

function App() {
  // @ts-ignore
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => setIsConnected(true);
    socket.onclose = () => setIsConnected(false);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log("data: ", data);
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

  if (!isConnected || !sensorData) {
    return <Spin size="large" />;
  }

  const handleSendSocketMessage = ({ command, value }: SockectMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ command, value }));
    }
  };

  // @ts-ignore
  const handleTogglePump = (value: boolean) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const commandMessage: SockectMessage = {
        command: SocketEvent.SET_PUMP,
        value,
      };

      handleSendSocketMessage(commandMessage);
    } else {
      console.warn("No socket connection");
    }
  };

  // @ts-ignore
  const handleToggleHeater = (value: boolean) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const commandMessage: SockectMessage = {
        command: SocketEvent.SET_HEATER,
        value,
      };

      handleSendSocketMessage(commandMessage);
    } else {
      console.warn("No socket connection");
    }
  };
  return (
    <BrowserRouter>
      {/* Головний контейнер на весь екран */}
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        {/* Наш боковий Sider */}
        <Sidebar />

        <Layout>
          <AppHeader
            hasGridPower={sensorData?.hasGridPower!}
            isAutoMode={sensorData?.isAutoMode!}
            sendCommand={handleSendSocketMessage}
          />

          {/* Робоча область (Контент) */}
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Suspense
              fallback={
                <div style={{ textAlign: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              }
            >
              <Routes>
                {/* Тимчасові заглушки. Сюди ми потім вставимо компоненти з MFE */}
                <Route
                  path="/"
                  element={
                    // <div>
                    //   <div
                    //     style={{
                    //       display: "flex",
                    //       gap: "5px",
                    //       marginBottom: "10px",
                    //     }}
                    //   >
                    //     <button onClick={() => handleTogglePump(true)}>
                    //       Turn on pump
                    //     </button>
                    //     <button onClick={() => handleTogglePump(false)}>
                    //       Turn of pump
                    //     </button>
                    //   </div>
                    //   <div
                    //     style={{
                    //       display: "flex",
                    //       gap: "5px",
                    //       marginBottom: "10px",
                    //     }}
                    //   >
                    //     <button onClick={() => handleToggleHeater(true)}>
                    //       Turn on heater
                    //     </button>
                    //     <button onClick={() => handleToggleHeater(false)}>
                    //       Turn of heater
                    //     </button>
                    //   </div>
                    //   {/* <Suspense fallback={<span>Loading MF</span>}>
                    //   <RemoteSensorPanel
                    //     {...sensorData}
                    //     isConnected={isConnected}
                    //   />
                    // </Suspense> */}
                    // </div>
                    <MfeDashboard />
                  }
                />
                <Route
                  path="/power"
                  element={<h3>Тут буде завантажено МФ: Енергетика</h3>}
                />
                <Route
                  path="/charts"
                  element={<h3>Тут буде завантажено МФ: Графіки</h3>}
                />
                <Route
                  path="/logs"
                  element={<h3>Тут буде завантажено МФ: Журнал</h3>}
                />
              </Routes>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
