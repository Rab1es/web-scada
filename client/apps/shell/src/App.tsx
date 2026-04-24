import React, { Suspense } from "react";

const RemoteSensorPanel = React.lazy(() => import("monitoring/SensorPanel"));

function App() {
  return (
    <div>
      <span>shell</span>
      <h3>Виджет из микрофронтенда:</h3>
      <Suspense fallback={<span>Loading MF</span>}>
        <RemoteSensorPanel />
      </Suspense>
    </div>
  );
}

export default App;
