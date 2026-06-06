declare module "monitoring/SensorPanel" {
  import type { ComponentType } from "react";
  import type { SensorPanelProps } from "@scada/shared-types";

  const SensorPanel: ComponentType<SensorPanelProps>;
  export default SensorPanel;
}

declare module "monitoring/Dashboard" {
  import type { ComponentType } from "react";
  const Dashboard: ComponentType;
  export default Dashboard;
}
