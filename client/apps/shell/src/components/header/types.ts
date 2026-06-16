import type { SoftwareData, WithSocketProps } from "@scada/shared-types";

export interface HeaderProps
  extends
    WithSocketProps,
    Pick<SoftwareData, "hasGridPower" | "isAutoMode" | "isEmergencyStop"> {
  collapsed: boolean;
  setCollapsed: (state: boolean) => void;
}
