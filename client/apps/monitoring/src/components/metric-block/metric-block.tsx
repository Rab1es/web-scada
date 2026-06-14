import type { FC, PropsWithChildren, ReactNode } from "react";
import styles from "./metric-block.module.css";
import { ScadaTypography } from "../typography";

interface MetricBlockProps {
  label: string;
  value: string | number;
  unit?: string;
  borderVariant?: "danger" | "primary" | "success" | "warning" | "default";
  valueColor?:
    | "default"
    | "danger"
    | "success"
    | "warning"
    | "primary"
    | "muted";
  className?: string;
  valueClassName?: string;
  // --- НОВЫЕ ПРОПСЫ ---
  icon?: ReactNode; // Позволяем прокинуть любую иконку
  valueVariant?: "value" | "status"; // По умолчанию оставим "value"
}

export const MetricBlock: FC<PropsWithChildren<MetricBlockProps>> = ({
  label,
  value,
  unit,
  borderVariant = "default",
  valueColor = "default",
  className = "",
  valueClassName = "",
  icon,
  valueVariant = "value", // Дефолтное значение для обратной совместимости
  children,
}) => {
  const borderClassMap = {
    danger: styles.borderRed,
    primary: styles.borderBlue,
    success: styles.borderGreen,
    warning: styles.borderOrange,
    default: styles.borderNeutral,
  };

  const selectedBorderClass =
    borderClassMap[borderVariant] || styles.borderNeutral;
  const combinedWrapperClass =
    `${styles.metricBlock} ${selectedBorderClass} ${className}`.trim();

  return (
    <div className={combinedWrapperClass}>
      <ScadaTypography variant="label">{label}</ScadaTypography>

      <div
        className={styles.valueWrapper}
        style={{ alignItems: icon ? "center" : "baseline" }}
      >
        {icon && (
          <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
        )}

        <ScadaTypography
          variant={valueVariant}
          color={valueColor}
          className={valueClassName}
        >
          {value}
        </ScadaTypography>

        {unit && <ScadaTypography variant="unit">{unit}</ScadaTypography>}
      </div>
      {children && <div style={{ marginTop: "12px" }}>{children}</div>}
    </div>
  );
};
