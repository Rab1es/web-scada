import { Badge, Progress, Statistic } from "antd";
import { WidgetCard } from "../../widget-card";
import { SyncOutlined } from "@ant-design/icons";
import { ScadaTypography } from "../../typography";
import type { FC } from "react";
import styles from "./pumo-metrics.module.css";
import { MetricBlock } from "../../metric-block";

interface PumpMetricsProps {
  //TODO: update types
  pumpActive: any;
  pumpSpeed: any;
  pressure: any;
}

export const PumpMetrics: FC<PumpMetricsProps> = ({
  pumpActive,
  pumpSpeed,
  pressure,
}) => {
  return (
    <WidgetCard title="Мережа (Циркуляція)">
      {/* --- ВЕРХНИЙ БЛОК: Статус и Кольцо мощности --- */}
      <div className={styles.pumpContainer}>
        {/* Строка статуса с иконкой */}
        <div className={styles.statusRow}>
          <SyncOutlined
            spin={pumpActive}
            style={{
              fontSize: "18px",
              color: pumpActive ? "var(--color-primary, #1890ff)" : "#595959",
            }}
          />
          <ScadaTypography
            variant="status"
            color={pumpActive ? "primary" : "muted"}
          >
            {pumpActive ? `Насос працює` : "Насос зупинено"}
          </ScadaTypography>
        </div>

        {/* Кольцо мощности по центру */}
        <div className={styles.progressWrapper}>
          <Progress
            type="dashboard"
            percent={pumpSpeed}
            status={pumpActive ? "normal" : "exception"}
            strokeColor={
              pumpActive ? "var(--color-primary, #1890ff)" : "#303030"
            }
            format={(percent) => (
              <div className={styles.progressText}>
                <ScadaTypography
                  variant="value"
                  color={pumpActive ? "default" : "muted"}
                >
                  {percent}%
                </ScadaTypography>
                {/* Используем наш маленький капс-шрифт для подписи */}
                <ScadaTypography variant="headerXs">Потужність</ScadaTypography>
              </div>
            )}
          />
        </div>
      </div>

      {/* --- НИЖНИЙ БЛОК: Давление --- */}
      <MetricBlock
        label="Тиск у контурі"
        value={pressure?.toFixed(1)}
        unit="Bar"
        borderVariant="success" /* Если нужно, можно менять на danger при падении давления */
        valueColor="default"
      />
    </WidgetCard>
  );
};
