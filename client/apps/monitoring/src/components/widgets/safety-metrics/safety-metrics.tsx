import { Progress, Statistic } from "antd";
import { WidgetCard } from "../../widget-card";
import { AlertOutlined, GlobalOutlined } from "@ant-design/icons";
import type { FC } from "react";

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
  return (
    <WidgetCard
      title="Середовище та Безпека"
      size="small"
      type="inner"
      style={{ height: "100%" }}
    >
      <WidgetCard
        bordered
        size="small"
        style={{
          marginBottom: "12px",
          border:
            gasLevel && gasLevel > 0.5
              ? "2px solid #ff4d4f"
              : "1px solid #d9d9d9",
          // backgroundColor:
          //   gasLevel && gasLevel > 0.5 ? "#fff1f0" : "#fff",
        }}
      >
        <Statistic
          title={
            <span
              style={{
                color: gasLevel && gasLevel > 0.5 ? "#cf1322" : "inherit",
              }}
            >
              Концентрація CH4
            </span>
          }
          value={gasLevel}
          precision={2}
          suffix="%"
          prefix={
            gasLevel && gasLevel > 0.5 ? (
              <AlertOutlined style={{ color: "#cf1322" }} />
            ) : undefined
          }
          valueStyle={{
            color: gasLevel && gasLevel > 0.5 ? "#cf1322" : "inherit",
          }}
        />
      </WidgetCard>

      <WidgetCard
        bordered
        size="small"
        style={{ borderLeft: "4px solid #52c41a", marginBottom: "12px" }}
      >
        <Statistic
          title="Температура надворі (T_ext)"
          value={tempOutdoor}
          precision={1}
          suffix="°C"
          valueStyle={{ color: "#389e0d" }}
          prefix={<GlobalOutlined />}
        />
      </WidgetCard>

      <WidgetCard
        bordered
        size="small"
        style={{ borderLeft: "4px solid purple" }}
      >
        <Statistic
          title="Температура в приміщенні"
          value={displayIndoorTemp}
          precision={1}
          suffix="°C"
          valueStyle={{ color: "purple" }}
        />
        <Progress
          percent={(tempSupply / 120) * 100} // где 120 - максимальная температура котла
          showInfo={false}
          strokeColor={
            tempSupply > 105
              ? "#cf1322" // Авария (красный)
              : tempSupply > 90
                ? "#faad14" // Предупреждение (желтый)
                : "#52c41a" // Норма (зеленый)
          }
          strokeWidth={6}
        />
      </WidgetCard>
    </WidgetCard>
  );
};
