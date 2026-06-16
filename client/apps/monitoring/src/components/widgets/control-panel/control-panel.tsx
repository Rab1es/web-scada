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
  heaterActive: any;
  pumpActive: any;
  isEmergencyStop: boolean;
}

export const ControlPanel: FC<ControlPanelProps> = ({
  sendCommand,
  batteryLevel,
  isAutoMode,
  temperatureSetpoint,
  hasGridPower,
  pumpActive,
  heaterActive,
  isEmergencyStop,
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
    isAutoMode ||
    (batteryLevel !== undefined && batteryLevel <= 10) ||
    isEmergencyStop;
  return (
    <WidgetCard
      title="Control parameters"
      className={styles.controllCardContainer}
    >
      {/* --- ВЕРХНІЙ ПОВЕРХ: Кнопки --- */}
      <div className={styles.section}>
        <div className={styles.buttonsContainer}>
          {/* Пальник */}
          <div className={styles.buttonGroup}>
            <ScadaTypography variant="label">Burner</ScadaTypography>
            <div className={styles.buttonsRow}>
              <Button
                type="primary"
                danger
                disabled={isControlDisabled || heaterActive}
                onClick={() => handleToggleHeater(true)}
                className={styles.btn}
              >
                Turn on
              </Button>
              <Button
                disabled={isControlDisabled || !heaterActive}
                onClick={() => handleToggleHeater(false)}
                className={styles.btn}
              >
                Turn off
              </Button>
            </div>
          </div>

          {/* Насос */}
          <div className={styles.buttonGroup}>
            <ScadaTypography variant="label">Circulation pump</ScadaTypography>
            <div className={styles.buttonsRow}>
              <Button
                type="primary"
                disabled={isControlDisabled || pumpActive}
                onClick={() => handleTogglePump(true)}
                className={styles.btn}
              >
                Turn on
              </Button>
              <Button
                disabled={isControlDisabled || !pumpActive}
                onClick={() => handleTogglePump(false)}
                className={styles.btn}
              >
                Turn off
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
          title="Heat transfer fluid temperature setpoint (Hysteresis)"
          min={0}
          max={90}
          currentValue={temperatureSetpoint}
          onApply={handleSetTemperatureSetpoint}
          unit="°C"
          isRange
          disabled={!isAutoMode || hasGridPower === false}
        />
      </div>
    </WidgetCard>
  );
};
