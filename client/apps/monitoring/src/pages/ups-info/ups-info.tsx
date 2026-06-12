import type { UpsInfoProps } from "@scada/shared-types";
import type { FC } from "react";

export const UpsInfo: FC<UpsInfoProps> = ({
  batteryLevel,
  batteryTimeRemaining,
  hasGridPower,
}) => {
  // Функція для красивого форматування часу (з хвилин у години та хвилини)
  const formatTime = (totalMinutes?: number) => {
    if (totalMinutes == null) return "Обчислення...";

    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);

    if (hours > 0) {
      return `${hours} год ${minutes} хв`;
    }
    return `${minutes} хв`;
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: "280px",
        backgroundColor: "#fff",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: 500 }}>
        Резервне живлення (ДБЖ)
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#374151", fontSize: "14px" }}>Заряд АКБ:</span>
        <span
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            // Якщо заряд менше 20% - червоний, інакше - зелений
            color: batteryLevel && batteryLevel <= 20 ? "#ef4444" : "#10b981",
          }}
        >
          {batteryLevel ?? 0}%
        </span>
      </div>

      {/* Умовний рендерінг залежно від наявності мережі */}
      {!hasGridPower ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#374151", fontSize: "14px" }}>
            Час автономності:
          </span>
          <span
            style={{ fontSize: "16px", fontWeight: "bold", color: "#f59e0b" }}
          >
            {formatTime(batteryTimeRemaining)}
          </span>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#374151", fontSize: "14px" }}>
            Статус мережі:
          </span>
          <span
            style={{ fontSize: "16px", fontWeight: "bold", color: "#10b981" }}
          >
            Заряджається
          </span>
        </div>
      )}
    </div>
  );
};
