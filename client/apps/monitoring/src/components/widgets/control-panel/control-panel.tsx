import { Button, Col, Row, Space } from "antd";
import { WidgetCard } from "../../widget-card";
import { Slider } from "../../slider";
import { SocketEvent } from "@scada/shared-types";
import type { FC } from "react";
import styles from "./control-panel.module.css";
import { ScadaTypography } from "../../typography";

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
      title="Параметри керування"
      className={styles.controllCardContainer}
    >
      {/* --- ВЕРХНІЙ ПОВЕРХ: Кнопки --- */}
      <div className={styles.section}>
        <ScadaTypography variant="headerXs">
          Ручне керування агрегатами
        </ScadaTypography>

        <div className={styles.buttonsContainer}>
          {/* Пальник */}
          <div className={styles.buttonGroup}>
            <ScadaTypography variant="label">Пальник</ScadaTypography>
            <div className={styles.buttonsRow}>
              <Button
                type="primary"
                danger
                disabled={isControlDisabled}
                onClick={() => handleToggleHeater(true)}
                className={styles.btn}
              >
                Увімк.
              </Button>
              <Button
                disabled={isControlDisabled}
                onClick={() => handleToggleHeater(false)}
                className={styles.btn}
              >
                Вимк.
              </Button>
            </div>
          </div>

          {/* Насос */}
          <div className={styles.buttonGroup}>
            <ScadaTypography variant="label">
              Циркуляційний насос
            </ScadaTypography>
            <div className={styles.buttonsRow}>
              <Button
                type="primary"
                disabled={isControlDisabled}
                onClick={() => handleTogglePump(true)}
                className={styles.btn}
              >
                Увімк.
              </Button>
              <Button
                disabled={isControlDisabled}
                onClick={() => handleTogglePump(false)}
                className={styles.btn}
              >
                Вимк.
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* --- РОЗДІЛЮВАЧ --- */}
      <div className={styles.divider} />

      {/* --- НИЖНІЙ ПОВЕРХ: Уставка (твій кастомний компонент) --- */}
      <div className={styles.section}>
        <Slider
          title="Уставка температури теплоносія (Гістерезис)"
          min={0}
          max={90}
          currentValue={temperatureSetpoint}
          onApply={handleSetTemperatureSetpoint}
          unit="°C"
          isRange
          disabled={isAutoMode || hasGridPower === false}
        />
      </div>
    </WidgetCard>
  );
};
