import type { UpsInfoProps } from "@scada/shared-types";
import type { FC } from "react";
import { Progress } from "antd";
import { ThunderboltOutlined, DisconnectOutlined } from "@ant-design/icons";
import { WidgetCard } from "../../components/widget-card";
import { ScadaTypography } from "../../components/typography";

export const UpsInfo: FC<UpsInfoProps> = ({
  batteryLevel = 0,
  batteryTimeRemaining,
  hasGridPower,
}) => {
  // Реалізація "динамічної деградації кольору" з диплома
  const getBatteryColor = (level: number) => {
    if (level > 50) return "#52c41a"; // Зелений (Норма)
    if (level > 20) return "#faad14"; // Жовтий (Увага)
    return "#cf1322"; // Червоний (Критично)
  };

  const formatTime = (totalMinutes?: number) => {
    if (totalMinutes == null) return "Обчислення...";
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    if (hours > 0) return `${hours} год ${minutes} хв`;
    return `${minutes} хв`;
  };

  const calculateChargeTime = (soc: number) => {
    const missingSoc = 100 - soc;
    // Если добавляем 0.5% за шаг, умножаем на интервал (например, 5 сек)
    const secondsLeft = (missingSoc / 0.5) * 5;
    return Math.floor(secondsLeft / 60); // в минутах
  };

  return (
    // Обмежуємо ширину, щоб віджет не розтягувався на весь екран як сосиска
    <WidgetCard
      title="Резервне живлення (ДБЖ)"
      style={{ maxWidth: 450, margin: "0 auto" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "24px 0",
        }}
      >
        {/* --- ВЕРХ: Статус мережі з іконками --- */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          {hasGridPower ? (
            <>
              <ThunderboltOutlined style={{ color: "#52c41a", fontSize: 24 }} />
              <ScadaTypography variant="status" color="success">
                Мережа 220В (Заряджається)
              </ScadaTypography>
            </>
          ) : (
            <>
              <DisconnectOutlined style={{ color: "#faad14", fontSize: 24 }} />
              <ScadaTypography variant="status" color="warning">
                Автономна робота (Розряд)
              </ScadaTypography>
            </>
          )}
          {hasGridPower && (
            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <ScadaTypography variant="label">
                Час до повного заряду:
              </ScadaTypography>
              <div style={{ marginTop: "4px" }}>
                <ScadaTypography variant="value" style={{ color: "#52c41a" }}>
                  {calculateChargeTime(batteryLevel)} хв
                </ScadaTypography>
              </div>
            </div>
          )}
        </div>

        {/* --- ЦЕНТР: Графічний віджет рівня заряду --- */}
        <Progress
          type="dashboard"
          percent={batteryLevel}
          strokeColor={getBatteryColor(batteryLevel)}
          trailColor="rgba(255,255,255,0.05)"
          size={220} // Робимо його великим і солідним
          strokeWidth={8}
          format={(percent) => (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <ScadaTypography
                variant="value"
                style={{
                  fontSize: "36px",
                  color: getBatteryColor(percent ?? 0),
                }}
              >
                {percent}%
              </ScadaTypography>
              <ScadaTypography variant="label">Заряд АКБ</ScadaTypography>
            </div>
          )}
        />

        {/* --- НИЗ: Інтелектуальний прогноз (показуємо тільки при розряді) --- */}
        {!hasGridPower && (
          <div
            style={{
              marginTop: "32px",
              textAlign: "center",
              backgroundColor: "rgba(250, 173, 20, 0.1)",
              padding: "16px 32px",
              borderRadius: "8px",
              border: "1px solid rgba(250, 173, 20, 0.3)",
              width: "100%",
            }}
          >
            <ScadaTypography variant="label">
              Прогноз автономної роботи
            </ScadaTypography>
            <div style={{ marginTop: "8px" }}>
              <ScadaTypography
                variant="value"
                style={{ color: "#faad14", fontSize: "28px" }}
              >
                {formatTime(batteryTimeRemaining)}
              </ScadaTypography>
            </div>
          </div>
        )}
      </div>
    </WidgetCard>
  );
};
