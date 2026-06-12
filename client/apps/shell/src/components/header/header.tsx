import { useState, useEffect, type FC } from "react";
import {
  Layout,
  Switch,
  Button,
  Tag,
  Space,
  Typography,
  Popconfirm,
} from "antd";
import {
  ThunderboltOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import type { HeaderProps } from "./types";
import { SocketEvent, type SockectMessage } from "@scada/shared-types";
import styles from "./header.module.css";

const { Header } = Layout;
const { Text, Title } = Typography;

export const AppHeader: FC<HeaderProps> = ({
  hasGridPower,
  isAutoMode,
  isEmergencyStop,
  sendCommand,
}) => {
  // Стейт для годинника
  const [time, setTime] = useState(new Date());

  // Оновлення годинника кожну секунду
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSystemMode = (checked: boolean) => {
    const socketMessage: SockectMessage = {
      command: SocketEvent.SET_AUTO_MODE,
      value: checked,
    };

    sendCommand(socketMessage);
  };

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: "1px solid #f0f0f0",
      }}
      //className={styles.header}
    >
      {/* Ліва частина: Заголовок */}
      <div>
        <Title level={4} style={{ margin: 0 }}>
          SCADA Котельні
        </Title>
      </div>

      {/* Права частина: Елементи керування */}
      <Space size="large" align="center">
        {/* Годинник */}
        <Text strong style={{ fontSize: "16px", fontFamily: "monospace" }}>
          {time.toLocaleTimeString("uk-UA")}
        </Text>

        {hasGridPower ? (
          <Tag
            color="success"
            icon={<CheckCircleOutlined />}
            style={{ fontSize: "14px", padding: "4px 10px", margin: 0 }}
          >
            Мережа 220В
          </Tag>
        ) : (
          <Tag
            color="warning"
            icon={<ThunderboltOutlined />}
            className={styles.pulsingUps} // Цей клас ми опишемо в CSS
            style={{ fontSize: "14px", padding: "4px 10px", margin: 0 }}
          >
            Робота від ДБЖ
          </Tag>
        )}

        {/* Перемикач режимів Auto/Manual */}
        <Space>
          <Text type={isAutoMode ? "secondary" : "danger"} strong={!isAutoMode}>
            РУЧН
          </Text>
          <Switch
            checked={isAutoMode}
            onChange={handleToggleSystemMode}
            style={{ background: isAutoMode ? "#52c41a" : "#ff4d4f" }}
          />
          <Text type={isAutoMode ? "success" : "secondary"} strong={isAutoMode}>
            АВТО
          </Text>
        </Space>

        <Space size="middle">
          {/* Кнопка деблокування (з'являється тільки під час аварії) */}
          {isEmergencyStop && (
            <Button
              type="primary"
              style={{ backgroundColor: "#52c41a" }}
              icon={<SafetyCertificateOutlined />}
              onClick={() =>
                sendCommand({ command: "emergency-stop", value: false })
              }
            >
              СКИДАННЯ АВАРІЇ
            </Button>
          )}

          {/* Основна кнопка E-STOP */}
          <Popconfirm
            title="Увага! Аварійна зупинка!"
            description="Ви впевнені, що хочете повністю зупинити котельню?"
            onConfirm={() =>
              sendCommand({ command: "emergency-stop", value: true })
            }
            okText="Зупинити"
            cancelText="Відміна"
            okButtonProps={{ danger: true }}
            disabled={isEmergencyStop} // Вимикаємо, якщо вже в аварії
          >
            <Button
              type="primary"
              danger
              icon={<PoweroffOutlined />}
              size="large"
              disabled={isEmergencyStop}
            >
              E-STOP
            </Button>
          </Popconfirm>
        </Space>
      </Space>
    </Header>
  );
};
