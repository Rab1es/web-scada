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
  ReferenceArea, // Додано дляshaded area
} from "recharts";
import { WidgetCard } from "../../widget-card";
import { ScadaTypography } from "../../typography";
import { type ChartDataPoint, type TemperatureChartProps } from "./types";

// === МОК-ДАНІ ЗА ЗАМОВЧУВАННЯМ ===
// Використовуємо діапазон 47—75°C, як на слайдері керування
const defaultChartData: ChartDataPoint[] = [
  {
    time: "13:00",
    t_out: 45.2,
    t_in: 34.1,
    setpoint_min: 47,
    setpoint_max: 75,
  },
  {
    time: "13:05",
    t_out: 52.5,
    t_in: 38.4,
    setpoint_min: 47,
    setpoint_max: 75,
  },
  {
    time: "13:10",
    t_out: 58.1,
    t_in: 42.0,
    setpoint_min: 47,
    setpoint_max: 75,
  },
  {
    time: "13:15",
    t_out: 60.3,
    t_in: 45.5,
    setpoint_min: 47,
    setpoint_max: 75,
  },
  {
    time: "13:20",
    t_out: 60.1,
    t_in: 48.2,
    setpoint_min: 47,
    setpoint_max: 75,
  },
  {
    time: "13:25",
    t_out: 59.8,
    t_in: 49.5,
    setpoint_min: 47,
    setpoint_max: 75,
  },
  {
    time: "13:30",
    t_out: 60.0,
    t_in: 50.1,
    setpoint_min: 47,
    setpoint_max: 75,
  },
];

// === ОНОВЛЕНИЙ КАСТОМНИЙ ТУЛТИП ===
// Тултип тепер групує Уставки Мін/Макс в один рядок
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Шукаємо в payload значення для уставки
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

        {/* Об'єднаний рядок для Гістерезису Уставки (використовуємо колір Макс-лінії) */}
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
              Уставка (Гістерезис):
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

        {/* Стандартні записи для t_in та t_out, відфільтровуємо уставки */}
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
export const TemperatureChart: FC<TemperatureChartProps> = ({
  data = defaultChartData,
}) => {
  return (
    <WidgetCard
      title="Динаміка температур (Тренди)"
      style={{ height: "450px" }}
    >
      <div style={{ flex: 1, width: "100%", height: "100%", minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            {/* Сітка на задньому фоні */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2a2e39"
              vertical={false}
            />

            {/* Осі */}
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

            {/* Підключення оновленого кастомного тултипа */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#474747",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
            />

            {/* Легенда під графіком */}
            <Legend wrapperStyle={{ paddingTop: "20px" }} />

            {/* Shaded Hysteresis Area (Затінена зона гістерезису) */}
            <ReferenceArea
              y1="setpoint_min"
              y2="setpoint_max"
              fill="#faad14"
              fillOpacity={0.04} // Дуже світле заповнення
            />

            {/* Лінія Уставка Макс (Точкова пунктирна, жовта) */}
            <Line
              type="stepAfter"
              dataKey="setpoint_max"
              name="Уставка Макс"
              stroke="#faad14" // Жовтий
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Лінія Уставка Мін (Точкова пунктирна, фіолетова для контрасту) */}
            <Line
              type="stepAfter"
              dataKey="setpoint_min"
              name="Уставка Мін"
              stroke="#b37feb" // Фіолетовий (як на бордері Середовища)
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Лінія T_in (Return - Синя, жирна) */}
            <Line
              type="monotone"
              dataKey="t_in"
              name="T_in (Зворотна)"
              stroke="#1890ff"
              strokeWidth={3}
              dot={{ r: 3, fill: "#131722", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

            {/* Лінія T_out (Supply - Червона, жирна) */}
            <Line
              type="monotone"
              dataKey="t_out"
              name="T_out (Подача)"
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
