declare module "monitoring/SensorPanel" {
  import type { ComponentType } from "react";
  import type { SensorPanelProps } from "@scada/shared-types";

  const SensorPanel: ComponentType<SensorPanelProps>;
  export default SensorPanel;
}

declare module "monitoring/Dashboard" {
  import type { ComponentType } from "react";
  import type { DashboardProps } from "@scada/shared-types";
  const Dashboard: ComponentType<DashboardProps>;
  export default Dashboard;
}

declare module "monitoring/UpsInfo" {
  import type { ComponentType } from "react";
  import type { UpsInfoProps } from "@scada/shared-types";
  const UpsInfo: ComponentType<UpsInfoProps>;
  export default UpsInfo;
}
