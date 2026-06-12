import { Row, Col, Card } from "antd";
import { type FC } from "react";
import { type DashboardProps } from "@scada/shared-types";
import styles from "./dashboard.module.css";
import { BoilerMetrics } from "../../components/widgets/boiler-metrics";
import { ScadaTypography } from "../../components/typography";

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
    <div style={{ padding: "24px", width: "100%" }}>
      {/* Простой заголовок страницы */}
      <ScadaTypography variant="header">
        Оперативні дані котельні (Панель моніторингу)
      </ScadaTypography>

      {/* Дальше сразу идет твоя сетка Row/Col и виджеты */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <BoilerMetrics
            flameActive={flameActive}
            tempSupply={tempSupply}
            tempReturn={tempReturn}
          />
        </Col>
        {/* Остальные виджеты... */}
      </Row>
    </div>
  );
};
