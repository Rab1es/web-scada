import { Card, type CardProps } from "antd";
import type { FC } from "react";
import styles from "./widget-card.module.css";

// Наследуем все пропсы обычной карточки AntD
interface WidgetCardProps extends CardProps {
  // Тут можно добавить свои специфичные пропсы в будущем
}

export const WidgetCard: FC<WidgetCardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Card
      className={`${styles.widgetCard} ${className || ""}`}
      variant="borderless"
      {...props}
    >
      {children}
    </Card>
  );
};
