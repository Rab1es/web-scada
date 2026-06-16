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
        height: "80px", // Збільшуємо висоту хедера (дефолт 64px)
      }}
    >
      {/* Ліва частина: Заголовок */}
      <div>
        {/* Збільшили рівень заголовка до 3, щоб він відповідав масштабу */}
        <Title level={3} style={{ margin: 0, letterSpacing: "0.5px" }}>
          SCADA Boiler House
        </Title>
      </div>

      {/* Права частина: Елементи керування */}
      {/* Збільшили загальний відступ між логічними блоками (size={32}) */}
      <Space size={32} align="center">
        {/* Годинник: збільшили шрифт і додали міжлітерний інтервал */}
        <Text
          strong
          style={{
            fontSize: "18px",
            fontFamily: "monospace",
            letterSpacing: "1px",
          }}
        >
          {time.toLocaleTimeString("uk-UA")}
        </Text>

        {/* Блок живлення: збільшили теги */}
        {hasGridPower ? (
          <Tag
            color="success"
            icon={<CheckCircleOutlined />}
            style={{
              fontSize: "15px",
              padding: "6px 14px",
              margin: 0,
              border: "none",
            }}
          >
            220V Network
          </Tag>
        ) : (
          <Tag
            color="warning"
            icon={<ThunderboltOutlined />}
            className={styles.pulsingUps}
            style={{
              fontSize: "15px",
              padding: "6px 14px",
              margin: 0,
              border: "none",
            }}
          >
            UPS powered
          </Tag>
        )}

        {/* Перемикач режимів: додали розмір тексту */}
        <Space size="middle">
          <Text
            type={isAutoMode ? "secondary" : "danger"}
            strong={!isAutoMode}
            style={{ fontSize: "15px" }}
          >
            MANUAL
          </Text>
          <Switch
            checked={isAutoMode}
            onChange={handleToggleSystemMode}
            style={{
              background: isAutoMode ? "#52c41a" : "#ff4d4f",
              transform: "scale(1.2)",
            }} // Трохи збільшили сам світчер
          />
          <Text
            type={isAutoMode ? "success" : "secondary"}
            strong={isAutoMode}
            style={{ fontSize: "15px" }}
          >
            AUTO
          </Text>
        </Space>

        {/* Блок кнопок аварії: відділили від решти інтерфейсу */}
        <Space size="middle" style={{ marginLeft: "16px" }}>
          {/* Кнопка деблокування */}
          {isEmergencyStop && (
            <Button
              type="primary"
              style={{
                backgroundColor: "#52c41a",
                height: "48px",
                fontWeight: "bold",
                fontSize: "15px",
              }}
              icon={<SafetyCertificateOutlined />}
              onClick={() =>
                sendCommand({ command: "emergency-stop", value: false })
              }
            >
              RESETTING THE ALARM
            </Button>
          )}

          {/* Основна кнопка E-STOP */}
          <Popconfirm
            // Передаем JSX вместо обычной строки, чтобы накрутить стили
            title={
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#ff4d4f",
                  marginBottom: "8px",
                }}
              >
                WARNING! EMERGENCY STOP!
              </div>
            }
            description={
              <div
                style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.85)" }}
              >
                Are you sure you want to completely shut down the boiler house?
              </div>
            }
            onConfirm={() =>
              sendCommand({ command: "emergency-stop", value: true })
            }
            okText="Shut Down"
            cancelText="Cancel"
            // Увеличиваем кнопки внутри самого попапа
            okButtonProps={{
              danger: true,
              size: "large",
              style: { fontWeight: "bold" },
            }}
            cancelButtonProps={{ size: "large" }}
            disabled={isEmergencyStop}
            placement="bottomRight" // Явно указываем позиционирование, чтобы он красиво выпадал из-под кнопки
            // Увеличиваем саму подложку попапа (padding и ширину)
            overlayInnerStyle={{
              width: "400px",
              padding: "20px 24px",
              backgroundColor: "#1e222d", // Подтягиваем цвет фона под твою тему
              border: "1px solid #ff4d4f", // Добавляем красную рамку для привлечения внимания
            }}
          >
            <Button
              type="primary"
              danger
              icon={<PoweroffOutlined />}
              disabled={isEmergencyStop}
              style={{
                height: "48px",
                padding: "0 28px",
                fontSize: "16px",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              E-STOP
            </Button>
          </Popconfirm>
        </Space>
      </Space>
    </Header>
  );
};
