import { Row, Col, Card } from "antd";
import { type FC } from "react";
import { type DashboardProps } from "@scada/shared-types";
import styles from "./dashboard.module.css";
import { BoilerMetrics } from "../../components/widgets/boiler-metrics";
import { ScadaTypography } from "../../components/typography";
import { MimicPanel } from "../../components/widgets/mimic-panel";
import { ControlPanel } from "../../components/widgets/control-panel";
import { PumpMetrics } from "../../components/widgets/pump-metrics";
import { SafetyMetrics } from "../../components/widgets/safety-metrics";

export const Dashboard: FC<DashboardProps> = ({
  tempSupply = 20,
  tempReturn = 10,
  tempOutdoor,
  tempIndoor,
  pressure = 1.2,
  gasLevel,
  pumpActive = false,
  pumpSpeed = 0,
  flameActive = false,
  isAutoMode,
  temperatureSetpoint,
  batteryLevel,
  hasGridPower,
  sendCommand,
}) => {
  return (
    <div className={styles.dashboardContainer}>
      <div style={{ marginBottom: "24px" }}>
        <ScadaTypography variant="header">
          Boiler operational data (Monitoring panel)
        </ScadaTypography>
      </div>

      <Row gutter={[24, 24]}>
        {/* --- ПОВЕРХ 1: КЕРУВАННЯ (На всю ширину) --- */}
        <Col span={24}>
          <ControlPanel
            sendCommand={sendCommand}
            batteryLevel={batteryLevel}
            isAutoMode={isAutoMode}
            temperatureSetpoint={temperatureSetpoint}
            hasGridPower={hasGridPower}
          />
        </Col>

        {/* --- ПОВЕРХ 2: МОНІТОРИНГ (3 віджети в рядок) --- */}
        {/* На екранах від lg (ноутбуки) вони займуть по 1/3 (span 8) */}
        <Col xs={24} lg={8}>
          <BoilerMetrics
            flameActive={flameActive}
            tempSupply={tempSupply}
            tempReturn={tempReturn}
          />
        </Col>

        <Col xs={24} lg={8}>
          <PumpMetrics
            pumpActive={pumpActive}
            pumpSpeed={pumpSpeed}
            pressure={pressure}
          />
        </Col>

        <Col xs={24} lg={8}>
          <SafetyMetrics
            gasLevel={gasLevel}
            tempOutdoor={tempOutdoor}
            tempSupply={tempSupply}
            tempIndoor={tempIndoor}
          />
        </Col>

        {/* --- ПОВЕРХ 3: АНАЛІТИКА (Графік на всю ширину) --- */}
        <Col span={24}>
          <div
            style={{
              height: "400px",
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "8px",
              border: "1px dashed #2a2e39",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ScadaTypography variant="label">
              Місце для графіка температур (Recharts)
            </ScadaTypography>
          </div>
        </Col>
      </Row>
    </div>
  );
};
