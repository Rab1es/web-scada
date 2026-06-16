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
          backgroundColor: "rgba(19, 23, 34, 0.95)",
          border: "1px solid #303030", // Зробили бордер трохи темнішим, як у хедера
          borderRadius: "8px",
          padding: "16px", // Збільшили відступи
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            marginBottom: "12px",
            borderBottom: "1px solid #303030",
            paddingBottom: "8px",
          }}
        >
          {/* Збільшили час */}
          <span
            style={{ fontSize: "18px", fontWeight: "bold", color: "#e0e0e0" }}
          >
            {label}
          </span>
        </div>

        {maxEntry && minEntry && (
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "baseline",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                color: maxEntry.color,
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Hysteresis:
            </span>
            <div>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: maxEntry.color,
                }}
              >
                {minEntry?.value?.toFixed(1)}—{maxEntry?.value?.toFixed(1)}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#787b86",
                  marginLeft: "4px",
                }}
              >
                °C
              </span>
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
                marginBottom: "6px",
              }}
            >
              <span
                style={{
                  color: entry.color,
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                {entry.name}:
              </span>
              <div>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: entry.color,
                  }}
                >
                  {entry.value?.toFixed(1)}
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#787b86",
                    marginLeft: "4px",
                  }}
                >
                  °C
                </span>
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
            Collecting telemetry... (Waiting for data)
          </ScadaTypography>
        </div>
      </WidgetCard>
    );
  }

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
            data={formattedData}
            margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2a2e39"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              stroke="#787b86"
              tick={{ fill: "#787b86", fontSize: 14 }} // Збільшили шрифт
              tickMargin={12}
            />
            <YAxis
              stroke="#787b86"
              tick={{ fill: "#787b86", fontSize: 14 }} // Збільшили шрифт
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

            {/* Збільшили іконки і шрифт легенди */}
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconSize={16}
              formatter={(value) => (
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: 500,
                    color: "#d1d4dc",
                  }}
                >
                  {value}
                </span>
              )}
            />

            <ReferenceArea
              y1="setpoint_min"
              y2="setpoint_max"
              fill="#faad14"
              fillOpacity={0.05}
            />

            <Line
              type="stepAfter"
              dataKey="setpoint_max"
              name="Setpoint max"
              stroke="#faad14"
              strokeWidth={2} // Зробили лінію уставки трохи товщою
              strokeDasharray="5 5"
              dot={false}
              activeDot={false} // Вимкнули появу великої точки при наведенні для уставки
            />

            <Line
              type="stepAfter"
              dataKey="setpoint_min"
              name="Setpoint min"
              stroke="#b37feb"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />

            <Line
              type="monotone"
              dataKey="tempReturn"
              name="Return"
              stroke="#1890ff"
              strokeWidth={3}
              dot={{ r: 3, fill: "#131722", strokeWidth: 2 }}
              activeDot={{ r: 7, strokeWidth: 0 }} // Трохи збільшили активну точку
            />

            <Line
              type="monotone"
              dataKey="tempSupply"
              name="Supply"
              stroke="#cf1322"
              strokeWidth={3}
              dot={{ r: 3, fill: "#131722", strokeWidth: 2 }}
              activeDot={{ r: 7, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
};
