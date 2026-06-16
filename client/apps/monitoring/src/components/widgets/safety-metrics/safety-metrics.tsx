import { Progress, Statistic } from "antd";
import { WidgetCard } from "../../widget-card";
import { AlertOutlined, GlobalOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { MetricBlock } from "../../metric-block";
import styles from "./safety-metrics.module.css";

interface SafetyMetricsProps {
  //TODO: update types
  gasLevel: any;
  tempOutdoor: any;
  tempSupply: any;
  tempIndoor: any;
}

export const SafetyMetrics: FC<SafetyMetricsProps> = ({
  gasLevel,
  tempOutdoor,
  tempSupply,
  tempIndoor,
}) => {
  const displayIndoorTemp = tempIndoor && tempIndoor > 1 ? tempIndoor : 21.5;
  const getProgressColor = (temp: number) => {
    if (temp > 105) return "var(--color-danger, #cf1322)";
    if (temp > 90) return "var(--color-warning, #faad14)";
    return "var(--color-success, #52c41a)";
  };

  const isGasAlarm = gasLevel > 0.5;
  return (
    <WidgetCard title="Environment and Safety" className={styles.card}>
      {/* 1. Концентрация газа */}
      <MetricBlock
        label="CH4 concentration"
        value={gasLevel?.toFixed(2)}
        unit="%"
        borderVariant={isGasAlarm ? "danger" : "default"}
        valueColor={isGasAlarm ? "danger" : "default"}
        icon={
          isGasAlarm ? (
            <AlertOutlined style={{ color: "#cf1322" }} />
          ) : undefined
        }
      />

      {/* 2. Температура на улице */}
      <MetricBlock
        label="Outside temperature"
        value={tempOutdoor?.toFixed(1)}
        unit="°C"
        borderVariant="success"
        valueColor="success"
        icon={<GlobalOutlined />}
      />

      {/* 3. Температура в помещении + Полоска прогресса */}
      <MetricBlock
        label="Indoor temperature"
        value={displayIndoorTemp?.toFixed(1)}
        unit="°C"
        className={styles.borderPurple}
        valueClassName={styles.textPurple}
      >
        <Progress
          className={styles.customProgress}
          percent={(tempSupply / 120) * 100}
          showInfo={false}
          strokeColor={getProgressColor(tempSupply)}
          strokeWidth={6}
          size="small"
        />
      </MetricBlock>
    </WidgetCard>
  );
};
