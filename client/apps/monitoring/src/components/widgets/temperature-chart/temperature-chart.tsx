import type { FC } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from "recharts";
import { WidgetCard } from "../../widget-card";
import { ScadaTypography } from "../../typography";
import { type TemperatureChartProps } from "./types";

// === КАСТОМНИЙ ТУЛТИП ===
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const minEntry = payload.find(
      (item: any) => item.dataKey === "setpoint_min",
    );
    const maxEntry = payload.find(
      (item: any) => item.dataKey === "setpoint_max",
    );

    return (
      <div
        style={{
          backgroundColor: "rgba(19, 23, 34, 0.9)",
          border: "1px solid #2a2e39",
          borderRadius: "6px",
          padding: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <ScadaTypography variant="headerXs">{label}</ScadaTypography>
        </div>

        {maxEntry && minEntry && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "baseline",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                color: maxEntry.color,
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Hysteresis:
            </span>
            <div>
              <ScadaTypography
                variant="value"
                style={{ fontSize: "16px", color: maxEntry.color }}
              >
                {minEntry?.value?.toFixed(1)}—{maxEntry?.value?.toFixed(1)}
              </ScadaTypography>
              <ScadaTypography variant="unit">°C</ScadaTypography>
            </div>
          </div>
        )}

        {payload
          .filter(
            (entry: any) =>
              entry.dataKey !== "setpoint_min" &&
              entry.dataKey !== "setpoint_max",
          )
          .map((entry: any, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "baseline",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  color: entry.color,
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {entry.name}:
              </span>
              <div>
                <ScadaTypography
                  variant="value"
                  style={{ fontSize: "16px", color: entry.color }}
                >
                  {entry.value?.toFixed(1)}
                </ScadaTypography>
                <ScadaTypography variant="unit">°C</ScadaTypography>
              </div>
            </div>
          ))}
      </div>
    );
  }
  return null;
};

// === КОМПОНЕНТ TemperatureChart ===
export const TemperatureChart: FC<TemperatureChartProps> = ({ data }) => {
  if (!data || data.length < 2) {
    return (
      <WidgetCard title="Temperature dynamics" style={{ height: "450px" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScadaTypography variant="label">
            Збір телеметрії... (Очікування даних)
          </ScadaTypography>
        </div>
      </WidgetCard>
    );
  }

  // Трансформуємо дані: витягуємо tuple уставки у плоскі змінні для Recharts
  const formattedData = data.map((point) => ({
    ...point,
    setpoint_min: point.temperatureSetpoint?.[0] ?? 0,
    setpoint_max: point.temperatureSetpoint?.[1] ?? 0,
  }));

  return (
    <WidgetCard title="Temperature dynamics" style={{ height: "450px" }}>
      <div style={{ flex: 1, width: "100%", height: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData} // Використовуємо адаптовані дані
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2a2e39"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              stroke="#787b86"
              tick={{ fill: "#787b86", fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis
              stroke="#787b86"
              tick={{ fill: "#787b86", fontSize: 12 }}
              domain={["auto", "auto"]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#474747",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
            />

            <Legend wrapperStyle={{ paddingTop: "20px" }} />

            <ReferenceArea
              y1="setpoint_min"
              y2="setpoint_max"
              fill="#faad14"
              fillOpacity={0.04}
            />

            <Line
              type="stepAfter"
              dataKey="setpoint_max"
              name="Setpoint max"
              fontSize={16}
              stroke="#faad14"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />

            <Line
              type="stepAfter"
              dataKey="setpoint_min"
              name="Setpoint min"
              fontSize={16}
              stroke="#b37feb"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* ОНОВЛЕНО: Нові dataKey згідно з контрактом HardwareData */}
            <Line
              type="monotone"
              dataKey="tempReturn"
              name="Return"
              fontSize={16}
              stroke="#1890ff"
              strokeWidth={3}
              dot={{ r: 3, fill: "#131722", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            <Line
              type="monotone"
              dataKey="tempSupply"
              name="Supply"
              fontSize={16}
              stroke="#cf1322"
              strokeWidth={3}
              dot={{ r: 3, fill: "#131722", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
};
