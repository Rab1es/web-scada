declare module "monitoring/SensorPanel" {
  import type { ComponentType } from "react";
  import type { SensorPanelProps } from "@scada/shared-types";

  const SensorPanel: ComponentType<SensorPanelProps>;
  export default SensorPanel;
}
