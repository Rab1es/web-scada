import type { FC } from "react";
import {
  ResponsiveContainer,
  LineChart, // Змінили AreaChart на LineChart
  Line, // Змінили Area на Line
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ScadaTypography } from "../../typography";
import { WidgetCard } from "../../widget-card";
import type { UpsDataPoint } from "@scada/shared-types";

interface UpsChartProps {
  data: UpsDataPoint[];
}

// === КАСТОМНИЙ ТУЛТИП ===
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    // Динамічний колір для тексту в тултипі залишається
    const color = value > 50 ? "#52c41a" : value > 20 ? "#faad14" : "#cf1322";

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
        <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
          <span style={{ color: "#787b86", fontSize: "14px", fontWeight: 500 }}>
            Заряд АКБ:
          </span>
          <div>
            <ScadaTypography
              variant="value"
              style={{ fontSize: "16px", color }}
            >
              {value?.toFixed(1)}
            </ScadaTypography>
            <ScadaTypography variant="unit">%</ScadaTypography>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const UpsChart: FC<UpsChartProps> = ({ data }) => {
  if (!data || data.length < 2) {
    return (
      <WidgetCard title="Charge degradation" style={{ height: "350px" }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScadaTypography variant="label">Очікування даних...</ScadaTypography>
        </div>
      </WidgetCard>
    );
  }

  return (
    <WidgetCard title="Charge degradation" style={{ height: "350px" }}>
      <div style={{ flex: 1, width: "100%", height: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart // Змінили тип графіка
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Вертикальный градиент: x2="0" y2="1" (сверху вниз) */}
              <linearGradient
                id="batteryColorGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {/* От 100% до 50% заряда (верхняя половина) — Зеленый */}
                <stop offset="0%" stopColor="#52c41a" stopOpacity={1} />
                <stop offset="50%" stopColor="#52c41a" stopOpacity={1} />

                {/* От 50% до 20% заряда — Желтый */}
                <stop offset="50%" stopColor="#faad14" stopOpacity={1} />
                <stop offset="80%" stopColor="#faad14" stopOpacity={1} />

                {/* Ниже 20% заряда (самый низ) — Красный */}
                <stop offset="80%" stopColor="#cf1322" stopOpacity={1} />
                <stop offset="100%" stopColor="#cf1322" stopOpacity={1} />
              </linearGradient>
            </defs>

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
              domain={[0, 100]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#474747", strokeDasharray: "5 5" }}
            />

            <Line // Змінили Area на Line
              type="monotone"
              dataKey="batteryLevel"
              stroke="url(#batteryColorGradient)"
              strokeWidth={3}
              activeDot={{
                r: 6,
                strokeWidth: 0,
                fill: "url(#batteryColorGradient)",
              }}
              dot={false} // Можна вимкнути крапки для більшої чистоти
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
};
