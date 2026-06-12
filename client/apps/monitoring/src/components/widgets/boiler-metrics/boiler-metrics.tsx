import { WidgetCard } from "../../widget-card";
import { FireOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { MetricBlock } from "../../metric-block/metric-block";
import styles from "./boiler-metrics.module.css";

interface BoilerMetricsProps {
  //TODO: update types
  flameActive: any;
  tempSupply: any;
  tempReturn: any;
}

export const BoilerMetrics: FC<BoilerMetricsProps> = ({
  flameActive,
  tempSupply,
  tempReturn,
}) => {
  const iconsClassName = flameActive
    ? styles.fireIconActive
    : styles.fireIconDefault;
  return (
    <WidgetCard title="Котел (Генерація тепла)">
      <MetricBlock
        label="Стан пальника"
        value={flameActive ? "Полум'я горить" : "Немає розпалу"}
        borderVariant="default"
        valueColor={flameActive ? "warning" : "default"}
        valueVariant="status"
        icon={<FireOutlined className={iconsClassName} />}
      />

      <MetricBlock
        label="Температура подачі (T_out)"
        value={tempSupply}
        unit="°C"
        borderVariant="danger"
        valueColor="danger"
      />

      <MetricBlock
        label="Температура зворотної (T_in)"
        value={tempReturn}
        unit="°C"
        borderVariant="primary"
        valueColor="primary"
      />
    </WidgetCard>
  );
};
