declare module 'monitoring/SensorPanel' {
  import type { ComponentType } from 'react';
  export interface SensorPanelProps {
    temperature?: number;
    pressure?: number;
    isLoading: boolean;
  }

  const SensorPanel: ComponentType<SensorPanelProps>;
  export default SensorPanel;
}