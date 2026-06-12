import { Badge, Progress, Statistic } from "antd";
import { WidgetCard } from "../../widget-card";
import { SyncOutlined } from "@ant-design/icons";
import { ScadaTypography } from "../../typography";
import type { FC } from "react";

interface PumpMetricsProps {
  //TODO: update types
  pumpActive: any;
  pumpSpeed: any;
  pressure: any;
}

export const PumpMetrics: FC<PumpMetricsProps> = ({
  pumpActive,
  pumpSpeed,
  pressure,
}) => {
  return (
    <WidgetCard
      title="Мережа (Циркуляція)"
      size="small"
      type="inner"
      style={{ height: "100%" }}
    >
      <WidgetCard bordered size="small" style={{ marginBottom: "12px" }}>
        <ScadaTypography>Статус циркуляції</ScadaTypography>
        <Badge
          status={pumpActive ? "processing" : "default"}
          text={
            pumpActive
              ? `Насос працює (${pumpSpeed?.toFixed(1)}%)`
              : "Насос зупинено"
          }
          styles={{ root: { fontSize: "16px" } }}
        />
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Progress
            type="dashboard"
            percent={pumpSpeed} // твое значение от 0 до 100
            status={pumpActive ? "normal" : "exception"}
            strokeColor={pumpActive ? "#1890ff" : "#d9d9d9"}
            format={(percent) => (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "24px",
                    color: pumpActive ? "#000" : "#d9d9d9",
                  }}
                >
                  {percent}%
                </span>
                <span style={{ fontSize: "12px", color: "gray" }}>
                  Потужність
                </span>
              </div>
            )}
          />
        </div>
        <SyncOutlined
          spin={pumpActive}
          style={{
            fontSize: "24px",
            color: pumpActive ? "#1890ff" : "gray",
          }}
        />
      </WidgetCard>

      <WidgetCard bordered size="small">
        <Statistic
          title="Тиск у контурі"
          value={pressure}
          precision={1}
          suffix="Bar"
        />
      </WidgetCard>
    </WidgetCard>
  );
};
