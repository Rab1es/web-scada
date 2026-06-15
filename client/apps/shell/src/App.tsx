import React, { Suspense, useEffect, useRef, useState } from "react";
import { WS_URL } from "./config";
import {
  SocketEvent,
  type DashboardProps,
  type ScadaPayload,
  type SockectMessage,
} from "@scada/shared-types";

import { ConfigProvider, Layout, Spin, theme } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Sidebar,
  AppHeader,
  type HeaderProps,
  ErrorBoundary,
} from "./components";
import "./index.css";

const { Content } = Layout;
// @ts-ignore
const RemoteSensorPanel = React.lazy(() => import("monitoring/SensorPanel"));
const MfeDashboard = React.lazy(() => import("monitoring/Dashboard"));
const MfeUpsInfo = React.lazy(() => import("monitoring/UpsInfo"));
const MfeAnalytics = React.lazy(() => import("monitoring/Analytics"));

function App() {
  // @ts-ignore
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState<ScadaPayload | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const {
    token: { borderRadiusLG },
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

  const {
    tempSupply,
    tempReturn,
    tempOutdoor,
    tempIndoor,
    pressure,
    batteryLevel,
    gasLevel,
    pumpActive,
    heaterActive,
    flameActive,
    pumpSpeed,
    // systemState,
    hasGridPower,
    isAutoMode,
    isEmergencyStop,
    temperatureSetpoint,
    batteryTimeRemaining,
    charts,
  } = sensorData;

  const handleSendSocketMessage = ({ command, value }: SockectMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ command, value }));
    }
  };

  const headerProps: HeaderProps = {
    isEmergencyStop,
    hasGridPower,
    isAutoMode,
    sendCommand: handleSendSocketMessage,
  };

  const dashboardProps: DashboardProps = {
    tempSupply,
    tempReturn,
    isAutoMode,
    tempOutdoor,
    tempIndoor,
    pressure,
    batteryLevel,
    gasLevel,
    pumpActive,
    heaterActive,
    flameActive,
    pumpSpeed,
    temperatureSetpoint,
    hasGridPower,
    sendCommand: handleSendSocketMessage,
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
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        // Сюда же можно добавить фирменный цвет котельной (например, оранжевый или синий)
        token: {
          colorPrimary: "#177ddc",
          colorBgBase: "#131722",
          colorBgContainer: "#141414",
          colorTextBase: "rgba(255, 255, 255, 0.85)",
          colorBorderSecondary: "#303030",
        },
        components: {
          Layout: {
            headerBg: "#1e222d",
            siderBg: "#1e222d",
            bodyBg: "#131722",
          },
          Menu: {
            darkItemBg: "#1e222d", // Чтобы фон меню совпадал с сайдбаром
          },
        },
      }}
    >
      <BrowserRouter>
        {/* Головний контейнер на весь екран */}
        <Layout style={{ height: "100vh", overflow: "hidden" }}>
          {/* Наш боковий Sider */}
          <Sidebar />

          <Layout>
            <AppHeader {...headerProps} />

            {/* Робоча область (Контент) */}
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                //background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                {/* Тимчасові заглушки. Сюди ми потім вставимо компоненти з MFE */}
                <Route
                  path="/"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={
                          <div style={{ textAlign: "center", padding: "50px" }}>
                            <Spin size="large" />
                          </div>
                        }
                      >
                        <MfeDashboard {...dashboardProps} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/power"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={
                          <div style={{ textAlign: "center", padding: "50px" }}>
                            <Spin size="large" />
                          </div>
                        }
                      >
                        <MfeUpsInfo
                          batteryLevel={batteryLevel}
                          batteryTimeRemaining={batteryTimeRemaining}
                          hasGridPower={hasGridPower}
                        />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/charts"
                  element={
                    <ErrorBoundary>
                      <Suspense
                        fallback={
                          <div style={{ textAlign: "center", padding: "50px" }}>
                            <Spin size="large" />
                          </div>
                        }
                      >
                        <MfeAnalytics charts={charts} />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                {/*<Route
                path="/logs"
                element={<h3>Тут буде завантажено МФ: Журнал</h3>}
              /> */}
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
