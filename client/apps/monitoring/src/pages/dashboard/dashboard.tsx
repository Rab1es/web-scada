import { Row, Col, Card } from "antd";
import { type FC } from "react";
import { type DashboardProps } from "@scada/shared-types";
import { MimicPanel } from "../../components/widgets/mimic-panel";
import styles from "./dashboard.module.css";

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
    <Card
      title="Оперативні дані котельні (Панель моніторингу)"
      style={{ width: "100%" }}
      className={styles.dashboardWidgetCardContainer}
    >
      {/* 1. БЛОК КЕРУВАННЯ */}

      {/* 2. ТЕХНОЛОГІЧНІ ВУЗЛИ (3 колонки) */}
      <Row gutter={[16, 16]}>
        {/* ВУЗОЛ 1: КОТЕЛ */}
        <Col xs={24} md={8}></Col>

        {/* ВУЗОЛ 2: МЕРЕЖА */}
        <Col xs={24} md={8}></Col>

        {/* ВУЗОЛ 3: СЕРЕДОВИЩЕ ТА БЕЗПЕКА */}
        <Col xs={24} md={8}></Col>

        <Col xs={24} md={8}>
          <MimicPanel
            tempReturn={tempReturn}
            tempSupply={tempSupply}
            pumpSpeed={pumpSpeed}
            flameActive={flameActive}
            pressure={pressure}
            pumpActive={pumpActive}
          />
        </Col>
      </Row>
    </Card>
  );
};
