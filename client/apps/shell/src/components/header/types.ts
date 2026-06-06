import type { WithSocketProps } from "@scada/shared-types";

export interface HeaderProps extends WithSocketProps {
  hasGridPower: boolean;
  isAutoMode: boolean;
}
