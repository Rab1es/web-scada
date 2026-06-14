import { type ChartDataPoint } from "./types"; // Твой интерфейс

const MAX_CHART_POINTS = 60;

interface IncomingTelemetry {
  tempSupply?: number;
  tempReturn?: number;
  temperatureSetpoint: [number, number];
}

export const appendChartData = (
  prevData: ChartDataPoint[],
  newData: IncomingTelemetry,
): ChartDataPoint[] => {
  const now = new Date();

  const timeString = now.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 1. Берем последнюю точку из предыдущего состояния
  const lastPoint = prevData[prevData.length - 1];

  // 2. Если секунда еще не сменилась, ПРОСТО ОБНОВЛЯЕМ последнюю точку
  // Это защитит график от спама миллисекундными обновлениями
  if (lastPoint && lastPoint.time === timeString) {
    const updatedData = [...prevData];
    updatedData[updatedData.length - 1] = {
      ...lastPoint, // Сохраняем время
      t_out: newData.tempSupply ?? lastPoint.t_out, // Берем новые данные, или оставляем старые
      t_in: newData.tempReturn ?? lastPoint.t_in,
      setpoint_min: newData.temperatureSetpoint[0],
      setpoint_max: newData.temperatureSetpoint[1],
    };
    return updatedData;
  }

  // 3. Если секунда сменилась (прошло время) — СОЗДАЕМ НОВУЮ ТОЧКУ
  const newPoint: ChartDataPoint = {
    time: timeString,
    t_out: newData.tempSupply || 0,
    t_in: newData.tempReturn || 0,
    setpoint_min: newData.temperatureSetpoint[0],
    setpoint_max: newData.temperatureSetpoint[1],
  };

  const updatedData = [...prevData, newPoint];

  // 4. Обрезаем старые данные (скользящее окно)
  if (updatedData.length > MAX_CHART_POINTS) {
    return updatedData.slice(updatedData.length - MAX_CHART_POINTS);
  }

  return updatedData;
};
