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
// Оновлений тултип у стилі TemperatureChart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const color = value > 50 ? "#52c41a" : value > 20 ? "#faad14" : "#cf1322";

    return (
      <div
        style={{
          backgroundColor: "rgba(19, 23, 34, 0.95)",
          border: "1px solid #303030",
          borderRadius: "8px",
          padding: "16px",
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
          <span
            style={{ fontSize: "18px", fontWeight: "bold", color: "#e0e0e0" }}
          >
            {label}
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
          <span style={{ color: "#787b86", fontSize: "16px", fontWeight: 500 }}>
            Battery Level:
          </span>
          <div>
            <ScadaTypography
              variant="value"
              style={{ fontSize: "18px", fontWeight: "bold", color }}
            >
              {value?.toFixed(1)}
            </ScadaTypography>
            <span
              style={{ fontSize: "14px", color: "#787b86", marginLeft: "4px" }}
            >
              %
            </span>
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
          <ScadaTypography variant="label">
            Collecting telemetry... (Waiting for data)
          </ScadaTypography>
        </div>
      </WidgetCard>
    );
  }

  // --- ЛОГІКА ДИНАМІЧНОГО ГРАДІЄНТА ---

  // 1. Знаходимо поточний діапазон даних на графіку
  const maxData = Math.max(...data.map((d: any) => d.batteryLevel));
  const minData = Math.min(...data.map((d: any) => d.batteryLevel));

  // 2. Якщо лінія плоска (наприклад, стабільно 100%), SVG градієнт зламається.
  const isFlat = maxData === minData;

  const getBatteryColor = (level: number) => {
    if (level > 50) return "#52c41a";
    if (level > 20) return "#faad14";
    return "#cf1322";
  };

  // 3. Рахуємо, де саме мають знаходитись пороги 50% і 20% ВЕРЕДИНІ поточного графіка
  const getOffset = (threshold: number) => {
    if (isFlat) return 0;
    // Знаходимо відсоток від maxData до threshold відносно загальної висоти кривої
    const percent = (maxData - threshold) / (maxData - minData);
    // Обмежуємо від 0 до 1, щоб градієнт не вилазив за межі
    return Math.max(0, Math.min(1, percent)) * 100 + "%";
  };

  const offset50 = getOffset(50);
  const offset20 = getOffset(20);

  // Якщо лінія плоска - малюємо суцільним кольором, інакше застосовуємо градієнт
  const lineStroke = isFlat
    ? getBatteryColor(maxData)
    : "url(#batteryColorGradient)";

  return (
    <WidgetCard title="Charge degradation" style={{ height: "350px" }}>
      <div style={{ flex: 1, width: "100%", height: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 10, left: -10, bottom: 20 }} // Збільшили відступи як у темп. графіка
          >
            <defs>
              <linearGradient
                id="batteryColorGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {/* Зелена зона */}
                <stop offset="0%" stopColor="#52c41a" stopOpacity={1} />
                <stop offset={offset50} stopColor="#52c41a" stopOpacity={1} />

                {/* Жовта зона (від 50 до 20) */}
                <stop offset={offset50} stopColor="#faad14" stopOpacity={1} />
                <stop offset={offset20} stopColor="#faad14" stopOpacity={1} />

                {/* Червона зона (нижче 20) */}
                <stop offset={offset20} stopColor="#cf1322" stopOpacity={1} />
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
              tick={{ fill: "#787b86", fontSize: 14 }}
              tickMargin={12}
            />
            <YAxis
              stroke="#787b86"
              tick={{ fill: "#787b86", fontSize: 14 }}
              domain={[0, 100]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#474747",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
            />

            <Line
              type="monotone"
              dataKey="batteryLevel"
              stroke={lineStroke} // <-- Використовуємо наш розумний stroke
              strokeWidth={3}
              activeDot={{
                r: 7,
                strokeWidth: 0,
                fill: isFlat ? getBatteryColor(maxData) : "#faad14", // Колір крапки
              }}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
};
