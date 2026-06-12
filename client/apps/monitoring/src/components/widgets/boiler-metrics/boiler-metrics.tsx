import { Statistic } from "antd";
import { WidgetCard } from "../../widget-card";
import { FireOutlined } from "@ant-design/icons";
import type { FC } from "react";

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
  return (
    <WidgetCard
      title="Котел (Генерація тепла)"
      size="small"
      type="inner"
      style={{ height: "100%" }}
    >
      <WidgetCard bordered size="small" style={{ marginBottom: "12px" }}>
        <div
          style={{
            color: "rgba(0, 0, 0, 0.45)",
            fontSize: "14px",
            marginBottom: "8px",
          }}
        >
          Стан пальника
        </div>
        <span
          style={{
            fontSize: "20px",
            color: flameActive ? "#fa541c" : "#d9d9d9",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FireOutlined />
          <span style={{ fontSize: "16px", color: "#000" }}>
            {flameActive ? "Полум'я горить" : "Немає розпалу"}
          </span>
        </span>
      </WidgetCard>

      <WidgetCard
        bordered
        size="small"
        style={{ borderLeft: "4px solid #f5222d", marginBottom: "12px" }}
      >
        <Statistic
          title="Температура подачі (T_out)"
          value={tempSupply}
          precision={1}
          suffix="°C"
          valueStyle={{ color: "#cf1322" }}
        />
      </WidgetCard>

      <WidgetCard
        bordered
        size="small"
        style={{ borderLeft: "4px solid #1890ff" }}
      >
        <Statistic
          title="Температура зворотної (T_in)"
          value={tempReturn}
          precision={1}
          suffix="°C"
          valueStyle={{ color: "#096dd9" }}
        />
      </WidgetCard>
    </WidgetCard>
  );
};
