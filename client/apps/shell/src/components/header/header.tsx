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
  MenuOutlined,
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
  collapsed,
  setCollapsed,
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
    <Header className={styles.headerContainer}>
      <Button
        type="text"
        icon={<MenuOutlined style={{ fontSize: "20px", color: "#fff" }} />}
        onClick={() => setCollapsed(!collapsed)}
        className={styles.mobileMenuBtn} // В CSS зробиш display: none для десктопу і display: block для мобілок
      />
      {/* Ліва частина: Заголовок */}
      <div className={styles.titleWrapper}>
        <Title level={3} className={styles.title}>
          SCADA Boiler House
        </Title>
      </div>

      {/* Права частина: Елементи керування */}
      <div className={styles.controlsWrapper}>
        {/* Годинник */}
        <Text strong className={styles.clock}>
          {time.toLocaleTimeString("uk-UA")}
        </Text>

        {/* Блок живлення */}
        {hasGridPower ? (
          <Tag
            color="success"
            icon={<CheckCircleOutlined />}
            className={styles.powerTag}
          >
            220V Network
          </Tag>
        ) : (
          <Tag
            color="warning"
            icon={<ThunderboltOutlined />}
            className={`${styles.powerTag} ${styles.pulsingUps || ""}`}
          >
            UPS powered
          </Tag>
        )}

        {/* Перемикач режимів */}
        <div className={styles.modeToggle}>
          <Text
            type={isAutoMode ? "secondary" : "danger"}
            strong={!isAutoMode}
            className={styles.modeText}
          >
            MANUAL
          </Text>
          <Switch
            checked={isAutoMode}
            onChange={handleToggleSystemMode}
            // checkedChildren="AUTO"
            // unCheckedChildren="MANUAL"
            style={{
              background: isAutoMode ? "#52c41a" : "#ff4d4f",
              transform: "scale(1.2)",
            }}
          />
          <Text
            type={isAutoMode ? "success" : "secondary"}
            strong={isAutoMode}
            className={styles.modeText}
          >
            AUTO
          </Text>
        </div>

        {/* Блок кнопок аварії */}
        <div className={styles.actionButtons}>
          {isEmergencyStop && (
            <Button
              type="primary"
              className={styles.resetButton}
              icon={<SafetyCertificateOutlined />}
              onClick={() =>
                sendCommand({ command: "emergency-stop", value: false })
              }
            >
              RESET ALARM
            </Button>
          )}

          {/* Основна кнопка E-STOP */}
          <Popconfirm
            title={
              <div className={styles.estopPopupTitle}>
                WARNING! EMERGENCY STOP!
              </div>
            }
            description={
              <div className={styles.estopPopupDesc}>
                Are you sure you want to completely shut down the boiler house?
              </div>
            }
            onConfirm={() =>
              sendCommand({ command: "emergency-stop", value: true })
            }
            okText="Shut Down"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              size: "large",
              style: { fontWeight: "bold" },
            }}
            cancelButtonProps={{ size: "large" }}
            disabled={isEmergencyStop}
            placement="bottomRight"
            overlayInnerStyle={{
              width: "400px",
              padding: "20px 24px",
              backgroundColor: "#1e222d",
              border: "1px solid #ff4d4f",
            }}
          >
            <Button
              type="primary"
              danger
              icon={<PoweroffOutlined />}
              disabled={isEmergencyStop}
              className={styles.estopButton}
            >
              E-STOP
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Header>
  );
};
