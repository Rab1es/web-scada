export interface ChartDataPoint {
  time: string; // Формат "ЧЧ:ММ"
  t_out: number; // Подача
  t_in: number; // Зворотна
  setpoint_min: number; // Уставка Мін
  setpoint_max: number; // Уставка Макс
}

// Визначаємо пропси для компонента
export interface TemperatureChartProps {
  data?: ChartDataPoint[]; // Необов'язковий масив даних
}
