import type { FC } from "react";
import type { SensorPanelProps } from "./types";

export const SensorPanel: FC<SensorPanelProps> = ({ temperature, pressure, isLoading }) => {
  return (
    <div>
      <h2>MF Monitoring</h2>
      {!isLoading ? (
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
