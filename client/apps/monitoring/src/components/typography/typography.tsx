import { Typography as BaseTypography } from "antd";
import type { FC, PropsWithChildren } from "react";
import styles from "./typography.module.css";

interface TypographyProps {
  // Розширений список варіантів
  variant?:
    | "header"
    | "headerS"
    | "headerXs"
    | "label"
    | "value"
    | "unit"
    | "status";
  // Додав muted для сірих статусів
  color?: "default" | "danger" | "success" | "warning" | "primary" | "muted";
  className?: string;
}

export const Typography: FC<PropsWithChildren<TypographyProps>> = ({
  variant = "label",
  color = "default",
  children,
  className = "",
}) => {
  const combinedClassName =
    `${styles.textBase} ${styles[variant]} ${styles[color]} ${className}`.trim();

  return (
    <BaseTypography.Text className={combinedClassName}>
      {children}
    </BaseTypography.Text>
  );
};
