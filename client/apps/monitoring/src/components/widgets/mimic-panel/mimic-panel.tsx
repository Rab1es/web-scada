import { type FC } from "react";
import { Card, Progress, Space } from "antd";
import { FireOutlined, SyncOutlined } from "@ant-design/icons";

interface MimicPanelProps {
  tempSupply: number;
  tempReturn: number;
  pumpActive: boolean;
  pumpSpeed: number;
  flameActive: boolean;
  pressure: number;
}

export const MimicPanel: FC<MimicPanelProps> = ({
  tempSupply,
  tempReturn,
  pumpActive,
  pumpSpeed,
  flameActive,
  pressure,
}) => {
  return (
    <Card
      title="Мнемосхема процесу"
      size="small"
      style={{ backgroundColor: "#141414", border: "1px solid #303030" }} // Принудительно делаем темнее
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          padding: "20px",
        }}
      >
        {/* ВЕРХНЯЯ ЧАСТЬ: ТРУБЫ И КОТЕЛ */}
        <div style={{ display: "flex", alignItems: "center", height: "120px" }}>
          {/* КОТЕЛ */}
          <div
            style={{
              width: "80px",
              height: "100%",
              backgroundColor: "#262626",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              border: "2px solid #434343",
              zIndex: 2,
            }}
          >
            <div
              style={{ fontSize: "12px", color: "gray", marginBottom: "8px" }}
            >
              КОТЕЛ
            </div>
            <FireOutlined
              style={{
                fontSize: "32px",
                color: flameActive ? "#fa541c" : "#595959",
              }}
            />
          </div>

          {/* ТРУБЫ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "80px",
              flex: 1,
              marginLeft: "-4px",
            }}
          >
            {/* Труба подачи (Червона) */}
            <div
              style={{
                height: "8px",
                backgroundColor: "#cf1322",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "40px",
                  top: "-30px",
                  backgroundColor: "#141414",
                  padding: "2px 8px",
                  border: "1px solid #cf1322",
                  borderRadius: "4px",
                  color: "#fff",
                }}
              >
                T_out:{" "}
                <strong style={{ color: "#ff4d4f" }}>{tempSupply}°C</strong>
              </div>
            </div>

            {/* Труба обратки (Синя) з насосом */}
            <div
              style={{
                height: "8px",
                backgroundColor: "#096dd9",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "40px",
                  top: "15px",
                  backgroundColor: "#141414",
                  padding: "2px 8px",
                  border: "1px solid #096dd9",
                  borderRadius: "4px",
                  color: "#fff",
                }}
              >
                T_in:{" "}
                <strong style={{ color: "#40a9ff" }}>{tempReturn}°C</strong>
              </div>

              {/* НАСОС на трубі */}
              <div
                style={{
                  position: "absolute",
                  right: "60px",
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#1f1f1f",
                  borderRadius: "50%",
                  border: `3px solid ${pumpActive ? "#1890ff" : "#595959"}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                <SyncOutlined
                  spin={pumpActive}
                  style={{
                    color: pumpActive ? "#1890ff" : "#595959",
                    fontSize: "20px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* НИЖНЯЯ ЧАСТЬ: ИНДУСТРИАЛЬНЫЕ ШКАЛЫ (Gauges) */}
        <Space
          size="large"
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          {/* Полукруглая шкала давления */}
          <div style={{ textAlign: "center" }}>
            <Progress
              type="dashboard"
              percent={(pressure / 4) * 100} // Допустим, 4 Bar - это 100%
              gapDegree={180} // Отрезаем нижнюю половину!
              strokeColor={pressure > 3 ? "#cf1322" : "#52c41a"}
              format={() => (
                <span style={{ color: "#fff" }}>{pressure} Bar</span>
              )}
            />
            <div style={{ color: "gray", marginTop: "-20px" }}>
              Тиск у контурі
            </div>
          </div>

          {/* Полукруглая шкала насоса */}
          <div style={{ textAlign: "center" }}>
            <Progress
              type="dashboard"
              percent={pumpSpeed}
              gapDegree={180}
              strokeColor={pumpActive ? "#1890ff" : "#595959"}
              format={() => (
                <span style={{ color: "#fff" }}>{pumpSpeed.toFixed(0)}%</span>
              )}
            />
            <div style={{ color: "gray", marginTop: "-20px" }}>
              Потужність насоса
            </div>
          </div>
        </Space>
      </div>
    </Card>
  );
};
