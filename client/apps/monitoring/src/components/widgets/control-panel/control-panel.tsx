import { Button, Col, Row, Space } from "antd";
import { WidgetCard } from "../../widget-card";
import { Slider } from "../../slider";
import { SocketEvent } from "@scada/shared-types";
import type { FC } from "react";
import styles from "./control-panel.module.css";

interface ControlPanelProps {
  //TODO: update types
  sendCommand: any;
  batteryLevel: any;
  isAutoMode: any;
  temperatureSetpoint: any;
  hasGridPower: any;
}

export const ControlPanel: FC<ControlPanelProps> = ({
  sendCommand,
  batteryLevel,
  isAutoMode,
  temperatureSetpoint,
  hasGridPower,
}) => {
  const handleToggleHeater = (value: boolean) => {
    sendCommand({ command: SocketEvent.SET_HEATER, value });
  };

  const handleTogglePump = (value: boolean) => {
    sendCommand({ command: SocketEvent.SET_PUMP, value });
  };

  const handleSetTemperatureSetpoint = (value: [number, number]) => {
    sendCommand({ command: SocketEvent.SET_TEMPERATURE_SETPOINT, value });
  };

  // Єдина логіка блокування ручного керування (АВТО режим АБО критичний розряд батареї)
  const isControlDisabled =
    isAutoMode || (batteryLevel !== undefined && batteryLevel <= 10);
  return (
    <WidgetCard
      type="inner"
      title="Параметри керування"
      className={styles.controllWidgetCardContainer}
    >
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} xl={12}>
          <div style={{ color: "rgba(0, 0, 0, 0.45)", marginBottom: "8px" }}>
            Ручне керування агрегатами
          </div>
          <Space wrap>
            <Button
              type="primary"
              danger
              disabled={isControlDisabled}
              onClick={() => handleToggleHeater(true)}
            >
              Увімк. пальник
            </Button>
            <Button
              disabled={isControlDisabled}
              onClick={() => handleToggleHeater(false)}
            >
              Вимк. пальник
            </Button>
            <Button
              type="primary"
              disabled={isControlDisabled}
              onClick={() => handleTogglePump(true)}
            >
              Увімк. насос
            </Button>
            <Button
              disabled={isControlDisabled}
              onClick={() => handleTogglePump(false)}
            >
              Вимк. насос
            </Button>
          </Space>
        </Col>

        <Col xs={24} xl={12}>
          <Slider
            title="Уставка температури теплоносія"
            min={0}
            max={90}
            currentValue={temperatureSetpoint}
            onApply={handleSetTemperatureSetpoint}
            unit="°C"
            isRange
            disabled={isAutoMode || hasGridPower === false}
          />
        </Col>
      </Row>
    </WidgetCard>
  );
};
