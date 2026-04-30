import type { FC } from "react";
import type { SensorPanelProps } from "@scada/shared-types";

export const SensorPanel: FC<SensorPanelProps> = ({
  temperature,
  pressure,
  isConnected,
}) => {
  return (
    <div>
      <h2>MF Monitoring</h2>
      {!isConnected ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>Temperature: {temperature}°C</p>
          <p>Pressure: {pressure} Pa</p>
        </div>
      )}
    </div>
  );
};
