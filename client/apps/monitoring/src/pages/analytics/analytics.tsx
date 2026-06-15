import { type FC } from "react";
import { TemperatureChart } from "../../components/widgets/temperature-chart";
import type { AnalyticsProps } from "@scada/shared-types";
import { UpsChart } from "../../components/widgets/ups-chart";

export const Analytics: FC<AnalyticsProps> = ({ charts }) => {
  return (
    <div>
      <TemperatureChart data={charts?.temperature || []} />
      <UpsChart data={charts?.battery || []} />
    </div>
  );
};
